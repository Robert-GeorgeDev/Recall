import { adminClient } from "@/lib/billing";

// Postgres / PostgREST codes for "the table is not there yet", i.e. the SQL in
// supabase/bootstrap-mode.sql has not been run. Until then Bootstrap Mode is OFF.
const MISSING_TABLE = new Set(["42P01", "PGRST205"]);

/**
 * Server-side source of truth for Bootstrap Mode. Reads with the service key,
 * so it never depends on anything the client sends.
 *
 * Throws when the setting cannot be read for any other reason, so callers that
 * guard purchases fail closed instead of selling by accident.
 */
export async function getBootstrapMode(): Promise<boolean> {
  const { data, error } = await adminClient()
    .from("app_settings")
    .select("value")
    .eq("key", "bootstrap_mode")
    .maybeSingle();
  if (error) {
    if (error.code && MISSING_TABLE.has(error.code)) return false;
    throw new Error("settings_unreadable");
  }
  return data?.value === true;
}

export const BOOTSTRAP_BLOCKED_MESSAGE = "Paid subscriptions are temporarily unavailable.";
