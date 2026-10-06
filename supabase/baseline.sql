-- Octom: snapshot of the LIVE production schema (read-only export, 2026-10-05).
-- Purpose: version control + disaster recovery + a way to build a staging project.
-- It is a reference. Production already has all of this; do NOT run it there.
-- To build a NEW empty Supabase project, run in the SQL Editor, in this order:
--   1. this file   2. bootstrap-mode.sql   3. bootstrap-limits.sql
--   4. security-fixes.sql   5. security-hardening-2.sql   6. security-hardening-3.sql
-- (2-6 are idempotent patches; this snapshot already contains their live effects
-- up to the date above, so re-running them is harmless.)
-- Tables app_settings, audit_log, platform_admins are defined in bootstrap-mode.sql.
-- Not included: Supabase-managed objects (auth schema, event trigger rls_auto_enable).

set check_function_bodies = off; -- some functions reference tables created later by bootstrap-mode.sql

-- ===== Tables =====
create table if not exists public.organizations (
  id uuid not null default gen_random_uuid(),
  name text not null,
  created_by uuid default auth.uid(),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null,
  user_id uuid not null,
  role text not null default 'member'::text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.subscriptions (
  organization_id uuid not null,
  plan text not null default 'free'::text,
  status text not null default 'active'::text,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.invitations (
  id uuid not null default gen_random_uuid(),
  organization_id uuid not null,
  token text not null default replace(((gen_random_uuid())::text || (gen_random_uuid())::text), '-'::text, ''::text),
  role text not null default 'member'::text,
  created_by uuid not null default auth.uid(),
  created_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone not null default (now() + '7 days'::interval),
  accepted_at timestamp with time zone,
  accepted_by uuid
);

create table if not exists public.contacts (
  id uuid not null default gen_random_uuid(),
  organization_id uuid not null,
  first_name text not null,
  last_name text not null default ''::text,
  company text not null default ''::text,
  email text not null default ''::text,
  phone text not null default ''::text,
  status text not null default 'New'::text,
  notes text not null default ''::text,
  created_by uuid default auth.uid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  won_at timestamp with time zone,
  assigned_to uuid
);

create table if not exists public.follow_ups (
  id uuid not null default gen_random_uuid(),
  organization_id uuid not null,
  contact_id uuid not null,
  due_date date not null,
  due_time time without time zone,
  priority text not null default 'Normal'::text,
  note text not null default ''::text,
  status text not null default 'open'::text,
  completed_at timestamp with time zone,
  created_by uuid default auth.uid(),
  created_at timestamp with time zone not null default now(),
  assigned_to uuid
);

create table if not exists public.activities (
  id uuid not null default gen_random_uuid(),
  organization_id uuid not null,
  contact_id uuid not null,
  type text not null,
  description text not null default ''::text,
  created_by uuid default auth.uid(),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.email_preferences (
  user_id uuid not null,
  daily_summary boolean not null default false,
  unsubscribe_token text not null default replace(((gen_random_uuid())::text || (gen_random_uuid())::text), '-'::text, ''::text),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.ai_usage (
  id bigint generated always as identity,
  user_id uuid not null default auth.uid(),
  kind text not null,
  created_at timestamp with time zone not null default now()
);

-- ===== Constraints =====
alter table public.organizations add constraint organizations_pkey PRIMARY KEY (id);
alter table public.organizations add constraint organizations_name_check CHECK (((char_length(name) >= 1) AND (char_length(name) <= 80)));
alter table public.organizations add constraint organizations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public.organization_members add constraint organization_members_pkey PRIMARY KEY (organization_id, user_id);
alter table public.organization_members add constraint organization_members_role_check CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text])));
alter table public.organization_members add constraint organization_members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;
alter table public.organization_members add constraint organization_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.subscriptions add constraint subscriptions_pkey PRIMARY KEY (organization_id);
alter table public.subscriptions add constraint subscriptions_plan_check CHECK ((plan = ANY (ARRAY['free'::text, 'pro'::text, 'business'::text])));
alter table public.subscriptions add constraint subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'trialing'::text, 'past_due'::text, 'canceled'::text])));
alter table public.subscriptions add constraint subscriptions_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

