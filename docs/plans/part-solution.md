# Plan d'Amélioration de l'Architecture des Onglets de Navigation et de la Sécurité

Ce document analyse l'architecture actuelle des onglets de navigation et propose des améliorations pour renforcer la sécurité et la séparation des préoccupations.

## Problématique Actuelle

L'architecture autour de `course-part-navigation-tabs.tsx`, `use-course-part-lock-status.ts`, et `tabs-config.ts` mélange des responsabilités de présentation (UI), de configuration et de logique métier/sécurité (vérification de verrouillage). Cela pose des problèmes de sécurité et de maintenabilité.

### 1. `tabs-config.ts` et la logique `lock.isLocked`

*   **Problème de Sécurité** : La décision de savoir si un onglet est "verrouillé" est prise en partie côté client si `tabs-config.ts` est utilisé directement pour l'affichage de l'UI. Même si les fonctions sous-jacentes (`isSolutionUnlocked`, `getCoursePartCompletionStatus`) sont des server actions sécurisées, le client peut potentiellement manipuler l'affichage. La logique de verrouillage/déverrouillage ne devrait jamais être entièrement dépendante du client.
*   **Problème de Performance/Responsabilité** : Exécuter des appels potentiellement coûteux (accès base de données via server actions) directement dans une fonction de configuration qui pourrait être appelée fréquemment pour l'affichage de l'UI n'est pas idéal. La configuration devrait être statique ou très légère.

### 2. `use-course-part-lock-status.ts`

*   **Problème de Sécurité** : Ce hook React s'exécute côté client et utilise la logique `isLocked` de `tabs-config.ts`. Il permet au client de "demander" le statut de verrouillage. Un utilisateur malveillant pourrait potentiellement intercepter ou modifier les réponses pour débloquer l'affichage d'un onglet. La vérification finale de l'accès à une ressource doit toujours se faire sur le serveur, au moment où la ressource est demandée. Le client ne devrait recevoir qu'une information simple (verrouillé/déverrouillé) sans avoir à exécuter la logique de vérification lui-même.
*   **Problème de Couplage** : Ce hook est fortement couplé à la structure de `tabs-config.ts`, ce qui rend difficile la réutilisation de la logique de verrouillage ailleurs sans dépendre de la configuration des onglets.

### 3. `course-part-navigation-tabs.tsx`

*   **Problème** : Si la décision de "verrouiller" un onglet est basée sur des informations que le client peut manipuler, alors l'interface utilisateur peut être trompée. Bien que cela n'accorde pas l'accès au contenu sous-jacent (si les server actions sont bien sécurisées), cela peut créer une expérience utilisateur incohérente ou permettre à un utilisateur de voir des options qu'il ne devrait pas voir.

## Solution Proposée : Renforcement de la Sécurité et Découplage

1.  **Logique de Vérification de Verrouillage Côté Serveur** :
    *   Créer une nouvelle **Server Action** (par exemple, `getCoursePartLockStatus`) dans `src/api/courses/navigation/server-actions.ts`.
    *   Cette server action encapsulera toute la logique de `isSolutionUnlocked` et `getCoursePartCompletionStatus` pour déterminer si une partie est verrouillée.
    *   Elle retournera un simple booléen (`isLocked: boolean`).
    *   Cette action sera la source de vérité pour le statut de verrouillage.

2.  **Mise à Jour de `tabs-config.ts`** :
    *   La propriété `lock.isLocked` dans `TabConfig` ne sera plus une fonction asynchrone exécutant des vérifications complexes.
    *   Elle pourrait être supprimée ou simplifiée pour dépendre d'une valeur déjà déterminée.

3.  **Nouveau Hook Client `useCoursePartLockStatus` (Lecture Seule)** :
    *   Ce hook (dans `src/api/courses/navigation/hooks/use-course-part-lock-status.ts`) utilisera React Query pour appeler la nouvelle server action `getCoursePartLockStatus`.
    *   Il fournira le statut de verrouillage (`isLocked`) et les états de chargement/erreur aux composants clients.
    *   Il sera purement en lecture seule et ne contiendra aucune logique de décision de sécurité.

4.  **Mise à Jour de `course-part-navigation-tabs.tsx`** :
    *   Ce composant utilisera le nouveau `useCoursePartLockStatus` pour récupérer le statut de verrouillage.
    *   L'affichage des onglets (activé/désactivé, icône de cadenas) sera basé sur la valeur retournée par ce hook.

5.  **Vérification Finale Côté Serveur** :
    *   Crucial : Lors de l'accès réel au contenu d'un onglet (par exemple, la page de solution officielle), le serveur doit *toujours* effectuer sa propre vérification d'autorisation et de verrouillage. Le fait que l'onglet soit affiché ou non côté client n'autorise pas l'accès au contenu.

## Flux Proposé

1.  **Client (UI)** : `course-part-navigation-tabs.tsx` utilise `useCoursePartLockStatus`.
2.  **Hook Client** : `useCoursePartLockStatus` appelle la server action `getCoursePartLockStatus`.
3.  **Server Action** : `getCoursePartLockStatus` (dans `src/api/courses/navigation/server-actions.ts`) exécute la logique de vérification de `isSolutionUnlocked` et `getCoursePartCompletionStatus`.
4.  **Server Action** : Retourne `isLocked: boolean` au hook client.
5.  **Client (UI)** : `course-part-navigation-tabs.tsx` met à jour l'affichage de l'onglet en fonction de `isLocked`.
6.  **Client (Requête de Contenu)** : Si l'utilisateur clique sur un onglet verrouillé, le serveur refuse l'accès au contenu après une vérification d'autorisation côté serveur.

Cette approche garantit que la logique de sécurité reste côté serveur, tout en offrant une expérience utilisateur réactive et cohérente.