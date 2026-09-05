# Testing Strategy

## Unit

Test pure stock calculations, threshold comparisons, and duplicate-alert state transitions. The foundation covers the key cases: 50 minus 40 becomes 10 and is low at a threshold of 15; an already-active alert remains suppressed below threshold; replenishment above threshold resets it; a later drop sends a new signal.

## Integration

Test route handlers, database adapters, and Africa's Talking wrappers with mocks or stubs. Verify validation, persistence ordering, and normalized failure records without sending live SMS.

Repository tests inject a fake Supabase client and must not read `.env.local` or live service-role keys. Schema tests assert that the CLI migration enables RLS and introduces no permissive policies. Live PostgreSQL is used only in CI against a throwaway database.

## End-to-end

Add focused browser coverage later for material creation, stock consumption, low-stock state, and supplier restock requests. Keep the suite centered on critical demonstration flows. Dashboard metrics must be asserted from repository data, never from hard-coded sample cards.

Run unit tests with `npm test`. Tests must not require live credentials.
