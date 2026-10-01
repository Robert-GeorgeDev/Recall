"use client";

import Link from "next/link";
import RequireAuth from "@/components/require-auth";
import BottomNav from "@/components/bottom-nav";
import FollowUpCard, { type Group } from "@/components/followup-card";
import { useOrgId } from "@/hooks/use-org-id";
import { useFollowUps } from "@/hooks/use-followups";
import { todayISO } from "@/lib/dates";
import type { FollowUp } from "@/types/followup";

const labels: Record<Group, { label: string; badge: string }> = {
  overdue: { label: "Overdue", badge: "bg-red-50 text-overdue" },
  today: { label: "Today", badge: "bg-amber-50 text-amber-700" },
  upcoming: { label: "Upcoming", badge: "bg-slate-100 text-slate-600" },
};

const order: Group[] = ["overdue", "today", "upcoming"];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function compare(a: FollowUp, b: FollowUp): number {
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  return (a.dueTime || "99:99").localeCompare(b.dueTime || "99:99");
}

function DashboardView() {
  const orgId = useOrgId();
  const { followUps, error } = useFollowUps(orgId);
  const today = todayISO();

  const open = (followUps ?? []).filter((f) => f.status === "open").sort(compare);
  const groups: Record<Group, FollowUp[]> = {
    overdue: open.filter((f) => f.dueDate < today),
    today: open.filter((f) => f.dueDate === today),
    upcoming: open.filter((f) => f.dueDate > today),
  };

  const stats = [
    { label: "Open", value: open.length },
    { label: "Due today", value: groups.today.length },
    { label: "Overdue", value: groups.overdue.length },
  ];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <h1 className="text-3xl font-bold tracking-tight">{greeting()}</h1>
      <p className="mt-1 text-slate-600">Here&apos;s what needs your attention.</p>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      {followUps === null && !error && (
        <p className="mt-8 text-slate-600">Loading…</p>
      )}

      {followUps !== null && (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-white p-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>

          {open.length === 0 && (
            <div className="mt-10 rounded-xl border border-dashed border-line bg-white p-8 text-center">
              <p className="text-lg font-semibold">No follow-ups yet.</p>
              <p className="mt-1 text-slate-600">
                Schedule your first one so you know who to contact today.
              </p>
              <Link
                href="/followups/new"
                className="mt-5 inline-block rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
              >
                Add follow-up
              </Link>
            </div>
          )}

          {open.length > 0 && groups.today.length === 0 && (
            <p className="mt-6 text-sm text-slate-600">Nothing is due today.</p>
          )}

          {orgId &&
            order.map((g) => {
              const list = groups[g];
              if (list.length === 0) return null;
              return (
                <section key={g} className="mt-8">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    {labels[g].label}
                    <span className={`rounded-full px-2 py-0.5 text-xs ${labels[g].badge}`}>
                      {list.length}
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {list.map((item) => (
                      <FollowUpCard key={item.id} orgId={orgId} item={item} group={g} />
                    ))}
                  </div>
                </section>
              );
            })}
        </>
      )}

      <BottomNav />
    </main>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardView />
    </RequireAuth>
  );
}
