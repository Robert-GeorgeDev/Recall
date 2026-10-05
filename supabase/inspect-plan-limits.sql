-- Octom: read-only inspection of where plan limits live in the database.
-- Changes nothing. Run it in Supabase > SQL Editor and share the result.
--
-- Part 1: triggers on the tables that carry plan limits.
select
  c.relname as table_name,
  t.tgname as trigger_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_proc p on p.oid = t.tgfoid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and not t.tgisinternal
  and c.relname in ('contacts', 'follow_ups', 'organization_members', 'invitations', 'ai_usage', 'subscriptions');

-- Part 2: the functions the app calls to check limits.
select p.proname as function_name, pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (p.proname ilike '%plan%' or p.proname ilike '%limit%' or p.proname ilike '%seat%' or p.proname ilike 'ai\_%');
