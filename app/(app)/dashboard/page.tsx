"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Clock, Trophy, Users } from "lucide-react";
import RequireAuth from "@/components/require-auth";
import FollowUpCard, { type Group } from "@/components/followup-card";
import PlanUsage from "@/components/plan-usage";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import { useFollowUps } from "@/hooks/use-followups";
import { supabase } from "@/lib/supabase";
import { todayISO } from "@/lib/dates";
import type { Key } from "@/lib/dictionaries";
import type { FollowUp } from "@/types/followup";

const groupLabel: Record<Group, Key> = {
  overdue: "group.overdue",
  today: "group.today",
  upcoming: "group.upcoming",
};

const badge: Record<Group, string> = {
  overdue: "bg-red-50 text-overdue",
  today: "bg-amber-50 text-amber-700",
  upcoming: "bg-slate-100 text-slate-600",
};

const order: Group[] = ["overdue", "today", "upcoming"];

function compare(a: FollowUp, b: FollowUp): number {
  if (a.due_date !== b.due_date) return a.due_date < b.due_date ? -1 : 1;
  return (a.due_time || "99:99").localeCompare(b.due_time || "99:99");
}

function DashboardView() {
  const { t } = useLanguage();
  const orgId = useOrgId();
  const { followUps, error, reload } = useFollowUps(orgId);
  const [openLeads, setOpenLeads] = useState<number | null>(null);
  const [wonCount, setWonCount] = useState<number | null>(null);

  useEffect(() => {
    if (!orgId) return;
    let cancelled = false;
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .not("status", "in", "(Won,Lost)")
      .then(({ count }) => {
        if (!cancelled) setOpenLeads(count ?? 0);
      });
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "Won")
      .gte("won_at", monthStart)
      .then(({ count }) => {
        if (!cancelled) setWonCount(count ?? 0);
      });
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  const today = todayISO();
  const open = (followUps ?? []).filter((f) => f.status === "open").sort(compare);
  const groups: Record<Group, FollowUp[]> = {
    overdue: open.filter((f) => f.due_date < today),
    today: open.filter((f) => f.due_date === today),
    upcoming: open.filter((f) => f.due_date > today),
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("dash.morning") : hour < 18 ? t("dash.afternoon") : t("dash.evening");

  const stats = [
    { label: t("dash.openLeads"), value: openLeads, Icon: Users, tone: "bg-brand-soft text-brand" },
    { label: t("dash.dueToday"), value: groups.today.length, Icon: Clock, tone: "bg-amber-50 text-amber-700" },
    { label: t("dash.overdue"), value: groups.overdue.length, Icon: AlertCircle, tone: "bg-red-50 text-overdue" },
    { label: t("dash.wonThisMonth"), value: wonCount, Icon: Trophy, tone: "bg-emerald-50 text-done" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-10 pt-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
          <p className="mt-1 text-slate-600">{t("dash.subtitle")}</p>
          {orgId && <PlanUsage orgId={orgId} />}

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
              {t("dash.loadError")}
            </p>
          )}

          {followUps === null && !error && (
            <p className="mt-8 text-slate-600">{t("common.loading")}</p>
          )}

          {followUps !== null && (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map(({ label, value, Icon, tone }) => (
                  <div key={label} className="rounded-xl border border-line bg-white p-4">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-2xl font-bold">{value ?? "–"}</p>
                    <p className="text-xs text-slate-600">{label}</p>
                  </div>
                ))}
              </div>

              {open.length === 0 && (
                <div className="mt-10 rounded-xl border border-dashed border-line bg-white p-8 text-center">
                  <p className="text-lg font-semibold">{t("dash.emptyTitle")}</p>
                  <p className="mt-1 text-slate-600">{t("dash.emptyText")}</p>
                  <Link
                    href="/followups/new"
                    className="mt-5 inline-block rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
                  >
                    {t("nav.addFollowUp")}
                  </Link>
                </div>
              )}

              {open.length > 0 && groups.today.length === 0 && (
                <p className="mt-6 text-sm text-slate-600">{t("dash.nothingToday")}</p>
              )}

              {order.map((g) => {
                const list = groups[g];
                if (list.length === 0) return null;
                return (
                  <section key={g} className="mt-8">
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                      {t(groupLabel[g])}
                      <span className={`rounded-full px-2 py-0.5 text-xs ${badge[g]}`}>
                        {list.length}
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {list.map((item) => (
                        <FollowUpCard
                          key={item.id}
                          item={item}
                          group={g}
                          onChanged={reload}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>

        <aside className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
          <div className="rounded-xl border border-line bg-white p-5">
            <h2 className="font-semibold">{t("dash.schedule")}</h2>
            {groups.today.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">{t("dash.scheduleEmpty")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {groups.today.map((f) => (
                  <li key={f.id} className="flex gap-3 border-l-4 border-brand-accent pl-3">
                    <span className="w-16 shrink-0 text-xs font-semibold text-slate-600">
                      {f.due_time || t("dash.anytime")}
                    </span>
                    <span className="min-w-0 truncate text-sm font-medium">
                      {f.contact_name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
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
