# Architecture

Octom is one Next.js application. The browser talks to Supabase directly for
ordinary data (protected by row level security) and to Next.js API routes for
anything that needs a secret.

```
Browser
   |
   +--> Supabase (Auth, Postgres + RLS)     contacts, follow-ups, workspaces
   |
   +--> Next.js API routes (Vercel)
            |-- /api/billing    Stripe checkout and portal
            |-- /api/stripe     Stripe webhook (writes subscriptions)
            |-- /api/ai         OpenAI drafts (limits enforced in the database)
            |-- /api/contact    contact form via Resend
            |-- /api/account    account deletion (service role)
            |-- /api/admin      Bootstrap Mode switch (platform admins only)
            |-- /api/cron       daily summary email (Resend)
```

## Where the rules live

- **Access control:** row level security on every table. Writes that need
  checks (create workspace, invitations, roles) go through `SECURITY DEFINER`
  functions, not direct table writes.
- **Limits** (contacts, follow-ups, seats, AI): enforced by database triggers
  and functions, so they cannot be bypassed from the browser.
- **Plans:** `lib/entitlements.ts` is the single place that turns a
  subscription and the Bootstrap Mode flag into what a workspace may do.
- **Bootstrap Mode:** a flag in `app_settings`, changed only by platform admins
  through `set_bootstrap_mode()`, every change written to `audit_log`. While on,
  the app is free and paid checkout is blocked on the server. Stripe code stays.
- **Secrets:** only in the hosting environment. The browser only knows the
  Supabase URL and public key (`lib/supabase-config.ts`).

## Deployment

Pushing to `main` deploys to Vercel. Pull requests run CI (unit tests, build,
end-to-end, CodeQL, dependency review). SQL changes are applied by hand in the
Supabase SQL editor; see `supabase/README.md`.

## Languages

All user-facing text lives in `lib/dictionary-*.ts` in English and Romanian.
`tests/dictionaries.test.ts` fails if a key exists in only one language.
