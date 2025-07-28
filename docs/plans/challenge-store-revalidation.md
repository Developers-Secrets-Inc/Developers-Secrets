# Challenge Store Revalidation - Complete Development Plan

## Problem Statement

Currently, when users switch between challenges, Zustand stores retain their previous state, causing data persistence issues. The `ChallengeExercice` component uses a `setTimeout` hack to work around timing issues, which is an anti-pattern that creates race conditions and unreliable behavior.

## Architecture Analysis

### Current Issues

1. **Race Conditions**: The `setTimeout(initializeEditor, 0)` in `challenge-exercice.tsx` is a timing hack
2. **No Coordinated Reset**: Stores persist data between challenge switches
3. **Missing Reset Implementation**: The documented `useStoreReset` hook doesn't exist
4. **Violation of SRP**: `ChallengeExercice` handles both UI and state management
5. **Unreliable State**: No guarantee that stores are clean before initialization

### Recommended Solution: Component Remounting Pattern

The most robust approach is to use React's key prop to force component remounting when the challenge changes. This guarantees a clean state without complex reset logic.

## Implementation Plan

### Phase 1: Store Reset Methods Implementation

#### 1.1 Complete Missing Reset Methods

**Files to modify:**

##### `src/core/compiler/code-editor/store/editor-store.ts`
```typescript
// Add complete reset implementation
reset: () => set({
  fileTree: [],
  activeFileId: null
})
```

##### `src/core/compiler/code-editor/store/editor-tabs-store.ts`
```typescript
// Add complete reset implementation
reset: () => set({
  openTabs: [],
  activeTabId: null
})
```

##### `src/core/compiler/code-editor/store/file-explorer-store.ts`
```typescript
// Add reset method if missing
reset: () => set({
  isOpen: true // Default state
})
```

##### `src/core/compiler/code-editor/store/footer-store.ts`
```typescript
// Add complete reset implementation
reset: () => set({
  isOpen: false,
  activeTabId: null,
  executionOutput: null
})
```

##### `src/core/challenges/store/challenge-ui-store.ts`
```typescript
// Add selective reset (preserve persisted values)
reset: () => set((state) => ({
  ...state,
  isChatActive: false,
  isCompletionDialogOpen: false
  // viewMode is preserved as it's persisted
}))
```

### Phase 2: Centralized Reset Hook

#### 2.1 Create `useStoreReset` Hook

**New file:** `src/api/challenges/hooks/use-store-reset.ts`

```typescript
'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { useFooterStore } from '@/core/compiler/code-editor/store/footer-store'
import { useChallengeUIStore } from '@/core/challenges/store/challenge-ui-store'

/**
 * Centralized hook for resetting all challenge-related stores
 * This ensures a clean state when switching between challenges
 */
export const useStoreReset = () => {
  const resetEditor = useEditorStore(state => state.reset)
  const resetEditorTabs = useEditorTabsStore(state => state.reset)
  const resetFileExplorer = useFileExplorerStore(state => state.reset)
  const resetFooter = useFooterStore(state => state.reset)
  const resetChallengeUI = useChallengeUIStore(state => state.reset)

  const resetAllStores = useCallback(() => {
    // Reset all stores synchronously
    resetEditor()
    resetEditorTabs()
    resetFileExplorer()
    resetFooter()
    resetChallengeUI()
  }, [resetEditor, resetEditorTabs, resetFileExplorer, resetFooter, resetChallengeUI])

  return { resetAllStores }
}
```

### Phase 3: Challenge Lifecycle Management

#### 3.1 Create Challenge Lifecycle Hook

**New file:** `src/api/challenges/hooks/use-challenge-lifecycle.ts`

