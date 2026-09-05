export type AppErrorCode =
  | "VALIDATION"
  | "NOT_FOUND"
  | "SKU_DUPLICATE"
  | "NEGATIVE_BALANCE"
  | "CONFIGURATION"
  | "DATABASE"
  | "CONFLICT";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor(message: string, code: AppErrorCode, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toUserMessage(error: unknown, fallback = "The request could not be completed."): string {
  if (isAppError(error)) {
    return error.message;
  }

  return fallback;
}
