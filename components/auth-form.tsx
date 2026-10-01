"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function friendlyError(code: string | undefined): string {
  switch (code) {
    case "user_already_exists":
      return "An account with this email already exists. Try logging in.";
    case "validation_failed":
    case "email_address_invalid":
      return "Please enter a valid email address.";
    case "weak_password":
      return "Please choose a stronger password.";
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_confirmed":
      return "Please confirm your email first. Check your inbox.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      const result = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setError(friendlyError(result.error.code));
        setBusy(false);
        return;
      }

      if (isSignup && !result.data.session) {
        setInfo("Check your email to confirm your account, then log in.");
        setBusy(false);
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm px-5 py-16">
      <Link href="/" className="text-lg font-semibold text-brand">
        Recall
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-slate-600">
        {isSignup
          ? "Start free. No card needed."
          : "Log in to see who to contact today."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {isSignup && (
            <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-overdue">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-cta px-6 py-3 font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
        >
          {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {isSignup ? "Already have an account? " : "New to Recall? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-brand"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </main>
  );
}
