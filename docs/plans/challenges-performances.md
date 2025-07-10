# Plan de Développement : Sécurisation et Optimisation des Challenges

## 1. Contexte

Une analyse approfondie du système de challenges a révélé des problèmes critiques dans trois domaines : la **sécurité**, la **performance** et la **complexité architecturale**. Ce document détaille un plan d'action pour corriger ces problèmes, améliorer l'expérience utilisateur et garantir la maintenabilité du code.

---

## 2. Rapport d'Analyse Détaillé

### 2.1. Audit de Sécurité : Vulnérabilité Critique

- **Constat :** L'exécution du code et la validation des tests sont entièrement effectuées côté client.
- **Flux de la Vulnérabilité :**
    1.  Le client (via `src/core/challenges/submissions/index.client.ts`) exécute le code de l'utilisateur contre les cas de test.
    2.  Le client détermine lui-même si la soumission est un succès (`AcceptedSubmission`).
    3.  Le client envoie le résultat de cette validation à l'action serveur `handleSubmission`.
    4.  L'action serveur (`src/core/challenges/submissions/actions.ts`) fait une confiance aveugle à ce résultat et l'enregistre en base de données sans aucune re-validation.
- **Risque :** Un utilisateur malveillant peut facilement contourner toute la logique du challenge et envoyer une fausse requête de succès au serveur pour valider n'importe quel challenge, débloquant ainsi indûment des récompenses et faussant sa progression. **Ceci est une vulnérabilité critique.**

### 2.2. Audit de Performance : Goulot d'Étranglement Majeur

- **Constat :** L'exécution du code Python côté client est extrêmement inefficace et génère un trafic réseau considérable.
- **Cause Racine :** La fonction `compilePython` (dans `src/core/compiler/index.ts`) utilise Pyodide. À **chaque clic** sur le bouton "Exécuter", l'intégralité de l'environnement Pyodide est téléchargée et initialisée depuis un CDN.
- **Impact :**
    - **Latence Élevée :** L'exécution du code est très lente pour l'utilisateur.
    - **Trafic Réseau Massif :** Chaque exécution peut générer des dizaines, voire des centaines de requêtes pour charger les différents fichiers de Pyodide.
    - **Mauvaise Expérience Utilisateur :** Le processus de débogage itératif devient pénible et frustrant.

### 2.3. Audit de Complexité : Architecture Illogique

- **Constat :** La gestion de l'état côté client est fragmentée, redondante et difficile à suivre.
- **Problèmes Structurels :**
    - **Multiples Couches de "Providers" :** La page utilise au moins trois fournisseurs de contexte (`ChallengeProvider`, `ChallengeStatusProvider`, `ChallengeEditorProvider`), ce qui alourdit l'arbre des composants.
    - **Multiples "Stores" Zustand :** Au moins trois stores Zustand (`useChallengeStore`, `useChallengeUIStore`, `useChallengeEditorStore`) coexistent pour gérer l'état de la même page.
    - **Redondance des Données :** Des données critiques comme l'objet `challenge` sont présentes à la fois dans un contexte React et dans un store Zustand, créant une confusion sur la source de vérité.
- **Impact :** Le code est difficile à maintenir, à déboguer et à faire évoluer.

---

## 3. Plan de Développement Stratégique

Ce plan est conçu pour être mis en œuvre de manière itérative, en commençant par les problèmes les plus critiques.

### Phase 1 : Correction de la Faille de Sécurité (Priorité Maximale)

- **Objectif :** Déplacer toute la logique de validation des soumissions côté serveur pour garantir l'intégrité des résultats.
- **Actions :**
    1.  **Modifier l'action `handleSubmission` :**
        -   Elle ne devra plus accepter un objet `submission` complet du client.
        -   Elle devra accepter uniquement le `challengeId`, le `code` de l'utilisateur et le `language`.
    2.  **Créer un service de compilation sécurisé côté serveur :**
        -   Ce service recevra le code et le `challengeId`.
        -   Il récupérera les cas de test officiels et sécurisés depuis la base de données.
        -   Il exécutera le code de l'utilisateur dans un environnement isolé et sécurisé (ex: un conteneur Docker, une lambda function) pour chaque cas de test.
        -   Il comparera les résultats et déterminera si la soumission est valide.
    3.  **Mettre à jour la base de données :** C'est seulement après une validation réussie côté serveur que l'action `handleSubmission` enregistrera la soumission.
    4.  **Mettre à jour le client :** Le `SubmitButton` et le hook associé appelleront la nouvelle action serveur et afficheront le résultat fiable retourné par le serveur.

