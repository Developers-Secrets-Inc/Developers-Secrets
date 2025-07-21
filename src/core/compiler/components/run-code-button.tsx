'use client'

import { useCodeEditor } from '../providers/code-editor-provider'
import { Button } from '@/components/ui/button'
import { Loader2, Play } from 'lucide-react'

/*  

Qu'est-ce qu'il se passe quand on clique sur le bouton pour lancer le code ?
- On doit récupérer le code actuel, le langage de ce code.
    - On doit définir que le code est en cours d'exécution.
    - On doit compiler ce code et définir le résultat de l'exécution.
- On doit définir que le code est exécuté

On ne veut pas avoir de couplage avec les autres composants, comme celui du footer par exemple. On aura généralement un terminal avec un tab `output` mais on ne veut pas avoir un lien direct type `openTerminal(true)`. 

C'est au niveau du terminal en lui même qu'on va décider quand est-ce qu'il va s'ouvrir.

*/

const RunningText = () => {
  return (
    <>
      <Loader2 size={14} className="mr-1 animate-spin" />
      Running...
    </>
  )
}

const RunText = () => {
  return (
    <>
      <Play size={14} className="mr-1" />
      Run
    </>
  )
}

export const RunCodeButton = () => {
  const { readOnly, isRunning, setIsRunning, language, code } = useCodeEditor()

  const handleRunCode = async () => {
    setIsRunning(true)
    console.log('Running code', language, code)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRunning(false)
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="h-8"
      onClick={handleRunCode}
      disabled={isRunning || readOnly}
    >
      {isRunning ? <RunningText /> : <RunText />}
    </Button>
  )
}
