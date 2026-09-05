export interface UrgencyItem {
  name: string;
  quantity: number;
  reorderLevel: number;
}

export function lowStockUrgencyRatio(item: UrgencyItem): number {
  if (item.reorderLevel === 0) {
    return item.quantity;
  }

  return item.quantity / item.reorderLevel;
}

export function compareLowStockUrgency(left: UrgencyItem, right: UrgencyItem): number {
  const ratioDelta = lowStockUrgencyRatio(left) - lowStockUrgencyRatio(right);

  if (ratioDelta !== 0) {
    return ratioDelta;
  }

  if (left.quantity !== right.quantity) {
    return left.quantity - right.quantity;
  }

  return left.name.localeCompare(right.name);
}
