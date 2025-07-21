import { Button } from "@/components/ui/button"

export const UsersSolutionsTagsFilter = ({
    languages,
    selectedLanguage,
    onSelectedLanguageChange,
}: {
    languages: string[]
    selectedLanguage: string | null
    onSelectedLanguageChange: (language: string | null) => void
}) => {
  return (
    <div className="inline-flex">
      <Button
        variant={selectedLanguage === null ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelectedLanguageChange(null)}
        className="rounded-r-none"
      >
        All
      </Button>
      {languages.map((lang) => (
        <Button
          key={lang}
          variant={selectedLanguage === lang ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectedLanguageChange(lang)}
          className={
            lang === languages[languages.length - 1] ? 'rounded-l-none' : 'rounded-none border-l-0'
          }
        >
          {lang}
        </Button>
      ))}
    </div>
  )
}
