# Plan de développement : Système de progression automatique des parties

## Objectif
Créer un système de progression automatique des parties de challenge côté client avec mise à jour en temps réel, en utilisant des server actions et l'action existante `getCoursePartCompletionStatus`.

## Server Actions à utiliser/créer

### 1. Reuse existing: `getChapterOutline` - `src/api/courses/navigation/index.ts`
```typescript
// Action existante qui récupère l'outline d'un chapitre, incluant le statut de complétion de chaque partie.
// Paramètres: { chapter_slug: string, userId: string }
// Retourne: Array<{ id: number, name: string, slug: string, completionStatus: CoursePartUserProgression['completionStatus'] }>
// Usage: Chargement initial de la progression de toutes les parties d'un chapitre.
```

### 2. Reuse existing: `getCoursePartCompletionStatus` - `src/api/courses/progression/index.ts`
```typescript
// Action existante déjà implémentée.
// Paramètres: { userId: string, partId: string }
// Retourne: Option<CoursePartUserProgression>
// Usage: Statut individuel des parties.
```

## Hooks à créer (lecture seule)

### 1. `useChapterPartsProgression`
- **IMPLEMENTÉ** ✅
- Utilise l'action existante `getChapterOutline`
- Paramètres: chapter_slug, userId
- Retourne: Liste des parties du chapitre avec leur statut de progression
- READ-ONLY - ne modifie pas les données

```typescript
// src/api/courses/progression/hooks/useChapterPartsProgression.ts
import { useQuery } from '@tanstack/react-query';
import { getChapterOutline } from '@/api/courses/navigation'; // Assurez-vous que le chemin est correct

export const useChapterPartsProgression = (chapter_slug: string, userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chapter-outline', chapter_slug, userId],
    queryFn: () => getChapterOutline({ chapter_slug, userId }),
    enabled: !!chapter_slug && !!userId, // Active la requête seulement si les paramètres sont présents
  });

  return { parts: data, isLoading, error };
};
```

### 2. Reuse existing: `useCoursePartUserStatus` - `src/api/courses/progression/hooks/use-course-part-completion-status.ts`
- Hook existant qui récupère le statut de complétion d'une partie unique.
- **MODIFICATION IMPORTANTE**: La partie `useMutation` de ce hook (qui permet de modifier le statut depuis le client) sera **supprimée**. Ce hook deviendra purement un hook de lecture (`useQuery`).
- Paramètres: partId, userId
- Retourne: Statut de la partie ('not_started' | 'in_progress' | 'completed')
- READ-ONLY - ne modifie pas les données

### 3. `useRevalidateChapterProgression`
- **IMPLEMENTÉ** ✅
- Force le rechargement de la progression complète d'un chapitre.
- Devra invalider le cache de `getChapterOutline`.
- Appelé après soumission réussie dans submit-button.tsx.
- Ne modifie pas directement le statut.

```typescript
// src/api/courses/progression/hooks/useRevalidateChapterProgression.ts
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
```

## Composants à modifier

### 1. `submit-button.tsx` - `src/api/courses/submissions/components/submit-button.tsx`
- **AJOUTER**: Appel à `useRevalidateChapterProgression` après soumission réussie.
  - Importer le hook `useRevalidateChapterProgression`.
  - Après une soumission de code réussie (tous les tests passés), appeler la fonction `revalidate` fournie par ce hook avec le `chapter_slug` et `userId` appropriés.
  - Cela forcera React Query à invalider et à re-fetcher les données de `getChapterOutline` pour le chapitre actuel, mettant à jour la progression affichée en temps réel.
- **MODIFIER**: Remplacer logique de vérification côté client par server actions.
  - La logique de vérification si une partie est déjà complétée sera simplifiée ou déplacée.
  - Le composant `submit-button.tsx` n'aura plus besoin de faire ces vérifications complexes côté client ; il se contentera d'appeler `setCompleted()` et de laisser le serveur gérer la logique métier (vérification, mise à jour en base de données, etc.).
