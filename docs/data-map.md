# Octom data map

Where personal data goes. Built from the code and configuration, not assumptions. Items marked **VERIFY** need a check in the provider's dashboard or contract before launch.

| Data | Where it is created | Stored in | Sent to | Purpose | Legal basis | Octom's role |
|---|---|---|---|---|---|---|
| Email, password hash | Sign-up | Supabase Auth (EU, Frankfurt) | — | Account | Contract | Controller |
| Language, marketing consent + date | Sign-up | Supabase Auth user metadata | — | Language; consent record | Contract; consent | Controller |
| Workspace, members, roles | App | Supabase Postgres | — | Service | Contract | Controller (account) |
| Contacts, notes, follow-ups, activity | App, CSV import | Supabase Postgres | OpenAI (only the contact selected for an AI request) | CRM service | Customer's own basis | **Processor** |
| AI draft / selected contact details, up to 10 recent chat messages | AI assistant | Not stored (only a usage counter row) | OpenAI (US transfer) | Generate text | Contract | Processor |
| AI usage counters | AI route | Supabase `ai_usage` | — | Limits, abuse prevention | Legitimate interest | Controller |
| Plan, subscription status, Stripe customer reference | Checkout, Stripe webhook | Supabase `subscriptions` | Stripe | Billing | Contract; legal obligation | Controller |
| Card details | Stripe checkout | Stripe only | — | Payment | Contract | Stripe |
| Email address + email content | Account emails, daily summary, contact replies | Not stored by Octom | Resend (and Supabase Auth mail until SMTP is set to Resend) | Delivery | Contract; consent (marketing) | Controller / processor |
| Contact form message | /contact | Not stored (forwarded by email) | Resend, then the owner's mailbox | Answer the message | Legitimate interest | Controller |
| Anonymous visit statistics | Browser, only after analytics consent | Vercel Web Analytics | Vercel | Product statistics | Consent | Controller |
| Invoices, payment records | Stripe | Stripe; Octom accounting | — | Kept after account deletion (accounting law) | Legal obligation | Controller |
| IP, request logs | Every request | Vercel logs | Vercel | Hosting, security | Legitimate interest | Controller |
| Login session, language, chosen plan | Browser | Browser storage only | — | Strictly necessary | Not consent-based | — |

## Not present
No advertising or tracking scripts. Vercel Web Analytics loads only after the visitor accepts it in the consent banner (`components/consent.tsx`). Marketing emails: consent is withdrawn in Settings or by the unsubscribe link (VERIFY the path exists before sending any marketing).

## VERIFY before launch
- Resend and Vercel data region and their data processing terms.
- OpenAI data retention setting and transfer mechanism for the account used.
- Stripe: data processing terms accepted in the Stripe dashboard.
- Supabase backup retention period (needed to state the real deletion timeline).
