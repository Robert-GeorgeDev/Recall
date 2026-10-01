"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";

export default function RequireAuth({
  children,
  requireWorkspace = true,
}: {
  children: React.ReactNode;
  requireWorkspace?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!requireWorkspace) {
      setReady(true);
      return;
    }
    let cancelled = false;
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        if (cancelled) return;
        if (snap.exists()) {
          setReady(true);
        } else {
          router.replace("/onboarding");
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user, requireWorkspace, router]);

  if (failed) {
    return (
      <p className="p-8 text-slate-600">
        Something went wrong. Please refresh the page.
      </p>
    );
  }

  if (loading || !user || !ready) {
    return <p className="p-8 text-slate-600">Loading…</p>;
  }

  return <>{children}</>;
}
