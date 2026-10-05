import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Privacy Policy – Octom" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" titleRo="Politica de confidențialitate">
      <Bi
        en={
          <>
      <p>
        This policy explains how Octom (“we”, “us”) handles personal data when
        you use our service. We try to collect as little as possible.
      </p>

      <h2>1. Who we are</h2>
      <p>
        The operator of Octom is {LEGAL.name}, {LEGAL.address}. You can contact
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
          <strong>Team data:</strong> if you invite colleagues, they can see and edit the
          workspace data and can see your email address inside the workspace.
        </li>
        <li>
          <strong>Email preferences:</strong> whether you turned on the optional daily
          summary email, and whether you agreed to receive news and offers
          (with the date you agreed).
        </li>
        <li>
          <strong>Billing data:</strong> if you subscribe to a paid plan, your
          plan, subscription status and the customer reference from our payment
          provider. Card details are entered with Stripe and never reach us.
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
        <li>To handle billing and keep the records the law requires (contract and legal obligation).</li>
        <li>To send you news, product updates and offers by email, only if you agreed (consent). You can withdraw it at any time.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>4. Your contacts’ data</h2>
      <p>
        The contact records you add are about other people. For that content you
        decide why and how it is used and you are responsible for having a valid
        legal basis for it. For that content we act as your processor: we
        process it on your behalf and only to run the service. A data
        processing agreement is available on request through the{" "}
        <a href="/contact">contact form</a>.
      </p>

      <h2>5. Who we share data with</h2>
      <p>
        We use these providers to run Octom. The full list, with purpose and
        data, is on the <a href="/subprocessors">Subprocessors</a> page.
      </p>
      <ul>
        <li>Supabase: database and authentication (project hosted in the EU, Frankfurt).</li>
        <li>Vercel: website hosting and, only if you accept analytics cookies, anonymous visit statistics (Vercel Web Analytics).</li>
        <li>Resend: sends the optional daily summary email (only if you turn it on), account emails and messages from the contact form.</li>
        <li>
          OpenAI: some features use AI models provided by OpenAI. When you use
          the AI assistant, the information needed for your request (your
          draft, or the selected contact’s name, company, status, notes and
          recent activity) is sent to OpenAI to produce the text. The request can include up to 10 recent messages of the chat. This data may be processed in the United States; OpenAI may
          keep API inputs for a limited period under its own terms.
        </li>
        <li>Stripe: handles payments for paid plans. We do not store card details. Invoices and payment records may be kept by Stripe and by us after account deletion, as required by accounting law.</li>
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
        contacts at any time from the Import &amp; export page. You can delete
        your account and all its data yourself from the Account page, or
        email us at {LEGAL.email}. When you delete your account, your workspace
        data and login are removed and any paid subscription is cancelled.
        Copies in provider backups expire on the provider’s normal schedule, and
        we keep billing records for as long as the law requires. AI usage
        counters are short-lived and contain no content.
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
      <p>Octom is intended for business use and is not for people under 18.</p>

      <h2>11. Changes</h2>
      <p>
        We may update this policy. The date at the top shows the latest version,
        and we will notify you of important changes.
      </p>
          </>
        }
        ro={
          <>
      <p>
        Această politică explică cum prelucrează Octom („noi”) datele cu caracter
        personal când folosești serviciul. Încercăm să colectăm cât mai puține date.
      </p>

      <h2>1. Cine suntem</h2>
      <p>
        Operatorul Octom este {LEGAL.name}, {LEGAL.address}. Ne poți contacta la{" "}
        {LEGAL.email}.
      </p>

      <h2>2. Ce date prelucrăm</h2>
      <ul>
        <li>
          <strong>Date de cont:</strong> adresa ta de email și o parolă. Parola este
          gestionată de furnizorul nostru de autentificare și este stocată doar sub
          formă de hash; noi nu o vedem niciodată.
        </li>
        <li>
          <strong>Date din spațiul de lucru:</strong> numele spațiului de lucru și
          conținutul pe care îl adaugi: contacte (nume, companii, emailuri, numere de
          telefon, notițe), follow-up-uri și istoricul activității acestor înregistrări.
        </li>
        <li>
          <strong>Contoare de utilizare AI:</strong> când folosești asistentul AI
          înregistrăm că a avut loc o cerere (cine, când, ce tip) pentru a aplica
          limitele de utilizare. Nu stocăm textele introduse și nici cele generate.
        </li>
        <li>
          <strong>Date de echipă:</strong> dacă inviți colegi, aceștia pot vedea și
          modifica datele spațiului de lucru și îți pot vedea adresa de email în
          cadrul spațiului.
        </li>
        <li>
          <strong>Preferințe de email:</strong> dacă ai activat emailul zilnic opțional
          cu rezumatul și dacă ai fost de acord să primești noutăți și oferte (cu data
          acordului).
        </li>
        <li>
          <strong>Date de facturare:</strong> dacă te abonezi la un plan plătit, planul,
          starea abonamentului și referința de client de la furnizorul nostru de plăți.
          Datele cardului se introduc la Stripe și nu ajung la noi.
        </li>
        <li>
          <strong>Stocare în browser:</strong> sesiunea de autentificare și limba aleasă
          (vezi pagina Cookies).
        </li>
      </ul>
      <p>
        Nu cerem date de card, credențiale bancare, date medicale sau parole către alte
        servicii și nu ar trebui să le introduci în notițe.
      </p>

      <h2>3. De ce le prelucrăm</h2>
      <ul>
        <li>Pentru a furniza serviciul cerut de tine (contract).</li>
        <li>Pentru securitatea serviciului și prevenirea abuzurilor, inclusiv limitele de utilizare (interes legitim).</li>
        <li>Pentru facturare și păstrarea evidențelor cerute de lege (contract și obligație legală).</li>
        <li>Pentru a-ți trimite pe email noutăți, actualizări de produs și oferte, doar dacă ai fost de acord (consimțământ). Îl poți retrage oricând.</li>
        <li>Pentru a respecta obligațiile legale.</li>
      </ul>

      <h2>4. Datele contactelor tale</h2>
      <p>
        Înregistrările de contact pe care le adaugi se referă la alte persoane. Pentru
        acest conținut tu decizi de ce și cum este folosit și ești responsabil să ai o
        bază legală valabilă. Pentru acest conținut acționăm ca persoană împuternicită
        de tine: îl prelucrăm în numele tău și doar pentru a furniza serviciul. Un
        acord de prelucrare a datelor (DPA) este disponibil la cerere prin{" "}
        <a href="/contact">formularul de contact</a>.
      </p>

      <h2>5. Cu cine partajăm datele</h2>
      <p>
        Folosim acești furnizori pentru a opera Octom. Lista completă, cu scopul și
        datele, se află pe pagina <a href="/subprocessors">Subprocesatori</a>.
      </p>
      <ul>
        <li>Supabase: baza de date și autentificarea (proiect găzduit în UE, Frankfurt).</li>
        <li>Vercel: găzduirea site-ului și, doar dacă accepți cookie-urile de analiză, statistici anonime de vizite (Vercel Web Analytics).</li>
        <li>Resend: trimite emailul zilnic opțional cu rezumatul (doar dacă îl activezi), emailurile de cont și mesajele din formularul de contact.</li>
        <li>
          OpenAI: unele funcții folosesc modele AI furnizate de OpenAI. Când folosești
          asistentul AI, informațiile necesare cererii tale (mesajul tău sau numele,
          compania, statusul, notițele și activitatea recentă a contactului ales) sunt
          trimise la OpenAI pentru a genera textul. Cererea poate include ultimele 10 mesaje din conversație. Datele pot fi prelucrate în Statele Unite; OpenAI poate păstra datele trimise
          prin API o perioadă limitată, conform propriilor termeni.
        </li>
        <li>Stripe: procesează plățile pentru planurile plătite. Nu stocăm datele cardului. Facturile și evidența plăților pot fi păstrate de Stripe și de noi după ștergerea contului, conform legii contabilității.</li>
      </ul>
      <p>Nu vindem date cu caracter personal.</p>

      <h2>6. Transferuri internaționale</h2>
      <p>
        Unii furnizori pot prelucra date în afara Spațiului Economic European. În acest
        caz ne bazăm pe garanțiile prevăzute de lege, precum clauzele contractuale
        standard sau o decizie de adecvare, după caz.
      </p>

      <h2>7. Cât timp păstrăm datele</h2>
      <p>
        Păstrăm datele cât timp contul tău este activ. Îți poți exporta contactele
        oricând din pagina Import și export. Îți poți șterge singur contul și toate
        datele din pagina Cont sau ne poți scrie la {LEGAL.email}. Când ștergi contul,
        datele spațiului de lucru și contul de autentificare sunt eliminate, iar orice
        abonament plătit este anulat. Copiile din backup-urile furnizorilor expiră
        conform ciclului normal al furnizorului, iar evidențele de facturare le păstrăm
        cât timp cere legea. Contoarele de utilizare AI sunt de scurtă durată și nu
        conțin conținut.
      </p>

      <h2>8. Drepturile tale</h2>
      <p>
        Conform GDPR poți cere acces la date, rectificare, ștergere, restricționare,
        portabilitate și te poți opune prelucrării. Scrie-ne la {LEGAL.email}. Poți
        depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor
        cu Caracter Personal (ANSPDCP) sau la autoritatea din țara ta.
      </p>

      <h2>9. Securitate</h2>
      <p>
        Datele sunt protejate prin reguli de acces la nivelul bazei de date, astfel
        încât fiecare spațiu de lucru poate fi citit doar de membrii săi, iar
        conexiunile folosesc HTTPS. Niciun sistem nu este perfect sigur, dar lucrăm să
        îți protejăm datele și să remediem rapid problemele.
      </p>

      <h2>10. Minori</h2>
      <p>Octom este destinat uzului profesional și nu este pentru persoane sub 18 ani.</p>

      <h2>11. Modificări</h2>
      <p>
        Putem actualiza această politică. Data de la început arată ultima versiune, iar
        pentru modificările importante te vom anunța.
      </p>
          </>
        }
      />
    </LegalLayout>
  );
}
