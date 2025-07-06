# Plan de développement : Refonte de la modale de complétion

## Objectif
Refondre la modale de fin de challenge pour garantir la fraîcheur des données et améliorer l'expérience utilisateur avec des informations et des commentaires dynamiques, en évitant tout état de chargement visible.

---

### **Partie 1 : Amélioration de la première page (Résultats du challenge)**

*Objectif : Afficher des commentaires dynamiques et un calcul d'XP précis.*

#### 1. Créer la logique de performance
- **Créer la fonction `getCurrentUserXpBoost()`** pour récupérer le multiplicateur d'XP de l'utilisateur.
- **Créer la fonction `getCompletionComments(performanceData)`** qui retournera des commentaires en anglais basés sur les performances :
  - **Entrée :** `{ submissionsCount: number, timeSpentInSeconds: number, xpBoost: number }`
  - **Sortie :** `{ submissionsComment: string | null, timeComment: string | null, xpComment: string | null }`
  - **Règles :**
    - `submissionsCount < 3` -> "Impressive!"
    - `timeSpentInSeconds < 60` -> "So fast!"
    - `xpBoost > 1` -> "XP Boost!"

#### 2. Intégrer la logique dans `ChallengeCompletionInformations`
- Dans `new-completion-dialog.client.tsx`, au moment de l'ouverture de la modale :
  - Appeler `getCurrentUserXpBoost()`.
  - Calculer l'XP final : `finalXp = baseXP * xpBoost`.
  - Appeler `getCompletionComments()` avec les données de performance.
  - Passer l'XP final et les commentaires aux sous-composants pour affichage.

---

### **Partie 2 : Refonte de la deuxième page (Progression des quêtes)**

*Objectif : S'assurer que les données des quêtes sont toujours à jour, **sans état de chargement visible**, en utilisant un système de cache.*

#### 1. Créer un hook de data-fetching avec cache (`useUserQuests`)
- **Créer un nouveau hook `useUserQuests`** qui utilisera `@tanstack/react-query`.
- Ce hook encapsulera l'appel à la fonction `fetchUserQuests()`.
- Il mettra en cache les données sous une clé de requête stable (ex: `['userQuests', userId]`).

#### 2. Intégrer le hook dans le composant client
- Le composant `QuestsProgressionPage` (ou son parent `NewChallengeSuccessDialog`) appellera `useUserQuests()`.
- **Grâce au cache de React Query, les données seront disponibles instantanément** lors de l'ouverture de la modale, évitant tout chargement visible pour l'utilisateur.

#### 3. Mettre en place l'invalidation du cache
- **Principe :** Le cache des quêtes doit être invalidé chaque fois qu'une action est susceptible de faire progresser une quête.
- **Action principale :** Au moment où un challenge est réussi (dans la même logique qui ouvre la modale de complétion), on doit impérativement appeler `queryClient.invalidateQueries({ queryKey: ['userQuests', userId] })`.
- **Conséquence :** React Query marquera les données comme obsolètes. La prochaine fois que le hook `useUserQuests` sera utilisé (ou s'il est déjà monté), il récupérera les données fraîches en arrière-plan, en toute transparence pour l'utilisateur.
