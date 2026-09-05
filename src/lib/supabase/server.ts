import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseServerEnv } from "@/lib/env";
import type { StockSignalDatabaseClient } from "@/lib/supabase/types";
import type { Database } from "@/types/database";

export function createSupabaseServerClient(): StockSignalDatabaseClient {
  const env = getSupabaseServerEnv();

  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
