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

#### 2) Fonctions serveur (src/core/onboarding/tour/server.ts)
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


---

### Implémentation — code proposé (hors collection)

Les extraits ci-dessous illustrent l’implémentation à ajouter au codebase. Ils respectent les standards de `src/core/functions` et l’architecture App Router. Les noms de fichiers sont indicatifs.

#### 1) Fonctions serveur (src/core/onboarding/tour/server.ts)

```typescript
// src/core/onboarding/tour/server.ts
import { z } from 'zod'
import { mutation, query } from '@/core/functions'
import { onboardingRegistry } from '@/core/onboarding/tour/registry' // aucune génération de fichiers

export type AppRoute = keyof typeof onboardingRegistry

// Schéma Zod runtime basé sur les clés du registre (100% TS, pas de génération)
const appRouteValues = Object.keys(onboardingRegistry) as AppRoute[]
const appRouteSchema = z.enum(appRouteValues as unknown as [AppRoute, ...AppRoute[]])

export const setPageVisited = mutation({
  name: 'setPageVisited',
  args: z.object({
    userId: z.string().min(1),
    path: appRouteSchema,
  }),
  handler: async ({ payload }, { userId, path }) => {
    const existing = await payload
      .find({
        collection: 'user-page-visits',
        where: {
          and: [
            { userId: { equals: userId } },
            { path: { equals: path } },
          ],
        },
        limit: 1,
      })
      .then((r) => r.docs[0])

    if (!existing) {
      await payload.create({
        collection: 'user-page-visits',
        data: { userId, path, visited: true },
      })
    }

    return { visited: true }
  },
})

export const hasVisited = query({
  name: 'hasVisited',
  args: z.object({
    userId: z.string().min(1),
    path: appRouteSchema,
  }),
  handler: async ({ payload }, { userId, path }) => {
    const total = await payload
      .find({
        collection: 'user-page-visits',
        where: {
          and: [
            { userId: { equals: userId } },
            { path: { equals: path } },
          ],
        },
        limit: 1,
      })
      .then((r) => r.totalDocs)

    return total > 0
  },
})
```

#### 2) Registre d’onboarding par route (src/core/onboarding/tour/registry.ts)

```typescript
// src/core/onboarding/tour/registry.ts
export type OnboardingStep = {
  id: string
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
}

export type OnboardingTour = {
  id: string
  steps: OnboardingStep[]
}

export const onboardingRegistry = {
  '/(frontend)/(dashboard)/(navigation)/home': {
    id: 'home',
    steps: [
      {
        id: 'current-course',
        title: 'Your current course',
        content: 'Resume your learning journey from here.',
        placement: 'bottom',
      },
      {
        id: 'recommended-challenge',
        title: 'Recommended challenge',
        content: 'Try this challenge tailored to your level.',
      },
    ],
  },
} as const satisfies Record<string, OnboardingTour>

// Les steps ciblent des éléments marqués via data attribute: [data-onboarding-step="<id>"]
```

> Pas de génération de fichiers. Le type `AppRoute` est dérivé directement des clés du `onboardingRegistry`.

#### 3) HOC pour marquer les composants (src/onboarding/withOnboardingStep.tsx)

```tsx
// src/onboarding/withOnboardingStep.tsx
'use client'
import React, { forwardRef } from 'react'

type WithOnboardingStepOptions = {
  stepId: string
}

export function withOnboardingStep<P extends object>(
  Component: React.ComponentType<P>,
  options: WithOnboardingStepOptions,
) {
  const Wrapped = forwardRef<any, P>(function Wrapped(props, ref) {
    return (
      <div data-onboarding-step={options.stepId}>
        <Component ref={ref as any} {...(props as P)} />
      </div>
    )
  })

  Wrapped.displayName = `WithOnboardingStep(${Component.displayName || Component.name || 'Component'})`
  return Wrapped
}
```

#### 4) Provider d’onboarding (src/core/onboarding/tour/components/provider.tsx)

