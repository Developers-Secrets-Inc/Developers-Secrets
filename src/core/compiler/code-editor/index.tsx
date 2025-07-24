import { Button } from '@/components/ui/button'
import { ListIcon, Play } from 'lucide-react'

import {
  CodeEditorContainer,
  CodeEditorHeaderContainer,
  CodeEditorHeaderLeftPart,
  CodeEditorHeaderRightPart,
} from './components/layout'
import { Footer } from './components/footer'
import { ChallengeEditor, ChallengeEditorContainer } from './components/editor'
import { FileExplorer, FileExplorerTrigger } from './components/file-explorer'
import { FileBreadcrumb } from './components/file-breadcrumb'
import EditorTabs from './components/tabs'

export const RunCodeButton = () => {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-8"
      //   onClick={onRun}
      //   disabled={isRunning || isDisabled}
    >
      {/* <LoadingIcon isLoading={isRunning}> */}
      <Play size={14} className="mr-1" />
      {/* </LoadingIcon> */}
      Run
    </Button>
  )
}

export const FileSystemButton = () => {
  return <FileExplorerTrigger />
}

export const CodeEditor = {
  Container: CodeEditorContainer,
  Header: {
    Container: CodeEditorHeaderContainer,
    LeftPart: CodeEditorHeaderLeftPart,
    RightPart: CodeEditorHeaderRightPart,
  },
  Editor: {
    Container: ChallengeEditorContainer,
    Tabs: EditorTabs,
    Content: ChallengeEditor,
  },
  FileExplorer: FileExplorer,
  FileBreadcrumb: FileBreadcrumb,
  Footer: Footer,
  RunButton: RunCodeButton,
  FileSystemButton: FileSystemButton,
}

/*

- On doit avoir un éditeur de code dans lequel on peut écrire du code, le lancer et voir le résultat dans un terminal. On veut développer un système qui permet de l'étendre librement.


- Ce n'est pas le rôle de cet éditeur mais on doit faire en sorte de pouvoir résoudre le challenge avec plusieurs langages. On ne doit pas fournir un support direct multi langage car c'est un éditeur de code et non pas un IDE de challenge.
- On doit ajouter des primitives qui permettent d'ajouter des comportement supplémentaires à chaque composant. On doit par exemple pour ajouter un primitive à l'éditeur de code monaco pour ajouter une sauvegarde du code dans la base de données. 
- On doit avoir un support multi fichier natif avec des listeners pour les événements de modification de fichier.
  - On pourra donc gérer le lancement de chaque fichier individuellement.


Les composants principaux de cet IDE sont le header, l'éditeur de code et le terminal (footer).


Dans les composants natifs on a : 
- Le bouton pour lancer le code (client uniquement, pyodide ou worker js/ts)
- Le bouton pour ouvrir le gestionnaire de fichier 
- Le gestionnaire de fichiers 
- Le footer 


On doit aussi donc avoir une gestion du fichier actuellement ouvert. On doit pouvoir créer de nouveaux dossiers et fichiers et que ça soit gérer correctement par le système, idem pour la suppression. On doit pouvoir gérer le fait qu'on fichier puisse être supprimé (utile pour les challenges avec des fichiers obligatoires)

On doit commencer avec une première version du système où on n'a pas encore le gestionnaire de fichiers.

  */
