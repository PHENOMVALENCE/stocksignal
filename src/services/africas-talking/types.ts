export interface SmsRecipientResult {
  cost?: string;
  messageId?: string;
  number?: string;
  status?: string;
  statusCode?: number;
}

export interface SmsSendResponse {
  SMSMessageData?: {
    Message?: string;
    Recipients?: SmsRecipientResult[];
  };
}

export interface SendSmsOptions {
  to: string[];
  message: string;
  from?: string;
}

export interface AfricasTalkingSmsClient {
  send(options: SendSmsOptions): Promise<SmsSendResponse>;
}

export interface AfricasTalkingClient {
  SMS: AfricasTalkingSmsClient;
}
