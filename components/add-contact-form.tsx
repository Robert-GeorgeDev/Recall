"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { STATUSES, type Status } from "@/types/contact";

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function AddContactForm({
  orgId,
  onDone,
}: {
  orgId: string;
  onDone: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("New");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (firstName.trim().length === 0) {
      setError("First name is required.");
      return;
    }
    setError("");
    setBusy(true);
    const { error: failure } = await supabase.from("contacts").insert({
      organization_id: orgId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      notes: notes.trim(),
    });
    if (failure) {
      setError("Something went wrong. Please try again.");
      setBusy(false);
      return;
    }
    onDone();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 rounded-xl border border-line bg-white p-5"
    >
      <h2 className="text-lg font-semibold">New contact</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First name *
          </label>
          <input
            id="firstName"
            required
            maxLength={80}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last name
          </label>
          <input
            id="lastName"
            maxLength={80}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          Company
        </label>
        <input
          id="company"
          maxLength={120}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className={inputClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          maxLength={5000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save contact"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-xl border border-line bg-white px-6 py-3 font-semibold text-ink hover:bg-brand-soft"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
