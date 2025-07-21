---
description: 
globs: 
alwaysApply: true
---
- **Taille maximale : 200 lignes par composant/fichier**
  - Un composant React (ou un fichier de composant) ne doit pas dépasser 200 lignes de code effectif (hors imports, types, commentaires).
  - Si un composant dépasse cette limite, il doit être découpé en sous-composants ou fonctions utilitaires.
  - Exemple :
    ```tsx
    // ✅ DO: Découper un composant trop long
    export default function Dashboard() {
      return (
        <div>
          <Header />
          <DashboardContent />
          <Footer />
        </div>
      );
    }
    ```

- **Responsabilité unique**
  - Chaque composant/fichier doit implémenter une seule responsabilité claire (Single Responsibility Principle).
  - Ne pas mélanger logique métier, UI, et gestion d'état complexe dans un même composant.
  - Exemple :
    ```tsx
    // ✅ DO: Un composant = une responsabilité
    function UserAvatar(props) { /* ... */ }
    function UserDropdownMenu(props) { /* ... */ }
    // ❌ DON'T: Un composant qui gère tout (UI, logique, navigation, etc.)
    ```

- **Refactoring systématique**
  - Refactorer dès qu'un composant/fichier devient trop long ou trop complexe.
  - Utiliser des sous-composants, hooks personnalisés ou fonctions utilitaires pour extraire la logique.

- **Références**
  - Voir les exemples de découpage dans [user-avatar.tsx](mdc:src/core/user/components/user-avatar.tsx), [user-dropdown-menu.tsx](mdc:src/core/user/components/user-dropdown-menu.tsx)
  - Documentation : [Single Responsibility Principle](mdc:https:/en.wikipedia.org/wiki/Single-responsibility_principle)

