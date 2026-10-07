-- Octom: remove Bootstrap Mode and the platform-admin objects (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
-- Then run supabase/tests/security_test.sql. It must end with the message
-- "ALL TESTS PASSED (rolled back on purpose)".
--
-- WARNING: after this runs the Free plan limits apply again to every account
-- (10 contacts, 10 open follow-ups, 5 AI requests a day, 1 seat). Deploy the
-- matching app version first or at the same time.
--
-- What this does:
--   1. Puts the four limit functions back to plain plan rules (no flag).
--   2. Drops set_bootstrap_mode(), bootstrap_mode(), is_platform_admin().
--   3. Drops the tables app_settings, audit_log, platform_admins. They only held
--      the Bootstrap switch, its history and the admin list.

-- 1. Limits ----------------------------------------------------------------------
create or replace function public.enforce_contact_limit()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  used int;
begin
  perform pg_advisory_xact_lock(hashtext('contacts:' || new.organization_id::text));

  if public.org_plan(new.organization_id) = 'free' then
    select count(*) into used
    from public.contacts
    where organization_id = new.organization_id;

    if used >= 10 then
      raise exception 'plan_limit_contacts';
    end if;
  end if;

  return new;
end;
$function$;

create or replace function public.enforce_followup_limit()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
declare
  used int;
begin
  if new.status <> 'open' then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.status = 'open' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtext('follow_ups:' || new.organization_id::text));

  if public.org_plan(new.organization_id) = 'free' then
    select count(*) into used
    from public.follow_ups
    where organization_id = new.organization_id
      and status = 'open'
      and id <> new.id;

    if used >= 10 then
      raise exception 'plan_limit_follow_ups';
    end if;
  end if;

  return new;
end;
$function$;

create or replace function public.ai_check_and_log(request_kind text)
returns boolean
language plpgsql
security definer
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
  org uuid;
  day_limit int := 5;
  global_day_limit constant int := 3000;
  used_day int;
  used_minute int;
  used_global int;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select organization_id into org
  from public.organization_members
  where user_id = uid
  limit 1;

  -- One request at a time per user, so parallel requests cannot all pass the check.
  perform pg_advisory_xact_lock(hashtext('ai:' || uid::text));

  if org is not null and public.org_plan(org) <> 'free' then
    day_limit := 100;
  end if;

  delete from public.ai_usage
  where user_id = uid and created_at < now() - interval '2 days';

  select count(*) into used_day
  from public.ai_usage
  where user_id = uid and created_at > now() - interval '1 day';

  select count(*) into used_minute
  from public.ai_usage
  where user_id = uid and created_at > now() - interval '1 minute';

  select count(*) into used_global
  from public.ai_usage
  where created_at > now() - interval '1 day';

  if used_day >= day_limit or used_minute >= 5 or used_global >= global_day_limit then
    return false;
  end if;

  insert into public.ai_usage (user_id, kind)
  values (uid, left(coalesce(request_kind, ''), 30));

  return true;
end;
$function$;

create or replace function public.org_seat_limit(org uuid)
returns integer
language sql
stable
security definer
set search_path to ''
as $function$
  select case public.org_plan(org) when 'business' then 5 else 1 end;
$function$;

-- 2. Functions ---------------------------------------------------------------------
-- (After step 1 nothing depends on bootstrap_mode() any more.)
drop function if exists public.set_bootstrap_mode(boolean);
drop function if exists public.bootstrap_mode();
drop function if exists public.is_platform_admin();

-- 3. Tables ------------------------------------------------------------------------
drop table if exists public.audit_log;
drop table if exists public.app_settings;
drop table if exists public.platform_admins;
