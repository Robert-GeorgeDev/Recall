"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import RequireAuth from "@/components/require-auth";
import BottomNav from "@/components/bottom-nav";
import AddContactForm from "@/components/add-contact-form";
import { useOrgId } from "@/hooks/use-org-id";
import { db } from "@/lib/firebase";
import type { Contact } from "@/types/contact";

function ContactsView() {
  const orgId = useOrgId();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orgId) return;
    const q = query(
      collection(db, "organizations", orgId, "contacts"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setContacts(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Contact, "id">),
          }))
        );
      },
      () => setError("Could not load contacts. Please refresh the page.")
    );
    return () => unsubscribe();
  }, [orgId]);

  const filtered = useMemo(() => {
    if (!contacts) return [];
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) =>
      [c.firstName, c.lastName, c.company, c.email, c.phone, c.notes]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [contacts, search]);

  async function handleDelete(c: Contact) {
    if (!orgId) return;
    const fullName = `${c.firstName} ${c.lastName}`.trim();
    if (!window.confirm(`Delete ${fullName}? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "organizations", orgId, "contacts", c.id));
    } catch {
      setError("Could not delete the contact. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
          >
            + Add contact
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      {showForm && orgId && (
        <AddContactForm orgId={orgId} onDone={() => setShowForm(false)} />
      )}

      {contacts && contacts.length > 0 && (
        <div className="mt-6">
          <label htmlFor="search" className="sr-only">
            Search contacts
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search by name, company, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      )}

      {contacts === null && !error && (
        <p className="mt-8 text-slate-600">Loading…</p>
      )}

      {contacts && contacts.length === 0 && !showForm && (
        <div className="mt-10 rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <p className="text-lg font-semibold">Your CRM is empty.</p>
          <p className="mt-1 text-slate-600">Add your first contact to get started.</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
          >
            Add contact
          </button>
        </div>
      )}

      {contacts && contacts.length > 0 && filtered.length === 0 && (
        <p className="mt-8 text-slate-600">No contacts match your search.</p>
      )}

      <div className="mt-6 space-y-3">
        {filtered.map((c) => (
          <article key={c.id} className="rounded-xl border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/contacts/${c.id}`}
                  className="font-semibold text-ink hover:text-brand"
                >
                  {c.firstName} {c.lastName}
                </Link>
                {c.company && (
                  <p className="text-sm text-slate-600">{c.company}</p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
                {c.status}
              </span>
            </div>

            <div className="mt-2 space-y-0.5 text-sm">
              {c.email && (
                <p>
                  <a href={`mailto:${c.email}`} className="break-all text-brand">
                    {c.email}
                  </a>
                </p>
              )}
              {c.phone && (
                <p>
                  <a href={`tel:${c.phone}`} className="text-brand">
                    {c.phone}
                  </a>
                </p>
              )}
            </div>

            {c.notes && (
              <p className="mt-2 text-sm text-slate-700">{c.notes}</p>
            )}

            <div className="mt-3 flex items-center gap-4">
              <Link
                href={`/contacts/${c.id}`}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Open
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(c)}
                className="text-sm font-semibold text-overdue hover:underline"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}

export default function ContactsPage() {
  return (
    <RequireAuth>
      <ContactsView />
    </RequireAuth>
  );
}
