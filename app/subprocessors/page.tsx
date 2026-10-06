import LegalLayout from "@/components/legal-layout";
import LegalDoc from "@/components/legal-doc";
import { loadLegalDoc } from "@/lib/legal-content";

export const metadata = { title: "Subprocessors – Octom" };

export default function Page() {
  const doc = loadLegalDoc("subprocessors");
  return (
    <LegalLayout title="Subprocessors" titleRo="Subprocesatori">
      <LegalDoc ro={doc.ro} en={doc.en} />
    </LegalLayout>
  );
}
