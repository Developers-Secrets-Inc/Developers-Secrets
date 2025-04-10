import { useState, useCallback } from 'react'
import { UsersSolutionsSearchBar } from '../users-solutions-search-bar'

type SolutionsSearchProps = {
  onSearch: (searchTerm: string) => void
}

export function SolutionsSearch({ onSearch }: SolutionsSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm)
      onSearch(newSearchTerm)
    },
    [onSearch],
  )

  return <UsersSolutionsSearchBar searchTerm={searchTerm} onSearchTermChange={handleSearchChange} />
}
