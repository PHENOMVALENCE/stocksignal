import type { StockSignalDatabaseClient } from "@/lib/supabase/types";

type QueryResult = {
  data?: unknown;
  error?: { code?: string; message?: string; details?: string } | null;
  count?: number | null;
};

class QueryBuilder {
  readonly filters: Record<string, unknown> = {};

  constructor(
    private readonly table: string,
    private readonly handler: (table: string, builder: QueryBuilder) => QueryResult | Promise<QueryResult>,
  ) {}

  select() {
    return this;
  }

  insert(payload: unknown) {
    this.filters.insert = payload;
    return this;
  }

  update(payload: unknown) {
    this.filters.update = payload;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value;
    return this;
  }

  gte(column: string, value: unknown) {
    this.filters[`gte:${column}`] = value;
    return this;
  }

  lte(column: string, value: unknown) {
    this.filters[`lte:${column}`] = value;
    return this;
  }

  order() {
    return this;
  }

  limit() {
    return this;
  }

  range() {
    return this;
  }

  maybeSingle() {
    return this.execute();
  }

  single() {
    return this.execute();
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }

  private execute() {
    return this.handler(this.table, this);
  }
}

export function createFakeClient(
  handler: (table: string, builder: QueryBuilder) => QueryResult | Promise<QueryResult>,
  rpcHandler?: (fn: string, params: Record<string, unknown>) => QueryResult | Promise<QueryResult>,
) {
  return {
    from(table: string) {
      return new QueryBuilder(table, handler);
    },
    async rpc(fn: string, params: Record<string, unknown>) {
      if (!rpcHandler) {
        return { data: null, error: { message: "RPC is not stubbed." } };
      }

      return rpcHandler(fn, params);
    },
  } as unknown as StockSignalDatabaseClient;
}
