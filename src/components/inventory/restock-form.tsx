"use client";

import { useActionState } from "react";

import { requestRestockAction } from "@/app/actions/restock";
import { idleActionState } from "@/lib/actions";

interface RestockFormProps {
  inventoryItemId: string;
  unit: string;
  supplierName: string;
  supplierPhone: string;
}

export function RestockForm({ inventoryItemId, unit, supplierName, supplierPhone }: RestockFormProps) {
  const [state, action, pending] = useActionState(requestRestockAction, idleActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5 border border-[var(--line)] bg-white p-6" noValidate>
      <input name="inventoryItemId" type="hidden" value={inventoryItemId} />
      <h2 className="text-xl font-semibold tracking-[-0.02em]">Request restock</h2>
      <p className="text-sm leading-6 text-[var(--muted)]">
        Send the supplier a replenishment request. The quantity is recorded in {unit}.
      </p>
      {state.message ? (
        <div
          className={
            state.status === "success"
              ? "border border-emerald-800 bg-emerald-50 px-4 py-3 text-emerald-950"
              : "border border-red-800 bg-red-50 px-4 py-3 text-red-950"
          }
          role={state.status === "success" ? "status" : "alert"}
        >
          {state.message}
        </div>
      ) : null}
      <label className="block">
        <span className="field-label">Requested quantity ({unit})</span>
        <input
          aria-invalid={Boolean(errors.requestedQuantity)}
          className="field-input"
          inputMode="decimal"
          name="requestedQuantity"
          required
        />
        {errors.requestedQuantity ? (
          <p className="mt-1 text-sm text-red-800" role="alert">
            {errors.requestedQuantity}
          </p>
        ) : null}
      </label>
      <label className="block">
        <span className="field-label">Supplier name</span>
        <input
          aria-invalid={Boolean(errors.supplierName)}
          className="field-input"
          defaultValue={supplierName}
          name="supplierName"
          required
        />
      </label>
      <label className="block">
        <span className="field-label">Supplier phone</span>
        <input
          aria-invalid={Boolean(errors.supplierPhone)}
          className="field-input"
          defaultValue={supplierPhone}
          name="supplierPhone"
          required
        />
      </label>
      <button className="button-primary" disabled={pending} type="submit">
        {pending ? "Sending request…" : "Send restock request"}
      </button>
    </form>
  );
}
