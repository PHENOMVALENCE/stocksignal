import { describe, expect, it } from "vitest";

import { createRestockRpc } from "./restock-rpc";
import { createFakeClient } from "./test-client";

const ids = {
  restock_request_id: "44444444-4444-4444-8444-444444444444",
  notification_id: "33333333-3333-4333-8333-333333333333",
};

describe("createRestockRpc", () => {
  it("returns both created identifiers from a successful RPC", async () => {
    const rpc = createRestockRpc(
      createFakeClient(
        () => ({ data: null, error: null }),
        (fn) => {
          expect(fn).toBe("create_restock_request");
          return { data: [ids], error: null };
        },
      ),
    );

    await expect(
      rpc.createRequest({
        inventoryItemId: "11111111-1111-4111-8111-111111111111",
        requestedQuantity: 50,
        supplierName: "Demo Mill",
        supplierPhone: "+254700000002",
        message: "STOCKSIGNAL RESTOCK REQUEST",
        unit: "metres",
      }),
    ).resolves.toEqual({
      restockRequestId: ids.restock_request_id,
      notificationId: ids.notification_id,
    });
  });

  it("normalizes a database failure instead of exposing provider text", async () => {
    const rpc = createRestockRpc(
      createFakeClient(
        () => ({ data: null, error: null }),
        () => ({
          data: null,
          error: { code: "P0001", message: "Requested quantity must be greater than zero." },
        }),
      ),
    );

    await expect(
      rpc.createRequest({
        inventoryItemId: "11111111-1111-4111-8111-111111111111",
        requestedQuantity: 50,
        supplierName: "Demo Mill",
        supplierPhone: "+254700000002",
        message: "STOCKSIGNAL RESTOCK REQUEST",
        unit: "metres",
      }),
    ).rejects.toMatchObject({
      message: "Requested quantity must be greater than zero.",
    });
  });
});
