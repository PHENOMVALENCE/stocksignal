"use client";

import { useActionState } from "react";

import { createInventoryItemAction } from "@/app/actions/inventory";
import { idleActionState } from "@/lib/actions";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1 text-sm text-red-800" id={id} role="alert">
      {message}
    </p>
  );
}

export function CreateInventoryForm() {
  const [state, action, pending] = useActionState(createInventoryItemAction, idleActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-2xl space-y-6 border border-[var(--line)] bg-white p-6" noValidate>
      {state.status === "error" && state.message ? (
        <div className="border border-red-800 bg-red-50 px-4 py-3 text-red-950" role="alert">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="field-label">Material name</span>
          <input aria-describedby={errors.name ? "name-error" : undefined} aria-invalid={Boolean(errors.name)} className="field-input" name="name" required />
          <FieldError id="name-error" message={errors.name} />
        </label>
        <label className="block">
          <span className="field-label">SKU</span>
          <input aria-describedby={errors.sku ? "sku-error" : undefined} aria-invalid={Boolean(errors.sku)} className="field-input font-mono" name="sku" required />
          <FieldError id="sku-error" message={errors.sku} />
        </label>
        <label className="block">
          <span className="field-label">Unit</span>
          <input aria-describedby={errors.unit ? "unit-error" : undefined} aria-invalid={Boolean(errors.unit)} className="field-input" name="unit" placeholder="metres" required />
          <FieldError id="unit-error" message={errors.unit} />
        </label>
        <label className="block">
          <span className="field-label">Starting quantity</span>
          <input
            aria-describedby={errors.quantity ? "quantity-error" : undefined}
            aria-invalid={Boolean(errors.quantity)}
            className="field-input"
            inputMode="decimal"
            min="0"
            name="quantity"
            required
            step="0.001"
            type="text"
          />
          <FieldError id="quantity-error" message={errors.quantity} />
        </label>
        <label className="block">
          <span className="field-label">Reorder level</span>
          <input
            aria-describedby={errors.reorderLevel ? "reorder-error" : undefined}
            aria-invalid={Boolean(errors.reorderLevel)}
            className="field-input"
            inputMode="decimal"
            min="0"
            name="reorderLevel"
            required
            step="0.001"
            type="text"
          />
          <FieldError id="reorder-error" message={errors.reorderLevel} />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Manager phone</span>
          <input
            aria-describedby={errors.managerPhone ? "manager-phone-error" : "manager-phone-hint"}
            aria-invalid={Boolean(errors.managerPhone)}
            className="field-input"
            name="managerPhone"
            placeholder="+254712345678"
            required
          />
          <p className="mt-1 text-sm text-[var(--muted)]" id="manager-phone-hint">
            International format, including country code.
          </p>
          <FieldError id="manager-phone-error" message={errors.managerPhone} />
        </label>
        <label className="block">
          <span className="field-label">Supplier name (optional)</span>
          <input aria-describedby={errors.supplierName ? "supplier-name-error" : undefined} aria-invalid={Boolean(errors.supplierName)} className="field-input" name="supplierName" />
          <FieldError id="supplier-name-error" message={errors.supplierName} />
        </label>
        <label className="block">
          <span className="field-label">Supplier phone (optional)</span>
          <input aria-describedby={errors.supplierPhone ? "supplier-phone-error" : undefined} aria-invalid={Boolean(errors.supplierPhone)} className="field-input" name="supplierPhone" placeholder="+254700000000" />
          <FieldError id="supplier-phone-error" message={errors.supplierPhone} />
        </label>
      </div>

      <button className="button-primary" disabled={pending} type="submit">
        {pending ? "Saving material…" : "Save material"}
      </button>
    </form>
  );
}
