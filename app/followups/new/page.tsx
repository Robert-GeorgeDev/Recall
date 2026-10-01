"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/require-auth";
import { useOrgId } from "@/hooks/use-org-id";
import { supabase } from "@/lib/supabase";
import { addDays, todayISO } from "@/lib/dates";
import { PRIORITIES, type Priority } from "@/types/followup";

type ContactOption = { id: string; name: string; company: string };

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function NewFollowUpForm() {
  const orgId = useOrgId();
  const router = useRouter();

  const [contacts, setContacts] = useState<ContactOption[] | null>(null);
  const [contactId, setContactId] = useState("");
  const [dueDate, setDueDate] = useState(addDays(todayISO(), 1));
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<Priority>("Normal");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    let cancelled = false;
    supabase
      .from("contacts")
      .select("id, first_name, last_name, company")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) {
          setError("Could not load contacts. Please refresh the page.");
          return;
        }
        setContacts(
          (data ?? []).map((c) => ({
            id: c.id as string,
            name: `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim(),
            company: (c.company ?? "") as string,
          }))
        );
      });
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!orgId || !contacts) return;
    if (!contacts.some((c) => c.id === contactId)) {
      setError("Please choose a contact.");
      return;
    }
    if (!dueDate) {
      setError("Please choose a date.");
      return;
    }
    setError("");
    setBusy(true);
    const { error: failure } = await supabase.from("follow_ups").insert({
      organization_id: orgId,
      contact_id: contactId,
      due_date: dueDate,
      due_time: dueTime || null,
      priority,
      note: note.trim(),
    });
    if (failure) {
      setError("Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    router.replace("/dashboard");
  }

  if (error && contacts === null) {
    return <p className="p-8 text-slate-600">{error}</p>;
  }

  if (contacts === null) {
    return <p className="p-8 text-slate-600">Loading…</p>;
  }

  if (contacts.length === 0) {
    return (
      <main className="mx-auto max-w-sm px-5 py-16">
        <h1 className="text-2xl font-bold tracking-tight">Add a contact first</h1>
        <p className="mt-2 text-slate-600">
          A follow-up belongs to a contact. Add your first contact, then come back.
        </p>
        <Link
          href="/contacts"
          className="mt-6 inline-block rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
        >
          Go to contacts
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-brand">
        ← Back
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">New follow-up</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="contact" className="block text-sm font-medium">
            Contact *
          </label>
          <select
            id="contact"
            required
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className={inputClass}
          >
            <option value="">Choose a contact…</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` (${c.company})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium">
              Date *
            </label>
            <input
              id="dueDate"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="dueTime" className="block text-sm font-medium">
              Time (optional)
            </label>
            <input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={inputClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium">
            Note
          </label>
          <textarea
            id="note"
            rows={3}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save follow-up"}
        </button>
      </form>
    </main>
  );
}

export default function NewFollowUpPage() {
  return (
    <RequireAuth>
      <NewFollowUpForm />
    </RequireAuth>
  );
}
