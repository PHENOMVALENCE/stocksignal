# Roadmap

The original StockSignal inventory roadmap remains the foundation. New order-to-production work follows the numbered vertical slices in `JENGAFLOW_IMPLEMENTATION_PLAN.md`.

## JengaFlow hackathon path

- Product alignment and organization-scoped authentication
- Customers, products, versioned bills of materials, and draft orders
- Deterministic material requirements, shortage analysis, and order confirmation
- Production jobs, stage history, and linked material consumption
- Versioned quality checklists, inspections, and delivery readiness
- Evidence-backed recommendations, operational dashboard, and demo data

## P0 — Hackathon core

- Project foundation, Docker, CI, documentation, and demo-ready seed data
- Inventory CRUD and stock-in, stock-out, and adjustment movements
- Reorder thresholds, low-stock detection, and duplicate-alert suppression
- Africa's Talking SMS alerts and notification history
- Supplier restock SMS

## P1 — High-value hackathon enhancements

- USSD inventory lookup, stock consumption, low-stock list, and restock requests
- Basic authentication and manufacturer settings
- Notification status tracking and graceful retry/error handling

## P2 — Post-MVP

- Multiple locations, supplier directory, formal restock requests, and purchase orders
- CSV import/export, QR/barcode scanning, analytics, reporting, and audit logs
- Role-based access and organization multi-tenancy

## P3 — Future

- Demand forecasting and predictive reorder recommendations
- Voice and WhatsApp alerts
- M-Pesa procurement/payment flow and supplier marketplace
- IoT stock sensors and advanced production planning

Do not implement P2 or P3 during initial setup unless specifically requested.
