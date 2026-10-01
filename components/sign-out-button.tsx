"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await signOut(auth);
        router.replace("/");
      }}
      className="text-sm font-semibold text-slate-600 hover:text-ink"
    >
      Sign out
    </button>
  );
}
