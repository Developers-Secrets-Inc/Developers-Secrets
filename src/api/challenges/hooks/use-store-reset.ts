import { useChallengeUIStore } from '../stores/challenge-ui-store'
import { useEditorStore } from '../../../core/compiler/code-editor/store/editor-store'
import { useEditorTabsStore } from '../../../core/compiler/code-editor/store/editor-tabs-store'
import { useFileExplorerStore } from '../../../core/compiler/code-editor/store/file-explorer-store'
import { useFooterStore } from '../../../core/compiler/code-editor/store/footer-store'

/**
 * Hook centralisé pour réinitialiser tous les stores Zustand
 * lors de la navigation entre les challenges
 */
export const useStoreReset = () => {
  const resetChallengeUI = useChallengeUIStore((state) => state.reset)
  const resetEditor = useEditorStore((state) => state.reset)
  const resetEditorTabs = useEditorTabsStore((state) => state.reset)
  const resetFileExplorer = useFileExplorerStore((state) => state.reset)
  const resetFooter = useFooterStore((state) => state.reset)

  const resetAllStores = () => {
    // Réinitialise tous les stores dans l'ordre approprié
    resetChallengeUI()
    resetEditor()
    resetEditorTabs()
    resetFileExplorer()
    resetFooter()
  }

  return { resetAllStores }
}