```typescript
'use client'

import { useEffect, useCallback } from 'react'
import { useStoreReset } from './use-store-reset'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { AiExercice, Exercice } from '@/payload-types'
import { FileSystemNode, FileNode } from '@/core/compiler/code-editor/types'

// Types from challenge-exercice.tsx
type FileStructureItem = {
  id?: string | null
  type: 'file' | 'folder'
  name: string
  parentId?: string | null
  language?: ('python' | 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'markdown' | 'text') | null
  content?: string | null
  isReadOnly?: boolean | null
  isHidden?: boolean | null
  isMainFile?: boolean | null
}

/**
 * Hook that manages the complete lifecycle of a challenge
 * Handles reset and initialization in a coordinated manner
 */
export const useChallengeLifecycle = (exercice: Exercice | AiExercice) => {
  const { resetAllStores } = useStoreReset()
  const { setFileTree, setActiveFileId } = useEditorStore()
  const { openTab } = useEditorTabsStore()

  // Utility functions (moved from challenge-exercice.tsx)
  const getFileStructureForLanguage = useCallback((exercice: Exercice | AiExercice, language: string): FileStructureItem[] => {
    const languageData = exercice.languages?.find((lang) => lang.language === language)
    return languageData?.fileStructure || []
  }, [])

  const findMainFile = useCallback((fileStructure: FileStructureItem[]): string | null => {
    const mainFile = fileStructure.find((item) => item.type === 'file' && item.isMainFile === true)
    return mainFile?.id || null
  }, [])

  const getDefaultLanguage = useCallback((exercice: Exercice | AiExercice): string => {
    return exercice.languages?.[0]?.language || 'javascript'
  }, [])

  const transformFileStructureToFileTree = useCallback((fileStructure: FileStructureItem[]): FileSystemNode[] => {
    // Implementation from challenge-exercice.tsx
    // ... (copy the existing implementation)
  }, [])

  const findFirstFile = useCallback((nodes: FileSystemNode[]): FileSystemNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') {
        return node
      }
      if (node.type === 'folder' && node.children) {
        const found = findFirstFile(node.children)
        if (found) return found
      }
    }
    return null
  }, [])

  const initializeEditor = useCallback((exercice: Exercice | AiExercice) => {
    const defaultLanguage = getDefaultLanguage(exercice)
    const fileStructure = getFileStructureForLanguage(exercice, defaultLanguage)
    const transformedFileTree = transformFileStructureToFileTree(fileStructure)

    setFileTree(transformedFileTree)

    const mainFileId = findMainFile(fileStructure)
    if (mainFileId && transformedFileTree.length > 0) {
      const mainFile = fileStructure.find((item) => item.id === mainFileId)
      if (mainFile && mainFile.language) {
        setActiveFileId(mainFileId)
        openTab(mainFileId, mainFile.name, mainFile.language)
      }
    } else if (transformedFileTree.length > 0) {
      const firstFile = findFirstFile(transformedFileTree)
      if (firstFile && firstFile.type === 'file') {
        setActiveFileId(firstFile.id)
        openTab(firstFile.id, firstFile.name, firstFile.language)
      }
    }
  }, [setFileTree, setActiveFileId, openTab, getDefaultLanguage, getFileStructureForLanguage, transformFileStructureToFileTree, findMainFile, findFirstFile])

  // Coordinated reset and initialization
  useEffect(() => {
    // Reset all stores first
    resetAllStores()
    
    // Then initialize with new data
    initializeEditor(exercice)
  }, [exercice.id, resetAllStores, initializeEditor]) // Depend on exercice.id for challenge changes

  return {
    resetAllStores,
    initializeEditor
  }
}
```

### Phase 4: Component Remounting Implementation

#### 4.1 Modify Layout Components

**Files to modify:**

##### `src/app/(frontend)/(dashboard)/challenges/[challenge_slug]/layout.tsx`

```typescript
// Add key prop to force remounting
<ChallengeProvider
  key={challenge.value.id} // This forces remounting when challenge changes
  challenge={challenge.value}
  metadata={{
    challengeAiChat: challengeAIChat,
    messages,
    quotas,
    completionCurrency: getCurrencyOnCompletion(challenge.value),
  }}
>
  {/* Rest of the component */}
</ChallengeProvider>
```

##### `src/app/(frontend)/(dashboard)/new-challenges/[challenge_slug]/layout.tsx`

```typescript
// Apply the same pattern
<ChallengeProvider
  key={challenge.value.id}
  challenge={challenge.value}
  metadata={{
    challengeAiChat: challengeAIChat,
    messages,
    quotas,
    completionCurrency: getCurrencyOnCompletion(challenge.value),
  }}
>
  {/* Rest of the component */}
</ChallengeProvider>
```

#### 4.2 Refactor ChallengeExercice Component

**File to modify:** `src/api/challenges/components/challenge-exercice.tsx`

