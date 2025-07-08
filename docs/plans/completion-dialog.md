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

---

### Partie 3 : Intégration de la monnaie virtuelle (coins) à la complétion d'un challenge

*Objectif : Créditez l'utilisateur avec une quantité de coins aléatoire lors de la réussite d'un challenge, et affichez cette récompense dans la modale de complétion.*

#### 1. Génération et attribution côté serveur
- Lorsqu'un challenge est complété (dans la logique serveur de complétion) :
  - Calculer l'XP gagné : `xp = 50 * difficulté`.
  - Générer la quantité de coins : `coins = randomInt(0.5 * xp, 1.5 * xp)` (arrondi à l'entier).
  - Appeler la fonction d'attribution : `addCurrency(userId, coins, "Challenge completion")`.
  - Retourner la valeur exacte de coins gagnés à la couche d'appel (client/store).

#### 2. Transmission de la valeur au client
- Lors de la soumission côté client (submit-button) :
  - Récupérer la valeur de coins gagnés depuis la réponse serveur.
  - Stocker cette valeur dans le store global (ex : `useChallengeEditorStore`) ou la passer en props à la page de succès.

#### 3. Affichage dans la page de succès
- Dans la page de succès (`ChallengeCompletionInformations` et sous-composants) :
  - Utiliser la valeur exacte reçue pour afficher le nombre de coins gagnés (plus de valeur en dur).
  - (Optionnel) Ajouter une animation de "reveal" qui s'arrête sur la vraie valeur.

#### 4. Cohérence avec le solde utilisateur
- Le solde total de l'utilisateur (utilisé dans le marketplace, etc.) sera automatiquement à jour, car la fonction d'attribution crédite le solde côté serveur.
- Si besoin, re-fetch le solde après la complétion pour affichage immédiat.

#### 5. Sécurité et robustesse
- Aucune logique de random ou de calcul de coins côté client.
- Aucune possibilité de créditer plusieurs fois pour le même challenge (vérifier côté serveur si besoin).

#### 6. Lien avec le marketplace
- Le solde affiché dans le marketplace doit toujours refléter la réalité du serveur.
- La quantité de coins gagnée lors de la complétion est persistée et affichée partout de façon fiable.

---

### Partie 4 : Intégration des pages de progression de niveau et de streak

#### 1. Page de progression de niveau (`LevelPage`)
- **Objectif** : Afficher la progression réelle de l'utilisateur après la complétion d'un challenge.
- **Données à charger côté serveur** :
  - Niveau actuel (`level`)
  - Expérience actuelle (`currentXp`)
  - Expérience gagnée lors de la complétion (`xpGained`)
- **Calcul côté client** :
  - L'expérience requise pour le prochain niveau est calculée avec la formule : `xpForNextLevel = level * 100`.
- **Flux** :
  - Charger les données côté serveur (dans la modale de complétion ou plus haut dans le layout).
  - Passer ces données en props à la page `LevelPage`.
  - Utiliser ces valeurs pour afficher la progression, gérer l'animation de barre et détecter le passage de niveau.

#### 2. Page de progression de streak (`StreakProgressionPage`)
- **Objectif** : Afficher la progression de streak uniquement dans certains cas clés.
- **Conditions d'affichage** :
  - La page n'est affichée que lorsque l'utilisateur vient de compléter le 1er, 3ème ou 5ème challenge du jour.
- **Données à charger côté serveur** :
  - Tableau du nombre de challenges complétés pour chaque jour de la semaine en cours (`challengesPerDay: number[]`).
  - Index du jour courant (`currentDayIndex`).
- **Flux** :
  - Après la réussite du challenge, récupérer le nombre de challenges déjà complétés aujourd'hui.
  - Si le nombre après la soumission courante est 1, 3 ou 5, afficher la page de streak.
  - Générer le tableau `challengesPerDay` pour la semaine (jours futurs à 0).
  - Passer ces données à la page `StreakProgressionPage` si elle doit être affichée.
