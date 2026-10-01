"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/language-provider";

export default function SignOutButton() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        router.replace("/");
      }}
      className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-ink"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {t("nav.signOut")}
    </button>
  );
}
