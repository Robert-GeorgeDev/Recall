import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Company details – Octom" };

export default function Page() {
  const doc = loadLegalDoc("company");
  return (
    <LegalLayout title="Company details" titleRo="Date despre companie">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
