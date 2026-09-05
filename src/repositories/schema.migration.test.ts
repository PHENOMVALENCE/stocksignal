import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const migrationsDir = path.resolve(process.cwd(), "supabase/migrations");
const schemaPath = path.resolve(process.cwd(), "supabase/schema.sql");

function readMigration(fileName: string) {
  return readFileSync(path.join(migrationsDir, fileName), "utf8");
}

describe("F01 schema migration", () => {
  it("ships a timestamped CLI migration that matches the reviewed schema", () => {
    const files = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql"));
    const baseline = files.find((file) => file.endsWith("_mvp_schema.sql"));

    expect(baseline).toBeDefined();

    const migration = readMigration(baseline!);
    const reviewed = readFileSync(schemaPath, "utf8");

    expect(migration).toContain("enable row level security");
    expect(migration).not.toMatch(/create policy/i);
    expect(migration).toContain("create table if not exists public.inventory_items");
    expect(migration).toContain("create table if not exists public.stock_movements");
    expect(migration).toContain("create table if not exists public.notifications");
    expect(migration).toContain("create table if not exists public.restock_requests");

    for (const table of ["inventory_items", "stock_movements", "notifications", "restock_requests"]) {
      expect(reviewed).toContain(`alter table public.${table} enable row level security`);
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });
});
