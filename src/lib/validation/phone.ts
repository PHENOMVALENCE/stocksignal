import { z } from "zod";

export const internationalPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Enter a phone number in international format, for example +254712345678.");

export const optionalInternationalPhoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(z.union([internationalPhoneSchema, z.undefined()]));
