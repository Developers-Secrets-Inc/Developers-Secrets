---
description: 
globs: 
alwaysApply: true
---
- **Flow de développement standard pour une nouvelle fonctionnalité**
  - **1. Définir les collections Payload CMS**
    - Créer ou modifier les collections nécessaires dans `src/collections/` pour modéliser les données métier.
    - S'assurer que les schémas sont typés et validés (Zod, TypeScript).
    - Exemple : [UserInformations.ts](mdc:src/collections/UserInformations.ts)

  - **2. Développer les actions serveur**
    - Implémenter les actions serveur (fonctions d'orchestration, accès aux données, logique métier) dans `src/core/` ou `src/actions/`.
    - Utiliser le typage fort et le pattern Result pour les retours.
    - Exemple : [auth.ts](mdc:src/actions/auth.ts)

  - **3. Développer les hooks React Query**
    - Créer des hooks personnalisés pour la récupération et la mutation des données côté client, en s'appuyant sur les actions serveur.
    - Utiliser `@tanstack/react-query` pour la gestion de l'état distant, le cache, et les mutations.
    - Exemple : [use-user.ts](mdc:src/core/user/hooks/use-user.ts)

  - **4. Développer les composants et les pages**
    - Construire les composants UI et les pages en utilisant les hooks précédents.
    - Respecter la séparation server/client, la responsabilité unique, et la taille maximale des composants.
    - Exemple : [SignUpCard.tsx](mdc:src/app/(frontend)/auth/components/SignUpCard.tsx), [login/page.tsx](mdc:src/app/(frontend)/auth/login/page.tsx)

- **Bonnes pratiques**
  - Toujours partir du modèle de données (Payload) pour garantir la cohérence.
  - Factoriser la logique métier dans les actions serveur, jamais dans les hooks ou composants.
  - Les hooks ne font que relayer les actions serveur et gérer l'état côté client.
  - Les composants/pages orchestrent l'affichage et les interactions UI.

- **Références**
  - [UserInformations.ts](mdc:src/collections/UserInformations.ts)
  - [auth.ts](mdc:src/actions/auth.ts)
  - [use-user.ts](mdc:src/core/user/hooks/use-user.ts)
  - [SignUpCard.tsx](mdc:src/app/(frontend)/auth/components/SignUpCard.tsx)
  - [login/page.tsx](mdc:src/app/(frontend)/auth/login/page.tsx)

