"use client";

import { Check } from "lucide-react";
import RequireAuth from "@/components/require-auth";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import BillingButton, { CheckoutNotice } from "@/components/billing-actions";
import { FREE_LIMITS, usePlan, type Plan } from "@/hooks/use-plan";
import type { Key } from "@/lib/dictionaries";

const order: Plan[] = ["free", "pro", "business"];

const names: Record<Plan, Key> = {
  free: "plans.free",
  pro: "plans.pro",
  business: "plans.business",
};

const prices: Record<Plan, string> = {
  free: "€0",
  pro: "€7.99",
  business: "€14.99",
};

const features: Record<Plan, Key[]> = {
  free: ["plans.free.f1", "plans.free.f2", "plans.free.f3", "plans.free.f4", "plans.free.f5"],
  pro: ["plans.pro.f1", "plans.pro.f2", "plans.pro.f3", "plans.pro.f4"],
  business: ["plans.business.f1", "plans.business.f2", "plans.business.f3"],
};

function Usage({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const { t } = useLanguage();
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">
          {limit === null ? `${used} · ${t("plans.unlimited")}` : `${used} / ${limit}`}
        </span>
      </div>
      {limit !== null && (
        <div className="mt-1 h-2 rounded-full bg-slate-100" aria-hidden="true">
          <div
            className={`h-2 rounded-full ${pct >= 80 ? "bg-today" : "bg-brand-accent"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function PlansView() {
  const { t } = useLanguage();
  const orgId = useOrgId();
  const { state, reload } = usePlan(orgId);
  const current: Plan = state?.plan ?? "free";
  const isFree = current === "free";

  return (
    <main className="mx-auto max-w-5xl px-5 pb-10 pt-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("plans.title")}</h1>

      {state && (
        <section className="mt-6 rounded-xl border border-line bg-white p-5">
          <p className="text-sm text-slate-600">{t("plans.currentPlan")}</p>
          <p className="text-xl font-bold">{t(names[current])}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Usage
              label={t("plans.contacts")}
              used={state.contacts}
              limit={isFree ? FREE_LIMITS.contacts : null}
            />
            <Usage
              label={t("plans.followUps")}
              used={state.followUps}
              limit={isFree ? FREE_LIMITS.followUps : null}
            />
          </div>
        </section>
      )}
      <CheckoutNotice reload={reload} />
      {!isFree && (
        <div className="mt-4 max-w-xs">
          <BillingButton orgId={orgId} kind="manage" />
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {order.map((id) => (
          <article
            key={id}
            className={`rounded-xl border bg-white p-5 ${
              id === current ? "border-brand ring-2 ring-brand/20" : "border-line"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t(names[id])}</h2>
              {id === current && (
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {t("plans.currentBadge")}
                </span>
              )}
            </div>
            <p className="mt-3">
              <span className="text-3xl font-bold">{prices[id]}</span>
              {id !== "free" && (
                <span className="text-sm text-slate-600"> {t("plans.perMonth")}</span>
              )}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {features[id].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  <span>{t(f)}</span>
                </li>
              ))}
            </ul>
            {id !== "free" && id !== current && (
              isFree ? <BillingButton orgId={orgId} kind={id} className="mt-5" /> : null
            )}
          </article>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-600">{t("plans.betaNote")}</p>
    </main>
  );
}

export default function PlansPage() {
  return (
    <RequireAuth>
      <PlansView />
    </RequireAuth>
  );
}
