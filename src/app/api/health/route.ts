/**
 * Liveness probe for container and platform health checks. It reports that the
 * server is serving requests and deliberately does not touch Supabase or
 * Africa's Talking, so an integration outage cannot restart a healthy process.
 */
export function GET() {
  return Response.json({ status: "ok", service: "stocksignal" });
}
