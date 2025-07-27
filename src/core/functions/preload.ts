import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { Preloaded } from './types'

/**
 * Server-side utility to preload a query and prepare React Query's dehydrated state for hydration on the client.
 *
 * Use this in a Next.js Server Component to fetch data and pass it to a Client Component,
 * enabling instant data availability and reactivity with React Query on the client.
 *
 * @template TArgs The argument type expected by the query function.
 * @template TResult The result type returned by the query function.
 * @param fn The query function to execute (should match the signature used in useQuery).
 * @param args The arguments to pass to the query function.
 * @returns A Preloaded object containing the dehydrated state, query key, function, and arguments.
 *
 * @example
 * // In a Server Component:
 * const preloaded = await preloadQuery(getChallenge, { slug: 'my-challenge' });
 * return <ChallengeClient preloaded={preloaded} />;
 */
export async function preloadQuery<TArgs, TResult>(
  fn: (args: TArgs) => Promise<TResult>,
  args: TArgs,
): Promise<Preloaded<TResult, TArgs>> {
  const queryClient = new QueryClient()
  const queryKey = [fn.name, args] as [string, TArgs]

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fn(args),
  })

  return {
    dehydratedState: dehydrate(queryClient),
    queryKey,
    fn,
    args,
  }
}
