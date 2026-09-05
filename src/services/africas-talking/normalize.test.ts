import { describe, expect, it } from "vitest";

import { normalizeSmsResponse, sanitizeProviderError } from "./normalize";

describe("normalizeSmsResponse", () => {
  it("extracts a provider message id from a successful recipient", () => {
    const result = normalizeSmsResponse({
      SMSMessageData: {
        Recipients: [{ status: "Success", messageId: "ATXid_demo_1", number: "+254712345678" }],
      },
    });

    expect(result).toEqual({
      ok: true,
      providerMessageId: "ATXid_demo_1",
      errorMessage: null,
    });
  });

  it("records a sanitized provider failure", () => {
    const result = normalizeSmsResponse({
      SMSMessageData: {
        Message: "Failed https://api.example/secret",
        Recipients: [{ status: "Failed: UserInBlacklist" }],
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errorMessage).toBe("Failed: UserInBlacklist");
  });
});

describe("sanitizeProviderError", () => {
  it("redacts urls and key assignments", () => {
    expect(sanitizeProviderError("boom api_key=abcd1234 https://sms.example/path")).toBe(
      "boom api_key=[redacted] [redacted]",
    );
  });
});
