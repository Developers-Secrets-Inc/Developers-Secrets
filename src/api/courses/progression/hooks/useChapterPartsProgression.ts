// src/api/courses/progression/hooks/useChapterPartsProgression.ts

import { useQuery } from '@tanstack/react-query';
import { getChapterOutline } from '@/api/courses/navigation';
import { UseQueryOptions } from '@tanstack/react-query';

type ResolvedChapterOutline = Awaited<ReturnType<typeof getChapterOutline>>;

export const useChapterPartsProgression = (
  chapter_slug: string,
  userId: string,
  options?: Omit<UseQueryOptions<
    ResolvedChapterOutline,
    Error,
    ResolvedChapterOutline,
    ['chapter-outline', string, string]
  >, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chapter-outline', chapter_slug, userId],
    queryFn: () => getChapterOutline({ chapter_slug, userId }),
    enabled: !!chapter_slug && !!userId,
    ...options,
  });

  return { parts: data, isLoading, error };
};