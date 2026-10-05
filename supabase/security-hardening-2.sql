-- Octom: security hardening, round 2 (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
-- Then run supabase/tests/security_test.sql. It must end with the message
-- "ALL TESTS PASSED (rolled back on purpose)".
--
-- What this does:
--   1. org_plan() can no longer be called by signed-in users. The website never
--      calls it; only database functions do. Before, anyone who knew a
--      workspace id could ask which plan that workspace is on.
--   2. A follow-up or activity can no longer point at a contact that belongs to
--      another workspace.
--   3. One workspace per user is enforced by the database, not just by the
--      functions (two requests at the same moment could create two).

-- 1. org_plan is internal -----------------------------------------------------
revoke execute on function public.org_plan(uuid) from public, anon, authenticated;

-- 2. Same-workspace contact references ---------------------------------------
create or replace function public.check_same_org_contact()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.contact_id is not null and not exists (
    select 1 from public.contacts c
    where c.id = new.contact_id and c.organization_id = new.organization_id
  ) then
    raise exception 'invalid_contact';
  end if;
  return new;
end;
$$;

revoke execute on function public.check_same_org_contact() from public, anon, authenticated;

drop trigger if exists check_follow_ups_contact on public.follow_ups;
create trigger check_follow_ups_contact
  before insert or update of contact_id, organization_id on public.follow_ups
  for each row execute function public.check_same_org_contact();

drop trigger if exists check_activities_contact on public.activities;
create trigger check_activities_contact
  before insert or update of contact_id, organization_id on public.activities
  for each row execute function public.check_same_org_contact();

-- 3. One workspace per user ----------------------------------------------------
-- Skipped with a notice if some user already belongs to more than one workspace.
do $$
begin
  if exists (
    select 1 from public.organization_members group by user_id having count(*) > 1
  ) then
    raise notice 'SKIPPED one-workspace-per-user index: some user is in more than one workspace';
  else
    create unique index if not exists organization_members_one_workspace
      on public.organization_members (user_id);
  end if;
end
$$;

-- To undo any part of this file:
--   grant execute on function public.org_plan(uuid) to authenticated;
--   drop trigger if exists check_follow_ups_contact on public.follow_ups;
--   drop trigger if exists check_activities_contact on public.activities;
--   drop index if exists public.organization_members_one_workspace;
