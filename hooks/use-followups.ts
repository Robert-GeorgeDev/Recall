"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FollowUp } from "@/types/followup";

export function useFollowUps(orgId: string | null) {
  const [followUps, setFollowUps] = useState<FollowUp[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orgId) return;
    const q = query(
      collection(db, "organizations", orgId, "followUps"),
      orderBy("dueDate", "asc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setFollowUps(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<FollowUp, "id">),
          }))
        );
      },
      () => setError("Could not load follow-ups. Please refresh the page.")
    );
    return () => unsubscribe();
  }, [orgId]);

  return { followUps, error };
}