```tsx
// src/core/onboarding/tour/components/provider.tsx
'use client'
import React, { useMemo, useCallback, useRef } from 'react'
import Joyride, { Step, STATUS } from 'react-joyride'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { onboardingRegistry } from './registry'
import { setPageVisited } from '@/core/onboarding/tour/index'
import type { AppRoute } from '@/core/onboarding/tour/index'
import { useMutation } from '@/core/functions/hooks'
import { useSessionUser } from '@/core/user/hooks/use-user'

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const pathnameRaw = usePathname() ?? ''
  const pathname = (pathnameRaw in onboardingRegistry ? pathnameRaw : '') as AppRoute | ''
  const search = useSearchParams()
  const shouldStart = Boolean(search.get('onboarding'))
  const router = useRouter()
  const visitedRef = useRef(false)
  const { user } = useSessionUser()
  const { mutate: markVisited } = useMutation(setPageVisited)

  const tour = useMemo(() => (pathname ? onboardingRegistry[pathname as AppRoute] : undefined), [pathname])
  const steps = useMemo<Step[]>(
    () =>
      tour
        ? tour.steps.map((s) => ({
            target: `[data-onboarding-step="${s.id}"]`,
            title: s.title,
            content: s.content,
            placement: s.placement ?? 'auto',
            disableBeacon: true,
          }))
        : [],
    [tour],
  )

  const run = shouldStart && steps.length > 0

  const handleJoyride = useCallback(async (data: any) => {
    const { status } = data
    if (visitedRef.current) return
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      visitedRef.current = true
      // Appelle directement la mutation setPageVisited (src/core/onboarding/tour/index.ts)
      if (user?.id && pathname) {
        markVisited({ userId: user.id, path: pathname as AppRoute })
      }
      // Nettoie l'URL pour retirer ?onboarding et rester sur la même page
      router.replace(window.location.pathname + window.location.hash)
    }
  }, [pathname, router, user?.id, markVisited])

  return (
    <>
      {children}
      {run && (
        <Joyride
          steps={steps}
          run={run}
          showSkipButton
          showProgress
          continuous
          disableScrolling
          callback={handleJoyride}
          styles={{ options: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}
```

#### 5) Hook TanStack Query pour le tracking (src/core/onboarding/tour/hooks.ts)

```typescript
// src/core/onboarding/tour/hooks.ts
'use client'
import { useQuery } from '@/core/functions/hooks'
import { setPageVisited } from '@/core/onboarding/tour/index'
import type { AppRoute } from '@/core/onboarding/tour/index'

export function useTrackPageVisit(args: { userId: string | undefined; path: AppRoute | '' }) {
  const enabled = Boolean(args.userId && args.path)
  // Déclenche l'écriture sans useEffect, via useQuery avec enabled
  return useQuery(setPageVisited, enabled ? { userId: args.userId!, path: args.path as AppRoute } : (undefined as any), {
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
```

#### 6) Composant client de tracking (src/core/onboarding/tour/components/visit-tracker-client.tsx)

```tsx
// src/core/onboarding/tour/components/visit-tracker-client.tsx
'use client'
import { usePathname } from 'next/navigation'
import { useSessionUser } from '@/core/user/hooks/use-user'
import { useTrackPageVisit } from '@/core/onboarding/tour/hooks'
import { onboardingRegistry } from '@/core/onboarding/tour/registry'
import type { AppRoute } from '@/core/onboarding/tour/index'

export function VisitTrackerClient() {
  const raw = usePathname() ?? ''
  const pathname = (raw in onboardingRegistry ? raw : '') as AppRoute | ''
  const { user } = useSessionUser()
  useTrackPageVisit({ userId: user?.id, path: pathname })
  return null
}
```

#### 7) Intégration layout (exemple)

```tsx
// src/app/(frontend)/layout.tsx (extrait)
import { OnboardingProvider } from '@/core/onboarding/tour/components/provider'
import { VisitTrackerClient } from '@/core/onboarding/tour/components/visit-tracker-client'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <OnboardingProvider>
          <VisitTrackerClient />
          {children}
        </OnboardingProvider>
      </body>
    </html>
  )
}
```

#### 8) Exemple d’usage du HOC dans une page/composant (src/core/onboarding/tour/components/with-step.tsx)

```tsx
// Exemple: marquer un composant de la Home
import { withOnboardingStep } from '@/core/onboarding/tour/components/with-step'
import { CurrentCourseCard as BaseCard } from '@/components/cards/current-course-card'

export const CurrentCourseCard = withOnboardingStep(BaseCard, { stepId: 'current-course' })
```

#### 8) Lecture du paramètre ?onboarding dans une page (option serveur)

```tsx
// src/app/(frontend)/(dashboard)/(navigation)/home/page.tsx (extrait)
export default async function Home({ searchParams }: { searchParams?: { onboarding?: string } }) {
  // Rien d’autre à faire si le Provider lit déjà useSearchParams côté client.
  // Si besoin, on peut passer un prop au wrapper client.
  return (
    // <HomeClientWrapper onboarding={!!searchParams?.onboarding}>
    //   ...
    // </HomeClientWrapper>
    // Pour ce plan, le Provider lit directement le paramètre côté client.
    <>{/* contenu existant */}</>
  )
}
```

Notes complémentaires:
- Si certains composants ne peuvent pas être enveloppés par le HOC (contraintes de composition), on peut ajouter un wrapper parent dédié à l’endroit où ils sont utilisés.
- En cas de DOM async, Joyride peut nécessiter un léger délai; sinon, fallback sur une étape non ciblée (plein écran) est possible.


