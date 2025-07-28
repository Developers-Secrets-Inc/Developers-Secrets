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

The `ChallengeProvider` uses the `useStoreReset` hook and triggers reset on every mount/challenge change for maximum reliability.

### Optimization with `key` prop

The `ChallengeProvider` in `layout.tsx` uses a `key={challenge.value.id}` prop to force component remounting when challenge changes.

### Synchronous Reset

The store reset is now synchronous, eliminating timing issues and allowing direct editor initialization.

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
4. The `ChallengeProvider` immediately resets all stores on mount
5. The `ChallengeExercice` initializes the editor directly with clean state
6. All components render with fresh, reset state

## Important Considerations

- Persisted stores only reset non-persisted values
- Store reset is now synchronous and immediate on component mount
- The system uses `useCallback` for performance optimization
- Reset order is optimized: UI stores first, then editor stores
- No timing delays needed - initialization is safe and direct