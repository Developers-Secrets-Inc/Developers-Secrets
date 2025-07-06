# Plan de développement : Refonte du système de quêtes v2

## Objectif
Simplifier l'architecture du système de quêtes, améliorer ses performances et le rendre plus maintenable.

---

### **[✅ Terminé] Partie 1 : Optimisation du fetching des données de base (`index.ts`)**

*Objectif : Réduire drastiquement les appels à la base de données pour récupérer la liste des quêtes en utilisant un cache persistant.*

#### 1. Constat actuel
- La fonction `getQuests()` dans `src/core/gamification/quests/index.ts` est appelée par toutes les autres fonctions du fichier (`getQuestById`, `getQuestByType`, `getRandomQuest`).
- À chaque appel, elle exécute une requête à la base de données via `payload.find({ collection: 'quests' })`.
- La liste des quêtes disponibles est relativement statique et n'a pas besoin d'être récupérée en temps réel à chaque requête utilisateur.

#### 2. Solution proposée : Intégration de `unstable_cache`
- **Action :** Envelopper l'appel `payload.find` dans la fonction `getQuests` avec `unstable_cache` de `next/cache`.
- **Configuration du cache :**
  - **Revalidation :** Mettre en place une revalidation temporelle, par exemple toutes les heures (`revalidate: 3600`).
  - **Tags :** Ajouter un tag de cache spécifique (ex: `['quests']`) pour permettre une revalidation manuelle si nécessaire (par exemple, après une mise à jour des quêtes dans le back-office Payload).

#### 3. Bénéfices attendus
- **Performance :** Les appels subséquents à `getQuests` (et donc à toutes les fonctions qui en dépendent) retourneront les données depuis le cache, ce qui sera quasi-instantané.
- **Réduction de la charge BDD :** La base de données ne sera sollicitée qu'une fois par heure pour cette requête, au lieu de potentiellement des centaines de fois.
- **Simplicité :** Le changement est localisé à une seule fonction et transparent pour le reste de l'application.

---

### **Partie 2 : Refactorisation et Fiabilisation de la gestion des quêtes utilisateur (`user-quests/index.ts`)**

*Objectif : Corriger les problèmes de performance, de fiabilité et de robustesse dans la logique de manipulation des quêtes spécifiques à un utilisateur.*

#### 1. Performance : Résolution du problème "N+1 Query"
- **Constat :** La fonction `getUserQuests` déclenche un nombre excessif d'appels à la base de données. Pour chaque quête utilisateur récupérée, un appel supplémentaire est fait pour récupérer les détails de la quête parente (`getQuestById`), qui lui-même rappelle la base de données.
- **Solution :** Utiliser le paramètre `depth: 1` dans la requête `payload.find` de `getUserQuests`. Payload se chargera de "populer" automatiquement le document `quest` associé, éliminant ainsi le besoin de la fonction `convertUserQuest` et des appels BDD en cascade.

#### 2. Fiabilité : Prévention des "Race Conditions" (Mis en attente)
- **Constat :** La fonction `increaseUserQuestProgression` suit un schéma "lecture puis écriture" non atomique, source de potentielles race conditions.
- **Décision :** La solution initialement proposée (via un hook `beforeChange`) a été jugée trop complexe pour l'instant. Le risque de race condition est considéré comme faible et acceptable. L'implémentation actuelle est conservée et ce point est mis en attente pour une potentielle réévaluation future si le problème se manifeste en pratique.

#### 3. Robustesse : Amélioration de la gestion des erreurs
- **Constat :** Plusieurs fonctions, comme `getUserQuest` et `increaseUserQuestProgression`, peuvent échouer de manière non contrôlée si une quête n'est pas trouvée (par exemple, `userQuest.docs[0]` peut être `undefined`).
- **Solution :**
  - Ajouter des vérifications systématiques pour s'assurer que les données existent avant de tenter d'y accéder.
  - Retourner `null` ou `undefined` de manière explicite lorsqu'un objet n'est pas trouvé.
  - Envelopper la logique des fonctions dans des blocs `try...catch` pour capturer les erreurs et les logger ou les remonter de manière contrôlée.

#### 4. Qualité du code : Factorisation de la logique redondante
- **Constat :** L'initialisation de Payload (`getPayload`) et la construction des clauses `where` sont répétées dans de nombreuses fonctions.
- **Solution :**
  - Instancier `payload` une seule fois dans le fichier ou le passer en paramètre.
  - Créer des fonctions utilitaires pour générer les clauses `where` communes afin de réduire la duplication et centraliser la logique.

---

### **Partie 3 : Décomposition et refactorisation du fichier "God Object" (`actions.ts`)**

*Objectif : Décomposer le fichier monolithique `actions.ts` en modules plus petits, chacun avec une responsabilité unique, pour améliorer la lisibilité, la maintenabilité et les performances.*

