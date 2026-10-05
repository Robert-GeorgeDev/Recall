"use client";

import Link from "next/link";
import { usePlan } from "@/hooks/use-plan";
import { useLanguage } from "@/components/language-provider";

export default function PlanUsage({ orgId }: { orgId: string }) {
  const { t } = useLanguage();
  const { state } = usePlan(orgId);

  const { contacts: contactLimit, followUps: followUpLimit } = state?.entitlements.limits ?? {
    contacts: null,
    followUps: null,
  };
  if (!state || contactLimit === null || followUpLimit === null) return null;

  const near = state.contacts >= contactLimit * 0.8 || state.followUps >= followUpLimit * 0.8;

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
        {contactLimit} {t("plan.contactsWord")} · {state.followUps}/
        {followUpLimit} {t("plan.followUpsWord")}
      </span>
      <Link href="/plans" className="font-semibold text-brand hover:underline">
        {t("plan.seePlans")}
      </Link>
    </div>
  );
}
