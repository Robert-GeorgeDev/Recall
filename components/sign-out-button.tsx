"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signOut();
        router.replace("/");
      }}
      className="text-sm font-semibold text-slate-600 hover:text-ink"
    >
      Sign out
    </button>
  );
}
