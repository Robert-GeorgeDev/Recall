"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import { useBootstrapMode } from "@/hooks/use-bootstrap";
import { supabase } from "@/lib/supabase";

type Member = { user_id: string; email: string; role: string; joined_at: string };
type Invite = { id: string; token: string; role: string; expires_at: string };

function TeamView() {
  const { t, lang } = useLanguage();
  const bootstrap = useBootstrapMode();
  const { user } = useAuth();
  const router = useRouter();
  const orgId = useOrgId();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [seats, setSeats] = useState(1);
  const [role, setRole] = useState<"member" | "admin">("member");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  const myRole = members.find((m) => m.user_id === user?.id)?.role ?? "member";
  const canManage = myRole === "owner" || myRole === "admin";
  const locale = lang === "ro" ? "ro-RO" : "en-GB";
  const roleLabel: Record<string, string> = {
    owner: t("team.role.owner"),
    admin: t("team.role.admin"),
    member: t("team.role.member"),
  };

  const load = useCallback(async () => {
    if (!orgId) return;
    const [m, i, s] = await Promise.all([
      supabase.rpc("list_members"),
      supabase
        .from("invitations")
        .select("id, token, role, expires_at")
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false }),
      supabase.rpc("org_seat_limit", { org: orgId }),
    ]);
    setMembers((m.data as Member[]) ?? []);
    setInvites((i.data as Invite[]) ?? []);
    if (typeof s.data === "number") setSeats(s.data);
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  function errorText(message: string) {
    if (message.includes("plan_limit_seats")) return t("team.err.seats");
    if (message.includes("not_allowed")) return t("team.err.notAllowed");
    return t("common.error");
  }

  async function run(action: () => PromiseLike<{ error: { message: string } | null }>) {
    setBusy(true);
    setMsg("");
    const { error } = await action();
    if (error) setMsg(errorText(error.message));
    await load();
    setBusy(false);
  }

  const linkFor = (token: string) => `${window.location.origin}/join?token=${token}`;

  async function copy(token: string) {
    try {
      await navigator.clipboard.writeText(linkFor(token));
      setCopied(token);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      window.prompt("Link", linkFor(token));
    }
  }

  async function createInvite() {
    setBusy(true);
    setMsg("");
    const { data, error } = await supabase.rpc("create_invitation", { invite_role: role });
    if (error) setMsg(errorText(error.message));
    else if (typeof data === "string") await copy(data);
    await load();
    setBusy(false);
  }

  const btn = "min-h-[44px] rounded-xl px-4 text-sm font-semibold";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-8">
      <h1 className="text-3xl font-bold tracking-tight">{t("team.title")}</h1>
      <p className="mt-1 text-slate-600">{t("team.subtitle")}</p>
      {msg && <p role="alert" className="mt-3 text-sm text-overdue">{msg}</p>}

      <section className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">{t("team.members")}</h2>
          <p className="text-sm text-slate-600">{t("team.seats")}: {members.length} / {seats}</p>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {members.map((m) => {
            const isMe = m.user_id === user?.id;
            const removable = !isMe && m.role !== "owner" && (myRole === "owner" || (myRole === "admin" && m.role === "member"));
            return (
              <li key={m.user_id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="min-w-0">
                  <p className="break-all font-medium">
                    {m.email} {isMe && <span className="ml-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">{t("team.you")}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {myRole === "owner" && !isMe && m.role !== "owner" ? (
                    <select
                      value={m.role}
                      disabled={busy}
                      onChange={(e) => run(() => supabase.rpc("set_member_role", { target: m.user_id, new_role: e.target.value }))}
                      className="min-h-[44px] rounded-xl border border-line bg-white px-3 text-sm"
                    >
                      <option value="member">{roleLabel.member}</option>
                      <option value="admin">{roleLabel.admin}</option>
                    </select>
                  ) : (
                    <span className="rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-brand">{roleLabel[m.role]}</span>
                  )}
                  {removable && (
                    <button
                      disabled={busy}
                      onClick={() => window.confirm(t("team.confirmRemove")) && run(() => supabase.rpc("remove_member", { target: m.user_id }))}
                      className={`${btn} border border-line text-overdue`}
                    >
                      {t("team.remove")}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {myRole !== "owner" && members.length > 0 && (
          <button
            disabled={busy}
            onClick={async () => {
              if (!window.confirm(t("team.confirmLeave"))) return;
              const { error } = await supabase.rpc("leave_workspace");
              if (error) setMsg(errorText(error.message));
              else router.replace("/onboarding");
            }}
            className={`${btn} mt-3 border border-line text-slate-700`}
          >
            {t("team.leave")}
          </button>
        )}
      </section>

      {canManage && seats > 1 && (
        <section className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{t("team.invite.title")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("team.invite.text")}</p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            {myRole === "owner" && (
              <label className="text-sm font-medium">
                {t("team.invite.role")}
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "member" | "admin")}
                  className="mt-1 block min-h-[44px] rounded-xl border border-line bg-white px-3"
                >
                  <option value="member">{roleLabel.member}</option>
                  <option value="admin">{roleLabel.admin}</option>
                </select>
              </label>
            )}
            <button disabled={busy} onClick={createInvite} className={`${btn} bg-cta text-white hover:bg-cta-dark`}>
              {t("team.invite.create")}
            </button>
          </div>

          {invites.length > 0 && (
            <>
              <h3 className="mt-5 text-sm font-semibold">{t("team.invite.pending")}</h3>
              <ul className="mt-2 divide-y divide-line">
                {invites.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span>
                      {roleLabel[i.role]} · {t("team.invite.expires")} {new Date(i.expires_at).toLocaleDateString(locale)}
                    </span>
                    <span className="flex gap-2">
                      <button onClick={() => copy(i.token)} className={`${btn} border border-line`}>
                        {copied === i.token ? t("team.invite.copied") : t("team.invite.copy")}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => run(() => supabase.rpc("revoke_invitation", { invitation_id: i.id }))}
                        className={`${btn} border border-line text-overdue`}
                      >
                        {t("team.invite.revoke")}
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      {seats <= 1 && bootstrap === false && (
        <section className="mt-4 rounded-2xl border border-line bg-lavender p-5">
          <h2 className="text-lg font-semibold">{t("team.upsell.title")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("team.upsell.text")}</p>
          <Link href="/plans" className={`${btn} mt-3 inline-flex items-center bg-cta text-white hover:bg-cta-dark`}>
            {t("team.upsell.cta")}
          </Link>
        </section>
      )}
    </main>
  );
}

export default function TeamPage() {
  return (
    <RequireAuth>
      <TeamView />
    </RequireAuth>
  );
}
