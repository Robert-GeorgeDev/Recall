-- Octom: security test. Runs inside one block and rolls everything back.
-- Expected outcome: an error that says
--   ALL TESTS PASSED (rolled back on purpose)
-- Any message that starts with FAIL means a real problem.
do $$
declare
  uid uuid;
  oid uuid;
  cid uuid;
  mid uuid;
  morg uuid;
  owner_uid uuid;
  n int;
begin
  select user_id, organization_id into uid, oid
  from public.organization_members
  where role = 'owner'
  limit 1;
  if uid is null then
    raise exception 'no owner found';
  end if;

  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', uid, 'role', 'authenticated')::text,
    true
  );
  set local role authenticated;

  -- Subscriptions cannot be changed by users
  begin
    update public.subscriptions set plan = 'business' where organization_id = oid;
    get diagnostics n = row_count;
    if n > 0 then raise exception 'FAIL: user changed plan'; end if;
  exception when insufficient_privilege then null;
  end;

  begin
    delete from public.subscriptions where organization_id = oid;
    get diagnostics n = row_count;
    if n > 0 then raise exception 'FAIL: user deleted subscription'; end if;
  exception when insufficient_privilege then null;
  end;

  begin
    insert into public.subscriptions (organization_id, plan)
    values (gen_random_uuid(), 'pro');
    raise exception 'FAIL: user inserted subscription';
  exception when insufficient_privilege then null;
  end;

  -- Authorship and workspace cannot be rewritten
  select id into cid from public.contacts where organization_id = oid limit 1;
  if cid is not null then
    begin
      update public.contacts set created_by = gen_random_uuid() where id = cid;
      get diagnostics n = row_count;
      if n > 0 then raise exception 'FAIL: author rewritten'; end if;
    exception when insufficient_privilege then null;
    end;

    begin
      update public.contacts set organization_id = gen_random_uuid() where id = cid;
      get diagnostics n = row_count;
      if n > 0 then raise exception 'FAIL: contact moved'; end if;
    exception when insufficient_privilege then null;
    end;
  end if;

  -- TRUNCATE ignores row level security, so it must be denied
  begin
    truncate public.contacts;
    raise exception 'FAIL: truncate allowed';
  exception when insufficient_privilege then null;
  end;

  -- Workspaces cannot be created by writing to the table directly
  begin
    insert into public.organizations (name) values ('x');
    raise exception 'FAIL: direct organization insert';
  exception when insufficient_privilege then null;
  end;

  -- Anonymous visitors cannot read data
  set local role anon;
  begin
    perform 1 from public.contacts limit 1;
    raise exception 'FAIL: anon can read contacts';
  exception when insufficient_privilege then null;
  end;

  -- The removed Bootstrap / admin objects must be gone
  if to_regclass('public.app_settings') is not null
     or to_regclass('public.audit_log') is not null
     or to_regclass('public.platform_admins') is not null
     or to_regprocedure('public.bootstrap_mode()') is not null then
    raise exception 'FAIL: bootstrap objects still exist (run remove-bootstrap.sql)';
  end if;

  -- Cross-workspace isolation: user A must not touch workspace B
  reset role;
  declare
    uid_b uuid;
    oid_b uuid;
  begin
    select user_id, organization_id into uid_b, oid_b
    from public.organization_members
    where role = 'owner' and organization_id <> oid and user_id <> uid
    limit 1;

    if oid_b is null then
      raise notice 'SKIPPED cross-workspace tests: only one workspace exists';
    else
      perform set_config(
        'request.jwt.claims',
        json_build_object('sub', uid, 'role', 'authenticated')::text,
        true
      );
      set local role authenticated;

      select count(*) into n from public.contacts where organization_id = oid_b;
      if n > 0 then raise exception 'FAIL: user A can read contacts of workspace B'; end if;

      select count(*) into n from public.follow_ups where organization_id = oid_b;
      if n > 0 then raise exception 'FAIL: user A can read follow-ups of workspace B'; end if;

      select count(*) into n from public.organization_members where organization_id = oid_b;
      if n > 0 then raise exception 'FAIL: user A can read members of workspace B'; end if;

      select count(*) into n from public.subscriptions where organization_id = oid_b;
      if n > 0 then raise exception 'FAIL: user A can read subscription of workspace B'; end if;

      update public.contacts set notes = 'x' where organization_id = oid_b;
      get diagnostics n = row_count;
      if n > 0 then raise exception 'FAIL: user A modified contacts of workspace B'; end if;

      delete from public.contacts where organization_id = oid_b;
      get diagnostics n = row_count;
      if n > 0 then raise exception 'FAIL: user A deleted contacts of workspace B'; end if;

      begin
        insert into public.contacts (organization_id, first_name) values (oid_b, 'intruder');
        raise exception 'FAIL: user A inserted a contact into workspace B';
      exception
        when insufficient_privilege or check_violation then null;
        when raise_exception then
          -- the assignee trigger refuses the row before row level security looks at it
          if sqlerrm <> 'invalid_assignee' then raise; end if;
      end;

      -- A signed-in user without any workspace sees nothing
      perform set_config(
        'request.jwt.claims',
        json_build_object('sub', gen_random_uuid(), 'role', 'authenticated')::text,
        true
      );
      select count(*) into n from public.contacts;
      if n > 0 then raise exception 'FAIL: user without workspace can read contacts'; end if;
    end if;
  end;

  -- Role escalation: an ordinary member cannot act as owner or admin
  reset role;
  select user_id, organization_id into mid, morg
  from public.organization_members
  where role = 'member'
  limit 1;

  if mid is null then
    raise notice 'SKIPPED role tests: no member account exists yet';
  else
    select user_id into owner_uid
    from public.organization_members
    where organization_id = morg and role = 'owner'
    limit 1;

    perform set_config(
      'request.jwt.claims',
      json_build_object('sub', mid, 'role', 'authenticated')::text,
      true
    );
    set local role authenticated;

    begin
      perform public.set_member_role(mid, 'admin');
      raise exception 'FAIL: member changed own role';
    exception when raise_exception then
      if sqlerrm <> 'not_allowed' then raise; end if;
    end;

    begin
      perform public.create_invitation('admin');
      raise exception 'FAIL: member created an admin invitation';
    exception when raise_exception then
      if sqlerrm <> 'not_allowed' then raise; end if;
    end;

    begin
      perform public.create_invitation('member');
      raise exception 'FAIL: member created an invitation';
    exception when raise_exception then
      if sqlerrm <> 'not_allowed' then raise; end if;
    end;

    begin
      perform public.remove_member(owner_uid);
      raise exception 'FAIL: member removed the owner';
    exception when raise_exception then
      if sqlerrm <> 'not_allowed' then raise; end if;
    end;

    select count(*) into n from public.invitations;
    if n > 0 then raise exception 'FAIL: member can read invitations'; end if;

    -- org_plan is internal (run supabase/security-hardening-2.sql)
    begin
      perform public.org_plan(morg);
      raise exception 'FAIL: signed-in user can call org_plan';
    exception when insufficient_privilege then null;
    end;
  end if;

  reset role;
  set local role anon;
  raise exception 'ALL TESTS PASSED (rolled back on purpose)';
end
$$;
