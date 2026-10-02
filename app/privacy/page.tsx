import LegalLayout from "@/components/legal-layout";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Privacy Policy – Orbito" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        This policy explains how Orbito (“we”, “us”) handles personal data when
        you use our service. We try to collect as little as possible.
      </p>

      <h2>1. Who we are</h2>
      <p>
        The operator of Orbito is {LEGAL.name}, {LEGAL.address}. You can contact
        us at {LEGAL.email}.
      </p>

      <h2>2. What data we process</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your email address and a password. The
          password is handled by our authentication provider and is stored only
          in hashed form; we never see it.
        </li>
        <li>
          <strong>Workspace data:</strong> your workspace name and the content
          you add: contacts (names, companies, emails, phone numbers, notes),
          follow-ups and the activity history of those records.
        </li>
        <li>
          <strong>AI usage counters:</strong> when you use the AI assistant we
          record that a request happened (who, when, which type) to apply usage
          limits. We do not store the prompts or the generated text.
        </li>
        <li>
          <strong>Browser storage:</strong> your login session and language
          choice (see our Cookies page).
        </li>
      </ul>
      <p>
        We do not ask for payment card data, bank credentials, medical data or
        passwords to other services, and you should not enter them in notes.
      </p>

      <h2>3. Why we process it</h2>
      <ul>
        <li>To provide the service you asked for (contract).</li>
        <li>To keep the service secure and prevent abuse, including usage limits (legitimate interest).</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>4. Your contacts’ data</h2>
      <p>
        The contact records you add are about other people. For that content you
        decide why and how it is used and you are responsible for having a valid
        legal basis for it; we process it on your behalf to run the service. A
        data processing agreement is available on request.
      </p>

      <h2>5. Who we share data with</h2>
      <p>We use these providers to run Orbito:</p>
      <ul>
        <li>Supabase: database and authentication (project hosted in the EU, Frankfurt).</li>
        <li>Vercel: website hosting.</li>
        <li>
          OpenAI: text generation for the AI assistant. When you use it, the
          relevant contact details (name, company, status, notes, recent
          activity, or your draft) are sent to OpenAI to produce the text.
          OpenAI may keep API inputs for a limited period under its own terms.
        </li>
        <li>
          If we introduce paid plans, payments will be handled by Stripe. We do
          not store card details.
        </li>
      </ul>
      <p>We do not sell personal data.</p>

      <h2>6. International transfers</h2>
      <p>
        Some providers may process data outside the European Economic Area. In
        that case we rely on the safeguards provided by law, such as standard
        contractual clauses or an adequacy decision, where applicable.
      </p>

      <h2>7. How long we keep data</h2>
      <p>
        We keep your data while your account is active. You can export your
        contacts at any time from the Import &amp; export page. To delete your
        account and its data, email us at {LEGAL.email} and we will do it
        within a reasonable time. AI usage counters are short-lived and contain
        no content.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Under the GDPR you can ask for access to your data, correction, deletion,
        restriction, portability and you can object to processing. Contact us at{" "}
        {LEGAL.email}. You can also lodge a complaint with the Romanian data
        protection authority (ANSPDCP) or the authority in your country.
      </p>

      <h2>9. Security</h2>
      <p>
        Data is protected with access controls at database level, so each
        workspace can only be read by its own members, and connections use
        HTTPS. No system is perfectly secure, but we work to protect your data
        and fix problems quickly.
      </p>

      <h2>10. Children</h2>
      <p>Orbito is intended for business use and is not for people under 18.</p>

      <h2>11. Changes</h2>
      <p>
        We may update this policy. The date at the top shows the latest version,
        and we will notify you of important changes.
      </p>
    </LegalLayout>
  );
}