### Phase 2 : Optimisation des Performances de l'Exécution Client (Pyodide)

- **Objectif :** Optimiser drastiquement l'exécution du code Python côté client en éliminant le rechargement constant de Pyodide, tout en garantissant un état d'exécution propre à chaque fois.
- **Problème sous-jacent :** La réinitialisation complète de Pyodide à chaque clic était une solution de contournement pour éviter la **pollution de l'état global** entre les exécutions. La documentation de Pyodide confirme que par défaut, `runPythonAsync` utilise `pyodide.globals`, un espace de noms global partagé, ce qui cause ce problème.
- **Actions :**
    1.  **Mettre en place un Gestionnaire d'Instance Pyodide :**
        -   **Action :** Créer un singleton ou un contexte React pour charger et gérer une unique instance de `pyodide`. Cette instance sera chargée **une seule fois** au début de la session du challenge.
        -   **Impact :** Élimine le téléchargement répétitif des fichiers de Pyodide depuis le CDN.
        -   **UI :** Un indicateur de chargement clair doit être affiché à l'utilisateur pendant cette initialisation unique.
    2.  **Implémenter un Environnement d'Exécution Isolé via l'API Pyodide :**
        -   **Action :** Refactoriser la fonction `compilePython` pour utiliser la solution d'isolation fournie par l'API Pyodide.
        -   **Solution Technique (Recommandée et Robuste) :** Pour chaque appel à `runPythonAsync`, nous allons créer un contexte d'exécution isolé en fournissant un dictionnaire de `globals` vide.
        -   **Exemple d'implémentation :**
            ```javascript
            // Créer un dictionnaire Python vide pour servir de scope global
            const globals = pyodide.toPy({});

            // Exécuter le code dans ce scope isolé
            await pyodide.runPythonAsync(code, { globals });

            // Optionnel mais recommandé : libérer la mémoire du proxy
            globals.destroy();
            ```
        -   **Avantage :** Cette approche, confirmée par la documentation de l'API, garantit qu'aucune variable, importation ou sortie (`stdout`) ne peut "fuir" d'une exécution à l'autre. C'est la solution la plus propre pour résoudre la racine du problème de pollution de l'état.

### Phase 3 : Refactorisation de la Gestion de l'État

- **Objectif :** Simplifier, centraliser et unifier la gestion de l'état côté client.
- **Actions :**
    1.  **Unification des Stores Zustand :**
        -   Fusionner les trois stores (`useChallengeStore`, `useChallengeUIStore`, `useChallengeEditorStore`) en un seul store `useChallengePageStore`.
        -   Utiliser l'approche "slices" de Zustand pour organiser logiquement l'état (ex: `uiSlice`, `editorSlice`).
    2.  **Élimination des Providers Redondants :**
        -   Supprimer les `ChallengeProvider` et `ChallengeStatusProvider`.
        -   L'état initial (challenge, user, etc.) sera récupéré dans le `layout.tsx` et servira à hydrater le store Zustand unifié.
    3.  **Clarification du Flux de Données :**
        -   **Source de vérité :** Le store Zustand unifié deviendra la seule source de vérité pour tout l'état côté client.
        -   **Hydratation :** Le store sera initialisé avec les données du serveur.
        -   **Mutations :** Les actions de l'utilisateur appelleront des fonctions du store, qui à leur tour appelleront des actions serveur pour persister les changements.

---

## 4. Conclusion

L'exécution de ce plan en trois phases permettra de résoudre les problèmes fondamentaux de l'architecture actuelle et de bâtir une fondation solide, sécurisée et performante pour l'avenir des challenges.
