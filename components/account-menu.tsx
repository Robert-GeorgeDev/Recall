"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import { supabase } from "@/lib/supabase";

function displayName(
  email: string | undefined,
  meta: Record<string, unknown> | undefined
): string {
  const named = meta?.full_name ?? meta?.name;
  if (typeof named === "string" && named.trim() !== "") return named.trim();
  return (email ?? "").split("@")[0] || "—";
}

export default function AccountMenu() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const orgId = useOrgId();
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orgId) return;
    let cancelled = false;
    supabase
      .from("organizations")
      .select("name")
      .eq("id", orgId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data && typeof data.name === "string") setWorkspace(data.name);
      });
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;
  const name = displayName(user.email, user.user_metadata);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("menu.label")}
        className="flex items-center gap-2 rounded-full border border-line/70 bg-white/90 py-1.5 pl-1.5 pr-3 shadow-soft backdrop-blur transition hover:bg-white"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[10rem] truncate text-sm font-semibold lg:inline">{name}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-line/70 bg-white p-2 shadow-lift"
        >
          <div className="px-3 py-3">
            <p className="truncate font-semibold">{name}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>

          <div className="mx-1 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <Building2 className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500">{t("menu.workspace")}</p>
              <p className="truncate text-sm font-semibold">{workspace || "—"}</p>
            </div>
          </div>

          <div className="mt-2 border-t border-line/70 pt-2">
            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              {t("menu.settings")}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await supabase.auth.signOut();
                router.replace("/");
              }}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-overdue hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
