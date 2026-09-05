import "server-only";

import { internationalPhoneSchema } from "@/lib/validation/phone";

import { createAfricasTalkingSmsClient } from "./client";
import { normalizeSmsResponse, sanitizeProviderError, type NormalizedSmsResult } from "./normalize";

interface SendTextMessageInput {
  recipient: string;
  message: string;
}

export async function sendTextMessage({
  recipient,
  message,
}: SendTextMessageInput): Promise<NormalizedSmsResult> {
  const phone = internationalPhoneSchema.safeParse(recipient);
  const trimmedMessage = message.trim();

  if (!phone.success) {
    return {
      ok: false,
      providerMessageId: null,
      errorMessage: phone.error.issues[0]?.message ?? "The recipient phone number is invalid.",
    };
  }

  if (!trimmedMessage) {
    return {
      ok: false,
      providerMessageId: null,
      errorMessage: "A message is required before SMS can be sent.",
    };
  }

  const { sms, senderId } = createAfricasTalkingSmsClient();

  try {
    const response = await sms.send({
      to: [phone.data],
      message: trimmedMessage,
      ...(senderId ? { from: senderId } : {}),
    });

    return normalizeSmsResponse(response);
  } catch (error) {
    const raw = error instanceof Error ? error.message : "The SMS provider could not be reached.";
    return {
      ok: false,
      providerMessageId: null,
      errorMessage: sanitizeProviderError(raw),
    };
  }
}
