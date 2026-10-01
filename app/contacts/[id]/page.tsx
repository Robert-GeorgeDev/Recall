"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import RequireAuth from "@/components/require-auth";
import BottomNav from "@/components/bottom-nav";
import FollowUpCard, { type Group } from "@/components/followup-card";
import { useOrgId } from "@/hooks/use-org-id";
import { useFollowUps } from "@/hooks/use-followups";
import { db } from "@/lib/firebase";
import { todayISO } from "@/lib/dates";
import { STATUSES, type Contact, type Status } from "@/types/contact";

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function ProfileView() {
  const params = useParams();
  const id = String(params.id);
  const orgId = useOrgId();
  const { followUps } = useFollowUps(orgId);

  // undefined = loading, null = not found
  const [contact, setContact] = useState<Contact | null | undefined>(undefined);
  const [notes, setNotes] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    const unsubscribe = onSnapshot(
      doc(db, "organizations", orgId, "contacts", id),
      (snap) => {
        setContact(
          snap.exists()
            ? { id: snap.id, ...(snap.data() as Omit<Contact, "id">) }
            : null
        );
      },
      () => setError("Could not load this contact. Please refresh the page.")
    );
    return () => unsubscribe();
  }, [orgId, id]);

  async function changeStatus(status: Status) {
    if (!orgId) return;
    setError("");
    try {
      await updateDoc(doc(db, "organizations", orgId, "contacts", id), {
        status,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  async function saveNotes() {
    if (!orgId || notes === null) return;
    setError("");
    setBusy(true);
    try {
      await updateDoc(doc(db, "organizations", orgId, "contacts", id), {
        notes: notes.trim(),
      });
      setNotes(null);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  const today = todayISO();
  const open = (followUps ?? [])
    .filter((f) => f.contactId === id && f.status === "open")
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0));

  function groupOf(date: string): Group {
    if (date < today) return "overdue";
    if (date === today) return "today";
    return "upcoming";
  }

  if (error && contact === undefined) {
    return <p className="p-8 text-slate-600">{error}</p>;
  }

  if (contact === undefined) {
    return <p className="p-8 text-slate-600">Loading…</p>;
  }

  if (contact === null) {
    return (
      <main className="mx-auto max-w-sm px-5 py-16">
        <h1 className="text-2xl font-bold tracking-tight">Contact not found</h1>
        <Link
          href="/contacts"
          className="mt-6 inline-block rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
        >
          Back to contacts
        </Link>
      </main>
    );
  }

  const fullName = `${contact.firstName} ${contact.lastName}`.trim();
  const notesValue = notes ?? contact.notes;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <Link href="/contacts" className="text-sm font-semibold text-brand">
        ← Contacts
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight">{fullName}</h1>
      {contact.company && (
        <p className="mt-1 text-slate-600">{contact.company}</p>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-1 text-sm">
        {contact.email && (
          <p>
            <a href={`mailto:${contact.email}`} className="break-all text-brand">
              {contact.email}
            </a>
          </p>
        )}
        {contact.phone && (
          <p>
            <a href={`tel:${contact.phone}`} className="text-brand">
              {contact.phone}
            </a>
          </p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="status" className="block text-sm font-medium">
          Lead status
        </label>
        <select
          id="status"
          value={contact.status}
          onChange={(e) => changeStatus(e.target.value as Status)}
          className={inputClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          maxLength={5000}
          value={notesValue}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
        />
        {notes !== null && notes !== contact.notes && (
          <button
            type="button"
            onClick={saveNotes}
            disabled={busy}
            className="mt-3 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save notes"}
          </button>
        )}
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Follow-ups</h2>
          <Link
            href="/followups/new"
            className="text-sm font-semibold text-brand"
          >
            + Add
          </Link>
        </div>
        {orgId && open.length === 0 && (
          <p className="text-sm text-slate-600">No open follow-ups for this contact.</p>
        )}
        <div className="space-y-3">
          {orgId &&
            open.map((f) => (
              <FollowUpCard key={f.id} orgId={orgId} item={f} group={groupOf(f.dueDate)} />
            ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}

export default function ContactProfilePage() {
  return (
    <RequireAuth>
      <ProfileView />
    </RequireAuth>
  );
}
