-- Octom: Bootstrap / Monetization Mode (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
-- Then run supabase/tests/security_test.sql. It must end with the message
-- "ALL TESTS PASSED (rolled back on purpose)".
--
-- What this does:
--   1. platform_admins: the accounts allowed to run the product (not workspace
--      admins). Nobody can write to it through the API; it is filled below.
--   2. app_settings: application-level switches. Only platform admins can read
--      it. The Bootstrap Mode flag is also exposed, read-only, through the
--      function public.bootstrap_mode() because the public pricing page needs it.
--   3. audit_log: who changed what. Only platform admins can read it.
--   4. public.set_bootstrap_mode(enabled): the only way to change the flag. It
--      checks the caller against platform_admins inside the database, writes
--      the setting and the audit row in one step.
--
-- Bootstrap Mode is OFF by default, so running this file changes nothing for users.
-- Stripe tables, webhooks and subscriptions are not touched.

-- 1. Platform admins ---------------------------------------------------------
create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.platform_admins enable row level security;

drop policy if exists platform_admins_self_read on public.platform_admins;
create policy platform_admins_self_read on public.platform_admins
  for select to authenticated
  using (user_id = auth.uid());

revoke all on public.platform_admins from anon, authenticated;
grant select on public.platform_admins to authenticated;

-- 2. Settings ----------------------------------------------------------------
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
alter table public.app_settings enable row level security;

drop policy if exists app_settings_admin_read on public.app_settings;
create policy app_settings_admin_read on public.app_settings
  for select to authenticated
  using (exists (select 1 from public.platform_admins a where a.user_id = auth.uid()));

revoke all on public.app_settings from anon, authenticated;
grant select on public.app_settings to authenticated;

insert into public.app_settings (key, value)
values ('bootstrap_mode', 'false'::jsonb)
on conflict (key) do nothing;

-- 3. Audit log ---------------------------------------------------------------
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  action text not null,
  actor_id uuid references auth.users (id) on delete set null,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;

drop policy if exists audit_log_admin_read on public.audit_log;
create policy audit_log_admin_read on public.audit_log
  for select to authenticated
  using (exists (select 1 from public.platform_admins a where a.user_id = auth.uid()));

revoke all on public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;

-- 4. Functions ---------------------------------------------------------------
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid())
$$;

revoke execute on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

-- Readable by everyone: the public pricing page has to know whether paid plans
-- are on sale. It reveals this one boolean and nothing else. A missing row means OFF.
create or replace function public.bootstrap_mode()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select s.value = 'true'::jsonb from public.app_settings s where s.key = 'bootstrap_mode'),
    false
  )
$$;

revoke execute on function public.bootstrap_mode() from public;
grant execute on function public.bootstrap_mode() to anon, authenticated, service_role;

create or replace function public.set_bootstrap_mode(enabled boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prev boolean;
begin
  if uid is null
     or not exists (select 1 from public.platform_admins where user_id = uid) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if enabled is null then
    raise exception 'invalid value' using errcode = '22023';
  end if;

  prev := public.bootstrap_mode();
  if prev = enabled then
    return enabled;
  end if;

  insert into public.app_settings (key, value, updated_at, updated_by)
  values ('bootstrap_mode', to_jsonb(enabled), now(), uid)
  on conflict (key) do update
    set value = excluded.value, updated_at = now(), updated_by = uid;

  insert into public.audit_log (action, actor_id, previous_value, new_value)
  values (
    case when enabled then 'bootstrap_mode_enabled' else 'bootstrap_mode_disabled' end,
    uid,
    to_jsonb(prev),
    to_jsonb(enabled)
  );

  return enabled;
end
$$;

revoke execute on function public.set_bootstrap_mode(boolean) from public, anon;
grant execute on function public.set_bootstrap_mode(boolean) to authenticated;

-- 5. Make yourself the platform admin ----------------------------------------
-- Replace the address with the email you use to log in to Octom, then run this
-- single statement once. It does nothing if no account has that email.
--
-- insert into public.platform_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict do nothing;
