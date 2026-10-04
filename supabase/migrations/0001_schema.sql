-- Octom schema (multi-tenant follow-up CRM). Reconstructed from the scripts run on production,
-- applied in order and tested on PostgreSQL 16. Needs Supabase (auth schema, roles anon/authenticated/service_role).

-- ===== part 00
-- ===== Orbito schema (V1) =====

-- 1) Tables
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null default '' check (char_length(last_name) <= 80),
  company text not null default '' check (char_length(company) <= 120),
  email text not null default '' check (char_length(email) <= 200),
  phone text not null default '' check (char_length(phone) <= 40),
  status text not null default 'New'
    check (status in ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost')),
  notes text not null default '' check (char_length(notes) <= 5000),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_id_org_unique unique (id, organization_id)
);
create index contacts_org_created_idx on public.contacts (organization_id, created_at desc);

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid not null,
  due_date date not null,
  due_time time,
  priority text not null default 'Normal' check (priority in ('Low', 'Normal', 'High')),
  note text not null default '' check (char_length(note) <= 1000),
  status text not null default 'open' check (status in ('open', 'done')),
  completed_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  -- a follow-up can only point to a contact in the SAME organization
  constraint follow_ups_contact_fk
    foreign key (contact_id, organization_id)
    references public.contacts (id, organization_id) on delete cascade
);
create index follow_ups_org_status_due_idx on public.follow_ups (organization_id, status, due_date);
create index follow_ups_contact_idx on public.follow_ups (contact_id);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  contact_id uuid not null,
  type text not null check (type in (
    'note', 'status_changed', 'follow_up_created', 'follow_up_completed', 'follow_up_snoozed', 'contacted'
  )),
  description text not null default '' check (char_length(description) <= 1000),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  constraint activities_contact_fk
    foreign key (contact_id, organization_id)
    references public.contacts (id, organization_id) on delete cascade
);
create index activities_contact_created_idx on public.activities (contact_id, created_at desc);

-- 2) updated_at trigger
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- 3) Membership helper (SECURITY DEFINER avoids RLS recursion)
create function public.is_org_member(org uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.organization_id = org
      and m.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_org_member(uuid) from public, anon;
grant execute on function public.is_org_member(uuid) to authenticated;

-- 4) Workspace creation (the only way to create an organization)
create function public.create_workspace(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
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

  return org_id;
end;
$$;

revoke execute on function public.create_workspace(text) from public, anon;
grant execute on function public.create_workspace(text) to authenticated;

-- 5) Row Level Security
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.contacts enable row level security;
alter table public.follow_ups enable row level security;
alter table public.activities enable row level security;

revoke all on table
  public.organizations,
  public.organization_members,
  public.contacts,
  public.follow_ups,
  public.activities
from anon;

create policy "members view their workspace"
  on public.organizations for select to authenticated
  using (public.is_org_member(id));

create policy "members view workspace members"
  on public.organization_members for select to authenticated
  using (public.is_org_member(organization_id));

create policy "members view contacts"
  on public.contacts for select to authenticated
  using (public.is_org_member(organization_id));

create policy "members create contacts"
  on public.contacts for insert to authenticated
  with check (public.is_org_member(organization_id) and created_by = (select auth.uid()));

create policy "members update contacts"
  on public.contacts for update to authenticated
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy "members delete contacts"
  on public.contacts for delete to authenticated
  using (public.is_org_member(organization_id));

create policy "members view follow-ups"
  on public.follow_ups for select to authenticated
  using (public.is_org_member(organization_id));

create policy "members create follow-ups"
  on public.follow_ups for insert to authenticated
  with check (public.is_org_member(organization_id) and created_by = (select auth.uid()));

create policy "members update follow-ups"
  on public.follow_ups for update to authenticated
  using (public.is_org_member(organization_id))
  with check (public.is_org_member(organization_id));

create policy "members delete follow-ups"
  on public.follow_ups for delete to authenticated
  using (public.is_org_member(organization_id));

create policy "members view activities"
  on public.activities for select to authenticated
  using (public.is_org_member(organization_id));

create policy "members create activities"
  on public.activities for insert to authenticated
  with check (public.is_org_member(organization_id) and created_by = (select auth.uid()));

-- ===== part 01
-- 1) When a contact became "Won"
alter table public.contacts add column won_at timestamptz;

create function public.contacts_set_won_at()
returns trigger
language plpgsql
set search_path = ''
as $$
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
$$;

create trigger contacts_won_at
  before insert or update on public.contacts
  for each row execute function public.contacts_set_won_at();

-- 2) Activity log for contact changes
create function public.log_contact_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

create trigger contacts_log_changes
  after update on public.contacts
  for each row execute function public.log_contact_changes();

-- 3) Activity log for follow-ups
create function public.log_followup_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

create trigger follow_ups_log_changes
  after insert or update on public.follow_ups
  for each row execute function public.log_followup_changes();

