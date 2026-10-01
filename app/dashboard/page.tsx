import Link from "next/link";

type Group = "overdue" | "today" | "upcoming";

type Item = {
  id: number;
  name: string;
  company: string;
  status: string;
  note: string;
  group: Group;
};

const items: Item[] = [
  { id: 1, name: "Andrei Pop", company: "Studio Nord", status: "Proposal Sent", note: "Waiting for feedback on the proposal.", group: "overdue" },
  { id: 2, name: "Maria Ionescu", company: "Bright Agency", status: "Contacted", note: "Asked for a call this week.", group: "today" },
  { id: 3, name: "Radu Matei", company: "Matei IT", status: "Qualified", note: "Send pricing details.", group: "today" },
  { id: 4, name: "Elena Dumitru", company: "Dumitru Consulting", status: "New", note: "Intro email to send.", group: "upcoming" },
];

const styles: Record<Group, { label: string; bar: string; badge: string }> = {
  overdue: { label: "Overdue", bar: "border-l-overdue", badge: "bg-red-50 text-overdue" },
  today: { label: "Today", bar: "border-l-today", badge: "bg-amber-50 text-amber-700" },
  upcoming: { label: "Upcoming", bar: "border-l-upcoming", badge: "bg-slate-100 text-slate-600" },
};

const order: Group[] = ["overdue", "today", "upcoming"];

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <h1 className="text-3xl font-bold tracking-tight">Good morning</h1>
      <p className="mt-1 text-slate-600">Here&apos;s what needs your attention.</p>
      <p className="mt-2 text-xs text-slate-500">Sample data for the preview.</p>

      {order.map((g) => {
        const list = items.filter((i) => i.group === g);
        if (list.length === 0) return null;
        return (
          <section key={g} className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              {styles[g].label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${styles[g].badge}`}>
                {list.length}
              </span>
            </h2>
            <div className="space-y-3">
              {list.map((i) => (
                <article
                  key={i.id}
                  className={`rounded-xl border border-line border-l-4 bg-white p-4 ${styles[g].bar}`}
                >
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-sm text-slate-600">
                    {i.company} · {i.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{i.note}</p>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <nav className="fixed inset-x-0 bottom-0 border-t border-line bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link href="/" className="text-sm font-semibold text-brand">
            Home
          </Link>
          <button
            type="button"
            className="rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
          >
            + Add follow-up
          </button>
        </div>
      </nav>
    </main>
  );
}
