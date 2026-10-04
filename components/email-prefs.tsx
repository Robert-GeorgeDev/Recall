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
    <section className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{t("mail.title")}</h2>
      <p className="mt-2 text-sm text-slate-600">{t("mail.text")}</p>
      <label className="mt-4 flex min-h-[44px] items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={on === true}
          disabled={on === null}
          onChange={(e) => toggle(e.target.checked)}
        />
        {t("mail.toggle")}
      </label>
      {msg && <p role="status" className="mt-2 text-sm text-slate-600">{msg}</p>}
    </section>
  );
}