-- 4) These functions run only as triggers
revoke execute on function
  public.contacts_set_won_at(),
  public.log_contact_changes(),
  public.log_followup_changes()
from public, anon, authenticated;

-- 5) Existing "Won" contacts
update public.contacts
set won_at = updated_at
where status = 'Won' and won_at is null;

-- ===== part 02
create table public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (char_length(kind) <= 30),
  created_at timestamptz not null default now()
);

create index ai_usage_user_created_idx on public.ai_usage (user_id, created_at desc);

alter table public.ai_usage enable row level security;
revoke all on table public.ai_usage from anon, authenticated;

create function public.ai_check_and_log(request_kind text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  used_day int;
  used_minute int;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  delete from public.ai_usage
  where user_id = uid and created_at < now() - interval '2 days';

  select count(*) into used_day
  from public.ai_usage
  where user_id = uid and created_at > now() - interval '1 day';

  select count(*) into used_minute
  from public.ai_usage
  where user_id = uid and created_at > now() - interval '1 minute';

  if used_day >= 30 or used_minute >= 5 then
    return false;
  end if;

  insert into public.ai_usage (user_id, kind)
  values (uid, left(coalesce(request_kind, ''), 30));

  return true;
end;
$$;

revoke execute on function public.ai_check_and_log(text) from public, anon;
grant execute on function public.ai_check_and_log(text) to authenticated;

-- ===== part 03
-- 1) Subscriptions (one row per workspace)
create table public.subscriptions (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'business')),
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'canceled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
revoke all on table public.subscriptions from anon;
revoke insert, update, delete on table public.subscriptions from authenticated;

create policy "members view subscription"
  on public.subscriptions for select to authenticated
  using (public.is_org_member(organization_id));

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

insert into public.subscriptions (organization_id)
select id from public.organizations;

-- 2) Effective plan of a workspace
create function public.org_plan(org uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select s.plan
     from public.subscriptions s
     where s.organization_id = org
       and s.status in ('active', 'trialing')),
    'free'
  );
$$;

revoke execute on function public.org_plan(uuid) from public, anon;
grant execute on function public.org_plan(uuid) to authenticated;

-- 3) New workspaces get a Free subscription
create or replace function public.create_workspace(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

-- 4) Plan limits enforced in the database
create function public.enforce_contact_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

create trigger contacts_enforce_limit
  before insert on public.contacts
  for each row execute function public.enforce_contact_limit();

create function public.enforce_followup_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

create trigger follow_ups_enforce_limit
  before insert or update of status on public.follow_ups
  for each row execute function public.enforce_followup_limit();

revoke execute on function
  public.enforce_contact_limit(),
  public.enforce_followup_limit()
from public, anon, authenticated;

-- 5) AI limits depend on the plan (Free: 5 per day, paid: 100 per day)
create or replace function public.ai_check_and_log(request_kind text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
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

  if used_day >= day_limit or used_minute >= 5 then
    return false;
  end if;

  insert into public.ai_usage (user_id, kind)
  values (uid, left(coalesce(request_kind, ''), 30));

  return true;
end;
$$;

-- ===== part 04
-- ===== Neximo team workspaces =====

-- 1) Responsible person on contacts and follow-ups
alter table public.contacts add column assigned_to uuid references auth.users(id) on delete set null;
alter table public.follow_ups add column assigned_to uuid references auth.users(id) on delete set null;

update public.contacts set assigned_to = created_by;
update public.follow_ups set assigned_to = created_by;

create index contacts_assigned_idx on public.contacts (organization_id, assigned_to);
create index follow_ups_assigned_idx on public.follow_ups (organization_id, assigned_to, status, due_date);

create function public.check_assignee()
returns trigger language plpgsql security definer set search_path = ''
as $$
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
$$;

create trigger contacts_check_assignee
  before insert or update of assigned_to on public.contacts
  for each row execute function public.check_assignee();
create trigger follow_ups_check_assignee
  before insert or update of assigned_to on public.follow_ups
  for each row execute function public.check_assignee();

revoke execute on function public.check_assignee() from public, anon, authenticated;

-- 2) Helpers
create function public.is_org_admin(org uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org
      and m.user_id = (select auth.uid())
      and m.role in ('owner', 'admin')
  );
$$;

create function public.org_seat_limit(org uuid)
returns int language sql stable security definer set search_path = ''
as $$
  select case public.org_plan(org) when 'business' then 5 else 1 end;
$$;

-- 3) Invitations
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  token text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  role text not null default 'member' check (role in ('admin', 'member')),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null
);
create index invitations_org_idx on public.invitations (organization_id);

alter table public.invitations enable row level security;
revoke all on table public.invitations from anon;
revoke insert, update, delete on table public.invitations from authenticated;

create policy "admins view invitations"
  on public.invitations for select to authenticated
  using (public.is_org_admin(organization_id));

