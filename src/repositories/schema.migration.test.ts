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

    const movement = files.find((file) => file.includes("apply_stock_movement"));
    if (movement) {
      expect(readMigration(movement)).toContain("for update");
    }

    const restock = files.find((file) => file.includes("create_restock_request"));
    expect(restock).toBeDefined();
    const restockSql = readMigration(restock!);
    expect(restockSql).toContain("insert into public.notifications");
    expect(restockSql).toContain("insert into public.restock_requests");
    expect(restockSql).toContain("for update");
    expect(restockSql).not.toMatch(/create policy/i);
    expect(restockSql).toContain("grant execute on function public.create_restock_request");

    const rollbackTest = readFileSync(path.resolve(process.cwd(), "supabase/tests/create_restock_request.sql"), "utf8");
    expect(rollbackTest).toContain("forced restock insert failure");
    expect(rollbackTest).toContain("orphaned notification or request");

    for (const table of ["inventory_items", "stock_movements", "notifications", "restock_requests"]) {
      expect(reviewed).toContain(`alter table public.${table} enable row level security`);
      expect(migration).toContain(`alter table public.${table} enable row level security`);
    }
  });
});
