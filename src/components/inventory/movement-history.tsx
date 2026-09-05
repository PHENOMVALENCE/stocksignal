import { EmptyState } from "@/components/ui/empty-state";
import { formatQuantity } from "@/lib/quantity";
import type { StockMovement } from "@/repositories/mappers";

const labels = {
  STOCK_IN: "Stock in",
  STOCK_OUT: "Stock out",
  ADJUSTMENT: "Adjustment",
} as const;

export function MovementHistory({ movements, unit }: { movements: StockMovement[]; unit: string }) {
  if (movements.length === 0) {
    return <EmptyState body="No movements have been recorded for this material yet." title="No movement history" />;
  }

  return (
    <div className="overflow-x-auto border border-[var(--line)] bg-white">
      <table className="data-table">
        <caption className="sr-only">Stock movements, newest first</caption>
        <thead>
          <tr>
            <th scope="col">When</th>
            <th scope="col">Type</th>
            <th scope="col">Quantity</th>
            <th scope="col">Previous</th>
            <th scope="col">New</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td>{new Date(movement.createdAt).toLocaleString()}</td>
              <td>{labels[movement.type]}</td>
              <td className="quantity-cell">
                {formatQuantity(movement.quantity)} <span className="unit-label">{unit}</span>
              </td>
              <td>
                {formatQuantity(movement.previousQuantity)} <span className="unit-label">{unit}</span>
              </td>
              <td className="quantity-cell">
                {formatQuantity(movement.newQuantity)} <span className="unit-label">{unit}</span>
              </td>
              <td>{movement.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
