### Joyride Onboarding — Plan de développement

#### Objectifs
- Mettre en place un système d’onboarding “joyride” activable par paramètre d’URL `?onboarding` sur les pages ciblées.
- Définir la configuration Joyride directement dans le code (pas de CMS) et marquer les composants via un composant d’ordre supérieur (HOC) sans toucher à leur implémentation interne.
- Persister en base uniquement le fait qu’un utilisateur a visité une page donnée (booléen oui/non), par (userId, path).

#### Contraintes et principes
- Toutes les lectures/écritures passent par `src/core/functions` (queries/mutations + Zod) pour typage, cache, SSR/CSR avec React Query.
- Intégration non invasive: ciblage des étapes par sélecteurs CSS configurés (pas d’édition de composants), overlay global monté dans le layout.
- Hydratation initiale côté serveur (preloadQuery) + réactivité côté client (usePreloadedQuery/useQuery).
- Respect des `maxLength` pour tous les champs textuels en Payload.

---

### Architecture technique

#### 1) Collections Payload
- `user-page-visits` (booléen de visite, simplifié)
  - userId (text, required, index)
  - path (text, required, maxLength: 255, index)
  - visited (checkbox, required, default: true)
  - indexes: unique composite (userId, path)
  - Remarque: absence d’entrée = non visité; on peut aussi ignorer le champ `visited` et considérer la présence comme “oui”.

#### 2) Fonctions serveur (src/core/functions)
- Queries
  - (Optionnel) `hasVisited({ userId, path })`: renvoie boolean depuis `user-page-visits`.

- Mutations
  - `setPageVisited({ userId, path })`: upsert idempotent sur (userId, path) pour marquer “visité”.

Notes:
- Zod pour valider les args; tagging cache via `makeCacheKey` + `revalidateTag` pour les mutations.

#### 3) Intégration UI (non invasive)
- `OnboardingProvider` (client) monté globalement (dans `RootLayout` ou layout Dashboard):
  - Lit le paramètre `?onboarding` depuis la page (via prop passée au wrapper client) et déclenche le tour si présent.
  - Utilise `react-joyride` (ou équivalent) pour rendre le tour; steps définies en code (voir registre ci-dessous).
  - Observe le DOM (MutationObserver) jusqu’à présence des cibles (attributs data du HOC) avec timeout configurable; fallback plein écran si nécessaire.

- `RouteTracker` (client léger) monté globalement:
  - À chaque navigation, appelle `setPageVisited` une seule fois par (userId, path) (cache mémoire session + debounce) pour écrire le booléen.

- `Paramètre ?onboarding` côté pages (`page.tsx`):
  - Dans les pages App Router, récupérer `searchParams` serveur ou `useSearchParams` côté client wrapper, et passer le flag/nom au `OnboardingProvider` pour ouverture du tour.

#### 4) Hydratation SSR/CSR
- Pas de données d’onboarding à précharger depuis le serveur (la config est dans le code).
- Écritures côté client: `setPageVisited` au premier rendu par route.

#### 5) Sécurité, perfs, conformité
- `maxLength` sur tous les champs `text`/`textarea` Payload.
- Upserts idempotents pour `setPageVisited` (réduction egress DB) + index unique (userId, path).
- Pas d’IP, pas de métadonnées de visite, uniquement booléen.

#### 6) Définition de la config Joyride dans le code
- Registre d’onboarding par route (p. ex. `src/onboarding/registry.ts`):
  - `export const onboardingRegistry = { '/dashboard/home': { id: 'home', steps: [...] } }`.
  - Chaque step référence un sélecteur stable de type `[data-onboarding-step="<id>"]`.

- HOC pour marquer les composants cibles:
  - `withOnboardingStep(Component, { stepId: string })` retourne un composant qui rend un wrapper (ou propage) avec `data-onboarding-step={stepId}`.
  - Aucun changement de logique interne des composants existants; seule la consommation via HOC change.
  - Les steps dans le registre référencent ces `stepId` via sélecteur CSS.

- Démarrage par paramètre:
  - `?onboarding=1` (ou `?onboarding=<tourId>`) déclenche le tour associé à la route/au tourId dans le registre.

#### 7) Accessibilité
- Focus management, ARIA, navigation clavier, échappement, spotlight configurable.

#### 8) Tests
- Unit: Zod schemas, upsert `setPageVisited`.
- Intégration: déclenchement via `?onboarding`, rendu des steps depuis le registre, HOC applique `data-onboarding-step`.
- E2E: rendu des étapes sur pages cibles, fallback si sélecteur manquant, une seule écriture par (userId, path).

#### 9) Déploiement par phases
- Phase 1 (MVP): collections, queries/mutations, `OnboardingProvider`, `RouteTracker`, un tour basique.
- Phase 2: mode preview, options d’audience, reprise cross-device.
- Phase 3: i18n, analytics de tours (indépendant du booléen de visite).

#### 10) Risques & mitigations
- Sélecteurs instables: privilégier sélecteurs stables, observer DOM, step fallback sans cible.
- Multi-écritures sur routes dynamiques: cache mémoire + index unique + debounce.

---

### Backlog de tâches (implémentation)
1) Collections Payload
   - Créer `user-page-visits` (booléen, unique (userId, path)).
2) Fonctions serveur (src/core/functions)
   - Queries: (opt) `hasVisited`.
   - Mutations: `setPageVisited` (upsert idempotent).
3) Client
   - `OnboardingProvider` (client) + lecture du paramètre `?onboarding`.
   - HOC `withOnboardingStep` pour marquer les composants.
   - Registre d’onboarding par route avec steps définies en code.
   - `RouteTracker` (écriture idempotente sur visite).
4) Tests (unit, intégration, E2E) et documentation d’usage (HOC, registre, paramètre d’URL).


