# Plan de développement Auth v2

## 1. Expérience Utilisateur (UX)

### 1.1 Feedback post-signup (vérification d'email)
- **Objectif** : S'assurer que l'utilisateur comprend qu'il doit vérifier son email après inscription, sans bloquer l'accès à l'application.
- **Comportement** :
  - Après inscription, envoyer un email de vérification contenant un lien unique (avec token).
  - Ajouter un champ `emailVerified: boolean` dans la base de données (`UserInformations`), initialisé à `false`.
  - L'utilisateur peut naviguer dans l'application même si son email n'est pas vérifié (affichage d'un reminder/bannière si besoin).
  - Si l'utilisateur clique sur le lien de l'email, il est redirigé vers `/auth/verify-email?token=...`.
  - Cette page vérifie le token, retrouve l'utilisateur, et met à jour `emailVerified` à `true` si le token est valide.
  - Afficher un message de succès ou d'échec sur la page de validation.
  - Proposer un bouton "Renvoyer l'email" (avec cooldown pour éviter l'abus).
- **Contraintes** :
  - Le token doit être à usage unique et expirer rapidement (ex : 30 min).
  - Le champ `emailVerified` doit être accessible dans tous les flows utilisateur.
  - S'assurer que l'UI est accessible et responsive.
- **Exemple** :
  ```typescript
  // Après signup
  if (!user.emailVerified) {
    showVerificationReminder();
  }
  // Sur /auth/verify-email
  if (isValidToken(token)) {
    setUserEmailVerified(userId, true);
  }
  ```
- **Performance** :
  - Ne charger que le strict nécessaire sur la page de validation.
- **Référence** :
  - [SignUpCard.tsx](mdc:src/app/(frontend)/auth/components/SignUpCard.tsx)
  - [UserInformations.ts](mdc:src/collections/UserInformations.ts)
  - [user-informations/types.ts](mdc:src/core/user/user-informations/types.ts)
  - [user-informations/index.ts](mdc:src/core/user/user-informations/index.ts)

#### 1.1.1 Gestion du token de validation d'email
- Générer un token unique à l'inscription (stocké en base ou via Supabase).
- Associer le token à l'utilisateur et à une date d'expiration.
- Endpoint ou page `/auth/verify-email` qui :
  - Récupère le token de l'URL.
  - Vérifie la validité et l'expiration du token.
  - Met à jour `emailVerified` à `true` si tout est valide.
  - Affiche un message de succès ou d'échec.
- Sécurité : le token ne doit permettre que la validation d'email, et être à usage unique.

### 1.2 Feedback utilisateur lors de la connexion
- **[FAIT]** Composant toast universel créé (`CustomToast`), supportant succès/erreur/info, accessible et performant.
- **[FAIT]** Toast de succès affiché lors du login réussi, persistant sur la page d'arrivée via `sessionStorage`.
- **[FAIT]** Intégration réalisée dans `LoginCard` et page de login (à dupliquer sur les autres pages d'arrivée si besoin).
- **[FAIT]** UX validée : feedback instantané, accessible, dismissible, sans impact sur la navigation.

### 1.3 Gestion des erreurs
- **[FAIT]** Centralisation et typage des erreurs côté serveur :
  - Classes d'erreur spécifiques (EmailInUseError, InvalidPasswordError, etc.) dans `src/core/user/errors.ts`.
  - Erreurs structurées `{ code: string, message: string }` retournées par les actions serveur (`auth.ts`).
- **[FAIT]** Uniformisation côté client :
  - `LoginCard` et `SignUpCard` consomment le format d'erreur.
  - Messages d'erreur précis affichés sous les champs ou dans un toast global.
  - Accessibilité gérée (focus, ARIA).
- **[FAIT]** Préparation à la localisation (i18n) :
  - Messages d'erreur prêts à être traduits.
- **[À FAIRE]** Logging serveur :
  - Logger les erreurs critiques côté serveur (console, Sentry, etc.).
- **Exemples** :
  ```typescript
  // Côté serveur
  return { success: false, error: { code: 'EMAIL_IN_USE', message: 'Cet email est déjà utilisé.' } }
  // Côté client
  if (result.error?.code === 'EMAIL_IN_USE') {
    setErrors({ email: result.error.message })
  }
  ```
- **Tests** :
  - Tests manuels des cas d'erreur courants effectués.

### 1.4 Redirections
- **Objectif** : Rendre les redirections post-authentification flexibles et contextuelles.
- **Comportement** :
  - Permettre de spécifier une URL de destination (query param, state, etc.).
  - Par défaut, retourner à la page précédente ou à une page configurable.
- **Contraintes** :
  - Sécuriser les redirections (éviter l'open redirect).
- **Exemple** :
  ```typescript
  redirectTo = getRedirectUrl() || '/home';
  ```
- **Performance** :
  - Calcul de la redirection côté serveur pour éviter un double chargement.
- **Référence** :
  - [login.tsx](mdc:src/app/(frontend)/auth/login/page.tsx)

### 1.5 Accessibilité
- **Objectif** : Rendre toutes les pages et composants d'auth utilisables par tous.
- **Comportement** :
  - Ajouter les attributs ARIA nécessaires.
  - Gérer le focus automatique sur les champs d'erreur ou de première saisie.
  - S'assurer de la navigation clavier et de la compatibilité lecteurs d'écran.
- **Contraintes** :
  - Respecter les standards WCAG 2.1 AA.
- **Exemple** :
  ```jsx
  <input aria-invalid={!!error} aria-describedby="error-message" />
  ```
- **Performance** :
  - Les attributs ARIA n'impactent pas la performance.
- **Référence** :
  - [LoginCard.tsx](mdc:src/app/(frontend)/auth/components/LoginCard.tsx)

## 2. Sécurité

### 2.1 MFA (Multi-Factor Authentication)
- **Objectif** : Ajouter une couche de sécurité supplémentaire.
- **Comportement** :
  - Permettre à l'utilisateur d'activer/désactiver le MFA (TOTP, email, SMS).
  - Demander le second facteur lors de la connexion si activé.
- **Contraintes** :
  - Stocker l'état MFA de façon sécurisée.
  - Protéger les endpoints MFA contre l'abus.
- **Exemple** :
  - Utilisation de librairies comme speakeasy pour TOTP.
- **Performance** :
  - Génération et validation du code doivent être rapides.
- **Référence** :
  - À créer : `src/core/user/mfa.ts`

### 2.2 Limitation des tentatives
- **Objectif** : Protéger contre le brute-force.
- **Comportement** :
  - Limiter le nombre de tentatives de login/signup/reset par IP et par compte.
  - Afficher un message d'attente ou de blocage après X tentatives.
- **Contraintes** :
  - Stockage temporaire (Redis, etc.) pour le comptage.
- **Exemple** :
  ```typescript
  if (attempts > 5) { blockUser(); }
  ```
- **Performance** :
  - Utiliser un stockage rapide (in-memory, Redis).
- **Référence** :
  - À créer : `src/core/user/throttling.ts`

### 2.3 Gestion des sessions
- **Objectif** : Gérer la durée et la sécurité des sessions.
- **Comportement** :
  - Implémenter le rememberMe côté serveur (durée de session, cookies persistants).
  - Permettre à l'utilisateur de voir et révoquer ses sessions actives.
- **Contraintes** :
  - Cookies HttpOnly, Secure, SameSite.
- **Exemple** :
  - Utilisation de Supabase pour la gestion des sessions.
- **Performance** :
  - Minimiser la taille des cookies.
- **Référence** :
  - [auth.ts](mdc:src/actions/auth.ts)

### 2.4 Réinitialisation du mot de passe
- **Objectif** : Permettre à l'utilisateur de réinitialiser son mot de passe de façon sécurisée.
- **Comportement** :
  - Générer un token sécurisé, avec expiration.
  - Envoyer un email avec un lien unique.
  - Valider le token lors de la saisie du nouveau mot de passe.
  - Afficher un feedback clair à chaque étape.
- **Contraintes** :
  - Token à usage unique, expiration courte (ex : 30 min).
- **Exemple** :
  - Utilisation de Supabase reset password flow.
- **Performance** :
  - Traitement rapide, feedback immédiat.
- **Référence** :
  - [reset-password/page.tsx](mdc:src/app/(frontend)/auth/reset-password/page.tsx)

## 3. Fonctionnalités

### 3.1 Connexion sociale
- **Objectif** : Permettre la connexion via plusieurs providers OAuth.
- **Comportement** :
  - Rendre l'ajout de nouveaux providers modulaire (Google, GitHub, Microsoft, Apple, etc.).
  - Permettre à l'utilisateur de lier/délier des comptes sociaux dans ses paramètres.
- **Contraintes** :
  - Sécuriser les callbacks OAuth.
  - Gérer les cas de fusion de comptes.
- **Exemple** :
  - Fichier de config listant les providers activés.
- **Performance** :
  - Charger dynamiquement les boutons/providers disponibles.
- **Référence** :
  - [OAuth2Buttons](mdc:src/components/buttons/OAuth2Buttons.tsx)

## 4. Code & Architecture

### 4.1 Séparation des responsabilités
- **Objectif** : Faciliter la maintenance, les tests et la réutilisation.
- **Comportement** :
  - Séparer la logique métier (validation, création utilisateur, etc.) de l'orchestration (redirection, feedback).
  - Utiliser des services/fonctions pures pour la logique.
- **Contraintes** :
  - Les actions serveur ne doivent faire que l'orchestration.
- **Exemple** :
  - `signupUserLogic()` vs `signupAction()`
- **Performance** :
  - Les fonctions pures sont plus faciles à optimiser/tester.
- **Référence** :
  - [auth.ts](mdc:src/actions/auth.ts)

### 4.2 Tests
- **Objectif** : Garantir la robustesse du système.
- **Comportement** :
  - Ajouter des tests unitaires pour chaque fonction critique.
  - Ajouter des tests d'intégration pour les flows complets (signup, login, reset, OAuth).
  - Couvrir les cas d'erreur et limites.
- **Contraintes** :
  - Utiliser des fixtures/mocks pour les dépendances externes.
- **Exemple** :
  - Utilisation de Jest, Testing Library.
- **Performance** :
  - Les tests doivent être rapides (<1s par test unitaire).
- **Référence** :
  - À créer : `src/core/user/__tests__/`

### 4.3 Typage
- **Objectif** : Éviter les erreurs de type et faciliter l'autocomplétion.
- **Comportement** :
  - Uniformiser et renforcer le typage des retours d'actions (succès, erreur, structure des erreurs).
  - Utiliser des types partagés entre client et serveur.
- **Contraintes** :
  - Utiliser Zod ou TypeScript pour la validation.
- **Exemple** :
  ```typescript
  type AuthResult = { success: true; user: User } | { success: false; error: AuthError }
  ```
- **Performance** :
  - Le typage n'impacte pas la perf runtime, mais améliore la DX.
- **Référence** :
  - [result.ts](mdc:src/core/user/result.ts)

### 4.4 Gestion des hooks
- **Objectif** : Centraliser la gestion de l'état d'authentification côté client.
- **Comportement** :
  - Factoriser les hooks React pour l'état utilisateur (auth global, contexte utilisateur).
  - Permettre une utilisation simple et cohérente dans toute l'application.
- **Contraintes** :
  - Les hooks doivent être performants et éviter les re-renders inutiles.
- **Exemple** :
  - `useAuth()`, `useSessionUser()`
- **Performance** :
  - Utiliser le cache et la mémoïsation.
- **Référence** :
  - [use-user.ts](mdc:src/core/user/hooks/use-user.ts)

## 5. Performance & Optimisation

### 5.1 Chargement initial minimal
- **Objectif** : Réduire le temps de chargement des pages d'auth.
- **Comportement** :
  - Charger uniquement le strict nécessaire (code splitting, lazy loading).
  - Reporter le chargement des assets non critiques.
- **Contraintes** :
  - Ne pas charger les composants inutiles (ex : illustrations, providers non activés).
- **Exemple** :
  - Utilisation de `React.lazy` pour les illustrations.
- **Performance** :
  - Mesurer le TTFB et le Largest Contentful Paint.
- **Référence** :
  - [LoginCard.tsx](mdc:src/app/(frontend)/auth/components/LoginCard.tsx)

### 5.2 Feedback utilisateur instantané
- **Objectif** : Rendre l'interface réactive dès l'action utilisateur.
- **Comportement** :
  - Afficher les loaders, toasts, feedbacks en local dès l'action.
  - Ne pas attendre la réponse serveur pour l'UI.
- **Contraintes** :
  - Gérer les cas d'erreur serveur après feedback local.
- **Exemple** :
  - Loader sur le bouton "Connexion".
- **Performance** :
  - Feedback <100ms.
- **Référence** :
  - [CustomErrorToast.tsx](mdc:src/app/(frontend)/auth/components/CustomErrorToast.tsx)

### 5.3 Optimisation des appels réseau
- **Objectif** : Réduire le nombre et la latence des requêtes.
- **Comportement** :
  - Regrouper les appels API.
  - Utiliser le cache pour les données statiques.
- **Contraintes** :
  - Ne pas surcharger le serveur.
- **Exemple** :
  - Précharger la liste des providers OAuth.
- **Performance** :
  - <2 requêtes réseau pour le login/signup.
- **Référence** :
  - [auth.ts](mdc:src/actions/auth.ts)

### 5.4 Gestion efficace de la session
- **Objectif** : Optimiser la gestion et la sécurité des sessions.
- **Comportement** :
  - Minimiser la taille des cookies/session.
  - Utiliser des cookies HttpOnly, Secure, SameSite.
- **Contraintes** :
  - Ne jamais stocker de données sensibles côté client.
- **Exemple** :
  - Utilisation de Supabase pour la session.
- **Performance** :
  - Session persistante sans impact sur le TTFB.
- **Référence** :
  - [auth.ts](mdc:src/actions/auth.ts)

### 5.5 Détection et gestion des lenteurs
- **Objectif** : Informer l'utilisateur en cas de lenteur.
- **Comportement** :
  - Timer pour détecter les réponses >500ms.
  - Afficher un message "Connexion en cours…" si besoin.
- **Contraintes** :
  - Ne pas spammer l'utilisateur.
- **Exemple** :
  - setTimeout avant d'afficher le loader.
- **Performance** :
  - Feedback visible avant 1s.
- **Référence** :
  - [LoginCard.tsx](mdc:src/app/(frontend)/auth/components/LoginCard.tsx)

### 5.6 Accessibilité et performance
- **Objectif** : Ne pas sacrifier la performance pour l'accessibilité.
- **Comportement** :
  - Utiliser des animations/transitions légères.
- **Contraintes** :
  - Pas d'animations bloquantes.
- **Exemple** :
  - Transitions CSS hardware-accelerated.
- **Performance** :
  - Animation <100ms.
- **Référence** :
  - [SignUpCard.tsx](mdc:src/app/(frontend)/auth/components/SignUpCard.tsx)

### 5.7 Tests de performance
- **Objectif** : Mesurer et garantir la performance réelle.
- **Comportement** :
  - Ajouter des tests Lighthouse/Web Vitals sur les pages d'auth.
  - Suivre les métriques de temps de chargement, TTFB, interaction utilisateur.
- **Contraintes** :
  - Automatiser les tests dans le CI.
- **Exemple** :
  - Script Lighthouse sur `/auth/login`.
- **Performance** :
  - LCP <1.5s, TTFB <500ms.
- **Référence** :
  - À créer : `tests/perf/auth-lighthouse.test.js`
