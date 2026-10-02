"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/require-auth";
import AddContactForm from "@/components/add-contact-form";
import { useLanguage } from "@/components/language-provider";
import { useOrgId } from "@/hooks/use-org-id";
import { supabase } from "@/lib/supabase";
import type { Key } from "@/lib/dictionaries";
import type { Contact } from "@/types/contact";

function ContactsView() {
  const { t } = useLanguage();
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
      setError("load");
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
    if (!window.confirm(t("contacts.confirmDelete"))) return;
    const { error: failure } = await supabase
      .from("contacts")
      .delete()
      .eq("id", c.id);
    if (failure) {
      setError("delete");
      return;
    }
    load();
  }

  const errorText =
    error === "load"
      ? t("contacts.loadError")
      : error === "delete"
      ? t("contacts.deleteError")
      : "";

  return (
    <main className="mx-auto max-w-3xl px-5 pb-10 pt-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{t("contacts.title")}</h1>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark"
          >
            {t("contacts.add")}
          </button>
        )}
      </div>

      {errorText && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {errorText}
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
            {t("contacts.searchLabel")}
          </label>
          <input
            id="search"
            type="search"
            placeholder={t("contacts.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      )}

      {contacts === null && !error && (
        <p className="mt-8 text-slate-600">{t("common.loading")}</p>
      )}

      {contacts && contacts.length === 0 && !showForm && (
        <div className="mt-10 rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <p className="text-lg font-semibold">{t("contacts.emptyTitle")}</p>
          <p className="mt-1 text-slate-600">{t("contacts.emptyText")}</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark"
          >
            {t("contacts.addShort")}
          </button>
        </div>
      )}

      {contacts && contacts.length > 0 && filtered.length === 0 && (
        <p className="mt-8 text-slate-600">{t("contacts.noMatch")}</p>
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
                {t(("status." + c.status) as Key)}
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
                {t("contacts.open")}
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(c)}
                className="text-sm font-semibold text-overdue hover:underline"
              >
                {t("contacts.delete")}
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
