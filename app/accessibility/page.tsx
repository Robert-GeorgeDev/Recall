import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Accessibility – Octom" };

export default function Page() {
  const doc = loadLegalDoc("accessibility");
  return (
    <LegalLayout title="Accessibility" titleRo="Accesibilitate">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
