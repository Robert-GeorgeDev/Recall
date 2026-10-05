import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";

export const metadata = { title: "Cookies – Octom" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookies and browser storage" titleRo="Cookies și stocare în browser">
      <Bi
        en={
          <>
      <p>
        Octom uses only the browser storage that is strictly necessary to make
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
        <li>
          <strong>Chosen plan:</strong> if you pick a paid plan before creating your
          account, we keep it locally for up to 24 hours so we can take you to
          payment after sign-up.
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
          </>
        }
        ro={
          <>
      <p>
        Octom folosește doar stocarea din browser strict necesară pentru funcționarea
        serviciului. Nu folosim cookie-uri de publicitate sau de urmărire și, momentan,
        nu folosim analytics.
      </p>

      <h2>Ce stocăm</h2>
      <ul>
        <li>
          <strong>Sesiunea de autentificare:</strong> un token setat de furnizorul
          nostru de autentificare care te ține conectat. Fără el nu ți-ai putea folosi
          contul.
        </li>
        <li>
          <strong>Preferința de limbă:</strong> reține dacă ai ales engleza sau româna.
        </li>
        <li>
          <strong>Planul ales:</strong> dacă alegi un plan plătit înainte de a-ți crea
          contul, îl reținem local maximum 24 de ore ca să te ducem la plată după
          înregistrare.
        </li>
      </ul>

      <h2>Alegerile tale</h2>
      <p>
        Poți șterge această stocare din setările browserului oricând. Vei fi
        deconectat, iar limba se va reseta.
      </p>

      <h2>Dacă se schimbă ceva</h2>
      <p>
        Dacă adăugăm analytics sau orice cookie-uri neesențiale, vom actualiza această
        pagină și îți vom cere mai întâi consimțământul.
      </p>
          </>
        }
      />
    </LegalLayout>
  );
}
