-- Octom: security fixes (safe to run more than once)
--
-- How to run: Supabase dashboard > SQL Editor > paste this whole file > Run.
-- Order: run this file BEFORE merging the matching code change, then do the last
-- step (the commented DROP) after the new version of the site is live.
--
-- Account deletion used to be a function any signed-in user could call straight
-- from the browser, which skips the step that cancels the Stripe subscription.
-- The new function can only be called with the server key, and the website
-- calls it only after the subscription is cancelled.

create or replace function public.delete_account_for(target uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
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
$$;

revoke execute on function public.delete_account_for(uuid) from public, anon, authenticated;
grant execute on function public.delete_account_for(uuid) to service_role;

-- LAST STEP: run only after the new version of the site is live.
-- It removes the old function that signed-in users could call directly.
--
-- drop function if exists public.delete_my_account();
