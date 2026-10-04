-- Octom: database hardening (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
-- Then run supabase/tests/security_test.sql. It must end with the message
-- "ALL TESTS PASSED (rolled back on purpose)".
--
-- What this does:
--   1. Nothing is granted to anonymous visitors by default on future objects.
--   2. Closes the trigger helper set_updated_at to API callers.
--   3. Removes table powers that ignore row level security (TRUNCATE) or that
--      no client needs (REFERENCES, TRIGGER).
--   4. Tables written only by server code or SECURITY DEFINER functions can no
--      longer be written directly by signed-in users, on top of RLS.
--   5. Authorship and workspace ownership of contacts and follow-ups cannot be
--      rewritten after creation.

-- 1. Defaults for future objects
alter default privileges for role postgres in schema public revoke all on tables from anon;
alter default privileges for role postgres in schema public revoke all on sequences from anon;
alter default privileges for role postgres in schema public revoke all on functions from anon;
alter default privileges for role postgres revoke execute on functions from public;

-- 2. Trigger helper is not an API function
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- 3. Table-level powers nobody needs
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;

-- 4. Server-written tables
revoke insert, update, delete on
  public.subscriptions,
  public.organizations,
  public.organization_members,
  public.invitations,
  public.ai_usage
from authenticated;

-- 5. Immutable columns
create or replace function public.protect_immutable_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.organization_id is distinct from old.organization_id
     or (new.created_by is distinct from old.created_by and new.created_by is not null) then
    raise exception 'immutable columns cannot be changed' using errcode = '42501';
  end if;
  return new;
end
$$;

revoke execute on function public.protect_immutable_columns() from public, anon, authenticated;

drop trigger if exists protect_contacts_columns on public.contacts;
create trigger protect_contacts_columns
  before update on public.contacts
  for each row execute function public.protect_immutable_columns();

drop trigger if exists protect_follow_ups_columns on public.follow_ups;
create trigger protect_follow_ups_columns
  before update on public.follow_ups
  for each row execute function public.protect_immutable_columns();
