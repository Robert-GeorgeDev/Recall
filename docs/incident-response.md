# Security incident plan

For a suspected leak, account takeover, exposed key or data-isolation bug.

## 1. Contain (first hour)
- Exposed secret: rotate it in the provider (Stripe, Supabase service role, Resend, OpenAI, `CRON_SECRET`), update Vercel, redeploy.
- Isolation bug: disable the affected feature or route, or revert the last deploy in Vercel.
- Compromised account: reset the password, sign the user out everywhere, review recent activity.
- Keep logs and screenshots. Do not delete evidence.

## 2. Assess
- What data, whose, how many people, since when?
- Was personal data accessed, lost, altered or disclosed? If no personal data was affected it is a security bug, not a data breach.
- Customer contact data is held as processor: the affected customers (controllers) must be told without undue delay.

## 3. Notify
- If the breach is likely to create a risk for people, the controller notifies the Romanian authority (ANSPDCP) within 72 hours of becoming aware. For data Octom holds as controller, that is Octom.
- If the risk to people is high, tell them directly, in plain words: what happened, what data, what to do, how to reach us.
- Write down every breach and the decision, even if no notification is needed.

## 4. Fix and learn
- Fix the root cause, add a test that would have caught it (see `supabase/tests/security_test.sql` and `tests/`).
- Short written summary: timeline, cause, impact, actions. Update this plan.

## Contacts to fill in
- Incident owner: [name, phone]
- Legal advisor / GDPR consultant: [name, contact]
- Authority: ANSPDCP, dataprotection.ro
