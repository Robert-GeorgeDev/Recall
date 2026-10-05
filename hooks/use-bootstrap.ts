"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Presentation only. The server and the database enforce Bootstrap Mode; this
// just lets the screens show the right pricing. It asks the public database
// function, never trusts anything stored in the browser, and treats an error
// (for example before the SQL has been run) as "OFF".
export async function fetchBootstrapMode(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("bootstrap_mode");
    return !error && data === true;
  } catch {
    return false;
  }
}

/** null while loading, then true or false. */
export function useBootstrapMode(): boolean | null {
  const [value, setValue] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchBootstrapMode().then((v) => {
      if (!cancelled) setValue(v);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return value;
}
