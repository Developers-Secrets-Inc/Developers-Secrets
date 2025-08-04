import { useQueryClient } from '@tanstack/react-query';

export const useRevalidateChapterProgression = () => {
  const queryClient = useQueryClient();

  const revalidate = (chapter_slug: string, userId: string) => {
    // Invalider le cache de getChapterOutline pour le chapitre et l'utilisateur donnés
    queryClient.invalidateQueries({
      queryKey: ['chapter-outline', chapter_slug, userId],
    });
  };

  return { revalidate };
};
