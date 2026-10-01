"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { addDays, formatDate, todayISO } from "@/lib/dates";
import type { FollowUp } from "@/types/followup";

export type Group = "overdue" | "today" | "upcoming";

const bars: Record<Group, string> = {
  overdue: "border-l-overdue",
  today: "border-l-today",
  upcoming: "border-l-upcoming",
};

export default function FollowUpCard({
  item,
  group,
  onChanged,
}: {
  item: FollowUp;
  group: Group;
  onChanged: () => void;
}) {
  const [mode, setMode] = useState<"none" | "snooze" | "custom">("none");
  const [customDate, setCustomDate] = useState(item.due_date);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action: () => PromiseLike<{ error: unknown }>) {
    setBusy(true);
    setError("");
    const { error: failure } = await action();
    if (failure) {
      setError("Something went wrong. Please try again.");
    } else {
      setMode("none");
      onChanged();
    }
    setBusy(false);
  }

  function complete() {
    run(() =>
      supabase
        .from("follow_ups")
        .update({ status: "done", completed_at: new Date().toISOString() })
        .eq("id", item.id)
    );
  }

  function moveTo(date: string) {
    if (!date) return;
    run(() =>
      supabase.from("follow_ups").update({ due_date: date }).eq("id", item.id)
    );
  }

  function remove() {
    if (!window.confirm("Delete this follow-up?")) return;
    run(() => supabase.from("follow_ups").delete().eq("id", item.id));
  }

  return (
    <article
      className={`rounded-xl border border-line border-l-4 bg-white p-4 ${bars[group]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{item.contact_name}</p>
          {item.company && (
            <p className="text-sm text-slate-600">{item.company}</p>
          )}
        </div>
        <div className="shrink-0 text-right text-sm">
          <p className="font-medium">{formatDate(item.due_date)}</p>
          {item.due_time && <p className="text-slate-500">{item.due_time}</p>}
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
