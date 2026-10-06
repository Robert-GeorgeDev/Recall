import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Terms of Service – Octom" };

export default function Page() {
  const doc = loadLegalDoc("terms");
  return (
    <LegalLayout title="Terms and conditions" titleRo="Termeni și condiții">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
