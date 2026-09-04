# Architecture Decisions

## ADR-001: Use Next.js rather than PHP/Laravel

One TypeScript codebase enables rapid UI and server development, supports the official Africa's Talking Node SDK, deploys simply to Vercel, and packages cleanly with Docker.

## ADR-002: Use Supabase/PostgreSQL

PostgreSQL provides relational integrity and transactions while Supabase accelerates hosted database setup and leaves room for authentication and realtime features.

## ADR-003: Use Docker for packaging

Docker creates a portable production artifact; it is not an application framework and does not replace Next.js architecture.

## ADR-004: Implement SMS before USSD

SMS directly proves proactive low-stock communication. USSD follows as a valuable low-connectivity interaction channel.

## ADR-005: Use a modular monolith

One deployable keeps operations and debugging predictable while service boundaries preserve maintainability. Microservices add unnecessary hackathon risk.

## ADR-006: Optimize for reliable demonstration quality

The MVP prioritizes correct stock state, duplicate-alert suppression, clear failures, and a reproducible demo over a large feature count.
