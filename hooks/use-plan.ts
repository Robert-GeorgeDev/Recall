"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Plan = "free" | "pro" | "business";

// Must match the limits enforced by the database triggers.
export const FREE_LIMITS = { contacts: 10, followUps: 10 };

export type PlanState = {
  plan: Plan;
  contacts: number;
  followUps: number;
};

export function usePlan(orgId: string | null) {
  const [state, setState] = useState<PlanState | null>(null);

  const reload = useCallback(async () => {
    if (!orgId) return;

    const [sub, contacts, followUps] = await Promise.all([
      supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("organization_id", orgId)
        .maybeSingle(),
      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId),
      supabase
        .from("follow_ups")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("status", "open"),
    ]);

    const row = sub.data as { plan: string; status: string } | null;
    const isActive = row?.status === "active" || row?.status === "trialing";
    const p = row?.plan;
    const plan: Plan = isActive && (p === "pro" || p === "business") ? p : "free";

    setState({
      plan,
      contacts: contacts.count ?? 0,
      followUps: followUps.count ?? 0,
    });
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { state, reload };
}