-- 4) Team functions
create function public.create_invitation(invite_role text)
returns text language plpgsql security definer set search_path = ''
as $$
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

  perform pg_advisory_xact_lock(hashtext('seats:' || org::text));

  select count(*) into used from public.organization_members where organization_id = org;
  select count(*) into pending from public.invitations
    where organization_id = org and accepted_at is null and expires_at > now();

  if used + pending >= public.org_seat_limit(org) then raise exception 'plan_limit_seats'; end if;

  insert into public.invitations (organization_id, role)
  values (org, invite_role)
  returning token into tok;

  return tok;
end;
$$;

create function public.revoke_invitation(invitation_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare org uuid;
begin
  select organization_id into org from public.invitations where id = invitation_id;
  if org is null or not public.is_org_admin(org) then raise exception 'not_allowed'; end if;
  delete from public.invitations where id = invitation_id and accepted_at is null;
end;
$$;

create function public.preview_invitation(invite_token text)
returns table (organization_name text, role text)
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  return query
    select o.name, i.role
    from public.invitations i
    join public.organizations o on o.id = i.organization_id
    where i.token = invite_token and i.accepted_at is null and i.expires_at > now();
end;
$$;

create function public.accept_invitation(invite_token text)
returns uuid language plpgsql security definer set search_path = ''
as $$
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

  perform pg_advisory_xact_lock(hashtext('seats:' || inv.organization_id::text));

  select organization_id into cur_org from public.organization_members where user_id = uid limit 1;

  if cur_org = inv.organization_id then raise exception 'already_member'; end if;

  if cur_org is not null then
    -- only an empty personal workspace (just this user, no data) may be replaced
    if (select count(*) from public.organization_members where organization_id = cur_org) <> 1
       or exists (select 1 from public.contacts where organization_id = cur_org)
       or exists (select 1 from public.follow_ups where organization_id = cur_org) then
      raise exception 'already_in_workspace';
    end if;
    delete from public.organizations where id = cur_org;
  end if;

  select count(*) into seats from public.organization_members where organization_id = inv.organization_id;
  if seats >= public.org_seat_limit(inv.organization_id) then raise exception 'plan_limit_seats'; end if;

  insert into public.organization_members (organization_id, user_id, role)
  values (inv.organization_id, uid, inv.role);

  update public.invitations set accepted_at = now(), accepted_by = uid where id = inv.id;

  return inv.organization_id;
end;
$$;

create function public.list_members()
returns table (user_id uuid, email text, role text, joined_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare org uuid;
begin
  select organization_id into org from public.organization_members where user_id = auth.uid() limit 1;
  if org is null then return; end if;
  return query
    select m.user_id, u.email::text, m.role, m.created_at
    from public.organization_members m
    join auth.users u on u.id = m.user_id
    where m.organization_id = org
    order by m.created_at;
end;
$$;

create function public.remove_member(target uuid)
returns void language plpgsql security definer set search_path = ''
as $$
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
$$;

create function public.leave_workspace()
returns void language plpgsql security definer set search_path = ''
as $$
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
$$;

create function public.set_member_role(target uuid, new_role text)
returns void language plpgsql security definer set search_path = ''
as $$
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
$$;

revoke execute on function
  public.is_org_admin(uuid), public.org_seat_limit(uuid),
  public.create_invitation(text), public.revoke_invitation(uuid),
  public.preview_invitation(text), public.accept_invitation(text),
  public.list_members(), public.remove_member(uuid),
  public.leave_workspace(), public.set_member_role(uuid, text)
from public, anon;

grant execute on function
  public.is_org_admin(uuid), public.org_seat_limit(uuid),
  public.create_invitation(text), public.revoke_invitation(uuid),
  public.preview_invitation(text), public.accept_invitation(text),
  public.list_members(), public.remove_member(uuid),
  public.leave_workspace(), public.set_member_role(uuid, text)
to authenticated;

-- ===== part 05
create or replace function public.list_members()
returns table (user_id uuid, email text, role text, joined_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
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
$$;

-- ===== part 08
create table public.email_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_summary boolean not null default false,
  unsubscribe_token text not null unique
    default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  updated_at timestamptz not null default now()
);

alter table public.email_preferences enable row level security;
revoke all on table public.email_preferences from anon;

create policy "own prefs select" on public.email_preferences
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own prefs insert" on public.email_preferences
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own prefs update" on public.email_preferences
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create trigger email_preferences_set_updated_at
  before update on public.email_preferences
  for each row execute function public.set_updated_at();

-- ===== part 09
alter table public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists current_period_end timestamptz;

create unique index if not exists subscriptions_stripe_customer_uidx
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;


-- ===== ai_usage: no direct client access (only ai_check_and_log, SECURITY DEFINER)
drop policy if exists "no direct access" on public.ai_usage;
create policy "no direct access"
  on public.ai_usage for all to authenticated
  using (false) with check (false);
