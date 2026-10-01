"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

export function useOrgId() {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) {
          setOrgId(data.organization_id as string);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return orgId;
}
