const QUANTITY_PATTERN = /^-?\d+(\.\d{1,3})?$/;

export function parseQuantity(value: string | number, label: string): number {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError(`${label} must be a finite number.`);
    }

    return Number(value.toFixed(3));
  }

  const trimmed = value.trim();

  if (!QUANTITY_PATTERN.test(trimmed)) {
    throw new RangeError(`${label} must be a number with up to three decimal places.`);
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new RangeError(`${label} must be a finite number.`);
  }

  return parsed;
}

export function formatQuantity(value: number): string {
  return value.toFixed(3).replace(/\.?0+$/, "");
}

export function quantityToDatabase(value: number): string {
  return value.toFixed(3);
}
