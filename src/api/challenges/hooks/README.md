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

## Execution Flow

1. User navigates to a new challenge
2. The `layout.tsx` receives the new challenge
3. The `key` prop forces remounting of `ChallengeProvider`
4. The `ChallengeProvider` detects the `challenge.id` change
5. The `useStoreReset` hook resets all stores
6. The `ChallengeExercice` initializes the editor with new data

## Important Considerations

- Persisted stores only reset non-persisted values
- Editor initialization is deferred to avoid conflicts
- The system is optimized to minimize unnecessary re-renders