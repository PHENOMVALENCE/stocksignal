"use client";

import { useActionState } from "react";

import { recordStockMovementAction } from "@/app/actions/movements";
import { idleActionState } from "@/lib/actions";

export function MovementForm({ inventoryItemId, unit }: { inventoryItemId: string; unit: string }) {
  const [state, action, pending] = useActionState(recordStockMovementAction, idleActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5 border border-[var(--line)] bg-white p-6" noValidate>
      <input name="inventoryItemId" type="hidden" value={inventoryItemId} />
      <h2 className="text-xl font-semibold tracking-[-0.02em]">Record movement</h2>
      {state.status === "error" && state.message ? (
        <div className="border border-red-800 bg-red-50 px-4 py-3 text-red-950" role="alert">
          {state.message}
        </div>
      ) : null}
      {state.status === "success" && state.message ? (
        <div className="border border-emerald-800 bg-emerald-50 px-4 py-3 text-emerald-950" role="status">
          {state.message}
        </div>
      ) : null}
      <label className="block">
        <span className="field-label">Type</span>
        <select className="field-input" name="type" required>
          <option value="STOCK_IN">Stock in</option>
          <option value="STOCK_OUT">Stock out</option>
          <option value="ADJUSTMENT">Adjustment (counted balance)</option>
        </select>
      </label>
      <label className="block">
        <span className="field-label">Quantity ({unit})</span>
        <input
          aria-describedby={errors.quantity ? "movement-quantity-error" : "movement-quantity-hint"}
          aria-invalid={Boolean(errors.quantity)}
          className="field-input"
          inputMode="decimal"
          name="quantity"
          required
        />
        <p className="mt-1 text-sm text-[var(--muted)]" id="movement-quantity-hint">
          Stock in and stock out must be greater than zero. An adjustment may be zero.
        </p>
        {errors.quantity ? (
          <p className="mt-1 text-sm text-red-800" id="movement-quantity-error" role="alert">
            {errors.quantity}
          </p>
        ) : null}
      </label>
      <label className="block">
        <span className="field-label">Notes (optional)</span>
        <textarea className="field-input min-h-24 py-3" name="notes" />
      </label>
      <button className="button-primary" disabled={pending} type="submit">
        {pending ? "Recording…" : "Save movement"}
      </button>
    </form>
  );
}
