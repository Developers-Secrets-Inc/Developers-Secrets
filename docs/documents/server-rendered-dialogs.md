# Plan de Développement : Dialogues/Sheets Rendus Côté Serveur

**Objectif :** Charger les données pour les dialogues/sheets Achievements, Division Leaderboard, Marketplace, Inventory et Quests côté serveur dans leurs groupes respectifs (`ProgressionGroup`, `SocialGroup`) au sein de la `HomeSidebar`. Passer ces données pré-chargées aux composants UI pour un affichage instantané sans chargement interne côté client lors de l'ouverture.

**Plan Détaillé :**

1.  **Refactoriser les Composants **Dialog**/Sheet (Supprimer le Fetching Interne) :**
    *   Modifier les props de chaque composant Dialog/Sheet (`AchievementsDialog`, `DivisionLeaderboard`, `MarketplaceDialog`, `InventorySheet`, `QuestsDialog`) pour accepter les données initiales (`initialData`, `initialError`, etc.) au lieu d'un `userId` pour le fetch.
    *   Supprimer la logique de récupération de données interne (`useEffect` qui appelle les fonctions de fetch).
    *   Supprimer les états `useState` liés au chargement initial (`isLoading`, `data`, `error`). Conserver les états liés aux actions internes (ex: `isPurchasingItemId`, `consumingItemId`).
    *   Adapter le rendu pour utiliser directement les données/erreurs reçues via les props. Afficher un état de chargement (squelette) si les données initiales sont `null` et qu'il n'y a pas d'erreur.

2.  **Créer les Composants Client pour les Contrôles et l'Affichage des Modales :**
    *   **`ProgressionGroupClientLayer.tsx` :**
        *   Ajouter `'use client'`.
        *   Accepter en props les données pré-chargées (`achievementsData`, `leaderboardData`, `questsData`, `userId`, erreurs potentielles).
        *   Définir les `useState` pour `achievementsOpen`, `divisionLeaderboardOpen`, `questsOpen`.
        *   Rendre les boutons déclencheurs avec les `onClick` pour modifier les états.
        *   Rendre les composants Dialog/Sheet correspondants, en leur passant :
            *   Les états `open` et les fonctions `onOpenChange`.
            *   Les données/erreurs pré-chargées (`initialAchievements={achievementsData}`, etc.).
            *   Le `userId` si nécessaire pour les actions.
    *   **`SocialGroupClientLayer.tsx` :**
        *   Ajouter `'use client'`.
        *   Accepter en props : `marketplaceItemsData`, `userCurrencyData`, `inventoryData`, `userId`, erreurs potentielles.
        *   Définir les `useState` pour `marketplaceOpen`, `inventoryOpen`.
        *   Rendre les boutons déclencheurs avec les `onClick`.
        *   Rendre `MarketplaceDialog` et `InventorySheet`, en leur passant :
            *   Les états `open` et `onOpenChange`.
            *   Les données/erreurs pré-chargées.
            *   Le `userId`.

3.  **Refactoriser `ProgressionGroup` en Server Component (`src/components/sidebars/home-sidebar/progression-group.tsx`) :**
    *   Retirer `'use client'`.
    *   Rendre la fonction `async`.
    *   Accepter `userId: string` comme prop.
    *   Utiliser `Promise.allSettled` pour appeler les fonctions de fetch nécessaires (achievements, user progress, division leaderboard, quests).
    *   Extraire les données ou les erreurs de chaque résultat.
    *   Rendre `<ProgressionGroupClientLayer ... />` en lui passant toutes les données récupérées et les erreurs éventuelles.

4.  **Refactoriser `SocialGroup` en Server Component (`src/components/sidebars/home-sidebar/social-group.tsx`) :**
    *   Retirer `'use client'`.
    *   Rendre la fonction `async`.
    *   Utiliser `getSessionUser()` à l'intérieur pour obtenir `userId` (ou accepter `userId` en prop).
    *   Utiliser `Promise.allSettled` pour appeler les fonctions de fetch (marketplace items, user currency, user inventory).
    *   Extraire les données ou les erreurs.
    *   Rendre `<SocialGroupClientLayer ... />` en lui passant les données et erreurs.

5.  **Ajuster `HomeSidebar` (`src/components/sidebars/home-sidebar/home-sidebar.tsx`) :**
    *   S'assurer qu'elle récupère `userId` avec `getSessionUser()`.
    *   Rendre les composants `ProgressionGroup` et `SocialGroup` (qui sont maintenant `async Server Components`), en leur passant le `userId` si nécessaire (pour `ProgressionGroup`).

**Gestion Post-Action (Rafraîchissement des données dans les modales ouvertes) :**

*   Les actions *dans* les dialogues/sheets (ex: acheter un item, consommer un item) qui modifient l'état côté serveur doivent rafraîchir les données affichées dans la modale.
*   Stratégies possibles :
    *   **Re-fetch Ciblé :** La modale appelle la fonction serveur spécifique (ex: `getUserInventory()`) après l'action réussie et met à jour son propre état interne (qui peut être initialisé à partir des props mais ensuite géré localement).
    *   **`router.refresh()` (de `next/navigation`) :** Déclenche un re-fetch des Server Components parents (y compris `ProgressionGroup`/`SocialGroup`), ce qui re-passera les données mises à jour aux Client Components. Peut être plus simple mais rafraîchit plus de choses.
    *   **Mise à Jour Manuelle/Optimiste :** Mettre à jour l'état local immédiatement pour la réactivité, puis éventuellement re-synchroniser.
