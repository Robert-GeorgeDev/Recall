"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { FollowUp, Priority } from "@/types/followup";

type ContactInfo = { first_name: string; last_name: string; company: string };

type Row = {
  id: string;
  contact_id: string;
  due_date: string;
  due_time: string | null;
  priority: Priority;
  note: string;
  status: "open" | "done";
  assigned_to: string | null;
  contacts: ContactInfo | ContactInfo[] | null;
};

export function useFollowUps(orgId: string | null) {
  const [followUps, setFollowUps] = useState<FollowUp[] | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!orgId) return;
    const { data, error: queryError } = await supabase
      .from("follow_ups")
      .select(
        "id, contact_id, due_date, due_time, priority, note, status, assigned_to, contacts!follow_ups_contact_fk(first_name, last_name, company)"
      )
      .eq("organization_id", orgId)
      .order("due_date", { ascending: true });

    if (queryError) {
      setError("Could not load follow-ups. Please refresh the page.");
      return;
    }

    setError("");
    const rows = (data ?? []) as unknown as Row[];
    setFollowUps(
      rows.map((r) => {
        const c = Array.isArray(r.contacts) ? r.contacts[0] : r.contacts;
        return {
          id: r.id,
          contact_id: r.contact_id,
          contact_name: c ? `${c.first_name} ${c.last_name}`.trim() : "",
          company: c?.company ?? "",
          due_date: r.due_date,
          due_time: r.due_time ? r.due_time.slice(0, 5) : "",
          priority: r.priority,
          note: r.note,
          status: r.status,
          assigned_to: r.assigned_to,
        };
      })
    );
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { followUps, error, reload };
}