alter table public.invitations add constraint invitations_pkey PRIMARY KEY (id);
alter table public.invitations add constraint invitations_token_key UNIQUE (token);
alter table public.invitations add constraint invitations_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'member'::text])));
alter table public.invitations add constraint invitations_accepted_by_fkey FOREIGN KEY (accepted_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.invitations add constraint invitations_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.invitations add constraint invitations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

alter table public.contacts add constraint contacts_pkey PRIMARY KEY (id);
alter table public.contacts add constraint contacts_id_org_unique UNIQUE (id, organization_id);
alter table public.contacts add constraint contacts_company_check CHECK ((char_length(company) <= 120));
alter table public.contacts add constraint contacts_email_check CHECK ((char_length(email) <= 200));
alter table public.contacts add constraint contacts_first_name_check CHECK (((char_length(first_name) >= 1) AND (char_length(first_name) <= 80)));
alter table public.contacts add constraint contacts_last_name_check CHECK ((char_length(last_name) <= 80));
alter table public.contacts add constraint contacts_notes_check CHECK ((char_length(notes) <= 5000));
alter table public.contacts add constraint contacts_phone_check CHECK ((char_length(phone) <= 40));
alter table public.contacts add constraint contacts_status_check CHECK ((status = ANY (ARRAY['New'::text, 'Contacted'::text, 'Qualified'::text, 'Proposal Sent'::text, 'Negotiation'::text, 'Won'::text, 'Lost'::text])));
alter table public.contacts add constraint contacts_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.contacts add constraint contacts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.contacts add constraint contacts_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

alter table public.follow_ups add constraint follow_ups_pkey PRIMARY KEY (id);
alter table public.follow_ups add constraint follow_ups_note_check CHECK ((char_length(note) <= 1000));
alter table public.follow_ups add constraint follow_ups_priority_check CHECK ((priority = ANY (ARRAY['Low'::text, 'Normal'::text, 'High'::text])));
alter table public.follow_ups add constraint follow_ups_status_check CHECK ((status = ANY (ARRAY['open'::text, 'done'::text])));
alter table public.follow_ups add constraint follow_ups_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.follow_ups add constraint follow_ups_contact_fk FOREIGN KEY (contact_id, organization_id) REFERENCES public.contacts(id, organization_id) ON DELETE CASCADE;
alter table public.follow_ups add constraint follow_ups_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.follow_ups add constraint follow_ups_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

alter table public.activities add constraint activities_pkey PRIMARY KEY (id);
alter table public.activities add constraint activities_description_check CHECK ((char_length(description) <= 1000));
alter table public.activities add constraint activities_type_check CHECK ((type = ANY (ARRAY['note'::text, 'status_changed'::text, 'follow_up_created'::text, 'follow_up_completed'::text, 'follow_up_snoozed'::text, 'contacted'::text])));
alter table public.activities add constraint activities_contact_fk FOREIGN KEY (contact_id, organization_id) REFERENCES public.contacts(id, organization_id) ON DELETE CASCADE;
alter table public.activities add constraint activities_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.activities add constraint activities_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

alter table public.email_preferences add constraint email_preferences_pkey PRIMARY KEY (user_id);
alter table public.email_preferences add constraint email_preferences_unsubscribe_token_key UNIQUE (unsubscribe_token);
alter table public.email_preferences add constraint email_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public.ai_usage add constraint ai_usage_pkey PRIMARY KEY (id);
alter table public.ai_usage add constraint ai_usage_kind_check CHECK ((char_length(kind) <= 30));
alter table public.ai_usage add constraint ai_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ===== Functions =====
CREATE OR REPLACE FUNCTION public.accept_invitation(invite_token text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  inv public.invitations%rowtype;
  cur_org uuid;
  seats int;
begin
  if uid is null then raise exception 'not authenticated'; end if;

  select * into inv from public.invitations where token = invite_token for update;
  if not found or inv.accepted_at is not null or inv.expires_at <= now() then
    raise exception 'invalid_invitation';
  end if;

  perform pg_advisory_xact_lock(hashtext('seats:' \;
CREATE OR REPLACE FUNCTION public.ai_check_and_log(request_kind text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  perform pg_advisory_xact_lock(hashtext('ai:' \;
CREATE OR REPLACE FUNCTION public.bootstrap_mode()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select coalesce(
    (select s.value = 'true'::jsonb from public.app_settings s where s.key = 'bootstrap_mode'),
    false
  )
$function$;
CREATE OR REPLACE FUNCTION public.check_assignee()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if tg_op = 'INSERT' and new.assigned_to is null then
    new.assigned_to := new.created_by;
  end if;
  if new.assigned_to is not null and not exists (
    select 1 from public.organization_members m
    where m.organization_id = new.organization_id and m.user_id = new.assigned_to
  ) then
    raise exception 'invalid_assignee';
  end if;
  return new;
end;
$function$;
CREATE OR REPLACE FUNCTION public.contacts_set_won_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  if tg_op = 'INSERT' then
    if new.status = 'Won' then
      new.won_at := now();
    end if;
  elsif new.status is distinct from old.status then
    new.won_at := case when new.status = 'Won' then now() else null end;
  end if;
  return new;
end;
$function$;
CREATE OR REPLACE FUNCTION public.create_invitation(invite_role text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  org uuid;
  my_role text;
  used int;
  pending int;
  tok text;
begin
  if uid is null then raise exception 'not authenticated'; end if;

  select organization_id, role into org, my_role
  from public.organization_members where user_id = uid limit 1;

  if org is null or my_role not in ('owner', 'admin') then raise exception 'not_allowed'; end if;
  if invite_role not in ('admin', 'member') then raise exception 'invalid_role'; end if;
  if invite_role = 'admin' and my_role <> 'owner' then raise exception 'not_allowed'; end if;

  perform pg_advisory_xact_lock(hashtext('seats:' \;
CREATE OR REPLACE FUNCTION public.create_workspace(workspace_name text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  org_id uuid;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if workspace_name is null or char_length(trim(workspace_name)) not between 1 and 80 then
    raise exception 'invalid workspace name';
  end if;

  select organization_id into org_id
  from public.organization_members
  where user_id = uid
  limit 1;

  if org_id is not null then
    return org_id;
  end if;

  insert into public.organizations (name, created_by)
  values (trim(workspace_name), uid)
  returning id into org_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (org_id, uid, 'owner');

  insert into public.subscriptions (organization_id)
  values (org_id);

  return org_id;
end;
$function$;
CREATE OR REPLACE FUNCTION public.delete_account_for(target uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if target is null then
    raise exception 'missing user';
  end if;

  if exists (
    select 1
    from public.organization_members mine
    join public.organization_members other
      on other.organization_id = mine.organization_id
     and other.user_id <> target
    where mine.user_id = target
  ) then
    raise exception 'members_exist';
  end if;

  delete from public.organizations
  where id in (
    select organization_id
    from public.organization_members
    where user_id = target
  );

  delete from auth.users where id = target;
end;
$function$;
CREATE OR REPLACE FUNCTION public.enforce_contact_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  used int;
begin
  perform pg_advisory_xact_lock(hashtext('contacts:' \;
CREATE OR REPLACE FUNCTION public.enforce_followup_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  used int;
begin
  if new.status <> 'open' then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.status = 'open' then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtext('follow_ups:' \;
CREATE OR REPLACE FUNCTION public.is_org_admin(org uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org
      and m.user_id = (select auth.uid())
      and m.role in ('owner', 'admin')
  );
$function$;
CREATE OR REPLACE FUNCTION public.is_org_member(org uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = org
      and m.user_id = (select auth.uid())
  );
$function$;
CREATE OR REPLACE FUNCTION public.is_platform_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (select 1 from public.platform_admins where user_id = auth.uid())
$function$;
CREATE OR REPLACE FUNCTION public.leave_workspace()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  org uuid;
  my_role text;
begin
  select organization_id, role into org, my_role
  from public.organization_members where user_id = uid limit 1;
  if org is null or my_role = 'owner' then raise exception 'not_allowed'; end if;

  delete from public.organization_members where organization_id = org and user_id = uid;
  update public.contacts set assigned_to = null where organization_id = org and assigned_to = uid;
  update public.follow_ups set assigned_to = null where organization_id = org and assigned_to = uid;
end;
$function$;
CREATE OR REPLACE FUNCTION public.list_members()
 RETURNS TABLE(user_id uuid, email text, role text, joined_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare org uuid;
begin
  select om.organization_id into org
  from public.organization_members om
  where om.user_id = auth.uid()
  limit 1;

  if org is null then return; end if;

  return query
    select m.user_id, u.email::text, m.role, m.created_at
    from public.organization_members m
    join auth.users u on u.id = m.user_id
    where m.organization_id = org
    order by m.created_at;
end;
$function$;
CREATE OR REPLACE FUNCTION public.log_contact_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  actor uuid;
begin
  actor := coalesce(auth.uid(), new.created_by);

  if new.status is distinct from old.status then
    insert into public.activities (organization_id, contact_id, type, description, created_by)
    values (new.organization_id, new.id, 'status_changed', new.status, actor);
  end if;

  if new.notes is distinct from old.notes then
    insert into public.activities (organization_id, contact_id, type, description, created_by)
    values (new.organization_id, new.id, 'note', '', actor);
  end if;

  return null;
end;
$function$;
CREATE OR REPLACE FUNCTION public.log_followup_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  actor uuid;
begin
  actor := coalesce(auth.uid(), new.created_by);

  if tg_op = 'INSERT' then
    insert into public.activities (organization_id, contact_id, type, description, created_by)
    values (new.organization_id, new.contact_id, 'follow_up_created', to_char(new.due_date, 'YYYY-MM-DD'), actor);
  elsif old.status = 'open' and new.status = 'done' then
    insert into public.activities (organization_id, contact_id, type, description, created_by)
    values (new.organization_id, new.contact_id, 'follow_up_completed', to_char(new.due_date, 'YYYY-MM-DD'), actor);
  elsif new.status = 'open' and new.due_date is distinct from old.due_date then
    insert into public.activities (organization_id, contact_id, type, description, created_by)
    values (new.organization_id, new.contact_id, 'follow_up_snoozed', to_char(new.due_date, 'YYYY-MM-DD'), actor);
  end if;

  return null;
end;
$function$;
CREATE OR REPLACE FUNCTION public.org_plan(org uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select coalesce(
    (select s.plan
     from public.subscriptions s
     where s.organization_id = org
       and s.status in ('active', 'trialing')),
    'free'
  );
$function$;
CREATE OR REPLACE FUNCTION public.org_seat_limit(org uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select case
    when public.bootstrap_mode() then 5
    else case public.org_plan(org) when 'business' then 5 else 1 end
  end;
$function$;
CREATE OR REPLACE FUNCTION public.preview_invitation(invite_token text)
 RETURNS TABLE(organization_name text, role text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  return query
    select o.name, i.role
    from public.invitations i
    join public.organizations o on o.id = i.organization_id
    where i.token = invite_token and i.accepted_at is null and i.expires_at > now();
end;
$function$;
CREATE OR REPLACE FUNCTION public.remove_member(target uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  org uuid;
  my_role text;
  target_role text;
begin
  select organization_id, role into org, my_role
  from public.organization_members where user_id = uid limit 1;
  if org is null or my_role not in ('owner', 'admin') or target = uid then raise exception 'not_allowed'; end if;

  select role into target_role from public.organization_members
  where organization_id = org and user_id = target;
  if target_role is null then raise exception 'not_found'; end if;
  if target_role = 'owner' or (my_role = 'admin' and target_role <> 'member') then raise exception 'not_allowed'; end if;

  delete from public.organization_members where organization_id = org and user_id = target;
  update public.contacts set assigned_to = null where organization_id = org and assigned_to = target;
  update public.follow_ups set assigned_to = null where organization_id = org and assigned_to = target;
end;
$function$;
CREATE OR REPLACE FUNCTION public.revoke_invitation(invitation_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare org uuid;
begin
  select organization_id into org from public.invitations where id = invitation_id;
  if org is null or not public.is_org_admin(org) then raise exception 'not_allowed'; end if;
  delete from public.invitations where id = invitation_id and accepted_at is null;
end;
$function$;
CREATE OR REPLACE FUNCTION public.set_bootstrap_mode(enabled boolean)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;
CREATE OR REPLACE FUNCTION public.set_member_role(target uuid, new_role text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := auth.uid();
  org uuid;
  my_role text;
begin
  select organization_id, role into org, my_role
  from public.organization_members where user_id = uid limit 1;
  if org is null or my_role <> 'owner' or new_role not in ('admin', 'member') or target = uid then
    raise exception 'not_allowed';
  end if;
  update public.organization_members set role = new_role
  where organization_id = org and user_id = target and role <> 'owner';
end;
$function$;

-- ===== Indexes and triggers =====
create index if not exists activities_contact_created_idx on public.activities using btree (contact_id, created_at desc);
create index if not exists ai_usage_user_created_idx on public.ai_usage using btree (user_id, created_at desc);
create index if not exists contacts_assigned_idx on public.contacts using btree (organization_id, assigned_to);
create index if not exists contacts_org_created_idx on public.contacts using btree (organization_id, created_at desc);
create index if not exists follow_ups_assigned_idx on public.follow_ups using btree (organization_id, assigned_to, status, due_date);
create index if not exists follow_ups_contact_idx on public.follow_ups using btree (contact_id);
create index if not exists follow_ups_org_status_due_idx on public.follow_ups using btree (organization_id, status, due_date);
create index if not exists invitations_org_idx on public.invitations using btree (organization_id);
create unique index if not exists subscriptions_stripe_customer_uidx on public.subscriptions using btree (stripe_customer_id) where (stripe_customer_id is not null);

create trigger contacts_check_assignee before insert or update of assigned_to on public.contacts for each row execute function public.check_assignee();
create trigger contacts_enforce_limit before insert on public.contacts for each row execute function public.enforce_contact_limit();
create trigger contacts_log_changes after update on public.contacts for each row execute function public.log_contact_changes();
create trigger contacts_set_updated_at before update on public.contacts for each row execute function public.set_updated_at();
create trigger contacts_won_at before insert or update on public.contacts for each row execute function public.contacts_set_won_at();
create trigger protect_contacts_columns before update on public.contacts for each row execute function public.protect_immutable_columns();
create trigger email_preferences_set_updated_at before update on public.email_preferences for each row execute function public.set_updated_at();
create trigger follow_ups_check_assignee before insert or update of assigned_to on public.follow_ups for each row execute function public.check_assignee();
create trigger follow_ups_enforce_limit before insert or update of status on public.follow_ups for each row execute function public.enforce_followup_limit();
create trigger follow_ups_log_changes after insert or update on public.follow_ups for each row execute function public.log_followup_changes();
create trigger protect_follow_ups_columns before update on public.follow_ups for each row execute function public.protect_immutable_columns();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();

-- ===== Row level security =====
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invitations enable row level security;
alter table public.contacts enable row level security;
alter table public.follow_ups enable row level security;
alter table public.activities enable row level security;
alter table public.email_preferences enable row level security;
alter table public.ai_usage enable row level security;

drop policy if exists "members create activities" on public.activities;
create policy "members create activities" on public.activities for insert to authenticated
  with check ((is_org_member(organization_id) AND (created_by = ( SELECT auth.uid() AS uid))));

drop policy if exists "members view activities" on public.activities;
create policy "members view activities" on public.activities for select to authenticated
  using (is_org_member(organization_id));

drop policy if exists "no direct access" on public.ai_usage;
create policy "no direct access" on public.ai_usage for all to authenticated
  using (false)
  with check (false);

drop policy if exists "members create contacts" on public.contacts;
create policy "members create contacts" on public.contacts for insert to authenticated
  with check ((is_org_member(organization_id) AND (created_by = ( SELECT auth.uid() AS uid))));

drop policy if exists "members delete contacts" on public.contacts;
create policy "members delete contacts" on public.contacts for delete to authenticated
  using (is_org_member(organization_id));

drop policy if exists "members update contacts" on public.contacts;
create policy "members update contacts" on public.contacts for update to authenticated
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

drop policy if exists "members view contacts" on public.contacts;
create policy "members view contacts" on public.contacts for select to authenticated
  using (is_org_member(organization_id));

drop policy if exists "own prefs insert" on public.email_preferences;
create policy "own prefs insert" on public.email_preferences for insert to authenticated
  with check ((user_id = ( SELECT auth.uid() AS uid)));

drop policy if exists "own prefs select" on public.email_preferences;
create policy "own prefs select" on public.email_preferences for select to authenticated
  using ((user_id = ( SELECT auth.uid() AS uid)));

drop policy if exists "own prefs update" on public.email_preferences;
create policy "own prefs update" on public.email_preferences for update to authenticated
  using ((user_id = ( SELECT auth.uid() AS uid)))
  with check ((user_id = ( SELECT auth.uid() AS uid)));

drop policy if exists "members create follow-ups" on public.follow_ups;
create policy "members create follow-ups" on public.follow_ups for insert to authenticated
  with check ((is_org_member(organization_id) AND (created_by = ( SELECT auth.uid() AS uid))));

drop policy if exists "members delete follow-ups" on public.follow_ups;
create policy "members delete follow-ups" on public.follow_ups for delete to authenticated
  using (is_org_member(organization_id));

drop policy if exists "members update follow-ups" on public.follow_ups;
create policy "members update follow-ups" on public.follow_ups for update to authenticated
  using (is_org_member(organization_id))
  with check (is_org_member(organization_id));

drop policy if exists "members view follow-ups" on public.follow_ups;
create policy "members view follow-ups" on public.follow_ups for select to authenticated
  using (is_org_member(organization_id));

drop policy if exists "admins view invitations" on public.invitations;
create policy "admins view invitations" on public.invitations for select to authenticated
  using (is_org_admin(organization_id));

drop policy if exists "members view workspace members" on public.organization_members;
create policy "members view workspace members" on public.organization_members for select to authenticated
  using (is_org_member(organization_id));

drop policy if exists "members view their workspace" on public.organizations;
create policy "members view their workspace" on public.organizations for select to authenticated
  using (is_org_member(id));

drop policy if exists "members view subscription" on public.subscriptions;
create policy "members view subscription" on public.subscriptions for select to authenticated
  using (is_org_member(organization_id));

-- ===== Grants (live) =====
-- authenticated: read/write own-workspace data through RLS; org tables read-only
grant select, insert, update, delete on public.contacts, public.follow_ups, public.activities, public.email_preferences to authenticated;
grant select on public.organizations, public.organization_members, public.subscriptions, public.invitations to authenticated;
-- service_role (server only): everything. anon: nothing.
grant all on all tables in schema public to service_role;
