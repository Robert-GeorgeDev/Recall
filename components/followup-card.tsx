"use client";

import { useState } from "react";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addDays, formatDate, todayISO } from "@/lib/dates";
import type { FollowUp } from "@/types/followup";

export type Group = "overdue" | "today" | "upcoming";

const bars: Record<Group, string> = {
  overdue: "border-l-overdue",
  today: "border-l-today",
  upcoming: "border-l-upcoming",
};

export default function FollowUpCard({
  orgId,
  item,
  group,
}: {
  orgId: string;
  item: FollowUp;
  group: Group;
}) {
  const [mode, setMode] = useState<"none" | "snooze" | "custom">("none");
  const [customDate, setCustomDate] = useState(item.dueDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ref = doc(db, "organizations", orgId, "followUps", item.id);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      setMode("none");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  function complete() {
    run(() => updateDoc(ref, { status: "done", completedAt: serverTimestamp() }));
  }

  function moveTo(date: string) {
    if (!date) return;
    run(() => updateDoc(ref, { dueDate: date }));
  }

  function remove() {
    if (!window.confirm("Delete this follow-up?")) return;
    run(() => deleteDoc(ref));
  }

  return (
    <article
      className={`rounded-xl border border-line border-l-4 bg-white p-4 ${bars[group]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{item.contactName}</p>
          {item.company && (
            <p className="text-sm text-slate-600">{item.company}</p>
          )}
        </div>
        <div className="shrink-0 text-right text-sm">
          <p className="font-medium">{formatDate(item.dueDate)}</p>
          {item.dueTime && <p className="text-slate-500">{item.dueTime}</p>}
        </div>
      </div>

      {item.priority === "High" && (
        <p className="mt-2 text-xs font-semibold text-overdue">High priority</p>
      )}
      {item.note && <p className="mt-2 text-sm text-slate-700">{item.note}</p>}

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-overdue">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={complete}
          disabled={busy}
          className="rounded-xl bg-done px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          Complete
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "none" ? "snooze" : "none")}
          disabled={busy}
          className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft disabled:opacity-60"
        >
          Snooze
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="px-2 py-2 text-sm font-semibold text-overdue hover:underline disabled:opacity-60"
        >
          Delete
        </button>
      </div>

      {mode !== "none" && (
        <div className="mt-3 rounded-xl bg-surface p-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => moveTo(addDays(todayISO(), 1))}
              className="rounded-xl border border-line bg-white px-3 py-1.5 text-sm font-semibold hover:bg-brand-soft disabled:opacity-60"
            >
              Tomorrow
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => moveTo(addDays(todayISO(), 7))}
              className="rounded-xl border border-line bg-white px-3 py-1.5 text-sm font-semibold hover:bg-brand-soft disabled:opacity-60"
            >
              Next week
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setMode("custom")}
              className="rounded-xl border border-line bg-white px-3 py-1.5 text-sm font-semibold hover:bg-brand-soft disabled:opacity-60"
            >
              Pick a date
            </button>
          </div>

          {mode === "custom" && (
            <div className="mt-3 flex items-center gap-2">
              <label htmlFor={`date-${item.id}`} className="sr-only">
                New date
              </label>
              <input
                id={`date-${item.id}`}
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                type="button"
                disabled={busy || !customDate}
                onClick={() => moveTo(customDate)}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
