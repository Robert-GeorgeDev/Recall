import LegalLayout from "@/components/legal-layout";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Terms of Service – Orbito" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        These terms govern your use of Orbito, operated by {LEGAL.name},{" "}
        {LEGAL.address} (“we”, “us”). By creating an account or using the
        service you agree to them.
      </p>

      <h2>1. The service</h2>
      <p>
        Orbito is a simple CRM that helps you keep track of contacts and
        follow-ups. The service is currently in beta. Features may change, and
        we do not guarantee uninterrupted availability.
      </p>

      <h2>2. Your account</h2>
      <p>
        You must provide accurate information and keep your login details
        secure. You are responsible for activity under your account. You must be
        at least 18 and use Orbito for business purposes.
      </p>

      <h2>3. Your content</h2>
      <p>
        You keep ownership of the data you add. You give us permission to store
        and process it only to provide the service. You are responsible for
        having the right to use the personal data of the people you add as
        contacts, and for contacting them in line with the law (for example
        marketing and consent rules).
      </p>

      <h2>4. Acceptable use</h2>
      <ul>
        <li>No unlawful, abusive, fraudulent or harmful use.</li>
        <li>No sending spam or unsolicited bulk messages.</li>
        <li>No attempts to break, overload or gain unauthorised access to the service or other users’ data.</li>
        <li>Do not store sensitive data that the service is not designed for, such as card numbers or medical information.</li>
      </ul>

      <h2>5. AI assistant</h2>
      <p>
        The AI assistant produces suggested text. It can be inaccurate or
        incomplete. You must review everything before you use or send it, and
        you are responsible for what you send. Orbito never sends messages on
        your behalf. We may limit how much you can use it.
      </p>

      <h2>6. Plans and payments</h2>
      <p>
        Orbito is free during the beta. If we introduce paid plans, we will
        explain prices and limits clearly before you are charged, and you will
        be able to choose whether to upgrade.
      </p>

      <h2>7. Ending the service</h2>
      <p>
        You can stop using Orbito at any time and export your contacts first.
        You can ask us to delete your account at {LEGAL.email}. We may suspend
        or close accounts that break these terms.
      </p>

      <h2>8. Liability</h2>
      <p>
        The service is provided “as is”. To the extent allowed by law, we are
        not liable for indirect or consequential losses, lost profits or lost
        data, and our total liability is limited to the amount you paid us in
        the 12 months before the claim. Nothing in these terms limits liability
        that cannot be limited by law.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may update these terms. If a change is important we will tell you.
        Continuing to use Orbito after a change means you accept it.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of Romania, without affecting any
        mandatory rights you may have under the law of your country.
      </p>

      <h2>11. Contact</h2>
      <p>Questions about these terms: {LEGAL.email}.</p>
    </LegalLayout>
  );
}
