import type { SmsSendResponse } from "./types";

export interface NormalizedSmsResult {
  ok: boolean;
  providerMessageId: string | null;
  errorMessage: string | null;
}

const SUCCESS_STATUSES = new Set(["success", "sent"]);

export function sanitizeProviderError(value: string): string {
  return value
    .replace(/https?:\/\/\S+/gi, "[redacted]")
    .replace(/(api[_-]?key|token|secret)["']?\s*[:=]\s*["']?[\w-]+/gi, "$1=[redacted]")
    .slice(0, 240);
}

export function normalizeSmsResponse(response: SmsSendResponse): NormalizedSmsResult {
  const recipient = response.SMSMessageData?.Recipients?.[0];
  const status = recipient?.status?.trim().toLowerCase() ?? "";
  const providerMessageId = recipient?.messageId?.trim() || null;
  const ok = SUCCESS_STATUSES.has(status) || Boolean(providerMessageId && !status.includes("fail"));

  if (ok) {
    return { ok: true, providerMessageId, errorMessage: null };
  }

  const raw = recipient?.status || response.SMSMessageData?.Message || "The SMS provider rejected the message.";
  return {
    ok: false,
    providerMessageId,
    errorMessage: sanitizeProviderError(raw),
  };
}
