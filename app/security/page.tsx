import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";

export const metadata = { title: "Security – Octom" };

export default function SecurityPage() {
  return (
    <LegalLayout title="Security" titleRo="Securitate">
      <Bi
        en={
          <>
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
          </>
        }
        ro={
          <>
      <p>
        Construim Octom cu securitatea ca parte a produsului. Niciun serviciu online nu
        poate promite securitate perfectă, așa că această pagină descrie ce facem
        efectiv, fără garanții.
      </p>

      <h2>Izolarea datelor</h2>
      <p>
        Datele fiecărui spațiu de lucru sunt separate prin reguli de acces aplicate
        chiar în baza de date. Un utilizator autentificat poate citi și modifica doar
        datele spațiilor de lucru din care face parte.
      </p>

      <h2>Conexiuni criptate</h2>
      <p>Traficul dintre browserul tău și Octom folosește HTTPS.</p>

      <h2>Autentificare</h2>
      <p>
        Autentificarea și gestionarea parolelor sunt furnizate de Supabase
        Authentication. Parolele sunt stocate doar sub formă de hash și nu ne sunt
        vizibile.
      </p>

      <h2>Verificări pe server</h2>
      <p>
        Acțiunile cu efecte, precum facturarea, asistentul AI și ștergerea contului,
        sunt verificate pe server pentru un utilizator autentificat. Asistentul AI și
        formularul de contact au limite de utilizare pentru a reduce abuzurile.
      </p>

      <h2>Plăți</h2>
      <p>
        Datele cardului se introduc pe paginile Stripe. Octom nu le primește și nu le
        stochează.
      </p>

      <h2>Raportează o problemă</h2>
      <p>
        Dacă crezi că ai găsit o problemă de securitate, spune-ne prin{" "}
        <a href="/contact">formularul de contact</a>, cu suficiente detalii ca să o
        reproducem, și dă-ne un timp rezonabil să o remediem înainte să o faci publică.
      </p>
          </>
        }
      />
    </LegalLayout>
  );
}
