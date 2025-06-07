---
description: 
globs: 
alwaysApply: true
---
- **Gestion des données côté client avec React Query**
  - Utiliser `@tanstack/react-query` pour la récupération, le cache et la mutation des données côté client.
  - Les hooks React Query doivent s'appuyer sur des actions serveur typées (voir [feature-development-flow.md](mdc:.roo/rules/feature-development-flow.md)).
  - Préférer l'hydratation initiale des données via SSR/SSG/ISR pour optimiser le SEO, la performance et l'accessibilité (voir [csr-ssr.md](mdc:docs/documents/csr-ssr.md)).

- **Pattern recommandé avec Next.js App Router**
  - Charger les données critiques dans un composant serveur (`'use server'` par défaut), puis passer ces données initiales au composant client via props.
  - Utiliser React Query côté client pour gérer l'état distant, le cache, les mutations et l'optimistic UI.
  - Exemple :
    ```tsx
    // app/courses/[slug]/page.tsx (server component)
    import { getCourse } from '@/core/courses'
    import { CourseClient } from './CourseClient'

    export default async function Page({ params }) {
      const course = await getCourse(params.slug)
      return <CourseClient initialCourse={course} />
    }

    // app/courses/[slug]/CourseClient.tsx (client component)
    'use client'
    import { useQuery, QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query'
    import { useState } from 'react'

    export function CourseClient({ initialCourse }) {
      const [queryClient] = useState(() => new QueryClient())
      return (
        <QueryClientProvider client={queryClient}>
          <Hydrate state={initialCourse}> {/* si SSR/SSG avec React Query */}
            <CourseContent />
          </Hydrate>
        </QueryClientProvider>
      )
    }

    function CourseContent() {
      const { data, isLoading } = useQuery({
        queryKey: ['course'],
        queryFn: fetchCourse, // doit pointer vers une action serveur
      })
      // ...
    }
    ```

- **Optimisation et bonnes pratiques**
  - Toujours hydrater le cache React Query avec les données initiales côté serveur si possible.
  - Utiliser l'optimistic UI pour les mutations côté client.
  - Préférer SWR ou React Query pour la gestion du cache et des revalidations côté client.
  - Respecter la séparation server/client décrite dans [server-client-component-decomposition.md](mdc:.roo/rules/server-client-component-decomposition.md).

- **Références**
  - Guide complet : [csr-ssr.md](mdc:docs/documents/csr-ssr.md)
  - [feature-development-flow.md](mdc:.roo/rules/feature-development-flow.md)
  - [server-client-component-decomposition.md](mdc:.roo/rules/server-client-component-decomposition.md)
  - [React Query Hydration](mdc:https:/tanstack.com/query/latest/docs/framework/react/guides/ssr)
  - [Next.js App Router](mdc:https:/nextjs.org/docs/app/building-your-application/routing)

