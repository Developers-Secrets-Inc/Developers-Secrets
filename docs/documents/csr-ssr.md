# Guide Senior : CSR, SSR, SSG, Hydratation et Architecture Moderne Next.js

---

## 1. Définitions clés

### CSR (Client-Side Rendering)
- **Principe** : Le HTML initial est minimal, tout le rendu et la récupération de données se font côté client (navigateur) via JavaScript.
- **Avantages** :
  - Navigation ultra-fluide (SPA), transitions instantanées.
  - Personnalisation et interactions riches côté client.
  - Scalabilité (le serveur ne fait que servir des APIs).
- **Inconvénients** :
  - Premier chargement plus lent (JS à télécharger, fetch API).
  - SEO plus difficile (le contenu n'est pas visible par défaut pour les moteurs de recherche).
  - Accessibilité réduite si JS désactivé ou en erreur.

### SSR (Server-Side Rendering)
- **Principe** : Le serveur génère le HTML complet à chaque requête, avec les données déjà présentes.
- **Avantages** :
  - SEO optimal (le contenu est visible immédiatement).
  - Premier affichage rapide (Time To First Byte faible).
  - Partage de liens, réseaux sociaux, crawlers : tout fonctionne.
- **Inconvénients** :
  - Scalabilité limitée (le serveur travaille à chaque requête).
  - Navigation moins fluide (rechargement ou hydratation nécessaire).
  - Interactions dynamiques nécessitent du JS côté client.

### SSG (Static Site Generation) / ISR (Incremental Static Regeneration)
- **Principe** : Le HTML est généré au build (SSG) ou périodiquement (ISR), puis servi via CDN.
- **Avantages** :
  - Performance maximale (tout est prêt, servi en cache/CDN).
  - Scalabilité extrême.
  - SEO et accessibilité excellents.
- **Inconvénients** :
  - Moins adapté au contenu très dynamique ou personnalisé.
  - Nécessite une stratégie de revalidation/mise à jour.

### Hydratation
- **Principe** : Le HTML généré côté serveur (SSR/SSG) est "connecté" à React côté client pour rendre l'UI interactive.
- **But** : Combiner le meilleur du SSR (affichage instantané, SEO) et du CSR (interactivité, transitions, mutations dynamiques).

---

## 2. Comparatif visuel

| Critère                | CSR (Client) | SSR (Server) | SSG/ISR (Statique) |
|-----------------------|:------------:|:------------:|:------------------:|
| SEO                   |      ❌*     |      ✅      |        ✅          |
| Performance initiale  |      ❌      |      ✅      |        ✅✅        |
| Navigation fluide     |      ✅      |      ❌      |        ✅          |
| Personnalisation      |      ✅      |      ✅      |        ❌/✅       |
| Scalabilité           |      ✅      |      ❌      |        ✅✅        |
| Accessibilité         |      ❌      |      ✅      |        ✅          |
| Interactions dynamiques|     ✅      |      ✅      |        ✅          |

> *SEO possible en CSR avec Next.js/Remix si fallback SSR/SSG/ISR

---

## 3. Architecture moderne Next.js : Page Router vs App Router

### Page Router (`pages/`)
- Utilise `getServerSideProps`, `getStaticProps`, `getInitialProps` pour charger les données côté serveur.
- SSR/SSG explicite via ces fonctions.
- Moins flexible pour le découpage server/client.

### App Router (`app/`)
- **Tous les composants sont "server components" par défaut** : tu peux faire des fetchs/DB directement dans le composant (async/await).
- **Hydratation automatique** : tu passes les données initiales aux client components via props.
- **Interactivité** : tu utilises `'use client'` pour les composants interactifs (état local, hooks, mutations, etc.).
- **Streaming/Suspense** : tu peux afficher des fallback pendant que certaines parties chargent.
- **Pas besoin de `getServerSideProps`/`getStaticProps`** : tout se fait naturellement dans le composant.

#### Exemple App Router
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
import { useState } from 'react'

export function CourseClient({ initialCourse }) {
  const [course, setCourse] = useState(initialCourse)
  // ...interactivité, mutations, etc.
  return <div>{course.title}</div>
}
```

---

## 4. Pattern senior recommandé

### 1. **Charger les données initiales côté serveur (SSR/SSG/ISR)**
- Utilise les server components pour fetcher les données critiques (cours, chapitres, contenu statique, etc.).
- Le HTML généré contient déjà les données → affichage instantané, SEO, accessibilité.

### 2. **Hydrater et gérer l'interactivité côté client (CSR)**
- Passe les données initiales aux client components via props.
- Utilise React Query/SWR pour le cache, les mutations, l'optimistic UI.
- Navigation client-side (`useRouter().push`), transitions instantanées, prefetch automatique.

### 3. **Sécurité et permissions**
- Les contrôles d'accès critiques (draft, droits, etc.) doivent toujours être vérifiés côté serveur.
- L'UI peut masquer les boutons côté client, mais la sécurité doit être côté serveur.

### 4. **Streaming et Suspense**
- Utilise le streaming pour afficher rapidement les parties critiques, puis charger le reste en arrière-plan.
- Suspense pour les loaders intelligents.

---

## 5. FAQ et conseils pratiques

### Q : Peut-on avoir une UX instantanée en CSR pur ?
- Non, il y aura toujours un délai initial (JS + fetch API). Pour une UX instantanée, il faut hydrater avec des données initiales côté serveur.

### Q : Faut-il tout mettre en SSR ?
- Non, SSR/SSG pour le contenu statique ou peu personnalisé, CSR pour l'interactivité, la personnalisation, le temps réel.

### Q : Comment organiser son code dans l'App Router ?
- Server components pour le fetch initial, client components pour l'interactivité. Passe les données initiales en props.

### Q : Comment gérer le cache et l'optimistic UI ?
- Utilise React Query/SWR côté client, hydrate avec les données initiales, active l'optimistic UI pour les mutations.

---

## 6. Conclusion

- **La meilleure architecture moderne combine SSR/SSG/ISR pour le contenu initial et CSR pour l'interactivité.**
- **L'App Router de Next.js permet ce découpage de façon naturelle et puissante.**
- **C'est la base d'une application web "senior" : instantanée, SEO, interactive, maintenable et scalable.**

---

**Pour aller plus loin :**
- [Next.js App Router Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [React Server Components](https://react.dev/reference/react-server-components)
- [React Query Hydration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)

