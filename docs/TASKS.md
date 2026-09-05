# Task Checklist

## JengaFlow order-to-production

- [x] Product specification, domain model, implementation phases, and agent prompt
- [x] JF-00 JengaFlow product shell
- [ ] JF-01 organizations, authentication, and RLS
- [ ] JF-02 customers
- [ ] JF-03 products
- [ ] JF-04 versioned bills of materials
- [ ] JF-05 draft customer orders
- [ ] JF-06 material requirement and shortage calculation
- [ ] JF-07 confirmed-order requirement snapshot
- [ ] JF-08 production jobs
- [ ] JF-09 production stage transitions
- [ ] JF-10 linked material consumption
- [ ] JF-11 quality checklist templates
- [ ] JF-12 quality inspections
- [ ] JF-13 production completion and delivery readiness
- [ ] JF-14 rule-based recommendations
- [ ] JF-15 optional AI operational summary
- [ ] JF-16 order-to-production dashboard
- [ ] JF-17 deterministic demo data and script

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
