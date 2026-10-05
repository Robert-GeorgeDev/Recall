# Octom database files

SQL is applied by hand: Supabase dashboard > SQL Editor > paste > Run.

| File | What it is | Run on production? |
|---|---|---|
| `baseline.sql` | Snapshot of the live schema (2026-10-05). For disaster recovery and for building a staging project. | No (already live) |
| `bootstrap-mode.sql` | Admin-only Bootstrap Mode switch, audit log | Already run |
| `bootstrap-limits.sql` | Limits that follow Bootstrap Mode | Already run (re-run after changes) |
| `security-fixes.sql` | Account deletion via service role only | Already run |
| `security-hardening-2.sql` | Same-workspace triggers, one workspace per user | Already run |
| `security-hardening-3.sql` | created_by on delete set null, AI global cap, invitation policy, MAINTAIN revoke | Run after merging |
| `inspect-*.sql` | Read-only diagnostics | Any time |
| `tests/security_test.sql` | Security test, rolls back everything | Any time |

New empty project: baseline, bootstrap-mode, bootstrap-limits, security-fixes,
security-hardening-2, security-hardening-3, then insert your admin (see the
comment at the end of bootstrap-mode.sql).
