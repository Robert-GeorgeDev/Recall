import LegalLayout from "@/components/legal-layout";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Company details – Octom" };

export default function CompanyPage() {
  const rows: [string, string][] = [
    ["Operator", LEGAL.name],
    ["Registered office", LEGAL.address],
    ["Tax ID (CUI)", LEGAL.companyId],
    ["Trade registry no.", LEGAL.registryNo],
    ["General contact", LEGAL.email],
    ["Legal matters", LEGAL.legalEmail],
  ];
  return (
    <LegalLayout title="Company details">
      <p>Octom is a software service developed and operated by:</p>
      <dl className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[200px_1fr]">
            <dt className="font-semibold text-ink">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p>
        You can also reach us through the <a href="/contact">contact form</a>.
      </p>
    </LegalLayout>
  );
}
