# Octom

**Know who to contact today.**

[![CI](https://github.com/Robert-GeorgeDev/octom/actions/workflows/ci.yml/badge.svg)](https://github.com/Robert-GeorgeDev/octom/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)

Octom is a deliberately simple CRM built around follow-ups, not a sales suite.
You add a contact and the date of the next follow-up. Every morning you open one
list that shows who to contact today, with the context and a draft message ready.

It is made for freelancers, consultants, small agencies and small B2B teams who
need clarity more than features.

## Why Octom

- **One daily list.** The product is the "Today" view, not a dashboard of charts.
- **Nothing is sent for you.** The assistant drafts and suggests. You decide and send.
- **Your data stays yours.** Export contacts, follow-ups and activity as CSV, and delete your account from the app.
- **Small on purpose.** Fewer features, fewer screens, less to maintain.

## Features

- Contacts with notes, status and a simple pipeline
- Follow-ups with due dates, snooze and a daily "Today" list
- AI assistant for drafting messages, summaries and next steps
- Shared workspaces with invitations, roles and assigned follow-ups
- CSV import with preview; CSV export for contacts, follow-ups and activity
- Optional daily summary email
- English and Romanian interface
- Free, Pro and Business plans with Stripe subscriptions, plus an admin-only Bootstrap Mode that makes the app free while the product is launching

## Stack

| Area | Technology |
|---|---|
| App | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Data and auth | Supabase: Postgres with row level security, Auth |
| Payments | Stripe subscriptions and customer portal |
| Email | Resend |
| AI | OpenAI API |
| Tests | Vitest, Playwright, SQL security tests |
| CI | GitHub Actions: tests, build, end-to-end, CodeQL; Dependabot |

## Security in short

- Every table uses row level security. Users only reach the data of their own workspace, and the SQL test in `supabase/tests/security_test.sql` checks isolation between workspaces.
- Subscriptions are written only by the payment webhook, with a server key.
- Billing, AI, contact and account-deletion routes check the signed-in user on the server and have usage limits where abuse is likely.
- Secrets live only in the hosting environment, never in the repository.
- To report a vulnerability, see [SECURITY.md](SECURITY.md).

## Privacy

The database is hosted in the EU (Frankfurt). Some providers (hosting, email, payments, AI) may process data outside the EEA; the full list is on the in-app Subprocessors page and in [docs/data-map.md](docs/data-map.md). No advertising trackers are used; anonymous visit statistics load only after the visitor accepts them.

## Run it locally

1. Install Node.js 22 or newer.
2. `npm ci`
3. Put your Supabase project URL and public key in `lib/supabase-config.ts`. Copy `.env.example` to `.env.local` and fill in your own server-side values.
4. In your Supabase SQL editor run the files listed in [supabase/README.md](supabase/README.md), starting with `baseline.sql`.
5. `npm run dev` and open http://localhost:3000

Run the unit tests with `npm test` and the end-to-end tests with `npm run test:e2e`.

The database structure is published as `supabase/baseline.sql` and described in [docs/database.md](docs/database.md). How the pieces fit together is in [docs/architecture.md](docs/architecture.md).

## Project layout

- `app/` pages and API routes
- `components/`, `hooks/`, `lib/` UI, data hooks, dictionaries (EN/RO) and helpers
- `supabase/` database baseline and patches, security tests, email templates
- `docs/` architecture, database, data map, incident plan, draft DPA for legal review
- `tests/`, `e2e/` unit and end-to-end tests

## Contributing

Octom stays small on purpose. Please open an issue to discuss a change before you send a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md).

## License

GNU Affero General Public License v3.0. See [LICENSE](LICENSE). If you run a modified version as a network service, the AGPL requires you to offer your users the source of your changes.
