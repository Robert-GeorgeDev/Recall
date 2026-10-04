-- Octom: security test. Runs inside one block and rolls everything back.
-- Expected outcome: an error that says
--   ALL TESTS PASSED (rolled back on purpose)
-- Any message that starts with FAIL means a real problem.
do $$
declare
  uid uuid;
  oid uuid;
  cid uuid;
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

  raise exception 'ALL TESTS PASSED (rolled back on purpose)';
end
$$;
