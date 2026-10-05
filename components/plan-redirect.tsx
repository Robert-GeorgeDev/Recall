"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import { clearPendingPlan, getPendingPlan } from "@/lib/pending-plan";
import { supabase } from "@/lib/supabase";

/**
 * If the visitor chose a paid plan on the pricing section before creating the
 * account, open Stripe checkout as soon as their workspace exists.
 */
export default function PlanRedirect() {
  const { t } = useLanguage();
  const router = useRouter();
  const orgId = useOrgId();
  const started = useRef(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!orgId || started.current) return;
    const plan = getPendingPlan();
    if (!plan) return;
    started.current = true;
    clearPendingPlan();
    setBusy(true);

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error("no session");
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orgId, plan }),
        });
        const json = (await res.json().catch(() => ({}))) as { url?: string };
        if (res.ok && json.url) {
          window.location.href = json.url;
          return;
        }
      } catch {
        // fall through to the Plans page, where the user can retry
      }
      setBusy(false);
      router.replace("/plans");
    })();
  }, [orgId, router]);

  if (!busy) return null;
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 grid place-items-center bg-white/90 text-slate-700 backdrop-blur"
    >
      {t("billing.redirecting")}
    </div>
  );
}
