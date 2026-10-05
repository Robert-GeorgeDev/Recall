-- Octom: read-only inspection of the database security rules.
-- Changes nothing. Run each query in Supabase > SQL Editor and share the results.
--
-- 1. Row level security: which tables have it on.
select c.relname as table_name, c.relrowsecurity as rls_on, c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;

-- 2. Every policy.
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 3. Functions the app calls (roles, invitations, workspaces, members).
select p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef as security_definer,
       pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname not in ('set_updated_at', 'protect_immutable_columns')
order by 1;

-- 4. Who may run each function.
select p.proname as function_name,
       has_function_privilege('anon', p.oid, 'execute') as anon_can_run,
       has_function_privilege('authenticated', p.oid, 'execute') as signed_in_can_run
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by 1;

-- 5. Size limits stored in the database.
select conrelid::regclass as table_name, conname, pg_get_constraintdef(oid) as rule
from pg_constraint
where connamespace = 'public'::regnamespace and contype = 'c'
order by 1, 2;
