import { UserSolution, Tag } from '@/payload-types'

export function filterAndSortSolutions(
  solutions: UserSolution[],
  searchTerm: string,
  selectedTags: string[],
  sortBy: string,
): UserSolution[] {
  return solutions
    .filter((solution) => {
      const matchesSearch =
        searchTerm === '' ||
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 ||
        solution.tags?.some((tag) => {
          if (typeof tag === 'number') return false
          return selectedTags.includes((tag as Tag).name)
        })

      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') {
        const aUpvotes = (a.votes || []).filter((vote) => vote.status === 'upvote').length
        const bUpvotes = (b.votes || []).filter((vote) => vote.status === 'upvote').length
        return bUpvotes - aUpvotes
      }
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'comments') {
        return (b.comments?.length || 0) - (a.comments?.length || 0)
      }
      return 0
    })
}
