-- Octom: security test. Runs inside one block and rolls everything back.
-- Expected outcome: an error that says
--   ALL TESTS PASSED (rolled back on purpose)
-- Any message that starts with FAIL means a real problem.
do $$
declare
  uid uuid;
  oid uuid;
  cid uuid;
  aid uuid;
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

  -- Bootstrap Mode: an ordinary signed-in user cannot read or change it
  -- (run supabase/bootstrap-mode.sql first)
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', gen_random_uuid(), 'role', 'authenticated')::text,
    true
  );

  begin
    perform public.set_bootstrap_mode(true);
    raise exception 'FAIL: non-admin changed bootstrap mode';
  exception when insufficient_privilege then null;
  end;

  begin
    update public.app_settings set value = 'true'::jsonb where key = 'bootstrap_mode';
    get diagnostics n = row_count;
    if n > 0 then raise exception 'FAIL: non-admin wrote app_settings'; end if;
  exception when insufficient_privilege then null;
  end;

  begin
    insert into public.platform_admins (user_id) values (gen_random_uuid());
    raise exception 'FAIL: user made themselves platform admin';
  exception when insufficient_privilege then null;
  end;

  begin
    insert into public.audit_log (action) values ('forged');
    raise exception 'FAIL: user wrote to audit_log';
  exception when insufficient_privilege then null;
  end;

  select count(*) into n from public.app_settings;
  if n > 0 then raise exception 'FAIL: non-admin can read app_settings'; end if;

  select count(*) into n from public.audit_log;
  if n > 0 then raise exception 'FAIL: non-admin can read audit_log'; end if;

  if public.is_platform_admin() then
    raise exception 'FAIL: random user is platform admin';
  end if;

  -- Bootstrap Mode: a platform admin can change it, and the change is audited
  reset role;
  select user_id into aid from public.platform_admins limit 1;
  if aid is null then
    raise notice 'SKIPPED platform admin tests: no platform admin exists yet';
  else
    perform set_config(
      'request.jwt.claims',
      json_build_object('sub', aid, 'role', 'authenticated')::text,
      true
    );
    set local role authenticated;

    perform public.set_bootstrap_mode(false);
    perform public.set_bootstrap_mode(true);
    if public.bootstrap_mode() is not true then
      raise exception 'FAIL: admin could not enable bootstrap mode';
    end if;

    select count(*) into n from public.audit_log
    where action = 'bootstrap_mode_enabled' and actor_id = aid;
    if n = 0 then raise exception 'FAIL: bootstrap change was not audited'; end if;

    -- While ON, the limits in the database are lifted (run supabase/bootstrap-limits.sql)
    if public.org_seat_limit(oid) <> 5 then
      raise exception 'FAIL: bootstrap seat limit not applied (run bootstrap-limits.sql)';
    end if;

    perform public.set_bootstrap_mode(false);
    if public.bootstrap_mode() is not false then
      raise exception 'FAIL: admin could not disable bootstrap mode';
    end if;
    reset role;
  end if;

  -- Anonymous visitors cannot read data
  set local role anon;
  begin
    perform 1 from public.contacts limit 1;
    raise exception 'FAIL: anon can read contacts';
  exception when insufficient_privilege then null;
  end;

  -- Anonymous visitors may learn only the Bootstrap Mode flag, nothing else
  perform public.bootstrap_mode();
  begin
    perform 1 from public.app_settings limit 1;
    raise exception 'FAIL: anon can read app_settings';
  exception when insufficient_privilege then null;
  end;

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

  reset role;
  set local role anon;
  raise exception 'ALL TESTS PASSED (rolled back on purpose)';
end
$$;
