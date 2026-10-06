import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Privacy Policy – Octom" };

export default function Page() {
  const doc = loadLegalDoc("privacy");
  return (
    <LegalLayout title="Privacy Policy" titleRo="Politica de confidențialitate">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
