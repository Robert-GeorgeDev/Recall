import LegalLayout from "@/components/legal-layout";

export const metadata = { title: "Security – Octom" };

export default function SecurityPage() {
  return (
    <LegalLayout title="Security">
      <p>
        We build Octom with security as part of the product. No online service
        can promise perfect security, so this page describes what we actually
        do rather than making guarantees.
      </p>

      <h2>Data isolation</h2>
      <p>
        Each workspace’s data is separated by access rules enforced in the
        database itself. A signed-in user can only read and change data that
        belongs to workspaces they are a member of.
      </p>

      <h2>Encrypted connections</h2>
      <p>Traffic between your browser and Octom uses HTTPS.</p>

      <h2>Authentication</h2>
      <p>
        Sign-in and password handling are provided by Supabase Authentication.
        Passwords are stored only in hashed form and are never visible to us.
      </p>

      <h2>Server-side checks</h2>
      <p>
        Actions with side effects, such as billing, the AI assistant and account
        deletion, are checked on the server for an authenticated user. The AI
        assistant and the contact form have usage limits to reduce abuse.
      </p>

      <h2>Payments</h2>
      <p>
        Card details are entered on Stripe’s pages. Octom never receives or
        stores them.
      </p>

      <h2>Report a problem</h2>
      <p>
        If you believe you found a security issue, please tell us through the{" "}
        <a href="/contact">contact form</a> with enough detail to reproduce it,
        and give us reasonable time to fix it before sharing it publicly.
      </p>
    </LegalLayout>
  );
}
