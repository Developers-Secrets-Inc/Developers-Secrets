# Nouveau Système Utilisateur (Basé sur Supabase)

## Objectifs

*   Remplacer le système actuel jugé chaotique.
*   Fournir des interfaces claires et robustes pour l'authentification et la récupération des données utilisateur côté serveur (Server Components, Actions, Route Handlers) dans Next.js App Router.
*   S'inspirer des helpers `auth()` et `currentUser()` de Clerk.
*   Utiliser Supabase comme fournisseur d'authentification et base de données.

## Helpers Proposés

Nous allons créer des helpers pour encapsuler la logique d'interaction avec Supabase côté serveur.

### 1. `auth()` (Équivalent de `auth()` de Clerk)

*   **Objectif**: Vérifier l'état d'authentification, obtenir l'ID utilisateur et potentiellement des informations de session de base. Gérer la redirection si non authentifié. Permettre la protection des routes/actions.
*   **Implémentation**:
    *   Utilisera `createServerClient` de `@supabase/ssr` avec les cookies de `next/headers`.
    *   Appellera `supabase.auth.getUser()` en interne.
    *   Retournera un objet contenant :
        *   `userId: string | null`: L'ID de l'utilisateur Supabase ou `null`.
        *   `session: Session | null`: L'objet session Supabase (peut être utile).
        *   `error: AuthError | null`: Une éventuelle erreur d'authentification.
    *   **Protection**: Une fonction `protect()` pourrait être ajoutée à l'objet retourné ou être un helper séparé.
        *   `protect()`: Vérifiera `userId`. Si `null`, utilisera `redirect('/')` (ou une URL de connexion configurable) de `next/navigation`.
        *   `protect({ role: 'admin' })` (Pour l'autorisation): Nécessitera une logique supplémentaire pour vérifier les rôles/permissions (probablement via `user_metadata` ou une table de rôles jointe).

### 2. `currentUser()` (Équivalent de `currentUser()` de Clerk)

*   **Objectif**: Récupérer l'objet utilisateur complet, incluant les données d'authentification de base et les informations de profil stockées dans la collection Payload `user-informations`.
*   **Implémentation**:
    *   Utilisera `createServerClient`.
    *   Appellera `supabase.auth.getUser()` pour obtenir l'ID et les infos de base.
    *   Si un utilisateur est trouvé, interrogera l'API Payload (ou directement la base de données si configuré) pour récupérer l'enregistrement correspondant dans la collection `user-informations` en utilisant le `userId`.
    *   Retournera un objet utilisateur combiné (données Supabase Auth + données Payload) ou `null` si non authentifié ou si les informations n'existent pas.
    *   Gérera les erreurs potentielles (authentification et récupération Payload).

### 3. `getUserById()` (Server-Side)

*   **Objectif**: Récupérer les informations complètes d'un utilisateur spécifique (pas nécessairement celui connecté) en utilisant son ID.
*   **Paramètres**: `userId: string`.
*   **Implémentation**:
    *   Nécessitera probablement des privilèges suffisants pour accéder aux informations d'autres utilisateurs (potentiellement via le client Supabase Admin ou une politique de sécurité Payload appropriée).
    *   Interrogera l'API Payload (ou la base de données) pour récupérer l'enregistrement de la collection `user-informations` correspondant au `userId` fourni.
    *   Optionnel: Pourrait aussi récupérer des informations de base de `supabase.auth` si nécessaire (ex: email), en utilisant potentiellement `supabase.auth.admin.getUserById(userId)`.
    *   Retournera l'objet utilisateur combiné (ou juste les infos Payload) ou `null` si l'utilisateur n'est pas trouvé.
    *   Gérera les erreurs.

## Composants Proposés

### 1. `<Protect>` (Client-Side)

*   **Objectif**: Composant React côté client pour afficher conditionnellement ses enfants en fonction des rôles, permissions ou d'une condition personnalisée de l'utilisateur courant.
*   **Props**:
    *   `role?: string`: Le rôle requis (ex: `'admin'`, `'pro'`).
    *   `permission?: string`: La permission requise (format à définir, ex: `'invoices:create'`).
    *   `condition?: (user: UserWithInfos) => boolean`: Une fonction personnalisée recevant l'objet utilisateur complet (incluant les infos Payload) pour une logique d'autorisation plus complexe.
    *   `fallback?: React.ReactNode`: Un élément React à afficher si l'utilisateur n'est pas autorisé.
*   **Implémentation**:
    *   Utilisera un hook client (ex: `useSessionUser` ou un dérivé) pour obtenir les données de l'utilisateur courant (incluant rôle et permissions depuis `user-informations`).
    *   Évaluera la condition (`role`, `permission` ou `condition`).
    *   Rendra `children` si autorisé, sinon `fallback` (ou `null`).
*   **Important**: Ce composant assure uniquement un **masquage visuel**. Il ne sécurise pas les données. La protection des données sensibles doit impérativement être faite côté serveur (via les helpers `auth()` / `currentUser()` dans les Server Actions, Route Handlers, etc.).

### 2. `<SignedIn>` (Client-Side)

*   **Objectif**: Composant React côté client pour afficher ses enfants uniquement si un utilisateur est actuellement authentifié (connecté).
*   **Implémentation**:
    *   Utilisera un hook client (ex: `useSessionUser`) pour vérifier si un utilisateur est connecté.
    *   Rendra `children` si l'utilisateur est connecté, sinon `null`.
*   **Important**: Assure uniquement un **masquage visuel**.

### 3. `<SignedOut>` (Client-Side)

*   **Objectif**: Composant React côté client pour afficher ses enfants uniquement si aucun utilisateur n'est actuellement authentifié (déconnecté).
*   **Implémentation**:
    *   Utilisera un hook client (ex: `useSessionUser`) pour vérifier si un utilisateur est connecté.
    *   Rendra `children` si l'utilisateur est déconnecté, sinon `null`.
*   **Important**: Assure uniquement un **masquage visuel**.

## Infrastructure Requise

*   **Packages**: `@supabase/supabase-js`, `@supabase/ssr`.
*   **Configuration**: Variables d'environnement pour l'URL et la clé `anon` de Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
*   **Middleware**: Un middleware Next.js configuré pour utiliser `updateSession` de `@/utils/supabase/middleware` (ou équivalent) pour la gestion des sessions/cookies.
*   **Utilities**: Fonctions `createClient` pour le serveur (`@/utils/supabase/server`) et potentiellement pour le client (`@/utils/supabase/client`).
*   **Base de Données / CMS**: La collection Payload `user-informations` existante, liée à `auth.users` via le champ `userId`, pour stocker les détails du profil (incluant rôle et potentiellement permissions).

## Étapes de Développement

1.  Mettre en place la configuration Supabase et les variables d'environnement.
2.  Installer les dépendances nécessaires.
3.  Créer les utilitaires `createClient` (serveur, client, middleware).
4.  Implémenter et configurer le middleware Next.js pour la gestion des sessions.
5.  Développer le helper `auth()`.
6.  Développer le helper `currentUser()` (incluant la logique de récupération du profil).
7.  Développer le helper `getUserById()`.
8.  Tester les helpers dans différents contextes (Server Components, Server Actions, Route Handlers).
9.  Développer le composant `<Protect>` côté client.
10. Développer les composants `<SignedIn>` et `<SignedOut>` côté client.
11. Implémenter la logique d'autorisation (`protect({ role: ... })` côté serveur et utiliser `<Protect>` côté client).
12. Remplacer les appels existants par les nouveaux helpers et composants.
13. Documentation interne.

## Questions Ouvertes / Points à Discuter

*   Stratégie exacte pour la gestion des rôles/permissions (métadonnées Supabase vs table dédiée).
*   URL de redirection par défaut pour `protect()`.
*   Gestion fine des erreurs et comment les exposer/logger.
*   Structure exacte des répertoires pour les utilitaires Supabase (`@/utils/supabase` vs `@/core/auth`).
*   Format exact et source des `permissions` (champ direct dans `user-informations`? Table liée? Métadonnées Supabase?).
*   Comment récupérer efficacement les rôles/permissions côté client pour `<Protect>` sans multiplier les requêtes.