```typescript
'use client'

import { useChallengeLifecycle } from '@/api/challenges/hooks/use-challenge-lifecycle'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { CodeEditor } from '@/core/compiler/code-editor'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { cn } from '@/lib/utils'
import { AiExercice, Exercice } from '@/payload-types'
import { OutputContent } from '@/core/compiler/code-editor/components/output-content'
import { SubmitButton } from './submit-button'
import { SubmitButton as AISubmitButton } from '@/api/exercices/ai/components/ai-exercice-submit-button'
import { TestResults } from '../submissions/components/test-results'

// Footer tabs configuration
const footerTabs = [
  {
    id: 'output',
    title: 'Output',
    content: <OutputContent />,
    icon: 'file-output',
  },
  {
    id: 'tests',
    title: 'Tests',
    content: <TestResults />,
    icon: 'beaker',
  },
]

export const ChallengeExercice = ({ exercice }: { exercice: Exercice | AiExercice }) => {
  const { isOpen } = useFileExplorerStore()
  
  // Use the lifecycle hook instead of manual useEffect
  useChallengeLifecycle(exercice)

  return (
    <CodeEditor.Container>
      <ResizablePanelGroup direction="horizontal" className="relative flex flex-1 overflow-hidden">
        <ResizablePanel
          className={cn(!isOpen && 'hidden')}
          defaultSize={20}
          minSize={15}
          maxSize={40}
        >
          <CodeEditor.FileExplorer />
        </ResizablePanel>
        <ResizableHandle className={cn(!isOpen && 'hidden')} />
        <ResizablePanel defaultSize={80}>
          <CodeEditor.Header.Container>
            <CodeEditor.Header.LeftPart>
              <CodeEditor.Editor.Tabs />
            </CodeEditor.Header.LeftPart>
            <CodeEditor.Header.RightPart>
              <CodeEditor.RunButton />
              {'prompts' in exercice ? <AISubmitButton /> : <SubmitButton />}
            </CodeEditor.Header.RightPart>
          </CodeEditor.Header.Container>
          <CodeEditor.FileBreadcrumb />
          <CodeEditor.Editor.Container>
            <CodeEditor.Editor.Content />
          </CodeEditor.Editor.Container>
        </ResizablePanel>
        <CodeEditor.FileSystemButton />
      </ResizablePanelGroup>
      <CodeEditor.Footer tabs={footerTabs} />
    </CodeEditor.Container>
  )
}
```

### Phase 5: Enhanced ChallengeProvider

#### 5.1 Add Reset Logic to ChallengeProvider

**File to modify:** `src/api/challenges/contexts/components/challenge-provider.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { Challenge, ChallengeAiChat } from '@/payload-types'
import { ChallengeContext } from '../challenge-context'
import { useStoreReset } from '@/api/challenges/hooks/use-store-reset'
import { Message } from 'ai'

export const ChallengeProvider = ({
  children,
  challenge,
  metadata
}: {
  children: React.ReactNode
  challenge: Challenge
  metadata: {
    challengeAiChat: ChallengeAiChat
    messages: Message[]
    quotas: number
    completionCurrency: number
  }
}) => {
  const { resetAllStores } = useStoreReset()

  // Reset stores when challenge changes (backup to key prop)
  useEffect(() => {
    resetAllStores()
  }, [challenge.id, resetAllStores])

  return (
    <ChallengeContext.Provider value={{ challenge, metadata }}>
      {children}
    </ChallengeContext.Provider>
  )
}
```

### Phase 6: Testing Strategy

#### 6.1 Create Test Utilities

**New file:** `src/api/challenges/hooks/__tests__/use-store-reset.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'
import { useStoreReset } from '../use-store-reset'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'

// Mock the stores
jest.mock('@/core/compiler/code-editor/store/editor-store')
jest.mock('@/core/compiler/code-editor/store/editor-tabs-store')
// ... other mocks

describe('useStoreReset', () => {
  it('should reset all stores when called', () => {
    const mockResetEditor = jest.fn()
    const mockResetTabs = jest.fn()
    
    ;(useEditorStore as jest.Mock).mockReturnValue(mockResetEditor)
    ;(useEditorTabsStore as jest.Mock).mockReturnValue(mockResetTabs)
    
    const { result } = renderHook(() => useStoreReset())
    
    act(() => {
      result.current.resetAllStores()
    })
    
    expect(mockResetEditor).toHaveBeenCalled()
    expect(mockResetTabs).toHaveBeenCalled()
  })
})
```

#### 6.2 Integration Tests

**New file:** `src/api/challenges/components/__tests__/challenge-exercice.integration.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { ChallengeExercice } from '../challenge-exercice'
import { mockExercice } from '../__mocks__/exercice'

describe('ChallengeExercice Integration', () => {
  it('should initialize editor with clean state', () => {
    render(<ChallengeExercice exercice={mockExercice} />)
    
    // Verify that editor is initialized properly
    expect(screen.getByTestId('code-editor')).toBeInTheDocument()
    
    // Verify that stores are in clean state
    // Add specific assertions based on your requirements
  })
  
  it('should reset state when exercice changes', () => {
    const { rerender } = render(<ChallengeExercice exercice={mockExercice} />)
    
    // Change exercice
    const newExercice = { ...mockExercice, id: 'different-id' }
    rerender(<ChallengeExercice exercice={newExercice} />)
    
    // Verify that state was reset and re-initialized
    // Add specific assertions
  })
})
```

