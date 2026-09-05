import { AppError } from "@/lib/errors";

interface ProviderError {
  code?: string;
  message?: string;
  details?: string;
}

function constraintName(error: ProviderError): string {
  return `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
}

export function mapDatabaseError(error: ProviderError, fallback = "The request could not be completed."): AppError {
  if (error.code === "23505" && constraintName(error).includes("sku")) {
    return new AppError("An item with this SKU already exists.", "SKU_DUPLICATE", 409);
  }

  if (error.code === "23505") {
    return new AppError("That record already exists.", "CONFLICT", 409);
  }

  if (error.code === "23503") {
    return new AppError("The related inventory item was not found.", "NOT_FOUND", 404);
  }

  if (error.code === "23514" || error.code === "23513") {
    return new AppError("The submitted values are not allowed.", "VALIDATION", 400);
  }

  if (error.code === "P0001") {
    const message = sanitizeRaisedMessage(error.message);
    return new AppError(message, classifyRaisedCode(message), 400);
  }

  if (error.code === "PGRST116") {
    return new AppError("The requested record was not found.", "NOT_FOUND", 404);
  }

  return new AppError(fallback, "DATABASE", 500);
}

function sanitizeRaisedMessage(message: string | undefined): string {
  if (!message) {
    return "The request could not be completed.";
  }

  const withoutPrefix = message.replace(/^ERROR:\s*/i, "").split("\n")[0]?.trim();
  return withoutPrefix || "The request could not be completed.";
}

function classifyRaisedCode(message: string): AppError["code"] {
  if (message.toLowerCase().includes("not found")) {
    return "NOT_FOUND";
  }

  if (message.toLowerCase().includes("negative")) {
    return "NEGATIVE_BALANCE";
  }

  return "VALIDATION";
}

export function requireData<T>(data: T | null, error: ProviderError | null, notFoundMessage: string): T {
  if (error) {
    throw mapDatabaseError(error);
  }

  if (data === null) {
    throw new AppError(notFoundMessage, "NOT_FOUND", 404);
  }

  return data;
}
