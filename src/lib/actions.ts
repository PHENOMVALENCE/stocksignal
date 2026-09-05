export interface FieldErrors {
  [field: string]: string;
}

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
}

export const idleActionState: ActionState = { status: "idle" };

export function fieldErrorsFromZod(error: { issues: { path: PropertyKey[]; message: string }[] }): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}
