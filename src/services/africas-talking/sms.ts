import "server-only";

import { createAfricasTalkingSmsClient } from "./client";
import type { SmsSendResponse } from "./types";

interface SendTextMessageInput {
  recipient: string;
  message: string;
}

export async function sendTextMessage({
  recipient,
  message,
}: SendTextMessageInput): Promise<SmsSendResponse> {
  const { sms, senderId } = createAfricasTalkingSmsClient();

  return sms.send({
    to: [recipient],
    message,
    ...(senderId ? { from: senderId } : {}),
  });
}
