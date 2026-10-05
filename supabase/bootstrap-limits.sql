-- Octom: Bootstrap Mode for the database limits (safe to run more than once)
--
-- Run supabase/bootstrap-mode.sql FIRST (it creates public.bootstrap_mode()).
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
-- Then run supabase/tests/security_test.sql.
--
-- The Free plan limits are enforced by these functions. Each one is replaced
-- with the same code plus one extra rule: while Bootstrap Mode is ON the
-- commercial limits are skipped. When it is OFF they behave exactly as before.
--
--   enforce_contact_limit   no 10-contact limit while ON
--   enforce_followup_limit  no 10-active-follow-up limit while ON
--   ai_check_and_log        daily AI cap is 30 while ON (paid plans keep 100);
--                           the 5-per-minute abuse limit stays; requests of the
--                           same user are now serialized (no parallel bypass)
--   org_seat_limit          5 seats while ON, like Business
--
-- public.org_plan() is NOT changed: it keeps reporting the real Stripe plan, so
-- existing subscriptions and billing stay exactly as they are.

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

  if public.org_plan(new.organization_id) = 'free' and not public.bootstrap_mode() then
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

  if public.org_plan(new.organization_id) = 'free' and not public.bootstrap_mode() then
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
  used_day int;
  used_minute int;
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
  elsif public.bootstrap_mode() then
    day_limit := 30;
  end if;

  delete from public.ai_usage
  where user_id = uid and created_at < now() - interval '2 days';

  select count(*) into used_day
  from public.ai_usage
  where user_id = uid and created_at > now() - interval '1 day';

  select count(*) into used_minute
  from public.ai_usage
  where user_id = uid and created_at > now() - interval '1 minute';

  if used_day >= day_limit or used_minute >= 5 then
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
  select case
    when public.bootstrap_mode() then 5
    else case public.org_plan(org) when 'business' then 5 else 1 end
  end;
$function$;
