"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";
import type { Key } from "@/lib/dictionaries";

type Kind = "pro" | "business" | "manage";

const labels: Record<Kind, Key> = {
  pro: "billing.upgradePro",
  business: "billing.upgradeBusiness",
  manage: "billing.manage",
};

export default function BillingButton({
  orgId,
  kind,
  className = "",
}: {
  orgId: string | null;
  kind: Kind;
  className?: string;
}) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Key | null>(null);

  async function go() {
    if (!orgId || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("no session");
      const res = await fetch(
        kind === "manage" ? "/api/billing/portal" : "/api/billing/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(kind === "manage" ? { orgId } : { orgId, plan: kind }),
        }
      );
      const json = (await res.json().catch(() => ({}))) as { url?: string };
      if (res.ok && json.url) {
        window.location.href = json.url;
        return;
      }
      setError(
        res.status === 403
          ? "billing.err.forbidden"
          : res.status === 409
            ? "billing.err.already"
            : "billing.err.generic"
      );
    } catch {
      setError("billing.err.generic");
    }
    setBusy(false);
  }

  const style =
    kind === "manage"
      ? "border border-line bg-white text-slate-700"
      : "bg-brand text-white";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={go}
        disabled={!orgId || busy}
        className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60 ${style}`}
      >
        {busy ? t("billing.redirecting") : t(labels[kind])}
      </button>
      {kind !== "manage" && (
        <p className="mt-2 text-center text-xs text-slate-500">
          {t("billing.note")}{" "}
          <a href="/terms" className="font-semibold text-brand">{t("billing.terms")}</a>
          {" · "}
          <a href="/refunds" className="font-semibold text-brand">{t("billing.refunds")}</a>
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {t(error)}
        </p>
      )}
    </div>
  );
}

export function CheckoutNotice({ reload }: { reload: () => void }) {
  const { t } = useLanguage();
  const [kind, setKind] = useState<"success" | "cancel" | null>(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("checkout");
    if (v !== "success" && v !== "cancel") return;
    setKind(v);
    if (v !== "success") return;
    let n = 0;
    const id = setInterval(() => {
      reload();
      if (++n >= 6) clearInterval(id);
    }, 2000);
    return () => clearInterval(id);
  }, [reload]);

  if (!kind) return null;
  return (
    <p role="status" className="mt-4 rounded-xl border border-line bg-white p-4 text-sm">
      {t(kind === "success" ? "billing.success" : "billing.cancelled")}
    </p>
  );
}
