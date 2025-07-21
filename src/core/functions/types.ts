import { BasePayload } from "payload"
import { PostgresAdapter } from "@payloadcms/db-postgres";

/**
 * Represents a preloaded query payload for React Query hydration between server and client.
 *
 * This type is returned by `preloadQuery` (server-side) and consumed by `usePreloadedQuery` (client-side).
 * It contains the dehydrated React Query state, the query key, the query function, and the arguments used.
 *
 * @template TResult The result type returned by the query function.
 * @template TArgs The argument type expected by the query function.
 */
export type Preloaded<TResult, TArgs> = {
  /**
   * The dehydrated state of the React Query cache, to be passed to <Hydrate /> on the client.
   */
  dehydratedState: unknown
  /**
   * The unique query key used for React Query caching and hydration.
   */
  queryKey: [string, TArgs]
  /**
   * The query function that fetches the data, matching the signature used in preloadQuery.
   */
  fn: (args: TArgs) => Promise<TResult>
  /**
   * The arguments used for the query function.
   */
  args: TArgs
}




export type QueryCtx = { payload: BasePayload, drizzle: PostgresAdapter['drizzle']}
