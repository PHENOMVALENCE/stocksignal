# Environment Variables

| Variable | Visibility | Required | Purpose and source |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public | Local default supplied | Canonical application URL; set from the deployment host. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | When Supabase is used | Project URL from Supabase project settings. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | When a browser client is introduced | Legacy anonymous/publishable project key from Supabase settings. RLS must protect exposed data. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | For privileged server database access | Secret/service-role key from Supabase settings. Never expose it to the browser. |
| `AT_USERNAME` | Server only | When SMS is used | Africa's Talking application username; `sandbox` is suitable for sandbox testing. |
| `AT_API_KEY` | Server only | When SMS is used | API key from the Africa's Talking dashboard. |
| `AT_SENDER_ID` | Server only | Optional | Approved sender ID from Africa's Talking; omit when unavailable. |

Copy `.env.example` to `.env.local` and add local values. Environment files remain ignored. The application shell and build do not require integration credentials; each integration validates its own values only when called and returns a clear configuration error if incomplete.
