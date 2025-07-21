'use client'

import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import { useIDEStore } from '../store'

type RunButtonProps = {
  onRun?: (code: string) => void
}

export const RunButton = ({ onRun }: RunButtonProps) => {
  const { codeByLanguage, language, runCode } = useIDEStore()

  const handleRun = () => {
    runCode()
    if (onRun) onRun(codeByLanguage[language] || '')
  }

  return (
    <Button variant="secondary" size="sm" className="h-8" onClick={handleRun}>
      <Play size={14} className="mr-1" />
      Run
    </Button>
  )
}
