"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchBootstrapMode } from "@/hooks/use-bootstrap";
import { FREE_LIMITS, resolveEntitlements, type Entitlements, type Plan } from "@/lib/entitlements";

export { FREE_LIMITS };
export type { Plan };

export type PlanState = {
  plan: Plan;
  contacts: number;
  followUps: number;
  bootstrap: boolean;
  entitlements: Entitlements;
};

export function usePlan(orgId: string | null) {
  const [state, setState] = useState<PlanState | null>(null);

  const reload = useCallback(async () => {
    if (!orgId) return;

    const [sub, contacts, followUps, bootstrap] = await Promise.all([
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
      fetchBootstrapMode(),
    ]);

    const entitlements = resolveEntitlements(
      bootstrap,
      sub.data as { plan: string; status: string } | null
    );

    setState({
      plan: entitlements.plan,
      contacts: contacts.count ?? 0,
      followUps: followUps.count ?? 0,
      bootstrap,
      entitlements,
    });
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { state, reload };
}
