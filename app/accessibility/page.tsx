import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";

export const metadata = { title: "Accessibility – Octom" };

export default function AccessibilityPage() {
  return (
    <LegalLayout title="Accessibility" titleRo="Accesibilitate">
      <Bi
        en={
          <>
            <p>
              We want Octom to be usable by as many people as possible, including
              people who use a keyboard, a screen reader or a small screen.
            </p>

            <h2>What we do</h2>
            <ul>
              <li>Semantic page structure with headings and labelled form fields.</li>
              <li>Visible focus states and keyboard navigation.</li>
              <li>Text contrast chosen to be readable, and layouts that work on phones.</li>
              <li>Animations are reduced or turned off when your device asks for less motion.</li>
            </ul>

            <h2>Where we are</h2>
            <p>
              We aim to follow the WCAG 2.1 AA guidelines. We have not had an
              independent accessibility audit yet, so we do not claim full
              conformance, and some parts of the app may still have problems.
            </p>

            <h2>Tell us about a problem</h2>
            <p>
              If something is hard to use, tell us through the{" "}
              <a href="/contact">contact form</a> and describe the page and the
              device or assistive technology you use. We will try to fix it.
            </p>
          </>
        }
        ro={
          <>
            <p>
              Vrem ca Octom să poată fi folosit de cât mai multe persoane, inclusiv de
              cele care folosesc tastatura, un cititor de ecran sau un ecran mic.
            </p>

            <h2>Ce facem</h2>
            <ul>
              <li>Structură semantică a paginilor, cu titluri și câmpuri de formular etichetate.</li>
              <li>Stări de focus vizibile și navigare cu tastatura.</li>
              <li>Contrast al textului ales pentru lizibilitate și machete care funcționează pe telefon.</li>
              <li>Animațiile sunt reduse sau oprite când dispozitivul tău cere mai puțină mișcare.</li>
            </ul>

            <h2>Unde suntem</h2>
            <p>
              Ne propunem să urmăm ghidurile WCAG 2.1 AA. Nu am avut încă un audit
              independent de accesibilitate, așa că nu pretindem conformitate
              completă, iar unele părți ale aplicației pot avea încă probleme.
            </p>

            <h2>Spune-ne despre o problemă</h2>
            <p>
              Dacă ceva este greu de folosit, scrie-ne prin{" "}
              <a href="/contact">formularul de contact</a> și descrie pagina și
              dispozitivul sau tehnologia asistivă pe care o folosești. Vom încerca să
              remediem.
            </p>
          </>
        }
      />
    </LegalLayout>
  );
}
