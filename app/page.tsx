import Link from "next/link";

const steps = [
  { title: "Add a contact", text: "Create one or import a CSV." },
  { title: "Schedule a follow-up", text: "Pick a date and add a note." },
  { title: "Know who to contact today", text: "Your dashboard shows what needs attention." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-lg font-semibold text-brand">Recall</p>

      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        Never miss a follow-up again.
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Recall is the simple CRM that tells you who to contact, when to contact
        them, and what to say.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
        >
          Start free
        </Link>
        <a
          href="#how"
          className="rounded-xl border border-line bg-white px-6 py-3 font-semibold text-ink hover:bg-brand-soft"
        >
          See how it works
        </a>
      </div>

      <section id="how" className="mt-20">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-line bg-white p-5">
              <p className="text-sm font-semibold text-brand">Step {i + 1}</p>
              <p className="mt-2 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
