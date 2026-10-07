# Database

Postgres on Supabase (EU, Frankfurt). The full structure is in
`supabase/baseline.sql`; patches are listed in `supabase/README.md`.
No real data belongs in this repository.

```
auth.users
   |
   +-- organization_members (role: owner / admin / member) -- organizations
   |                                                              |
   |                                       +----------------------+----------+
   |                                       |                      |          |
   |                                   contacts              invitations  subscriptions
   |                                       |
   |                              follow_ups, activities
   +-- email_preferences
```

| Table | Purpose |
|---|---|
| `organizations` | A workspace |
| `organization_members` | Who belongs to which workspace, with role. One workspace per user |
| `contacts`, `follow_ups`, `activities` | The CRM data, always scoped by `organization_id` |
| `invitations` | Pending invitation links (admins see member invites only) |
| `subscriptions` | Plan and Stripe references. Written only by the webhook (service role) |
| `email_preferences` | Daily summary and marketing consent per user |
| `ai_usage` | Counters for AI limits. No message content is stored |

Rules worth knowing:
- Child rows use composite foreign keys `(contact_id, organization_id)` so a row
  cannot point at another workspace's contact.
- `created_by` is nullable and becomes empty when its author's account is deleted.
- Users cannot change `organization_id` or `created_by` after a row is created.
- `supabase/tests/security_test.sql` checks isolation and role limits,
  and rolls everything back.
