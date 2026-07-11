import { createClient } from "@supabase/supabase-js";

// Service-role client for admin-only operations (e.g. creating pre-confirmed
// users at signup so there's no email-verification step to configure).
// Server-only -- SUPABASE_SERVICE_ROLE_KEY must never reach the client bundle.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
