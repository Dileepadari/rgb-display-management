import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Service-role client: bypasses RLS entirely. Only for server code that has
// no user session to authorize against — e.g. the ESP32 device-feed route
// (authenticated by device token, not a Supabase user) and cron jobs.
// Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
export function createServiceClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
