# Audit Technique : Système de Cours (Navigation, Interactions, Performance, Sécurité)

## 1. Performance & Instantanéité

### 1.1. Navigation (Accès aux cours, changement d'onglet, navigation entre parties)
- **Problèmes** :
  - Navigation basée sur des server components (Next.js) : chaque changement de partie/onglet déclenche un rechargement serveur (SSR/SSG).
  - Données utilisateur (progression, statut, réactions) fetchées côté serveur à chaque navigation, même si peu de changements.
  - Composants serveur orchestrant des sous-composants asynchrones, multipliant les fetchs.
- **Conséquences** :
  - Latence perceptible à chaque navigation (non instantané).
  - Transitions non fluides, pas d'optimistic UI, pas de transitions animées.
  - Données utilisateur parfois "stales" ou nécessitant un refetch manuel.
- **Problèmes techniques** :
  - Pas de cache client (React Query/SWR) pour les données critiques.
  - Pas de prefetch des données des parties suivantes/précédentes.
  - Navigation client-side sous-exploitée (Next.js app router supporte le client-side navigation, mais SSR forcé).
  - Suspense/fallbacks peu contextualisés.

### 1.2. Interactions (Run/Submit code, feedback, réactions, changement de statut)
- **Problèmes** :
  - Actions utilisateur déclenchant des appels API/server actions lents (latence réseau, cold start, etc.).
  - Pas d'optimistic UI : l'UI attend la réponse serveur avant de refléter le changement.
  - Gestion d'erreur utilisateur faible ou absente.
  - Pas de retry automatique sur les actions critiques.
- **Conséquences** :
  - Délai perçu, parfois sans feedback visuel.
  - Erreurs réseau/serveur peu gérées (perte de données, frustration).
  - Actions non instantanées (ex : marquer une partie comme complétée, liker/disliker, etc.).

### 1.3. Chargement initial et préchargement
- **Problèmes** :
  - Chargement initial dépendant de fetchs serveur séquentiels (cours, chapitre, partie, progression, etc.).
  - Pas de prefetch des assets/code/données des parties suivantes/précédentes.
  - Lazy loading peu optimisé pour les composants lourds (éditeur de code, AI assistant, etc.).

---

## 2. Lisibilité & Maintenabilité

### 2.1. Structure des composants
- **Problèmes** :
  - Mélange logique serveur/client dans certains composants (ex : layout.tsx orchestre tout, délègue à des wrappers asynchrones).
  - Composants parfois trop gros ou multi-responsabilités (>200 lignes, ex : layout.tsx, course-code-editor.tsx).
  - Hooks personnalisés nombreux, parfois dupliqués ou peu factorisés.
  - Typage partiel ou implicite (usage de any, typage incomplet).
- **Conséquences** :
  - Difficulté à raisonner sur le flow de données.
  - Difficulté à factoriser/réutiliser la logique.
  - Difficulté à tester ou mocker certains composants.

### 2.2. Séparation des responsabilités
- **Problèmes** :
  - Composants serveur orchestrant la logique métier, mais délèguent à des wrappers asynchrones qui font eux-mêmes des fetchs serveur.
  - Composants client-side gérant à la fois l'état local, les appels API, et le rendu UI.
  - Hooks de progression, statut, solution unlock, etc. couplés à la logique UI.
- **Conséquences** :
  - Difficile d'extraire la logique métier pour la réutiliser ailleurs (mobile, API, etc.).
  - Difficile de maintenir ou d'étendre le système (ajout d'un nouveau type de feedback, d'un nouveau statut, etc.).

---

## 3. Extensibilité

