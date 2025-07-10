
# Plan de Développement : Nouvelle Logique de Compilation et d'Exécution de Code E2B

Ce plan détaille l'implémentation de la nouvelle architecture de compilation et d'exécution de code, en exploitant les sandboxes E2B pour la sécurité et la performance, et en intégrant un pré-contrôle côté client pour l'efficacité.

## Phase 2.0 : Optimisation de l'Exécution du Code (Remplacement de Pyodide par E2B - Phase Initiale)

**Objectif Principal :** Remplacer Pyodide pour l'exécution de code côté client par une solution basée sur E2B Sandbox côté serveur, tout en introduisant un pré-contrôle côté client pour détecter les boucles infinies et améliorer l'expérience utilisateur.

### Étapes de Refactoring Détaillées :

1.  **Mise en place de l'Infrastructure E2B (Prérequis)**
    *   Créer un service ou un wrapper côté serveur pour interagir avec l'API E2B. Ce service sera responsable de la création, de la connexion, de la reprise, de la mise en pause et de la destruction des sandboxes.
    *   Implémenter la gestion des clés API E2B de manière sécurisée (variables d'environnement sur Vercel).
    *   Établir un mécanisme de pool de sandboxes E2B si nécessaire pour la réutilisation, potentiellement en utilisant Redis pour suivre l'état des sandboxes et leurs métadonnées (userId, challengeId).

2.  **Refactoring de l'Action `executeCode` et `submitChallengeCode` (Côté Serveur)**
    *   Unifier la logique d'exécution de code pour les actions "Run" (test local) et "Submit" (soumission finale) via le même pipeline serveur basé sur E2B.
    *   Modifier l'action serveur existante (ou créer une nouvelle) qui recevra le `code` de l'utilisateur, la `language`, et les `testCases` (ou l'ID du challenge pour récupérer les tests).
    *   Pour la soumission, `submitChallengeCode` ne recevra plus le résultat pré-calculé `success` du client. Elle appellera la logique d'exécution unifiée.
    *   Dans cette action, la logique sera :
        *   Obtenir ou créer une sandbox E2B réutilisable pour l'utilisateur et le challenge (utiliser les métadonnées `userId` et `challengeId`).
        *   Connecter à la sandbox.
        *   Envoyer le code de l'utilisateur et les tests à la sandbox E2B.
        *   Exécuter le code de l'utilisateur dans un environnement isolé au sein de la sandbox E2B, en utilisant la fonction `runPythonAsync({ code, globals: {} })` ou l'équivalent pour d'autres langages, en s'assurant d'un environnement propre pour chaque exécution.
        *   Récupérer les résultats de l'exécution et des tests depuis la sandbox.
        *   Vérifier la validité des résultats (comparaison des outputs réels avec les outputs attendus).
        *   Mettre en pause (`pause()`) la sandbox E2B après l'exécution pour économiser des coûts, et la marquer comme disponible pour une réutilisation.
        *   Enregistrer les résultats autoritaires (succès/échec, outputs) dans la base de données via Payload CMS (uniquement pour les soumissions finales).
        *   Retourner ces résultats autoritaires au client.

3.  **Implémentation du Pré-contrôle Côté Client (Web Worker)**
    *   Créer un Web Worker (par exemple, dans `src/core/compiler/workers/`) dédié à l'exécution préliminaire du code.
    *   Ce Web Worker utilisera une version *légère* de Pyodide (ou un autre interpréteur JavaScript/TypeScript embarqué) uniquement pour la détection de boucles infinies et l'analyse syntaxique de base.
    *   Le Web Worker ne fera *jamais* d'appels réseau et n'aura *pas* accès aux données sensibles.
    *   Modifier la fonction `handleRun` (`src/core/compiler/challenge-editor/index.tsx` et `src/core/compiler/hooks/use-run-code.ts`) pour :
        *   Envoyer le code à exécuter au Web Worker.
        *   Attendre la réponse du Web Worker (succès, détection de boucle infinie, erreur syntaxique).
        *   Si une boucle infinie est détectée côté client, afficher immédiatement une erreur à l'utilisateur et empêcher l'envoi au serveur.
        *   Si le pré-contrôle est réussi, alors (et seulement alors) appeler l'action serveur unifiée d'exécution (`executeCode` ou `submitChallengeCode`).
        *   Afficher les résultats renvoyés par le serveur.

4.  **Refactoring du Store Zustand `useChallengeEditorStore` (`src/core/compiler/challenge-editor/store.ts`)**
    *   Supprimer ou adapter toutes les logiques liées à l'exécution directe du code via Pyodide ou `submitCode` (`compileCode`, `submitCode` imports).
    *   Mettre à jour les états `isLoadingRun` et `isLoadingSubmit` pour refléter les interactions avec le Web Worker (pré-run) et l'action serveur E2B.
    *   Le store gérera principalement l'état de l'UI (code actuel, langue, onglets du terminal, etc.) et affichera les résultats **fournis par le serveur**.

5.  **Mise à jour des Composants UI**
    *   Modifier `ChallengeIDE` (`src/core/compiler/challenge-editor/index.tsx`) et les composants connexes pour qu'ils interagissent avec le nouveau `useRunCode` (qui lui-même appelle le Web Worker et l'action serveur).
    *   Assurer que l'UI affiche correctement les messages d'erreur du pré-contrôle client et les résultats finaux du serveur.

6.  **Stratégie de Coût E2B et Maintenance**
    *   Implémenter une stratégie de `kill()` aggressive pour les sandboxes E2B inactives après une certaine période ou un certain nombre d'exécutions pour minimiser les coûts.
    *   Surveiller l'utilisation et les coûts d'E2B pour ajuster les seuils de `pause()`/`kill()`.
    *   Utiliser les métadonnées (`userId`, `challengeId`) pour la réutilisation intelligente des sandboxes, potentiellement avec un mécanisme de LRU cache si le nombre d'utilisateurs actifs simultanément est très élevé.

## Phase 2.1 : Optimisation Avancée et Réduction des Coûts (Architecture Évolutive)

**Objectif Principal :** Maximiser la performance, la scalabilité et l'efficacité des coûts du système de compilation en intégrant des concepts d'architecture distribuée et de gestion intelligente des ressources.

### Principes Clés :
*   **Découplage Asynchrone :** Séparer la réception des requêtes de leur traitement pour améliorer la réactivité et la résilience.
*   **Gestion Intelligente des Ressources :** Optimiser l'utilisation des sandboxes E2B pour minimiser les coûts de création et d'exécution.
*   **Validation Progressive :** Éliminer les requêtes inutiles le plus tôt possible dans le pipeline.
*   **Observabilité Continue :** Surveiller les métriques clés pour prendre des décisions informées et proactives.

### Étapes de Refactoring Détaillées :

1.  **Mise en place d'une File d'Attente de Soumissions (Message Queue)**
    *   Choisir et intégrer une solution de file d'attente robuste (ex: Redis Streams via Vercel KV, ou un service dédié comme AWS SQS/Kafka si l'échelle l'exige).
    *   Modifier l'action serveur `executeCode` (ou créer une nouvelle action d'entrée) pour qu'elle ne déclenche plus directement l'exécution E2B. Au lieu de cela, elle va :
        *   Valider la requête initiale.
        *   Générer un `requestId` unique (pour le suivi de l'exécution, qu'il s'agisse d'un "run" ou d'un "submit").
        *   Pousser le `code`, `language`, `challengeId`, `userId`, `requestId`, et le `type` de la requête (e.g., "run", "submit") dans la file d'attente.
        *   Retourner immédiatement le `requestId` au client.

2.  **Développement des Workers d'Exécution Asynchrones**
    *   Créer un ou plusieurs *workers* sans serveur (Vercel Functions dédiées) qui écoutent la file d'attente de soumissions.
    *   Chaque worker sera responsable de :
        *   Extraire une soumission de la file.
        *   Appeler le service de gestion de sandboxes E2B (voir étape suivante).
        *   Traiter les résultats de l'exécution E2B.
        *   Enregistrer les résultats finaux dans Payload CMS (uniquement si le `type` est "submit").
        *   Publier les résultats dans une nouvelle "file d'attente de résultats" (ou un canal pub/sub pour les WebSockets).

3.  **Implémentation d'un Service de Gestion de Pool de Sandboxes E2B Avancé**
    *   **Service Autonome :** Isoler la logique de gestion des sandboxes dans un module ou un service dédié (ex: `src/core/compiler/e2b-sandbox-manager.ts`).
    *   **Pool "Chaud" (Warm Pool) :** Le manager maintiendra un pool configuré de sandboxes E2B pré-initialisées et prêtes à l'emploi pour les langages les plus courants. Ces sandboxes seront maintenues en état `idle` (minimisant le coût mais étant instantanément disponibles).
    *   **Allocation Intelligente :** Lors d'une demande d'exécution :
        *   Priorité 1 : Tenter de réutiliser une sandbox existante `pausée` et correspondant au `userId` et `challengeId` spécifiques (pour la persistance du contexte).
        *   Priorité 2 : Si échec, tenter de réutiliser une sandbox `idle` du pool chaud correspondant au `language` requis.
        *   Priorité 3 : Si échec, créer une nouvelle sandbox E2B.
    *   **Gestion du Cycle de Vie et Coûts :**
        *   `pause()` agressive immédiatement après chaque exécution, sauf si le manager détecte une forte probabilité de réutilisation immédiate.
        *   Implémenter une stratégie de `kill()` basée sur LRU (Least Recently Used) ou un TTL (Time To Live) configurable pour les sandboxes `pausées`. Un job cron régulier (fonction Vercel) parcourra et `kill()`era les sandboxes inutilisées pour optimiser le budget "créations".

4.  **Mise en place de Notifications en Temps Réel (WebSockets / SSE)**
    *   Intégrer une solution de communication en temps réel (ex: Ably, Pusher, ou un serveur WebSocket auto-hébergé simplifié si l'infrastructure le permet).
    *   Le client s'abonnera à un canal spécifique (basé sur le `requestId` et/ou `userId`).
    *   Les workers d'exécution, après avoir enregistré les résultats (pour les soumissions) ou simplement traité l'exécution, publieront ces résultats sur le canal temps réel.
    *   Le client mettra à jour son UI dès réception des résultats.

5.  **Implémentation du Cache Serveur Intelligent**
    *   Utiliser Redis (via Vercel KV ou un service externe) pour un cache distribué des résultats de soumissions.
    *   **Génération de Clé :** Créer une clé de cache unique (ex: `SHA256(code + challengeId + language)`).
    *   **Logique de Cache :** Avant de pousser une soumission dans la file d'attente (dans l'action serveur d'entrée), vérifier la présence de la clé dans le cache.
    *   **Hit du Cache :** Si un résultat est trouvé dans le cache et est toujours valide (pas expiré, challenge non modifié), retourner immédiatement ce résultat au client via le système de notification en temps réel, sans passer par E2B ni les files d'attente.
    *   **Invalidation :** Invalider les entrées de cache pertinentes lorsqu'un challenge est mis à jour dans Payload CMS.

6.  **Optimisations Spécifiques aux Challenges (Tiered Execution)**
    *   Introduire un champ `executionStrategy` (ou similaire) dans la collection `Challenges` de Payload CMS.
    *   Ce champ pourra indiquer si un challenge est "léger" ou "complexe".
    *   **Challenges Légers :** Pour des défis très courts avec des tests simples, implémenter une exécution directe et rapide sur une Vercel Edge Function (`Level 1` validation). Cela pourrait utiliser un `vm` Node.js pour JavaScript/TypeScript ou un très petit interpréteur si possible. Ces exécutions rapides se feraient *avant* même la file d'attente E2B, retournant des résultats quasi instantanés pour les cas triviaux et réduisant la charge sur E2B.
    *   **Images E2B Pré-construites :** Pour les langages populaires ou les défis utilisant des bibliothèques spécifiques, créer et utiliser des images E2B personnalisées avec les dépendances pré-installées.

7.  **Amélioration de l'Observabilité et du Contrôle des Coûts**
    *   **Tableaux de Bord :** Développer des tableaux de bord (via des outils comme Grafana, Datadog ou des dashboards Vercel/E2B customisés) pour visualiser en temps réel :
        *   Le nombre de "créations" de sandboxes E2B.
        *   Les "secondes d'exécution" E2B.
        *   Le nombre de requêtes passées par chaque niveau de validation (Web Worker, Edge Function, E2B).
        *   Les hits/miss du cache.
        *   La taille des files d'attente.
    *   **Alertes Granulaires :** Configurer des alertes sur les dépassements de seuils budgétaires E2B ou Vercel.
    *   **Ajustement Dynamique :** En fonction des métriques, permettre des ajustements automatiques (par exemple, augmenter/diminuer la taille du pool chaud E2B, ajuster la durée de vie des sandboxes `pausées`).
    *   **Journalisation Approfondie :** Enregistrer les détails de chaque exécution (durée, ressources consommées, type de validation utilisé) pour une analyse post-mortem et une optimisation continue.

### Stratégie de Commit Mise à Jour :

La stratégie de commit doit être étendue pour refléter la granularité et la complexité de cette nouvelle architecture.

*   **Commit 1: `feat(e2b): Add E2B infrastructure and basic service wrapper`**
    *   Initialisation du service `e2b-sandbox-manager` (sans le pooling intelligent avancé pour l'instant).
    *   Configuration des variables d'environnement E2B.

*   **Commit 2: `refactor(challenges): Secure and unify code execution with server-side E2B`**
    *   Modification des actions serveur pour gérer à la fois les requêtes "Run" et "Submit" via E2B.
    *   Suppression de la dépendance au `success` côté client pour les soumissions.

*   **Commit 3: `feat(compiler): Implement client-side pre-run with Web Worker for infinite loop detection`**
    *   Création du Web Worker pour le pré-contrôle.
    *   Intégration du Web Worker dans `useRunCode` et `ChallengeIDE`.

*   **Commit 4: `refactor(compiler): Update challenge editor Zustand store for E2B integration`**
    *   Nettoyage des dépendances Pyodide et des logiques d'exécution directes dans le store.
    *   Ajustement des états de chargement pour les actions "Run" et "Submit".

*   **Commit 5: `feat(e2b): Implement advanced E2B sandbox pooling and lifecycle management`**
    *   Amélioration du `e2b-sandbox-manager` avec le pool chaud, l'allocation intelligente, et les stratégies avancées de `pause()`/`kill()`.

*   **Commit 6: `feat(infra): Introduce submission message queue and async workers`**
    *   Intégration de la file d'attente de messages (Redis Streams ou équivalent).
    *   Modification de l'action d'entrée pour pousser vers la file (pour "Run" et "Submit").
    *   Création des workers asynchrones pour traiter les requêtes de la file.

*   **Commit 7: `feat(realtime): Add WebSocket/SSE for real-time code execution results`**
    *   Mise en place du service de notification en temps réel.
    *   Intégration de la publication des résultats par les workers (pour "Run" et "Submit").
    *   Abonnement du client aux résultats via WebSocket/SSE.

*   **Commit 8: `feat(cache): Implement intelligent server-side code execution result cache`**
    *   Mise en place de Redis/Vercel KV pour le cache des résultats.
    *   Intégration de la logique de vérification et d'invalidation du cache (pour "Run" et "Submit").

*   **Commit 9: `feat(challenges): Add tiered execution strategy for simple challenges`**
    *   Ajout du champ `executionStrategy` dans Payload CMS.
    *   Implémentation de la logique de validation de `Level 1` (Edge Function) pour les challenges légers.

*   **Commit 10: `chore(observability): Set up comprehensive cost and performance monitoring`**
    *   Intégration des outils de monitoring et d'alerting.
    *   Configuration des tableaux de bord pour E2B et Vercel.

*   **Commit 11: `chore: Finalize UI components and end-to-end testing`**
    *   Ajustements finaux de l'UI.
    *   Tests complets du flux d'exécution et de soumission avec la nouvelle architecture.
    *   Tests de performance et de charge.

*   **Commit 12: `docs(architecture): Update new-code-compiler.md with final architecture`**
    *   Assurer que la documentation est à jour avec toutes les décisions et implémentations.

