import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Company details – Octom" };

function Details({ ro }: { ro: boolean }) {
  const rows: [string, string][] = ro
    ? [
        ["Operator", LEGAL.name],
        ["Sediu social", LEGAL.address],
        ["CUI", LEGAL.companyId],
        ["Nr. Registrul Comerțului", LEGAL.registryNo],
        ["Contact general", LEGAL.email],
        ["Chestiuni juridice", LEGAL.legalEmail],
      ]
    : [
        ["Operator", LEGAL.name],
        ["Registered office", LEGAL.address],
        ["Tax ID (CUI)", LEGAL.companyId],
        ["Trade registry no.", LEGAL.registryNo],
        ["General contact", LEGAL.email],
        ["Legal matters", LEGAL.legalEmail],
      ];
  return (
    <dl className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr]">
          <dt className="font-semibold text-ink">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CompanyPage() {
  return (
    <LegalLayout title="Company details" titleRo="Date despre companie">
      <Bi
        en={
          <>
            <p>Octom is a software service developed and operated by:</p>
            <Details ro={false} />
            <p>
              You can also reach us through the <a href="/contact">contact form</a>.
            </p>
          </>
        }
        ro={
          <>
            <p>Octom este un serviciu software dezvoltat și operat de:</p>
            <Details ro />
            <p>
              Ne poți contacta și prin <a href="/contact">formularul de contact</a>.
            </p>
          </>
        }
      />
    </LegalLayout>
  );
}
