import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Cookies – Octom" };

export default function Page() {
  const doc = loadLegalDoc("cookies");
  return (
    <LegalLayout title="Cookies and browser storage" titleRo="Cookie-uri și stocare în browser">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