### Phase 7: Performance Optimization

#### 7.1 Memoization Strategy

**File to modify:** `src/api/challenges/hooks/use-challenge-lifecycle.ts`

```typescript
// Add memoization for expensive operations
import { useMemo } from 'react'

export const useChallengeLifecycle = (exercice: Exercice | AiExercice) => {
  // Memoize file structure transformation
  const fileStructure = useMemo(() => {
    const defaultLanguage = getDefaultLanguage(exercice)
    return getFileStructureForLanguage(exercice, defaultLanguage)
  }, [exercice.id, exercice.languages])

  const transformedFileTree = useMemo(() => {
    return transformFileStructureToFileTree(fileStructure)
  }, [fileStructure])

  // Rest of the implementation...
}
```

#### 7.2 Selective Re-rendering

**File to modify:** `src/api/challenges/contexts/components/challenge-provider.tsx`

```typescript
import { memo } from 'react'

// Memoize the provider to prevent unnecessary re-renders
export const ChallengeProvider = memo(({
  children,
  challenge,
  metadata
}: {
  children: React.ReactNode
  challenge: Challenge
  metadata: {
    challengeAiChat: ChallengeAiChat
    messages: Message[]
    quotas: number
    completionCurrency: number
  }
}) => {
  // Implementation...
})

ChallengeProvider.displayName = 'ChallengeProvider'
```

### Phase 8: Documentation and Migration

#### 8.1 Update README

**File to modify:** `src/api/challenges/hooks/README.md`

```markdown
# Store Reset System - Updated

This system manages the automatic reset of Zustand stores when navigating between challenges using a component remounting strategy.

## Architecture

### Primary Strategy: Component Remounting

The system uses React's `key` prop on `ChallengeProvider` to force component remounting when the challenge ID changes. This guarantees a clean state without complex reset logic.

### Backup Strategy: Coordinated Reset

As a backup mechanism, the `ChallengeProvider` also includes explicit store reset logic.

### Hooks

- `useStoreReset`: Centralized store reset functionality
- `useChallengeLifecycle`: Manages complete challenge lifecycle

### Benefits

1. **Reliability**: Component remounting guarantees clean state
2. **Simplicity**: No complex timing logic required
3. **Performance**: Remounting only occurs on challenge changes
4. **Maintainability**: Less code to maintain
5. **Predictability**: Deterministic behavior

## Migration Guide

1. Remove `setTimeout` hacks from components
2. Use `useChallengeLifecycle` instead of manual `useEffect`
3. Ensure all stores have proper `reset()` methods
4. Add `key` prop to `ChallengeProvider` in layouts
```

#### 8.2 Create Migration Checklist

**New file:** `docs/plans/challenge-store-revalidation-checklist.md`

```markdown
# Migration Checklist

## Phase 1: Store Reset Methods
- [ ] Complete `reset()` method in `editor-store.ts`
- [ ] Complete `reset()` method in `editor-tabs-store.ts`
- [ ] Add `reset()` method in `file-explorer-store.ts`
- [ ] Complete `reset()` method in `footer-store.ts`
- [ ] Complete `reset()` method in `challenge-ui-store.ts`

## Phase 2: Hooks
- [ ] Create `use-store-reset.ts`
- [ ] Create `use-challenge-lifecycle.ts`
- [ ] Test hooks in isolation

## Phase 3: Component Updates
- [ ] Add `key` prop to `ChallengeProvider` in challenge layout
- [ ] Add `key` prop to `ChallengeProvider` in new-challenge layout
- [ ] Refactor `ChallengeExercice` component
- [ ] Update `ChallengeProvider` with reset logic

## Phase 4: Testing
- [ ] Unit tests for hooks
- [ ] Integration tests for components
- [ ] Manual testing of challenge switching
- [ ] Performance testing

## Phase 5: Documentation
- [ ] Update README
- [ ] Create migration guide
- [ ] Update code comments
```

## Implementation Timeline

### Week 1: Foundation
- Implement store reset methods
- Create and test `useStoreReset` hook
- Unit tests for reset functionality

### Week 2: Core Logic
- Implement `useChallengeLifecycle` hook
- Refactor `ChallengeExercice` component
- Integration tests

