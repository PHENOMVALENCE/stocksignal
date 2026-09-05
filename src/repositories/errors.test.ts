import { describe, expect, it } from "vitest";

import { mapDatabaseError } from "./errors";

describe("mapDatabaseError", () => {
  it("turns a unique SKU violation into a clear conflict", () => {
    const error = mapDatabaseError({
      code: "23505",
      message: "duplicate key value violates unique constraint inventory_items_sku_key",
    });

    expect(error.code).toBe("SKU_DUPLICATE");
    expect(error.message).toBe("An item with this SKU already exists.");
    expect(error.status).toBe(409);
  });

  it("does not expose raw provider text for unknown failures", () => {
    const error = mapDatabaseError(
      { code: "XX000", message: "internal connection secret=abc" },
      "Inventory items could not be loaded.",
    );

    expect(error.code).toBe("DATABASE");
    expect(error.message).toBe("Inventory items could not be loaded.");
    expect(error.message).not.toContain("secret");
  });

  it("maps a missing-row PostgREST code to not found", () => {
    const error = mapDatabaseError({ code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" });

    expect(error.code).toBe("NOT_FOUND");
  });
});
