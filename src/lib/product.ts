export const PRODUCT_NAME = "JengaFlow";
export const INVENTORY_MODULE_NAME = "StockSignal";

export const PRODUCT_DESCRIPTION =
  "JengaFlow is an order-to-production platform for African manufacturers. StockSignal is its inventory and shortage-signal module.";

export const productMetadata = {
  title: { default: PRODUCT_NAME, template: `%s | ${PRODUCT_NAME}` },
  description: PRODUCT_DESCRIPTION,
} as const;

export const primaryNavigation = [
  { href: "/", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/notifications", label: "Notifications" },
] as const;