### 3.1. Ajout de nouvelles fonctionnalités
- **Problèmes** :
  - Ajout d'un nouveau type d'interaction (bookmark, note, annotation) nécessiterait de modifier plusieurs endroits (composants, hooks, server actions).
  - Modèles de données rigides (progression, feedback, réactions séparés, pas de système d'extension/plugin).
  - Composants peu pensés pour l'extension (peu de pattern "slot", composition limitée).

### 3.2. Scalabilité
- **Problèmes** :
  - Système reposant sur des fetchs serveur synchrones pour chaque interaction (scalabilité limitée).
  - Pas de support natif pour le temps réel (WebSocket, SSE) pour synchroniser l'état entre clients.
  - Actions critiques (submit, feedback) non idempotentes ni transactionnelles.

---

## 4. Sécurité & Gestion des erreurs

### 4.1. Sécurité
- **Problèmes** :
  - Server actions supposant l'utilisateur authentifié, mais vérification parfois implicite ou absente.
  - Permissions non toujours vérifiées côté serveur (accès à une partie, soumission de feedback, etc.).
  - Données utilisateur parfois exposées côté client sans filtrage.

### 4.2. Gestion des erreurs
- **Problèmes** :
  - Erreurs serveur souvent loguées en console, rarement propagées à l'UI de façon claire.
  - Pas de gestion centralisée des erreurs (React error boundary, toast global, etc.).
  - Erreurs réseau non différenciées des erreurs applicatives.

---

## 5. Bases pour de futurs systèmes

### 5.1. Observabilité & Analytics
- **Problèmes** :
  - Pas de tracking analytique des interactions utilisateur (navigation, run, submit, feedback).
  - Pas de logs structurés pour les actions critiques (audit trail, débogage).

### 5.2. Extensibilité future
- **Problèmes** :
  - Pas de système de plugin/extension pour ajouter des fonctionnalités sans toucher au cœur du code.
  - Modèles de données non versionnés ni migrables facilement.

---

## 6. Résumé des problèmes majeurs

- **Performance** : Navigation/interactions non instantanées, absence de cache/prefetch, pas d'optimistic UI.
- **Lisibilité** : Composants trop gros, logique métier et UI mélangées, typage partiel.
- **Maintenabilité** : Difficulté à factoriser, à tester, à étendre.
- **Extensibilité** : Système peu flexible pour de nouveaux besoins.
- **Sécurité** : Vérifications d'authentification/permissions incomplètes, gestion d'erreur faible.
- **Futur** : Manque d'observabilité, de tracking, de support pour le temps réel ou les extensions.

---

## 7. Prochaines étapes

1. **Valider ce diagnostic** : Approfondir certains points si besoin.
2. **Prioriser les axes d'optimisation** : Performance, sécurité, DX, extensibilité, etc.
3. **Élaborer un plan d'architecture** :
   - Refactoring structurel (server/client split, hooks, context, etc.)
   - Mise en place d'un cache client (React Query/SWR), prefetch, navigation client-side
   - Optimistic UI, gestion d'erreur centralisée, sécurité renforcée
   - Préparation pour le temps réel, l'analytics, l'extensibilité

---

**Ce rapport sert de base pour la refonte et l'optimisation du système de cours.**

## 8. Fonctionnalités à ajouter

### 8.1. Gestion de plusieurs fichiers et dossiers dans les challenges
- **Objectif** : Permettre aux utilisateurs de manipuler plusieurs fichiers et dossiers dans l'éditeur de code des challenges/cours (multi-file, multi-folder support).
- **Implications techniques** :
  - Refactor de l'éditeur pour supporter une arborescence de fichiers (UI, API, persistance).
  - Adaptation du code runner/sandbox pour exécuter des projets multi-fichiers.
  - Gestion du stockage (temporaire et persistant) des fichiers utilisateurs.
  - Impacts sur la performance (préchargement, synchronisation, sauvegarde rapide).
  - Sécurité accrue (sandboxing, validation des accès fichiers, isolation des exécutions).
- **Lien avec les problèmes identifiés** :
  - Accentue le besoin d'optimistic UI, de cache local, de gestion d'erreur robuste.
  - Complexifie la maintenabilité et l'extensibilité (nécessité de patterns modulaires, d'API claires).

