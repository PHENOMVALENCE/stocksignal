# Africa's Talking Integration

## Priority

SMS is the primary hackathon integration; USSD is second. Voice, Airtime, Mobile Data, Insights, and WhatsApp may be explored later when they serve a validated use case.

The official `africastalking` Node.js SDK is installed. All calls are server-side and credentials are read only when the integration is invoked. `AT_SENDER_ID` is optional because sandbox and account capabilities differ.

```text
src/services/africas-talking/
  client.ts   # validated configuration and SDK creation
  sms.ts      # message use cases and normalized results
  types.ts    # internal contracts
```

## Use cases

1. **Low-stock alert:** inform the responsible manager when an item crosses to `quantity <= reorder_level`.
2. **Supplier restock request:** send the chosen supplier the material, requested quantity, and manufacturer contact prompt.

Every attempt should create or update a notification record with provider, recipient, status, provider message ID when available, and a sanitized error when delivery fails. Inventory persistence must remain valid if SMS fails.

## Configuration and safety

Use `AT_USERNAME`, `AT_API_KEY`, and optional `AT_SENDER_ID`. Sandbox may use `AT_USERNAME=sandbox`, but no environment is assumed in code. Never import the adapter from a client component, log credentials, or expose raw provider failures to users.

Initial implementation should mock the wrapper in integration tests. Live sandbox validation should be performed only after the owner supplies credentials.
