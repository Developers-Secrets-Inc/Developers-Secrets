import { useCallback } from 'react'
import { useChallengeUIStore } from '../stores/challenge-ui-store'
import { useEditorStore } from '../../../core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '../../../core/compiler/code-editor/store/editor-tabs-store'
import { useFileExplorerStore } from '../../../core/compiler/code-editor/store/file-explorer-store'
import { useFooterStore } from '../../../core/compiler/code-editor/store/footer-store'

/**
 * Centralized hook to reset all Zustand stores
 * when navigating between challenges
 */
export const useStoreReset = () => {
  const resetChallengeUI = useChallengeUIStore((state) => state.reset)
  const resetEditor = useEditorStore((state) => state.reset)
  const resetEditorTabs = useEditorTabsStore((state) => state.reset)
  const resetFileExplorer = useFileExplorerStore((state) => state.reset)
  const resetFooter = useFooterStore((state) => state.reset)

  const resetAllStores = useCallback(() => {
    // Reset all stores in optimized order: UI first, then editor
    resetChallengeUI()
    resetFooter()
    resetEditor()
    resetEditorTabs()
    resetFileExplorer()
  }, [resetChallengeUI, resetFooter, resetEditor, resetEditorTabs, resetFileExplorer])

  return { resetAllStores }
}