### 8.2. Système de draft et gestion fine des accès
- **Objectif** : Permettre de bloquer l'accès à certains cours ou parties à des utilisateurs spécifiques (brouillons, accès restreint, publication différée).
- **Implications techniques** :
  - Ajout d'un statut "draft" ou "privé" sur les entités cours/chapitre/partie.
  - Système de permissions/visibilité granulaire (par rôle, par utilisateur, par groupe).
  - UI pour la gestion des drafts et la publication (workflow d'édition, validation, publication).
  - Sécurité renforcée côté serveur (vérification stricte des droits d'accès à chaque requête).
  - Gestion des erreurs et feedback utilisateur lors de l'accès à un contenu bloqué.
- **Lien avec les problèmes identifiés** :
  - Renforce la nécessité d'une gestion des permissions robuste et centralisée.
  - Accentue l'importance d'une architecture claire pour l'extensibilité et la sécurité.

### 8.3. Pagination, Filtres/Recherche et Prérequis dans CoursesGrid

- **Objectif** :
  - Améliorer la performance, la scalabilité et l'expérience utilisateur de l'affichage des formations via une pagination côté serveur, des filtres/recherche avancés et la gestion des prérequis (formations bloquées).

- **Détails techniques** :
  - **Pagination** :
    - L'API/serveur Payload doit supporter la pagination (skip/limit ou cursor).
    - CoursesGrid affiche des boutons ou une pagination infinie (infinite scroll ou "Load more").
    - Les données de chaque page sont préchargées côté serveur (App Router, fetch en server component) et mises en cache (`unstable_cache` ou équivalent).
    - La revalidation du cache se fait toutes les heures (ou selon la fréquence métier).
  - **Filtres et recherche** :
    - Filtres synchronisés avec l'URL (query params) pour partage et persistance.
    - Recherche déclenchant une requête serveur filtrée, avec résultats paginés.
    - Filtres et recherche combinables, résultats mis en cache par combinaison.
  - **Gestion des prérequis (formations bloquées)** :
    - Le modèle Payload "Course" inclut un champ "prerequisites" (liste de slugs/IDs de formations requises).
    - Le serveur détermine pour chaque formation si elle est "bloquée" pour l'utilisateur courant (en fonction de sa progression).
    - Formations bloquées affichées avec un style distinct (grisé, cadenas, etc.).
    - Un clic sur une formation bloquée ouvre un dialog/modal expliquant les prérequis manquants et propose un lien pour y accéder.
  - **UX et accessibilité** :
    - Transitions de page, chargements et erreurs gérés proprement (skeletons, messages d'erreur, etc.).
    - Dialogues de blocage accessibles (focus, navigation clavier, ARIA).
    - Actions utilisateur traçables pour l'analytics.

- **Sécurité et robustesse** :
  - Endpoints API/serveur vérifiant systématiquement les prérequis avant de retourner le contenu d'une formation.
  - Erreurs d'accès explicites (403, message utilisateur).
  - Tests couvrant les cas d'accès non autorisé.

- **Documentation et extensibilité** :
  - Code modulaire : chaque filtre est une fonction/composant réutilisable.
  - Modèles Payload documentés et versionnés.
  - Patterns de cache, revalidation et gestion des accès documentés dans le repo.

### 8.4. Refonte du composant UserProfile (user-profile.tsx & core/user-profile/index.ts)

- **Objectif** :
  - Offrir un affichage de profil utilisateur performant, sécurisé, extensible et synchronisé, en cohérence avec les standards du reste du système.

- **Architecture & Data Fetching** :
  - Précharger les données critiques du profil utilisateur côté serveur lors du rendu initial (SSR/Server Component).
  - Utiliser React Query côté client pour la synchronisation, la mise à jour et l'optimistic UI (progression, badges, etc.).
  - Grouper tous les fetchs nécessaires dans une seule action serveur (`getUserProfileData`).
  - Prévoir l'extension future de la structure de retour (modules de gamification, badges, statistiques avancées).

- **Sécurité & Permissions** :
  - Vérifier que l'API ne retourne que les données du profil de l'utilisateur authentifié (ou d'un profil public si consulté par un autre utilisateur).
  - Filtrer les champs sensibles côté serveur (jamais exposer d'ID internes, d'emails, etc. dans le retour public).
  - Retourner des erreurs explicites (404 si utilisateur inconnu, 403 si accès interdit).
  - Afficher des messages d'erreur clairs et accessibles côté client.

- **Extensibilité & Modélisation** :
  - Prévoir des champs extensibles dans le retour serveur (achievements, badges, historique d'activité, etc.).
  - Utiliser des types TypeScript/Zod stricts et versionnés pour la structure du profil.
  - Extraire les sous-parties du profil (progression, calendrier, badges, etc.) en sous-composants dédiés, testables et réutilisables.
  - Utiliser des patterns de composition (slots, props.children) pour permettre l'ajout de nouveaux modules sans refactor global.

- **Performance & UX** :
  - Afficher un skeleton loader pendant le chargement.
  - Optimistic UI pour les actions rapides (validation d'un challenge, ajout d'un badge).
  - S'assurer que tous les éléments du profil sont accessibles (navigation clavier, ARIA, contrastes).
  - Traquer les vues de profil, les interactions (clics, progression) pour l'analytics.

- **Cache & Synchronisation** :
  - Utiliser React Query/SWR pour garder le profil à jour sans polling :
    - `refetchOnWindowFocus: true`
    - `invalidateQueries` après chaque mutation (progression, badge gagné)
  - Pas de polling ni de WebSocket pour cette fonctionnalité (sauf besoin temps réel).

- **Tests & Robustesse** :
  - Tester les actions serveur (retour, erreurs, permissions).
  - Tester les sous-composants du profil (affichage, accessibilité, fallback).
  - Vérifier le flow complet (chargement, erreur, mise à jour, synchronisation).

---

**Ces fonctionnalités doivent être prises en compte dans le plan d'optimisation et la refonte, car elles impactent fortement l'architecture, la sécurité, la performance et la maintenabilité du système.**
