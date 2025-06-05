import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIDEStore } from '../store'

export const LanguageSelector = ({
  showLanguageSelector = true,
}: {
  showLanguageSelector?: boolean
}) => {
  const { language, availableLanguages, setLanguage } = useIDEStore()

  const handleLanguageChange = (value: string) => {
    setLanguage(value.toLowerCase())
  }
  const pyodideStatus = 'loaded'

  if (!showLanguageSelector || availableLanguages.length === 1) {
    const languageLabel = language
    return <span className="font-medium text-sm">{languageLabel}</span>
  }

  const isPythonSelected = language === 'python'
  const showPythonStatus = isPythonSelected && pyodideStatus !== 'loaded'

  return (
    <div className="flex items-center gap-2">
      <Select
        value={language.charAt(0).toUpperCase() + language.slice(1)}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang} value={lang.charAt(0).toUpperCase() + lang.slice(1)}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* {showPythonStatus && <PyodideLoadingStatus pyodideStatus={pyodideStatus} />} */}
    </div>
  )
}
