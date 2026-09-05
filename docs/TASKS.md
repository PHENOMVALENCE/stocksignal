# Task Checklist

## MFGFlow order-to-production

- [x] Product specification, domain model, implementation phases, and agent prompt
- [x] MF-00 MFGFlow product shell
- [ ] MF-01 organizations, authentication, and RLS
- [ ] MF-02 customers
- [ ] MF-03 products
- [ ] MF-04 versioned bills of materials
- [ ] MF-05 draft customer orders
- [ ] MF-06 material requirement and shortage calculation
- [ ] MF-07 confirmed-order requirement snapshot
- [ ] MF-08 production jobs
- [ ] MF-09 production stage transitions
- [ ] MF-10 linked material consumption
- [ ] MF-11 quality checklist templates
- [ ] MF-12 quality inspections
- [ ] MF-13 production completion and delivery readiness
- [ ] MF-14 rule-based recommendations
- [ ] MF-15 optional AI operational summary
- [ ] MF-16 order-to-production dashboard
- [ ] MF-17 deterministic demo data and script

## Foundation

- [x] Next.js, TypeScript, Tailwind CSS, and ESLint configured
- [x] Environment template and validation foundation
- [x] Agent and architecture documentation
- [x] Docker packaging and GitHub CI
- [x] Health endpoint and application shell
- [x] Schema verified against PostgreSQL, with updated_at triggers
- [x] Dependency advisories cleared via overrides

## Inventory

- [x] CLI migration, typed definitions, and server-only repositories
- [x] Database migrations applied to the configured hosted project
- [x] List and create items
- [ ] Update items
- [x] Stock in, stock out, and adjustments
- [x] Movement history

## Signals

- [x] Pure threshold and alert-state rules
- [x] SMS provider connected to configured credentials
- [x] Low-stock notification persistence
- [x] SMS failure handling

## Restocking

- [x] Supplier information UI
- [x] Requested quantity and supplier SMS
- [x] Request status/history
- [x] Atomic restock request and notification write

## Optional USSD

- [ ] Callback endpoint and session handling
- [ ] Check stock, record usage, and low-stock menu
- [ ] Request restock
