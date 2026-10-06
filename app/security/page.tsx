import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Security – Octom" };

export default function Page() {
  const doc = loadLegalDoc("security");
  return (
    <LegalLayout title="Security" titleRo="Securitate">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
