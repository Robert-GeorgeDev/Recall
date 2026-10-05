-- Octom: security hardening, round 3 (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
--
-- What this does:
--   1. Account deletion no longer fails for people who created data in a
--      workspace they later left. "created_by" now becomes empty when that
--      person is deleted, instead of blocking the deletion.
--   2. AI: a global daily cap across all accounts (protects the OpenAI bill from
--      many fake accounts), and a lower per-account cap while Bootstrap Mode is
--      on (30 a day instead of 100). Paid plans keep 100. Free keeps 5.
--   3. Only the workspace owner can see the pending invitations for admins, so an
--      admin cannot pass on the owner's admin invitation links.

-- 1. Account deletion ----------------------------------------------------------
alter table public.contacts alter column created_by drop not null;
alter table public.follow_ups alter column created_by drop not null;
alter table public.activities alter column created_by drop not null;
alter table public.organizations alter column created_by drop not null;

alter table public.contacts drop constraint if exists contacts_created_by_fkey;
alter table public.contacts add constraint contacts_created_by_fkey
  foreign key (created_by) references auth.users (id) on delete set null;

alter table public.follow_ups drop constraint if exists follow_ups_created_by_fkey;
alter table public.follow_ups add constraint follow_ups_created_by_fkey
  foreign key (created_by) references auth.users (id) on delete set null;

alter table public.activities drop constraint if exists activities_created_by_fkey;
alter table public.activities add constraint activities_created_by_fkey
  foreign key (created_by) references auth.users (id) on delete set null;

alter table public.organizations drop constraint if exists organizations_created_by_fkey;
alter table public.organizations add constraint organizations_created_by_fkey
  foreign key (created_by) references auth.users (id) on delete set null;

-- The database looks these up when a user is deleted.
create index if not exists contacts_created_by_idx on public.contacts (created_by);
create index if not exists follow_ups_created_by_idx on public.follow_ups (created_by);
create index if not exists activities_created_by_idx on public.activities (created_by);
create index if not exists organizations_created_by_idx on public.organizations (created_by);

-- 2. AI limits -------------------------------------------------------------------
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

-- 3. Invitation links -------------------------------------------------------------
drop policy if exists "admins view invitations" on public.invitations;
create policy "admins view invitations" on public.invitations
  for select to authenticated
  using (
    public.is_org_admin(organization_id)
    and (
      role = 'member'
      or exists (
        select 1 from public.organization_members m
        where m.organization_id = invitations.organization_id
          and m.user_id = (select auth.uid())
          and m.role = 'owner'
      )
    )
  );

-- To undo part 3:
--   drop policy "admins view invitations" on public.invitations;
--   create policy "admins view invitations" on public.invitations
--     for select to authenticated using (public.is_org_admin(organization_id));
