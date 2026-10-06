import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Billing, cancellation and refunds – Octom" };

export default function Page() {
  const doc = loadLegalDoc("refunds");
  return (
    <LegalLayout title="Billing, cancellation and refunds" titleRo="Facturare, anulare și rambursări">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
