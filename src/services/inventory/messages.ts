import { formatQuantity } from "@/lib/quantity";

export function buildLowStockMessage(input: {
  name: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
}): string {
  return [
    "JENGAFLOW ALERT",
    "",
    `${input.name} is running low.`,
    "",
    `Available: ${formatQuantity(input.quantity)} ${input.unit}`,
    `Minimum level: ${formatQuantity(input.reorderLevel)} ${input.unit}.`,
    "",
    "Restocking is recommended.",
  ].join("\n");
}

export function buildRestockRequestMessage(input: {
  manufacturerName: string;
  name: string;
  requestedQuantity: number;
  unit: string;
}): string {
  return [
    "JENGAFLOW RESTOCK REQUEST",
    "",
    `${input.manufacturerName} requires:`,
    input.name,
    "",
    "Requested quantity:",
    `${formatQuantity(input.requestedQuantity)} ${input.unit}`,
    "",
    "Please contact the manufacturer regarding availability.",
  ].join("\n");
}
