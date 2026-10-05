import LegalLayout from "@/components/legal-layout";

export const metadata = { title: "Subprocessors – Octom" };

const ROWS = [
  ["Supabase", "Database and authentication", "Account data, workspace content (contacts, notes, follow-ups, activity)", "EU (Frankfurt)"],
  ["Vercel", "Website and API hosting", "Request data such as IP address and logs", "Provider is US-based; processing may occur outside the EEA"],
  ["Stripe", "Subscription payments", "Email address, plan and billing data. Card details go directly to Stripe and are never stored by Octom", "Provider is US-based; processing may occur outside the EEA"],
  ["Resend", "Email delivery", "Email address and the content of emails we send (account emails, optional daily summary, contact replies)", "Provider is US-based; processing may occur outside the EEA"],
  ["OpenAI", "AI assistant text generation", "Only what is needed for a request you make: your draft or the selected contact details (name, company, status, notes, recent activity)", "Provider is US-based; processing may occur outside the EEA"],
];

export default function SubprocessorsPage() {
  return (
    <LegalLayout title="Subprocessors">
      <p>
        To provide Octom we use a small number of service providers that may
        process personal data on our behalf. This page lists them and what they
        are used for. We will update it when the list changes.
      </p>

      <h2>Current subprocessors</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink">
              <th scope="col" className="py-2 pr-4 font-semibold">Provider</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Purpose</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Data</th>
              <th scope="col" className="py-2 font-semibold">Location</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([name, purpose, data, where]) => (
              <tr key={name} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4 font-semibold text-ink">{name}</th>
                <td className="py-3 pr-4">{purpose}</td>
                <td className="py-3 pr-4">{data}</td>
                <td className="py-3">{where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Transfers outside the EEA</h2>
      <p>
        Where a provider processes data outside the European Economic Area, we
        rely on the safeguards allowed by law, such as an adequacy decision or
        standard contractual clauses, as described in the provider’s own data
        processing terms.
      </p>

      <h2>Questions</h2>
      <p>
        If you have questions about subprocessors or need a data processing
        agreement, use the <a href="/contact">contact form</a>.
      </p>
    </LegalLayout>
  );
}
