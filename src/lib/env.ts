import "server-only";

import { z } from "zod";

const supabaseServerSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const africasTalkingSchema = z.object({
  AT_USERNAME: z.string().min(1),
  AT_API_KEY: z.string().min(1),
  AT_SENDER_ID: z.string().min(1).optional(),
});

export type SupabaseServerEnv = z.infer<typeof supabaseServerSchema>;
export type AfricasTalkingEnv = z.infer<typeof africasTalkingSchema>;

function formatConfigurationError(integration: string, error: z.ZodError) {
  const fields = error.issues.map((issue) => issue.path.join(".")).join(", ");
  return new Error(`${integration} is not configured correctly. Check: ${fields}.`);
}

export function getSupabaseServerEnv(): SupabaseServerEnv {
  const result = supabaseServerSchema.safeParse(process.env);

  if (!result.success) {
    throw formatConfigurationError("Supabase", result.error);
  }

  return result.data;
}

export function getAfricasTalkingEnv(): AfricasTalkingEnv {
  const result = africasTalkingSchema.safeParse(process.env);

  if (!result.success) {
    throw formatConfigurationError("Africa's Talking", result.error);
  }

  return result.data;
}
