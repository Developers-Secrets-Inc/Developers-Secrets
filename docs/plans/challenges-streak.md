### Plan de Développement : Système de Streaks de Challenges

#### Étape 1 : Modélisation des données (Collection Payload)
1.  **Créer la collection `ChallengeStreaks`** :
    *   Créer un nouveau fichier `src/collections/ChallengeStreaks.ts`.
    *   Cette collection stockera une entrée pour chaque jour où un utilisateur complète au moins un challenge.
    *   **Champs requis :**
        *   `userId` (type: `text`, `required: true`, `index: true`) : L'ID de l'utilisateur.
        *   `date` (type: `date`, `required: true`) : La date de la complétion.
        *   `challengesCompleted` (type: `number`, `required: true`, `defaultValue: 1`) : Le nombre brut de challenges complétés ce jour-là.
        *   `status` (type: `select`, options: `['active', 'frozen']`, `defaultValue: 'active'`) : Gère l'état du streak pour ce jour. `'frozen'` sera utilisé pour la fonctionnalité future permettant de ne pas briser un streak.

#### Étape 2 : Logique métier (Actions Serveur)
1.  **Créer un fichier pour la logique des streaks** :
    *   Créer `src/core/gamification/streaks/actions.ts` (ou un nom similaire).
2.  **Implémenter les fonctions de base** :
    *   `updateChallengeStreak(userId: string)`:
        *   **Important :** Cette fonction devra retourner un objet contenant l'état du streak avant et après la mise à jour pour permettre une UI réactive sans re-fetch. Par exemple : `{ previousChallengesToday: number; currentChallengesToday: number; streakLength: number; }`.
        *   Sera appelée à chaque fois qu'un challenge est terminé avec succès.
        *   **Logique** : Vérifie s'il existe une entrée pour l'utilisateur à la date du jour avec le statut `active`. Si oui, incrémente `challengesCompleted`. Sinon, vérifie si l'entrée la plus récente (active ou `frozen`) date d'hier. Si c'est le cas, on continue le streak en créant une nouvelle entrée `active`. Si le streak est brisé, on supprime les anciennes entrées et on en crée une nouvelle.
    *   `getCurrentChallengeStreak(userId: string)`:
        *   Calcule la longueur du streak actuel en comptant les jours consécutifs dans `ChallengeStreaks` (statut `active` ou `frozen`).
        *   Retourne le nombre de jours du streak et le nombre de challenges complétés pour le jour en cours.

#### Étape 3 : Intégration dans le flux de complétion
1.  **Remplacer l'appel direct par un hook de mutation** :
    *   Au lieu d'appeler directement l'action serveur, la fonction `handleSubmit` dans `src/core/compiler/challenge-editor/header/submit-button.tsx` utilisera un **hook de mutation** fourni par le futur hook `useChallengeStreak`.
    *   L'appel ressemblera à `mutation.mutateAsync(userId)`. Ce hook gérera l'appel à `updateChallengeStreak` et les états de chargement/erreur associés.

#### Étape 4 : Création du Hook et de l'Interface (UI)
1.  **Créer un hook `useChallengeStreak` unifié** :
    *   Ce sera le point d'entrée unique pour toute interaction avec le streak côté client.
    *   **Partie Requête (`useQuery`)**:
        *   Utilisera `useQuery` pour appeler l'action serveur `getCurrentChallengeStreak`.
        *   Aura l'option `refetchOnWindowFocus: true` activée pour garantir la fraîcheur des données.
        *   Exposera les données du streak (`streakLength`, etc.) et l'état de chargement.
    *   **Partie Mutation (`useMutation`)**:
        *   Utilisera `useMutation` pour appeler l'action serveur `updateChallengeStreak`.
        *   Dans le callback `onSuccess` de la mutation, il effectuera deux actions :
            1.  **Invalider la requête** : `queryClient.invalidateQueries` sur la clé de la requête du streak, forçant tous les composants (comme le badge) à se mettre à jour automatiquement.
            2.  **Stocker le résultat pour le dialogue** : Le résultat de `updateChallengeStreak` sera stocké dans un state manager (Zustand) pour une utilisation instantanée par le dialogue de complétion.

2.  **Créer le composant d'affichage du streak de challenges** :
    *   Le nouveau `ChallengeStreakBadge.tsx` utilisera la partie **requête** du hook `useChallengeStreak` pour afficher le `streakLength` et gérer l'état de chargement.
    *   Son style s'inspirera de `daily-entries-badge.tsx`.

3.  **Mettre à jour l'interface utilisateur** :
    *   Remplacer le composant `DailyEntriesBadge` par le nouveau `ChallengeStreakBadge` dans les emplacements clés (ex: `home-sidebar.tsx`).
    *   La logique backend du streak de connexion sera conservée mais son badge ne sera plus l'indicateur principal.

4.  **Rendre le dialogue de complétion dynamique** :
    *   Le composant `NewChallengeSuccessDialog` lira les informations de mise à jour du streak depuis le state manager (alimenté par le `onSuccess` de la mutation) pour ajouter dynamiquement une page de félicitations si un palier est franchi.
