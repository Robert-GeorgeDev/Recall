-- Octom: account deletion function (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
--
-- Deletes the signed-in user's workspaces and login. Refuses ("members_exist")
-- if any workspace the user belongs to has other members. The app calls this
-- through /api/account/delete, which cancels paid subscriptions first.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  if exists (
    select 1
    from public.organization_members mine
    join public.organization_members other
      on other.organization_id = mine.organization_id
     and other.user_id <> uid
    where mine.user_id = uid
  ) then
    raise exception 'members_exist';
  end if;

  delete from public.organizations
  where id in (
    select organization_id
    from public.organization_members
    where user_id = uid
  );

  delete from auth.users where id = uid;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
