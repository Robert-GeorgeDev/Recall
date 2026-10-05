import LegalLayout from "@/components/legal-layout";
import Bi from "@/components/bi";

export const metadata = { title: "Billing, cancellation and refunds – Octom" };

export default function RefundsPage() {
  return (
    <LegalLayout title="Billing, cancellation and refunds" titleRo="Facturare, anulare și rambursări">
      <Bi
        en={
          <>
            <p>
              This page explains how paid plans work. It is part of our{" "}
              <a href="/terms">Terms of Service</a>.
            </p>

            <h2>Plans and prices</h2>
            <p>
              The Free plan is currently available at no cost and without a card.
              Pro costs €7.99 per month and Business costs €14.99 per month. The
              price is shown on the button before you subscribe. Payments are
              handled by Stripe.
            </p>

            <h2>How billing works</h2>
            <p>
              Paid plans are billed monthly and renew automatically until you
              cancel. There is no free trial at the moment.
            </p>

            <h2>Cancelling</h2>
            <p>
              You can cancel at any time from Manage subscription. No further
              payments are taken after you cancel, and your paid plan stays active
              until the end of the period you already paid for. Cancelling does not
              delete your data; you can also export it or delete your account from
              the Account page.
            </p>

            <h2>Refunds</h2>
            <p>
              Payments already made for the current period are not refunded when you
              cancel, except where the law gives you a right to a refund. If you
              think you were charged by mistake, contact us through the{" "}
              <a href="/contact">contact form</a> and we will look into it.
            </p>

            <h2>Consumer rights</h2>
            <p>
              Octom is intended mainly for professionals and businesses. If you are a
              consumer, the rights the law gives you apply and cannot be limited by
              our terms. If you have a complaint we could not solve together, you can
              use the Romanian alternative dispute resolution platform:{" "}
              <a href="https://reclamatiisal.anpc.ro/" rel="noopener noreferrer">
                reclamatiisal.anpc.ro
              </a>
              .
            </p>
          </>
        }
        ro={
          <>
            <p>
              Această pagină explică cum funcționează planurile plătite. Face parte
              din <a href="/terms">Termenii și condițiile</a>.
            </p>

            <h2>Planuri și prețuri</h2>
            <p>
              Planul Free este în prezent disponibil fără cost și fără card. Pro costă
              7,99 € pe lună, iar Business 14,99 € pe lună. Prețul apare pe buton
              înainte să te abonezi. Plățile sunt procesate de Stripe.
            </p>

            <h2>Cum funcționează facturarea</h2>
            <p>
              Planurile plătite se facturează lunar și se reînnoiesc automat până la
              anulare. Momentan nu există perioadă de probă gratuită.
            </p>

            <h2>Anulare</h2>
            <p>
              Poți anula oricând din Gestionează abonamentul. După anulare nu se mai
              încasează alte plăți, iar planul plătit rămâne activ până la sfârșitul
              perioadei deja plătite. Anularea nu șterge datele; îți poți exporta
              datele sau poți șterge contul din pagina Cont.
            </p>

            <h2>Rambursări</h2>
            <p>
              Plățile deja făcute pentru perioada curentă nu se rambursează la
              anulare, cu excepția cazurilor în care legea îți dă dreptul la
              rambursare. Dacă crezi că ai fost taxat din greșeală, scrie-ne prin{" "}
              <a href="/contact">formularul de contact</a> și verificăm.
            </p>

            <h2>Drepturile consumatorilor</h2>
            <p>
              Octom este destinat în principal profesioniștilor și firmelor. Dacă ești
              consumator, se aplică drepturile pe care ți le dă legea, iar termenii
              noștri nu le pot limita. Dacă ai o reclamație pe care nu am rezolvat-o
              împreună, poți folosi platforma națională de soluționare alternativă a
              litigiilor:{" "}
              <a href="https://reclamatiisal.anpc.ro/" rel="noopener noreferrer">
                reclamatiisal.anpc.ro
              </a>
              .
            </p>
          </>
        }
      />
    </LegalLayout>
  );
}