- **SUPPRIMER**: Logique de mise à jour directe du statut (serveur s'en charge).
  - Toute ligne de code qui tente de modifier directement l'état de complétion d'une partie côté client ou qui dépend d'un état client pour décider de la complétion sera supprimée.
  - La source de vérité pour le statut de complétion sera uniquement la base de données, mise à jour via la server action `setCompleted()`.

### 2. `part-progression-dot.tsx` - `src/api/courses/progression/components/part-progression-dot.tsx`
- **MODIFIER**: Utiliser le hook existant `useCoursePartUserStatus`.
  - Importer et utiliser `useCoursePartUserStatus` pour récupérer le statut de complétion de la partie associée au `dot`.
  - Adapter l'affichage du `dot` (couleur, icône) en fonction du statut (`not_started`, `in_progress`, `completed`).
- **AJOUTER**: Gestion des états de chargement et mise à jour automatique.
  - Le `dot` se mettra à jour automatiquement lorsque le statut de la partie change, grâce à React Query.
  - Afficher un état de chargement si nécessaire pendant la récupération du statut.

### 3. `part-completion-toast.tsx` - `src/api/courses/progression/components/part-completion-toast.tsx`
- **MODIFIER**: Utiliser le hook existant `useCoursePartUserStatus` pour déterminer l'affichage.
  - Le toast sera affiché lorsque le statut de la partie passe à `completed`.
  - S'assurer que le toast ne s'affiche qu'une seule fois par complétion (par exemple, en vérifiant si le statut précédent était différent).
- **AJOUTER**: Logique pour s'assurer que le toast ne s'affiche qu'à la première complétion.
  - Utiliser un `ref` ou un état local pour suivre si le toast a déjà été affiché pour la complétion actuelle, ou s'appuyer sur la logique de `setCompleted()` qui ne devrait être appelée qu'une fois.

### 4. Layout du challenge - `src/app/(frontend)/(dashboard)/courses/[course_slug]/[chapter_slug]/[part_slug]/layout.tsx`
- **AJOUTER**: Utilisation de `useChapterPartsProgression` pour le chargement initial des données de progression du chapitre.
- **AJOUTER**: Initialisation automatique du chargement de la progression au chargement de la page.

## Structure des fichiers

```
src/api/courses/
├── chapters.ts (ajout getChapterWithPartsProgression)
├── progression/
│   ├── server-actions.ts (nouveau - toutes les actions)
│   ├── hooks/
│   │   ├── useChapterPartsProgression.ts (nouveau)
│   │   ├── usePartProgressionStatus.ts (nouveau)
│   │   └── useRevalidateProgression.ts (nouveau)
```

## Types et interfaces

```typescript
// Server actions return types
interface ChapterWithProgression {
  chapter: Chapter;
  parts: Array<{
    id: string;
    // Note: getChapterOutline will use getCoursePartCompletionStatus for each part to retrieve completion status.

    name: string;
    status: 'pending' | 'completed';
    completedAt?: Date;
  }>;
}

interface PartProgressionStatus {
  partId: string;
  status: 'pending' | 'completed';
  completedAt?: Date;
}
```

## Sécurité et validation

### Validation côté serveur
- Vérification de l'identité de l'utilisateur dans chaque server action
- Validation que l'utilisateur a accès au chapitre/partie
- Protection contre les accès non autorisés

### Cache et performance
- Utilisation de React Query avec cache approprié
- Invalide le cache uniquement quand nécessaire
- Optimisation des requêtes pour éviter les appels multiples

## Flux de données sécurisé

1. **Chargement initial**: Layout appelle getChapterWithPartsProgression
2. **Affichage**: Composants utilisent les hooks en lecture seule
3. **Soumission**: Submit-button valide la soumission côté serveur
4. **Revalidation**: Après succès, rechargement de la progression
5. **Synchronisation**: Tous les composants se mettent à jour automatiquement

## Points clés de sécurité
- Aucun hook ne peut modifier directement le statut
- La seule source de vérité est le serveur
- Les server actions gèrent toute la logique métier
- Les hooks sont strictement en lecture seule