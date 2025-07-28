# Store Reset System

This system manages the automatic reset of Zustand stores when navigating between challenges.

## Architecture

### Centralized Hook: `useStoreReset`

The `useStoreReset` hook centralizes the reset logic for all concerned stores:

- `useChallengeUIStore` - Challenge user interface state
- `useEditorStore` - Code editor state
- `useEditorTabsStore` - Editor tabs state
- `useFileExplorerStore` - File explorer state
- `useFooterStore` - Footer panel state

### Integration in `ChallengeProvider`

The `ChallengeProvider` uses the `useStoreReset` hook and monitors `challenge.id` changes to trigger reset automatically.

### Optimization with `key` prop

The `ChallengeProvider` in `layout.tsx` uses a `key={challenge.value.id}` prop to force component remounting when challenge changes.

### Side Effects Management

The `ChallengeExercice` component uses a `setTimeout` to ensure editor initialization happens after store reset.

## Affected Stores

Each store has a `reset()` method that restores state to its initial values:

### `challenge-ui-store`
- Resets only non-persisted values (`isChatActive`, `isCompletionDialogOpen`)
- Preserves `viewMode` which is persisted in localStorage

### `editor-store`
- Resets `fileTree` and `activeFileId`

### `editor-tabs-store`
- Resets `openTabs` and `activeTabId`

### `file-explorer-store`
- Resets `isOpen` to `true`

### `footer-store`
- Resets `isOpen`, `activeTabId` and `executionOutput`

## Flux d'exécution

1. L'utilisateur navigue vers un nouveau challenge
2. Le `layout.tsx` reçoit le nouveau challenge
3. La prop `key` force le remontage du `ChallengeProvider`
4. Le `ChallengeProvider` détecte le changement de `challenge.id`
5. Le hook `useStoreReset` réinitialise tous les stores
6. Le `ChallengeExercice` initialise l'éditeur avec les nouvelles données

## Considérations importantes

- Les stores persistés ne réinitialisent que les valeurs non persistées
- L'initialisation de l'éditeur est différée pour éviter les conflits
- Le système est optimisé pour minimiser les re-rendus inutiles