#### 1. Problème principal : Centralisation excessive et non-respect du principe de responsabilité unique
- **Constat :** Le fichier `actions.ts` mélange au moins cinq responsabilités distinctes : actions utilisateur directes, récupération de données pour l'UI, gestionnaires d'événements, logique de cron, et logique métier interne. Il est devenu un "God Object" difficile à maintenir.
- **Solution :** Le refactoring ne consistera pas seulement à nettoyer le code, mais à repenser fondamentalement son architecture en le divisant en plusieurs fichiers/modules.

#### 2. Axe de refactorisation n°1 : Extraire la logique métier dupliquée
- **Constat :** La logique pour déterminer les droits de remplacement de quêtes (basée sur le rôle de l'utilisateur et le décompte quotidien) est dupliquée dans `replaceUserQuest` et `getQuestReplacementInfo`.
- **Solution :** Créer un nouveau module de "policy" (ex: `src/core/gamification/quests/policy.ts`) qui exportera une fonction unique, comme `getUserQuestReplacementPolicy(userId)`. Cette fonction centralisera la logique et sera appelée par les actions qui en ont besoin.

#### 3. Axe de refactorisation n°2 : Simplifier les fonctions monolithiques
- **Constat :** Des fonctions comme `replaceUserQuest` sont extrêmement longues, enchaînant des dizaines d'étapes (authentification, fetchs multiples, logique conditionnelle, mises à jour BDD).
- **Solution :** Décomposer ces fonctions en plus petites fonctions internes (préfixées par `_` si elles ne sont pas exportées) ou en les plaçant dans des modules de logique métier. Par exemple, `replaceUserQuest` serait décomposé en étapes claires : validation des droits, recherche d'un remplaçant, exécution de l'échange, mise à jour des stats.

#### 4. Axe de refactorisation n°3 : Généraliser la logique des gestionnaires d'événements
- **Constat :** Les fonctions `handleExperienceGainForQuests` et `handleChallengeCompletionForQuests` sont presque identiques.
- **Solution :** Créer une fonction générique unique, comme `handleQuestProgression(userId, questType, incrementValue)`. Les différents gestionnaires d'événements (qui seront peut-être déplacés dans un fichier dédié, ex: `events.ts`) appelleront cette fonction centrale, évitant ainsi la duplication de code.

#### 5. Axe de refactorisation n°4 : Optimiser les performances
- **Constat :** De nombreux appels `await` sont effectués en série alors qu'ils pourraient être parallélisés.
- **Solution :** Utiliser `Promise.all` pour exécuter les opérations asynchrones indépendantes (comme la récupération des informations de gamification et les informations utilisateur) en parallèle, réduisant ainsi le temps d'attente total.

#### 6. Axe de refactorisation n°5 : Éliminer les "correctifs temporaires"
- **Constat :** Le code contient des solutions de contournement (ex: `await getRandomQuest(1, 'easy')`) qui introduisent des bugs potentiels.
- **Solution :** Remplacer ces correctifs par une récupération de données robuste, en s'appuyant sur les optimisations de la **Partie 2** (notamment l'utilisation de `depth: 1` pour garantir que les données de quête sont toujours entièrement chargées).

---

### **[✅ Terminé] Partie 4 : Modernisation des hooks React Query (`use-quests.ts`)**

*Objectif : Simplifier le code des hooks côté client, le rendre plus robuste et améliorer l'expérience utilisateur en adoptant les patterns avancés de React Query.*

#### 1. Problème principal : Réimplémentation manuelle de la logique de mutation
- **Constat :** Le hook `useQuestActions` n'utilisait pas le hook `useMutation` de React Query. Il gérait manuellement l'état de chargement avec `useState` pour `isReplacingQuestId`, les erreurs via des blocs `try...catch` et les appels asynchrones.
- **Impact :** Le code était verbeux, complexe et la gestion d'état était incomplète, dégradant l'expérience utilisateur.

#### 2. Solution implémentée : Adoption de `useMutation` pour toutes les actions
- **Action :** Les fonctions manuelles `replaceQuest` et `completeQuest` ont été remplacées par deux instances de `useMutation` (`replaceQuestMutation` et `completeQuestMutation`).
- **Gestion de l'état :** La gestion de l'état de chargement est désormais entièrement déléguée à React Query. `isReplacingQuestId` est maintenant dérivé de `replaceQuestMutation.isPending`, éliminant le besoin de `useState`.
- **Gestion des erreurs :** Les blocs `try...catch` ont été supprimés au profit des callbacks `onError` des mutations, qui affichent des toasts d'erreur de manière centralisée.
- **Correction du bug de `completeQuest` :** La `mutationFn` de `completeQuestMutation` résout l'erreur de type en récupérant l'objet `UserQuest` complet depuis le cache de React Query (`queryClient.getQueryData()`) avant d'appeler l'action serveur.

#### 3. Stratégie d'invalidation du cache
- **Action :** Une fonction `invalidateQuestQueries` a été créée pour invalider à la fois les quêtes et les informations de remplacement.
- **Intégration :** Cette fonction est appelée dans les callbacks `onSuccess` de chaque mutation, garantissant que l'interface utilisateur se met à jour automatiquement avec des données fraîches après chaque action réussie.

