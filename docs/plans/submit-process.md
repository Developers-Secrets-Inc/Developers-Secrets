# Plan de Refonte du Processus de Soumission et de Progression

Ce document détaille la refonte de la logique de soumission de code et de la gestion de la progression des parties, en se basant sur le principe de séparation des responsabilités et en garantissant la sécurité des opérations.

## Problématique Actuelle
Le composant `submit-button.tsx` est un "god object" qui gère un trop grand nombre de responsabilités : UI, soumission de code, gestion de la progression, gamification, etc. Cela rend le code difficile à maintenir, tester et comprendre, et pose des problèmes de sécurité en exposant potentiellement des logiques critiques côté client.

## Objectifs de la Refonte
1.  **Découplage** : Séparer la logique de soumission de code de la logique de progression et des effets secondaires.
2.  **Sécurité** : Assurer que toute modification du statut de progression et les actions de gamification sont gérées exclusivement côté serveur.
3.  **Réactivité Client** : Maintenir des mises à jour en temps réel sur l'interface utilisateur via l'invalidation et la revalidation du cache React Query.
4.  **Maintenabilité** : Rendre chaque module plus petit, plus ciblé et plus facile à comprendre.

## Solution Proposée : Décomposition des Responsabilités

### 1. Découpler la Logique de Soumission de Code

*   **Nouveau Hook Client : `useCodeSubmission`**
    *   **Chemin** : `src/api/courses/submissions/hooks/use-code-submission.ts`
    *   **Responsabilité** : Encapsuler la logique d'envoi du code de l'utilisateur pour exécution et tests.
    *   **Détails** :
        *   Prendra `fileTree` et `coursePart` en paramètres.
        *   Appellera la server action `submit` (celle qui exécute le code et les tests).
        *   Gérera les états de chargement (`isLoading`, `isSubmitting`) et d'erreur liés à cette opération.
        *   Retournera les résultats de la soumission (`submission`, `testResults`).

*   **`submit-button.tsx` (simplifié)**
    *   **Chemin** : `src/api/courses/submissions/components/submit-button.tsx`
    *   **Responsabilité** : Gérer l'UI du bouton de soumission et orchestrer le flux.
    *   **Détails** :
        *   Utilisera le hook `useCodeSubmission` pour déclencher la soumission.
        *   Affichera les résultats bruts des tests (via `setSubmissionResult`, `setTestResults`).
        *   **Ne gérera plus directement la logique de complétion ou les actions post-complétion.**
        *   Passera les résultats de la soumission (`submission`, `testResults`) à un nouveau hook d'orchestration de progression.

### 2. Centraliser la Logique de Progression de Partie (Server Actions)

*   **Nouvelle Server Action : `updatePartProgressionStatus`**
    *   **Chemin** : `src/api/courses/progression/server-actions.ts`
    *   **Responsabilité** : Modifier de manière sécurisée le statut de progression d'une partie.
    *   **Détails** :
        *   Prendra `partId`, `userId`, et les `testResults` (ou `submission.testsPassed`) en paramètres.
        *   **Logique sécurisée côté serveur** :
            *   Vérifiera le statut actuel de la partie (`not_started`, `in_progress`, `completed`).
            *   Si `not_started` et tests lancés -> passer à `in_progress`.
            *   Si `in_progress` et tous les tests passés -> passer à `completed`.
            *   Si `completed` et tests passés -> ne rien faire (déjà complété).
            *   Effectuera la mise à jour dans la base de données (collection `CoursePartUserProgression`).
        *   **Retournera** le nouveau statut de la partie et un indicateur si la partie vient d'être complétée pour la première fois.

*   **Nouvelle Server Action : `handlePartCompletionSideEffects`**
    *   **Chemin** : `src/api/courses/progression/server-actions.ts`
    *   **Responsabilité** : Exécuter toutes les actions liées à la complétion d'une partie (gamification, quêtes, achievements, XP).
    *   **Détails** :
        *   Prendra `partId`, `userId`, et `coursePart.difficulty` en paramètres.
        *   Contiendra toute la logique actuelle de `progressQuest`, `trackAchievementProgress`, `addExperience`, etc.
        *   **Sera appelée *uniquement* si `updatePartProgressionStatus` a effectivement marqué la partie comme `completed` pour la première fois.**
        *   **Retournera** les données pertinentes pour le client (par exemple, les nouvelles valeurs de quêtes, d'XP, etc., pour les afficher en temps réel).

### 3. Orchestrer le Flux Post-Soumission (Hook Client)

*   **Nouveau Hook Client : `usePartCompletionOrchestrator`**
    *   **Chemin** : `src/api/courses/progression/hooks/use-part-completion-orchestrator.ts`
    *   **Responsabilité** : Coordonner les mises à jour de statut et les actions post-complétion après une soumission de code.
    *   **Détails** :
        *   Sera appelé par `submit-button.tsx` après avoir reçu les `submission` et `testResults` de `useCodeSubmission`.
        *   Appellera la server action `updatePartProgressionStatus` avec les résultats des tests.
        *   Si `updatePartProgressionStatus` indique que la partie est maintenant `completed` (et qu'elle ne l'était pas avant) :
            *   Appellera la server action `handlePartCompletionSideEffects`.
            *   Déclenchera la revalidation du cache pour toutes les données impactées (via `useRevalidateChapterProgression` pour `getChapterOutline`, et potentiellement d'autres hooks pour les quêtes, achievements, etc.).
            *   Déclenchera l'affichage du `part-completion-toast`.
        *   Gérera les états de chargement et d'erreur pour ce flux.

### 4. Mises à Jour en Temps Réel sur le Client

*   **Stratégie : Invalidation et Re-fetch du Cache (React Query)**
    *   **Progression des parties** : `useRevalidateChapterProgression` invalidera le cache de `getChapterOutline`. Tous les composants utilisant `useChapterPartsProgression` (comme `part-progression-dot.tsx` et `part-status.tsx`) se mettront à jour automatiquement.
    *   **Quêtes, Achievements, XP** : Les server actions `handlePartCompletionSideEffects` devraient retourner les données mises à jour. Ces données peuvent ensuite être utilisées pour invalider les caches de hooks React Query dédiés à l'affichage de ces éléments (ex: `useUserQuests`, `useUserAchievements`). Cela garantira que l'UI reflète les changements en temps quasi-réel.

## Flux Global Simplifié

1.  **`submit-button.tsx`** (UI)
    *   Déclenche `useCodeSubmission`.
2.  **`useCodeSubmission`** (Hook client)
    *   Appelle `submit` (Server Action).
    *   Retourne `submission` et `testResults`.
3.  **`submit-button.tsx`** (UI)
    *   Passe `submission` et `testResults` à `usePartCompletionOrchestrator`.
4.  **`usePartCompletionOrchestrator`** (Hook client)
    *   Appelle `updatePartProgressionStatus` (Server Action) avec les résultats des tests.
    *   Si la partie est complétée pour la première fois :
        *   Appelle `handlePartCompletionSideEffects` (Server Action).
        *   Appelle `useRevalidateChapterProgression.revalidate()` pour mettre à jour la progression du chapitre.
        *   Déclenche l'affichage du `part-completion-toast`.
5.  **Composants d'affichage** (ex: `part-status.tsx`, `part-progression-dot.tsx`, composants de quêtes/achievements)
    *   Utilisent leurs hooks React Query respectifs (`useChapterPartsProgression`, `useCoursePartUserStatus`, `useUserQuests`, etc.).
    *   Se mettent à jour automatiquement lorsque leur cache est invalidé et re-fetché.