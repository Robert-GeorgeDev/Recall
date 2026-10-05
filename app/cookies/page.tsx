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
        use analytics only if you accept it (see below).
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

      <h2>Optional analytics (only with your consent)</h2>
      <p>
        If you click “Accept” in the banner, we load Vercel Web Analytics to
        count visits and pages viewed. It is privacy-oriented: it does not use
        advertising cookies and does not track you across other websites. If
        you click “Decline”, the script is never loaded. Your choice is
        remembered in your browser (key <code>octom-consent</code>) and you can
        change it at any time with “Cookie settings” in the page footer.
      </p>

      <h2>Your choices</h2>
      <p>
        You can clear this storage in your browser settings at any time. You
        will then be logged out and the language will reset.
      </p>

      <h2>If this changes</h2>
      <p>
        If we add any other non-essential cookies or tools, we will update this
        page and ask for your consent first.
      </p>
          </>
        }
        ro={
          <>
      <p>
        Octom folosește doar stocarea din browser strict necesară pentru funcționarea
        serviciului. Nu folosim cookie-uri de publicitate sau de urmărire și, momentan,
        folosim analytics doar dacă accepți (vezi mai jos).
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

      <h2>Analytics opțional (doar cu acordul tău)</h2>
      <p>
        Dacă apeși „Accept” în banner, încărcăm Vercel Web Analytics pentru a număra
        vizitele și paginile văzute. Este orientat spre confidențialitate: nu folosește
        cookie-uri de publicitate și nu te urmărește pe alte site-uri. Dacă apeși
        „Refuz”, scriptul nu este încărcat niciodată. Alegerea ta este reținută în
        browser (cheia <code>octom-consent</code>) și o poți schimba oricând din
        „Setări cookie”, în subsolul paginii.
      </p>

      <h2>Alegerile tale</h2>
      <p>
        Poți șterge această stocare din setările browserului oricând. Vei fi
        deconectat, iar limba se va reseta.
      </p>

      <h2>Dacă se schimbă ceva</h2>
      <p>
        Dacă adăugăm alte cookie-uri sau instrumente neesențiale, vom actualiza această
        pagină și îți vom cere mai întâi consimțământul.
      </p>
          </>
        }
      />
    </LegalLayout>
  );
}
