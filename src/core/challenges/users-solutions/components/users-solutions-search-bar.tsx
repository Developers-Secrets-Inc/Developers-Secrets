import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const UsersSolutionsSearchBar = ({
    searchTerm,
    onSearchTermChange,
}: {
    searchTerm: string
    onSearchTermChange: (searchTerm: string) => void
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search solutions..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  )
}
