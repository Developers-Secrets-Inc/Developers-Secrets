'use client'

import { useCallback } from 'react'
import { useEditorStore } from '@/core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '@/core/compiler/code-editor/store/editor-tabs-store'
import { useFileExplorerStore } from '@/core/compiler/code-editor/store/file-explorer-store'
import { useFooterStore } from '@/core/compiler/code-editor/store/footer-store'
import { useChallengeUIStore } from '@/api/challenges/stores/challenge-ui-store'
import { useSubmissionResultsStore } from '@/api/challenges/submissions/store/submission-results-store'

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
  const resetSubmissionResults = useSubmissionResultsStore(state => state.reset)

  const resetAllStores = useCallback(() => {
    // Reset all stores synchronously
    resetEditor()
    resetEditorTabs()
    resetFileExplorer()
    resetFooter()
    resetChallengeUI()
    resetSubmissionResults()
  }, [resetEditor, resetEditorTabs, resetFileExplorer, resetFooter, resetChallengeUI, resetSubmissionResults])

  return { resetAllStores }
}