---

### **Partie 5 : Implémentation du pattern d'hydratation SSR**

*Objectif : Mettre en place le flux de données du serveur vers le client pour garantir un chargement instantané des quêtes, en utilisant l'architecture existante.*

#### 1. Le flux de données
- **Étape 1 : Composant Serveur Parent (ex: `home-sidebar.tsx` ou un layout)**
  - Ce composant est responsable de l'appel `await fetchUserQuests()`.
  - Il rend ensuite `ProgressionGroupClientLayer` en lui passant les `initialQuestsData` en prop.

- **Étape 2 : Composant Client Intermédiaire (`progression-group-client-layer.tsx`)**
  - Ce composant reçoit la prop `initialQuestsData`.
  - Sa seule responsabilité est de la transmettre à son tour à la prop `initialQuests` du composant `QuestsDialog` lorsqu'il est rendu.

- **Étape 3 : Composant Client Final (`quests-dialog.tsx`)**
  - Le `QuestsDialog` sera refactorisé pour accepter la prop `initialQuests`.
  - Il passera ces données initiales directement au hook `useQuests`.

- **Étape 4 : Le Hook (`use-quests.ts`)**
  - La signature du hook `useQuests` sera modifiée pour accepter `initialData`.
  - Ce `initialData` sera utilisé pour hydrater le cache de React Query via l'option du même nom, assurant que les données sont disponibles instantanément au premier rendu, sans aucun chargement visible.

---

### **Partie 6 : Gestion du cycle de vie des quêtes et suivi des statistiques**

*Objectif : Mettre en place un système robuste qui nettoie quotidiennement les quêtes non pertinentes tout en conservant une trace permanente des accomplissements de l'utilisateur pour les futurs achievements.*

#### 1. Problème : Pollution de la base de données et perte des statistiques
- **Constat :** Sans une stratégie de nettoyage, la collection `user-quests` grossirait indéfiniment. Cependant, une suppression pure et simple ferait perdre toute trace des quêtes accomplies, rendant impossible la création d'achievements basés sur le volume (`Compléter 100 quêtes`, `Maîtriser 50 quêtes difficiles`, etc.).

#### 2. Solution en deux temps : Dissocier le "nettoyage" du "suivi"

**Axe 1 : Le cycle de vie quotidien des quêtes**
- **Action :** La fonction responsable d'assigner les nouvelles quêtes quotidiennes (actuellement `setUserDailyQuests`) doit être modifiée pour suivre un processus "Nettoyer puis Ajouter".
- **Implémentation :**
  1. À la première connexion d'un utilisateur pour une nouvelle journée (logique déjà gérée par `areUserDailyQuestsExpired`), le système doit d'abord appeler `deleteAllUserQuests(userId)` pour supprimer **toutes** les entrées de la veille (complétées ou non).
  2. Ce n'est qu'après ce nettoyage que le système appellera `addMultipleUserQuests` pour insérer le nouveau set de quêtes pour la journée.
- **Résultat :** La collection `user-quests` reste légère et ne contient que les quêtes pertinentes pour la session en cours.

**Axe 2 : Création d'une collection dédiée au suivi des statistiques (`UserQuestsStatistics`)**
- **Action :** Pour éviter le couplage et la surcharge de la collection `UserGamification`, nous allons créer une nouvelle collection `UserQuestsStatistics` qui aura une relation `one-to-one` avec un utilisateur.
- **Schéma de la nouvelle collection `UserQuestsStatistics` :**
  - `user`: Relation (hasOne) vers la collection `users`.
  - `totalQuestsCompleted`: Nombre (défaut: 0).
  - `easyQuestsCompleted`: Nombre (défaut: 0).
  - `mediumQuestsCompleted`: Nombre (défaut: 0).
  - `hardQuestsCompleted`: Nombre (défaut: 0).
- **Implémentation :**
  1. La logique d'incrémentation de ces compteurs doit être intégrée dans l'action `completeUserQuest`.
  2. Lorsqu'une quête est marquée comme complétée avec succès, on doit exécuter une opération "find-or-create" pour le document de statistiques de l'utilisateur, puis incrémenter les compteurs appropriés.
  3. **Crucial :** Cette opération de mise à jour des compteurs doit être atomique pour éviter les race conditions, en utilisant les opérateurs d'incrémentation de la base de données si possible.

#### 3. Bénéfices
- **Découplage Fort :** Le système de quêtes devient plus autonome. Ses statistiques ne polluent pas les autres systèmes de gamification.
- **Base de données saine :** Les collections restent ciblées sur leur responsabilité unique (`user-quests` pour l'état quotidien, `UserQuestsStatistics` pour l'historique agrégé).
- **Évolutivité :** Le système est prêt pour l'implémentation future de nombreux achievements. Pour les obtenir, il suffira d'interroger la collection `UserQuestsStatistics`.
