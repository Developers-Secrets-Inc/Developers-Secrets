---
description: 
globs: 
alwaysApply: true
---
- **Maximiser l'utilisation des composants serveur**
  - Par défaut, tous les composants React doivent être des composants serveur (`'use server'`).
  - Les composants serveur gèrent la logique, les accès aux données, et l'orchestration globale.
  - Exemple :
    ```tsx
    // ✅ DO: Composant serveur par défaut
    export default async function Dashboard() {
      const data = await getData();
      return <DashboardView data={data} />;
    }
    ```

- **Décomposer la logique client dans des sous-composants**
  - Si une nouvelle fonctionnalité nécessite du code client (état local, hooks, interactions, etc.), créer un sous-composant dédié avec `'use client'`.
  - Ne pas convertir tout le composant parent en composant client si seule une partie de la logique le nécessite.
  - Exemple :
    ```tsx
    // ✅ DO: Décomposer la logique client
    export default function ParentServerComponent() {
      return (
        <div>
          <ServerOnlyPart />
          <ClientOnlyPart />
        </div>
      );
    }

    // ClientOnlyPart.tsx
    'use client';
    export function ClientOnlyPart() {
      const [open, setOpen] = useState(false);
      return <button onClick={() => setOpen(o => !o)}>Toggle</button>;
    }
    ```

- **Responsabilités claires**
  - Le composant serveur doit rester responsable de la logique métier, des accès aux données et de l'orchestration.
  - Le composant client ne doit contenir que la logique strictement nécessaire côté client (UI interactive, hooks React, etc.).
  - Exemple :
    ```tsx
    // ❌ DON'T: Tout convertir en composant client
    'use client';
    export default function Dashboard() {
      // ... logique serveur ET client mélangée
    }
    ```

- **Références**
  - Voir la documentation Next.js sur les [Server Components](mdc:https:/nextjs.org/docs/getting-started/react-essentials#server-components) et [Client Components](mdc:https:/nextjs.org/docs/getting-started/react-essentials#client-components).
  - Exemples dans le code : [SignUpCard.tsx](mdc:src/app/(frontend)/auth/components/SignUpCard.tsx), [LoginCard.tsx](mdc:src/app/(frontend)/auth/components/LoginCard.tsx)


