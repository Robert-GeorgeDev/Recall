"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/require-auth";
import AddContactForm from "@/components/add-contact-form";
import { useOrgId } from "@/hooks/use-org-id";
import { supabase } from "@/lib/supabase";
import type { Contact } from "@/types/contact";

function ContactsView() {
  const orgId = useOrgId();
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!orgId) return;
    const { data, error: queryError } = await supabase
      .from("contacts")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    if (queryError) {
      setError("Could not load contacts. Please refresh the page.");
      return;
    }
    setError("");
    setContacts((data ?? []) as Contact[]);
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!contacts) return [];
    const term = search.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((c) =>
      [c.first_name, c.last_name, c.company, c.email, c.phone, c.notes]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [contacts, search]);

  async function handleDelete(c: Contact) {
    const fullName = `${c.first_name} ${c.last_name}`.trim();
    if (!window.confirm(`Delete ${fullName}? This cannot be undone.`)) return;
    const { error: failure } = await supabase
      .from("contacts")
      .delete()
      .eq("id", c.id);
    if (failure) {
      setError("Could not delete the contact. Please try again.");
      return;
    }
    load();
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
        <AddContactForm
          orgId={orgId}
          onDone={() => {
            setShowForm(false);
            load();
          }}
        />
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
                  {c.first_name} {c.last_name}
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
