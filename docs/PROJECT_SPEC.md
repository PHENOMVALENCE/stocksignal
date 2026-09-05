# StockSignal Inventory Module Specification

This document describes the implemented inventory module. For the current overall product direction, read `JENGAFLOW_PRODUCT_SPEC.md`; StockSignal remains a module within JengaFlow.

## Purpose

StockSignal is a lightweight inventory intelligence and communication platform for small and medium manufacturers in Africa. It helps teams track raw materials, record stock movements, identify shortages early, and coordinate replenishment through channels that work on basic phones.

## Users and outcomes

The initial user is an inventory or operations manager. They need an accurate view of material availability, an audit trail of movements, and timely low-stock alerts before production stops.

## P0 capability 1: inventory and low-stock signal

A manager can add and view inventory materials, set quantities and reorder levels, record stock in, stock out, or adjustments, see current status, and inspect movement history.

An `InventoryItem` contains an ID, name, unique SKU, unit, quantity, reorder level, manager phone, supplier name and phone, alert state, and timestamps. A `StockMovement` records the item, movement type, positive movement quantity, previous and new balances, notes, and creation time.

Movement types are `STOCK_IN`, `STOCK_OUT`, and `ADJUSTMENT`.

### Threshold behavior

An item is low when `newQuantity <= reorderLevel`. The transition into low stock sets `alert_active`, attempts one Africa's Talking SMS to the responsible manager, and records the notification. Further movements below the threshold do not send duplicate alerts. Replenishment above the threshold resets `alert_active`; a later transition back to low stock creates a new alert.

Example: 50 metres of Cotton Fabric minus 40 metres consumed leaves 10. With a reorder level of 15, the item becomes low and one alert is due.

## P0 capability 2: supplier restock request

A low-stock item exposes **Request Restock**. The manager supplies a requested quantity and supplier. StockSignal sends an Africa's Talking SMS to the supplier and records the request as a notification.

Notification types are `LOW_STOCK` and `RESTOCK_REQUEST`. A notification records its item, type, recipient, message, provider, optional provider message ID, delivery status, optional error, and creation time.

Example supplier message:

```text
JENGAFLOW RESTOCK REQUEST

Mwigani Manufacturing requires:
Cotton Fabric

Requested quantity:
50 metres

Please contact the manufacturer regarding availability.
```

## Reliability requirements

- Validate all external input and reject stock-out operations that would create an unintended negative balance.
- Commit valid inventory changes independently from SMS delivery. Provider failure must be recorded, but must not roll back a valid stock movement.
- Use a database transaction or PostgreSQL RPC for production stock updates to prevent concurrent balance corruption.
- Keep privileged database and provider credentials server-side.
- Label any sample values as demo data; do not present fake operational statistics.

## Out of scope for the StockSignal foundation

Customer orders, bills of materials, production tracking, quality control, and AI recommendations are intentionally specified separately in the JengaFlow documents. Authentication, USSD, payments, multi-tenancy, and advanced analytics remain separately phased work. See the roadmap for priorities.
