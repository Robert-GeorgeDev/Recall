"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/dates";
import { useLanguage } from "@/components/language-provider";
import type { Key } from "@/lib/dictionaries";

type Activity = {
  id: string;
  type: string;
  description: string;
  created_at: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default function ActivityTimeline({
  orgId,
  contactId,
  refreshKey,
}: {
  orgId: string;
  contactId: string;
  refreshKey: string;
}) {
  const { t, lang } = useLanguage();
  const locale = lang === "ro" ? "ro-RO" : "en-GB";
  const [items, setItems] = useState<Activity[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("activities")
      .select("id, type, description, created_at")
      .eq("organization_id", orgId)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setFailed(true);
          return;
        }
        setFailed(false);
        setItems((data ?? []) as Activity[]);
      });
    return () => {
      cancelled = true;
    };
  }, [orgId, contactId, refreshKey]);

  function dateText(value: string): string {
    return ISO_DATE.test(value) ? formatDate(value, locale) : value;
  }

  function describe(a: Activity): string {
    switch (a.type) {
      case "status_changed": {
        const label = t(("status." + a.description) as Key) || a.description;
        return `${t("activity.status_changed")} ${label}`;
      }
      case "note":
        return t("activity.note");
      case "follow_up_created":
        return `${t("activity.follow_up_created")} ${dateText(a.description)}`;
      case "follow_up_completed":
        return t("activity.follow_up_completed");
      case "follow_up_snoozed":
        return `${t("activity.follow_up_snoozed")} ${dateText(a.description)}`;
      default:
        return a.description;
    }
  }

  let lastDay = "";

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">{t("activity.title")}</h2>

      {failed && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {t("activity.loadError")}
        </p>
      )}
      {!failed && items === null && (
        <p className="mt-3 text-sm text-slate-600">{t("common.loading")}</p>
      )}
      {items && items.length === 0 && (
        <p className="mt-3 text-sm text-slate-600">{t("activity.empty")}</p>
      )}

      <ol className="mt-2">
        {(items ?? []).map((a) => {
          const d = new Date(a.created_at);
          const day = d.toLocaleDateString(locale, { day: "numeric", month: "long" });
          const showDay = day !== lastDay;
          lastDay = day;
          return (
            <li key={a.id}>
              {showDay && (
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {day}
                </p>
              )}
              <div className="flex gap-3 border-l-2 border-line py-1.5 pl-3">
                <span className="w-12 shrink-0 text-xs text-slate-500">
                  {d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-sm">{describe(a)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
