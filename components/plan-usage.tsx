"use client";

import Link from "next/link";
import { FREE_LIMITS, usePlan } from "@/hooks/use-plan";
import { useLanguage } from "@/components/language-provider";

export default function PlanUsage({ orgId }: { orgId: string }) {
  const { t } = useLanguage();
  const { state } = usePlan(orgId);

  if (!state || state.plan !== "free") return null;

  const near =
    state.contacts >= FREE_LIMITS.contacts * 0.8 ||
    state.followUps >= FREE_LIMITS.followUps * 0.8;

  return (
    <div
      className={`mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm ${
        near
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-line bg-white text-slate-700"
      }`}
    >
      <span>
        <strong>{t("plan.bannerTitle")}</strong> · {state.contacts}/
        {FREE_LIMITS.contacts} {t("plan.contactsWord")} · {state.followUps}/
        {FREE_LIMITS.followUps} {t("plan.followUpsWord")}
      </span>
      <Link href="/plans" className="font-semibold text-brand hover:underline">
        {t("plan.seePlans")}
      </Link>
    </div>
  );
}
