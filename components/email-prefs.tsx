"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";

export default function EmailPrefs() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [on, setOn] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("email_preferences")
      .select("daily_summary")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setOn(Boolean(data?.daily_summary)));
  }, [user]);

  async function toggle(next: boolean) {
    if (!user) return;
    setOn(next);
    setMsg("");
    const { error } = await supabase
      .from("email_preferences")
      .upsert({ user_id: user.id, daily_summary: next });
    if (error) {
      setOn(!next);
      setMsg(t("common.error"));
    } else {
      setMsg(t("mail.saved"));
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold">{t("mail.title")}</h3>
          <p className="mt-1 text-sm text-slate-600">{t("mail.text")}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on === true}
          aria-label={t("mail.toggle")}
          disabled={on === null}
          onClick={() => toggle(on !== true)}
          className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 ${
            on === true ? "bg-brand" : "bg-slate-300"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
              on === true ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {msg && <p role="status" className="mt-3 text-sm text-slate-600">{msg}</p>}
    </div>
  );
}
