# Octom

**Know who to contact today.**

Octom is a deliberately simple CRM built around follow-ups. Add a contact and
the date of the next follow-up, and every day you open one list that shows who
to contact. It is made for freelancers, consultants, small agencies and small
B2B teams who need clarity, not a sales suite.

## Features

- Contacts with notes, status and a simple pipeline
- Follow-ups with due dates and a daily list ("Today")
- Assistant that drafts messages and answers questions. It never sends anything
- Shared workspaces with invitations, roles and assigned follow-ups
- CSV import with preview, and CSV export
- Optional daily summary email
- English and Romanian interface
- Data hosted in the EU (Frankfurt)

## Stack

Next.js, React, TypeScript, Tailwind CSS, Supabase (Postgres, Auth and row level
security), Stripe for subscriptions, Resend for email, Vitest and Playwright
for tests.

## Security in short

- Every table uses row level security. Users only reach data of their own
  workspace.
- Subscriptions are written only by the payment webhook with a server key.
- Secrets live only in the hosting environment, never in the repository.
- `supabase/hardening.sql` and `supabase/tests/security_test.sql` document and
  verify the database rules.
- To report a vulnerability, see [SECURITY.md](SECURITY.md).

## Run it locally

1. Install Node.js 22 or newer.
2. `npm ci`
3. Put your Supabase project URL and public key in `lib/supabase-config.ts`.
   Copy `.env.example` to `.env.local` and fill in your own server-side values.
4. `npm run dev` and open http://localhost:3000

Run the tests with `npm test`. End-to-end tests run with `npm run test:e2e`.

The database schema for self-hosting is not published yet. It will be added
under `supabase/migrations`.

## Contributing

Octom stays small on purpose. Please open an issue to discuss a change before
you send a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) and the
[code of conduct](CODE_OF_CONDUCT.md).

## License

GNU Affero General Public License v3.0. See [LICENSE](LICENSE).
