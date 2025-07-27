import {
  useQuery as useReactQuery,
  UseQueryOptions,
  useMutation as useReactMutation,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query'

/**
 * Client-side hook to fetch and cache data using a typed query function and arguments.
 *
 * This hook wraps React Query's useQuery, automatically generating a unique query key
 * based on the function name and arguments. It provides type safety and cache management
 * for server-defined query functions.
 *
 * @template TArgs The argument type expected by the query function.
 * @template TResult The result type returned by the query function.
 * @param fn The query function to execute (should match the signature used in preloadQuery).
 * @param args The arguments to pass to the query function.
 * @param options Optional React Query useQuery options (except queryKey and queryFn).
 * @returns The result of useQuery for the given query key and function.
 *
 * @example
 * const { data, isLoading } = useQuery(getChallenge, { slug: 'my-challenge' });
 */
export function useQuery<TArgs, TResult>(
  fn: (args: TArgs) => Promise<TResult>,
  args: TArgs,
  options?: Omit<
    UseQueryOptions<TResult, unknown, TResult, [string, TArgs]>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryKey = [fn.name, args] as [string, TArgs]

  return useReactQuery({
    queryKey,
    queryFn: () => fn(args),
    ...options,
  })
}

/**
 * Client-side hook to perform mutations and automatically invalidate related queries.
 *
 * This hook wraps React Query's useMutation, and after a successful mutation,
 * it invalidates all queries whose key starts with the function name, ensuring
 * cache consistency across the app.
 *
 * @template TArgs The argument type expected by the mutation function.
 * @template TResult The result type returned by the mutation function.
 * @param fn The mutation function to execute.
 * @param options Optional React Query useMutation options.
 * @returns The result of useMutation for the given mutation function.
 *
 * @example
 * const mutation = useMutation(updateChallenge);
 * mutation.mutate({ slug: 'my-challenge', data: { ... } });
 */
export function useMutation<TArgs, TResult>(
  fn: (args: TArgs) => Promise<TResult>,
  options?: UseMutationOptions<TResult, unknown, TArgs>,
) {
  const queryClient = useQueryClient()

  return useReactMutation({
    mutationFn: fn,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [fn.name] })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
