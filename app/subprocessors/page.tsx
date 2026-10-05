import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";

export const metadata = { title: "Subprocessors – Octom" };

const US_EN = "Provider is US-based; processing may occur outside the EEA";
const US_RO = "Furnizor cu sediul în SUA; prelucrarea poate avea loc în afara SEE";

// [name, purposeEn, dataEn, locationEn, purposeRo, dataRo, locationRo]
const ROWS: [string, string, string, string, string, string, string][] = [
  ["Supabase", "Database and authentication", "Account data, workspace content (contacts, notes, follow-ups, activity)", "EU (Frankfurt)", "Baza de date și autentificare", "Date de cont, conținutul spațiului de lucru (contacte, notițe, follow-up-uri, activitate)", "UE (Frankfurt)"],
  ["Vercel", "Website and API hosting", "Request data such as IP address and logs", US_EN, "Găzduirea site-ului și a API-ului", "Date despre cereri, precum adresa IP și loguri", US_RO],
  ["Vercel Web Analytics (only if you accept)", "Anonymous visit statistics", "Pages viewed, referrer, country and device type; no advertising cookies", US_EN, "Statistici anonime de vizite (doar dacă accepți)", "Pagini vizualizate, sursa vizitei, țara și tipul dispozitivului; fără cookie-uri de publicitate", US_RO],
  ["Stripe", "Subscription payments", "Email address, plan and billing data. Card details go directly to Stripe and are never stored by Octom", US_EN, "Plăți pentru abonamente", "Adresa de email, plan și date de facturare. Datele cardului ajung direct la Stripe și nu sunt stocate de Octom", US_RO],
  ["Resend", "Email delivery", "Email address and the content of emails we send (account emails, optional daily summary, contact replies)", US_EN, "Trimiterea emailurilor", "Adresa de email și conținutul emailurilor trimise (emailuri de cont, rezumatul zilnic opțional, răspunsuri la contact)", US_RO],
  ["OpenAI", "AI assistant text generation", "Only what is needed for a request you make: your draft or the selected contact details (name, company, status, notes, recent activity)", US_EN, "Generarea de text pentru asistentul AI", "Doar ce este necesar pentru o cerere făcută de tine: mesajul tău sau datele contactului ales (nume, companie, status, notițe, activitate recentă)", US_RO],
];

function Table({ ro }: { ro: boolean }) {
  const h = ro ? ["Furnizor", "Scop", "Date", "Locație"] : ["Provider", "Purpose", "Data", "Location"];
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-ink">
            <th scope="col" className="py-2 pr-4 font-semibold">{h[0]}</th>
            <th scope="col" className="py-2 pr-4 font-semibold">{h[1]}</th>
            <th scope="col" className="py-2 pr-4 font-semibold">{h[2]}</th>
            <th scope="col" className="py-2 font-semibold">{h[3]}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r[0]} className="border-b border-line align-top">
              <th scope="row" className="py-3 pr-4 font-semibold text-ink">{r[0]}</th>
              <td className="py-3 pr-4">{ro ? r[4] : r[1]}</td>
              <td className="py-3 pr-4">{ro ? r[5] : r[2]}</td>
              <td className="py-3">{ro ? r[6] : r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SubprocessorsPage() {
  return (
    <LegalLayout title="Subprocessors" titleRo="Subprocesatori">
      <Bi
        en={
          <>
            <p>
              To provide Octom we use a small number of service providers that may
              process personal data on our behalf. This page lists them and what they
              are used for. We will update it when the list changes.
            </p>

            <h2>Current subprocessors</h2>
            <Table ro={false} />

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
          </>
        }
        ro={
          <>
            <p>
              Pentru a furniza Octom folosim un număr mic de furnizori de servicii care
              pot prelucra date personale în numele nostru. Această pagină îi listează
              și explică la ce sunt folosiți. O vom actualiza când lista se schimbă.
            </p>

            <h2>Subprocesatori actuali</h2>
            <Table ro />

            <h2>Transferuri în afara SEE</h2>
            <p>
              Când un furnizor prelucrează date în afara Spațiului Economic European,
              ne bazăm pe garanțiile permise de lege, precum o decizie de adecvare sau
              clauze contractuale standard, așa cum sunt descrise în termenii de
              prelucrare ai furnizorului.
            </p>

            <h2>Întrebări</h2>
            <p>
              Dacă ai întrebări despre subprocesatori sau ai nevoie de un acord de
              prelucrare a datelor, folosește{" "}
              <a href="/contact">formularul de contact</a>.
            </p>
          </>
        }
      />
    </LegalLayout>
  );
}
