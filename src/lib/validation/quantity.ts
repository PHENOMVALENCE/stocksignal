import { z } from "zod";

function quantitySchema(label: string, options: { allowZero: boolean }) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .regex(/^-?\d+(\.\d{1,3})?$/, `${label} must be a number with up to three decimal places.`)
    .transform((value) => Number(value))
    .refine((value) => Number.isFinite(value), `${label} must be a finite number.`)
    .refine((value) => (options.allowZero ? value >= 0 : value > 0), options.allowZero ? `${label} cannot be negative.` : `${label} must be greater than zero.`);
}

export const nonNegativeQuantitySchema = (label: string) => quantitySchema(label, { allowZero: true });
export const positiveQuantitySchema = (label: string) => quantitySchema(label, { allowZero: false });
