"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import RequireAuth from "@/components/require-auth";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";

function OnboardingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const workspaceName = name.trim();
    if (workspaceName.length === 0 || workspaceName.length > 80) {
      setError("Please enter a name (up to 80 characters).");
      return;
    }

    setError("");
    setBusy(true);
    try {
      const orgRef = doc(collection(db, "organizations"));
      const batch = writeBatch(db);
      batch.set(orgRef, {
        name: workspaceName,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(doc(db, "organizations", orgRef.id, "members", user.uid), {
        role: "owner",
        createdAt: serverTimestamp(),
      });
      batch.set(doc(db, "users", user.uid), {
        orgId: orgRef.id,
        createdAt: serverTimestamp(),
      });
      await batch.commit();
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-16">
      <p className="text-lg font-semibold text-brand">Recall</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        What do you want to call your workspace?
      </h1>
      <p className="mt-2 text-slate-600">
        Your company, your brand, or just your name. You can change it later.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="workspace" className="block text-sm font-medium">
            Workspace name
          </label>
          <input
            id="workspace"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {busy ? "Please wait…" : "Continue"}
        </button>
      </form>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <RequireAuth requireWorkspace={false}>
      <OnboardingForm />
    </RequireAuth>
  );
}
