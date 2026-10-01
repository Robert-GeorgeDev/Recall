import { createClient } from "@supabase/supabase-js";

// Public configuration (safe to be visible in the browser).
// Real protection comes from Row Level Security in the database.
const supabaseUrl = "https://lhrcbasrojssskbciahl.supabase.co";
const supabaseKey = "sb_publishable_Ab3CHF0yQ1MTTi0Ls8CLaQ_-DfeXejY";

export const supabase = createClient(supabaseUrl, supabaseKey);
