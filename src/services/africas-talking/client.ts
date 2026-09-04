import "server-only";

import initializeAfricasTalking from "africastalking";

import { getAfricasTalkingEnv } from "@/lib/env";

export function createAfricasTalkingSmsClient() {
  const env = getAfricasTalkingEnv();
  const client = initializeAfricasTalking({
    apiKey: env.AT_API_KEY,
    username: env.AT_USERNAME,
  });

  return { sms: client.SMS, senderId: env.AT_SENDER_ID };
}
