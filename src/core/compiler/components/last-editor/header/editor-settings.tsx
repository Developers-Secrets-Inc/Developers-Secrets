import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIDEStore } from '../store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const EditorSettings = () => {
  const { language, codeByLanguage, initialize, availableLanguages } = useIDEStore()
  const [open, setOpen] = useState(false)

  // We assume that initialCode is the one from store initialization
  // For this, we need to keep a reference to initialCode per language
  // Here, we assume that codeByLanguage has not been modified since init
  // If this is not the case, we should store initialCodeByLanguage in the store

  // For the demo, we reset by calling initialize with the initial code for the current language
  const handleReset = () => {
    // We get the initial code of the current language
    const initialCode = codeByLanguage[language] || ''
    // We reset only the code of the current language
    initialize({
      availableLanguages,
      codeByLanguage: {
        ...codeByLanguage,
        [language]: initialCode,
      },
      language,
    })
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleReset}>Reset current language code</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
