import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select'
import { useCodeEditor } from '../providers/code-editor-provider'



const LanguageLabel = ({ language }: { language: string }) => {
  return <span className="font-medium text-sm">{language.charAt(0).toUpperCase() + language.slice(1)}</span>
}


export const LanguageSelector = () => {
  const { availableLanguages, language, setLanguage } = useCodeEditor()

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  return (
    availableLanguages.length > 1 ? (
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[155px] h-8">
          <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>
    ) : (
      <LanguageLabel language={language} />
    )
  )
}
