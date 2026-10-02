import LegalLayout from "@/components/legal-layout";

export const metadata = { title: "Cookies – Orbito" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookies and browser storage">
      <p>
        Orbito uses only the browser storage that is strictly necessary to make
        the service work. We do not use advertising or tracking cookies, and we
        do not use analytics at the moment.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>
          <strong>Login session:</strong> a token set by our authentication
          provider that keeps you logged in. Without it you could not use your
          account.
        </li>
        <li>
          <strong>Language preference:</strong> remembers whether you chose
          English or Romanian.
        </li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You can clear this storage in your browser settings at any time. You
        will then be logged out and the language will reset.
      </p>

      <h2>If this changes</h2>
      <p>
        If we add analytics or any non-essential cookies, we will update this
        page and ask for your consent first.
      </p>
    </LegalLayout>
  );
}
