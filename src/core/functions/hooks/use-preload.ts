import { useQuery } from '@tanstack/react-query'
import type { Preloaded } from '../types'

/**
 * Client-side hook to consume a preloaded query payload and enable reactivity with React Query.
 *
 * Use this in a Next.js Client Component to access data preloaded on the server with preloadQuery,
 * ensuring instant data availability and seamless reactivity (refetch, cache, etc.).
 *
 * @template TResult The result type returned by the query function.
 * @template TArgs The argument type expected by the query function.
 * @param preloaded The Preloaded object returned by preloadQuery (server-side).
 * @returns The result of useQuery for the given query key and function.
 *
 * @example
 * // In a Client Component:
 * const { data, isLoading } = usePreloadedQuery(preloaded);
 */
export function usePreloadedQuery<TResult, TArgs>(preloaded: Preloaded<TResult, TArgs>) {
  return useQuery({
    queryKey: preloaded.queryKey,
    queryFn: () => preloaded.fn(preloaded.args),
  })
}
