import { useCallback } from 'react'
import { useChallengeUIStore } from '../stores/challenge-ui-store'
import { useEditorStore } from '../../../core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '../../../core/compiler/code-editor/store/editor-tabs-store'
import { useFileExplorerStore } from '../../../core/compiler/code-editor/store/file-explorer-store'
import { useFooterStore } from '../../../core/compiler/code-editor/store/footer-store'

/**
 * Centralized hook to reset Zustand stores with granular control
 * Supports different reset strategies for challenge changes vs page refreshes
 */
export const useStoreReset = () => {
  const resetChallengeUI = useChallengeUIStore((state) => state.reset)
  const resetAllChallengeUI = useChallengeUIStore((state) => state.resetAll)
  const resetEditor = useEditorStore((state) => state.reset)
  const resetEditorTabs = useEditorTabsStore((state) => state.reset)
  const resetFileExplorer = useFileExplorerStore((state) => state.reset)
  const resetFooter = useFooterStore((state) => state.reset)

  // Reset only UI-related stores (for page refreshes)
  const resetUIStores = useCallback(() => {
    resetChallengeUI()
  }, [resetChallengeUI])

  // Reset only editor-related stores (for specific scenarios)
  const resetEditorStores = useCallback(() => {
    resetFooter()
    resetEditor()
    resetEditorTabs()
    resetFileExplorer()
  }, [resetFooter, resetEditor, resetEditorTabs, resetFileExplorer])

  // Reset all stores (for challenge changes)
  const resetAllStores = useCallback(() => {
    // Reset all stores in optimized order: UI first, then editor
    resetAllChallengeUI() // Use resetAll to include viewMode
    resetFooter()
    resetEditor()
    resetEditorTabs()
    resetFileExplorer()
  }, [resetAllChallengeUI, resetFooter, resetEditor, resetEditorTabs, resetFileExplorer])

  return { 
    resetUIStores,
    resetEditorStores, 
    resetAllStores 
  }
}