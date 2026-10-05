import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Terms of Service – Octom" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" titleRo="Termeni și condiții">
      <Bi
        en={
          <>
      <p>
        These terms govern your use of Octom, operated by {LEGAL.name},{" "}
        {LEGAL.address} (“we”, “us”). By creating an account or using the
        service you agree to them.
      </p>

      <h2>1. The service</h2>
      <p>
        Octom is a simple CRM that helps you keep track of contacts and
        follow-ups. The service is currently in beta. Features may change, and
        we do not guarantee uninterrupted availability.
      </p>

      <h2>2. Your account</h2>
      <p>
        You must provide accurate information and keep your login details
        secure. You are responsible for activity under your account. You must be
        at least 18 and use Octom for business purposes.
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
        you are responsible for what you send. Octom never sends messages on
        your behalf. We may limit how much you can use it.
      </p>

      <h2>6. Plans and payments</h2>
      <p>
        Octom has a Free plan, currently available at no cost and without a
        card, and paid plans: Pro at €7.99 per month and Business at €14.99 per
        month. Prices and limits are shown before you subscribe and we may
        change them for the future with notice.
      </p>
      <p>
        Paid plans are billed monthly through Stripe and renew automatically
        until you cancel. You can cancel at any time from Manage subscription;
        your plan then stays active until the end of the period you already
        paid for. If you are a consumer, the rights the law gives you cannot be
        limited by these terms.
      </p>

      <h2>7. Ending the service</h2>
      <p>
        You can stop using Octom at any time and export your contacts first.
        You can delete your account yourself from the Account page, which also
        cancels any paid subscription. We may suspend or close accounts that
        break these terms.
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
        Continuing to use Octom after a change means you accept it.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of Romania, without affecting any
        mandatory rights you may have under the law of your country.
      </p>

      <h2>11. Contact</h2>
      <p>Questions about these terms: {LEGAL.email}.</p>
          </>
        }
        ro={
          <>
      <p>
        Acești termeni reglementează folosirea Octom, operat de {LEGAL.name},{" "}
        {LEGAL.address} („noi”). Prin crearea unui cont sau folosirea serviciului
        ești de acord cu ei.
      </p>

      <h2>1. Serviciul</h2>
      <p>
        Octom este un CRM simplu care te ajută să ții evidența contactelor și a
        follow-up-urilor. Serviciul este în prezent în beta. Funcțiile se pot schimba
        și nu garantăm disponibilitate neîntreruptă.
      </p>

      <h2>2. Contul tău</h2>
      <p>
        Trebuie să furnizezi informații corecte și să îți păstrezi datele de
        autentificare în siguranță. Ești responsabil pentru activitatea din contul
        tău. Trebuie să ai cel puțin 18 ani și să folosești Octom în scop profesional.
      </p>

      <h2>3. Conținutul tău</h2>
      <p>
        Rămâi proprietarul datelor pe care le adaugi. Ne dai permisiunea să le stocăm
        și să le prelucrăm doar pentru a furniza serviciul. Ești responsabil să ai
        dreptul de a folosi datele personale ale persoanelor adăugate ca și contacte
        și să le contactezi conform legii (de exemplu regulile de marketing și
        consimțământ).
      </p>

      <h2>4. Utilizare acceptabilă</h2>
      <ul>
        <li>Fără utilizare ilegală, abuzivă, frauduloasă sau dăunătoare.</li>
        <li>Fără trimiterea de spam sau mesaje în masă nesolicitate.</li>
        <li>Fără încercări de a bloca, supraîncărca sau accesa neautorizat serviciul sau datele altor utilizatori.</li>
        <li>Nu stoca date sensibile pentru care serviciul nu este conceput, precum numere de card sau informații medicale.</li>
      </ul>

      <h2>5. Asistentul AI</h2>
      <p>
        Asistentul AI produce texte sugerate. Acestea pot fi inexacte sau incomplete.
        Trebuie să verifici tot înainte să folosești sau să trimiți și ești responsabil
        pentru ce trimiți. Octom nu trimite niciodată mesaje în numele tău. Putem
        limita cât îl poți folosi.
      </p>

      <h2>6. Planuri și plăți</h2>
      <p>
        Octom are un plan Free, disponibil în prezent fără cost și fără card, și planuri
        plătite: Pro la 7,99 € pe lună și Business la 14,99 € pe lună. Prețurile și
        limitele sunt afișate înainte să te abonezi și le putem schimba pentru viitor,
        cu notificare.
      </p>
      <p>
        Planurile plătite se facturează lunar prin Stripe și se reînnoiesc automat până
        la anulare. Poți anula oricând din Gestionează abonamentul; planul rămâne apoi
        activ până la sfârșitul perioadei deja plătite. Dacă ești consumator, drepturile
        pe care ți le dă legea nu pot fi limitate prin acești termeni.
      </p>

      <h2>7. Încheierea serviciului</h2>
      <p>
        Poți înceta oricând să folosești Octom și îți poți exporta mai întâi contactele.
        Îți poți șterge singur contul din pagina Cont, ceea ce anulează și orice
        abonament plătit. Putem suspenda sau închide conturile care încalcă acești
        termeni.
      </p>

      <h2>8. Răspundere</h2>
      <p>
        Serviciul este oferit „ca atare”. În măsura permisă de lege, nu răspundem
        pentru pierderi indirecte sau subsecvente, profit nerealizat sau date pierdute,
        iar răspunderea noastră totală este limitată la suma plătită nouă în cele 12
        luni dinaintea pretenției. Nimic din acești termeni nu limitează răspunderea
        care nu poate fi limitată prin lege.
      </p>

      <h2>9. Modificări</h2>
      <p>
        Putem actualiza acești termeni. Dacă o modificare este importantă, te vom
        anunța. Continuarea folosirii Octom după o modificare înseamnă că o accepți.
      </p>

      <h2>10. Legea aplicabilă</h2>
      <p>
        Acești termeni sunt guvernați de legea română, fără a afecta drepturile
        obligatorii pe care le poți avea conform legii țării tale.
      </p>

      <h2>11. Contact</h2>
      <p>Întrebări despre acești termeni: {LEGAL.email}.</p>
          </>
        }
      />
    </LegalLayout>
  );
}
