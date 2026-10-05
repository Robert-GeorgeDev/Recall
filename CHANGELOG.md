# Changelog

## Unreleased

- First public version.
- Bootstrap Mode: an admin-only switch (`/admin`) that makes Octom free and unlimited for a while, hides paid plans and blocks Stripe checkout on the server, without touching Stripe webhooks or existing subscriptions. Run `supabase/bootstrap-mode.sql` to enable it.