### Week 3: Layout Integration
- Add key props to layouts
- Update `ChallengeProvider`
- End-to-end testing

### Week 4: Polish and Documentation
- Performance optimization
- Documentation updates
- Final testing and deployment

## Risk Mitigation

### Potential Issues
1. **Performance Impact**: Component remounting might be expensive
   - **Mitigation**: Memoization and selective re-rendering

2. **State Loss**: Important user state might be lost
   - **Mitigation**: Identify and preserve necessary state

3. **Timing Issues**: Race conditions during remounting
   - **Mitigation**: Proper dependency management in hooks

### Rollback Plan
1. Keep current implementation as backup
2. Feature flag for new system
3. Gradual rollout with monitoring
4. Quick rollback mechanism if issues arise

## Success Metrics

1. **Reliability**: Zero data persistence issues between challenges
2. **Performance**: No significant performance degradation
3. **Maintainability**: Reduced complexity in challenge components
4. **User Experience**: Smooth transitions between challenges

## Managing Persistence During Page Reload

### Problem Statement

When a user reloads the page on the same challenge, we do **NOT** want to trigger a complete store reset. The goal is to distinguish between:
- **Challenge change**: Reset required
- **Same challenge reload**: State preservation

### Implemented Solutions

#### 1. Detection Based on `exercice.id`

```typescript
// In useChallengeLifecycle
useEffect(() => {
  resetAllStores()
  initializeEditor(exercice)
}, [exercice.id, resetAllStores, initializeEditor]) // Reset ONLY if exercice.id changes
```

**Behavior**:
- **Challenge change**: `exercice.id` changes → Reset triggered
- **Same challenge reload**: `exercice.id` identical → No reset

#### 2. Selective Persistence in Stores

```typescript
// challenge-ui-store.ts
reset: () => set((state) => ({
  ...state,
  isChatActive: false,
  isCompletionDialogOpen: false
  // viewMode, userPreferences are preserved as they are persisted
}))
```

#### 3. Controlled Remounting Strategy

```typescript
// layout.tsx
<ChallengeProvider
  key={challenge.value.id} // Remounting ONLY if ID changes
  challenge={challenge.value}
  metadata={metadata}
>
```

### Data Preserved During Reload

1. **User preferences**:
   - `viewMode` (split, full-screen)
   - Panel sizes
   - Editor theme

2. **Editor state**:
   - Open files
   - Cursor position
   - Unsaved modified content

3. **Interface state**:
   - Open/closed panels
   - Active tabs

### Data Reset During Challenge Change

1. **Temporary state**:
   - Open dialogs
   - Error messages
   - Loading state

2. **Challenge-specific data**:
   - File structure
   - Running tests
   - Execution results

### Technical Implementation

#### Persistence Hook

```typescript
// use-challenge-persistence.ts
export const useChallengePersistence = (challengeId: string) => {
  const [lastChallengeId, setLastChallengeId] = useState<string | null>(null)
  
  const isNewChallenge = useMemo(() => {
    return lastChallengeId !== null && lastChallengeId !== challengeId
  }, [lastChallengeId, challengeId])
  
  useEffect(() => {
    setLastChallengeId(challengeId)
  }, [challengeId])
  
  return { isNewChallenge }
}
```

#### Conditional Reset

```typescript
// use-challenge-lifecycle.ts (enhanced version)
export const useChallengeLifecycle = (exercice: Exercice | AiExercice) => {
  const { isNewChallenge } = useChallengePersistence(exercice.id)
  const { resetAllStores } = useStoreReset()
  
  useEffect(() => {
    if (isNewChallenge) {
      // Reset only during challenge change
      resetAllStores()
    }
    
    // Initialization always necessary (even on reload)
    initializeEditor(exercice)
  }, [exercice.id, isNewChallenge, resetAllStores, initializeEditor])
}
```

### Benefits of This Approach

1. **Optimal user experience**: No work loss during reload
2. **Performance**: Avoids unnecessary resets
3. **Reliability**: Guaranteed reset during challenge change
4. **Flexibility**: Granular control over what is persisted

### Validation Tests

```typescript
describe('Challenge Persistence', () => {
  it('should preserve editor state on reload', () => {
    // Test that editor state is preserved
  })
  
  it('should reset state on challenge change', () => {
    // Test that state is reset during change
  })
  
  it('should preserve user preferences', () => {
    // Test that preferences survive changes
  })
})
```

This plan provides a comprehensive approach to solving the challenge store revalidation problem while maintaining system reliability and performance.