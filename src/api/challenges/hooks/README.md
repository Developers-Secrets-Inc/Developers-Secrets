# Intelligent Store Reset System

This system manages the automatic reset of Zustand stores with intelligent detection of challenge changes vs page refreshes.

## Architecture

### Centralized Hook: `useStoreReset`

The `useStoreReset` hook provides granular reset control for all concerned stores:

- `useChallengeUIStore` - Challenge user interface state
- `useEditorStore` - Code editor state
- `useEditorTabsStore` - Editor tabs state
- `useFileExplorerStore` - File explorer state
- `useFooterStore` - Footer panel state

### Reset Strategies

- **`resetUIStores()`** - Resets only UI-related stores (for page refreshes)
- **`resetEditorStores()`** - Resets only editor-related stores (for specific scenarios)
- **`resetAllStores()`** - Resets all stores completely (for challenge changes)

### Integration in `ChallengeProvider`

The `ChallengeProvider` uses intelligent detection to determine the appropriate reset strategy:
- Uses `sessionStorage` to track the current challenge ID
- Differentiates between challenge changes and page refreshes
- Applies the appropriate reset strategy based on the detected scenario

### No Forced Remounting

The system no longer relies on `key` prop remounting, providing better performance and state preservation when appropriate.

### Synchronous Reset

All store resets are synchronous, eliminating timing issues and allowing direct editor initialization.

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

### Challenge Change
1. User navigates to a new challenge
2. The `ChallengeProvider` detects the challenge ID change
3. `resetAllStores()` is called to completely reset all stores
4. `sessionStorage` is updated with the new challenge ID
5. The `ChallengeExercice` initializes the editor with clean state

### Page Refresh
1. User refreshes the page on the same challenge
2. The `ChallengeProvider` detects it's the same challenge ID
3. `resetUIStores()` is called to reset only UI state
4. Editor state (files, tabs) is preserved from previous session
5. The `ChallengeExercice` continues with existing editor state

## Important Considerations

- **Smart Detection**: Uses `sessionStorage` to differentiate challenge changes from page refreshes
- **Granular Reset**: Different reset strategies preserve editor state when appropriate
- **Performance**: No forced component remounting, better React performance
- **Persistence**: Editor state is naturally preserved on page refresh
- **Synchronous**: All resets are immediate and synchronous
- **Optimized Order**: UI stores reset first, then editor stores when needed
- **Callback Optimization**: Uses `useCallback` for performance

## Resolved Issues

- ✅ Completion dialog no longer stays open after challenge change
- ✅ Test results are properly cleared between challenges
- ✅ File duplication issues resolved
- ✅ Editor state preserved on page refresh
- ✅ Improved performance without forced remounting