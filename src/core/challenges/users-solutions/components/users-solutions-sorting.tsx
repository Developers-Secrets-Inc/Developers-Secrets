import { Button } from "@/components/ui/button"

export const UsersSolutionsSorting = ({
    sortBy,
    onSortByChange,
}: {
    sortBy: string
    onSortByChange: (sortBy: "upvotes" | "date" | "comments") => void
}) => {
  return (
    <div className="inline-flex">
      <Button
        variant={sortBy === 'upvotes' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortByChange('upvotes')}
        className="rounded-r-none"
      >
        Top
      </Button>
      <Button
        variant={sortBy === 'date' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortByChange('date')}
        className="rounded-none border-l-0"
      >
        Recent
      </Button>
      <Button
        variant={sortBy === 'comments' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSortByChange('comments')}
        className="rounded-l-none border-l-0"
      >
        Most Discussed
      </Button>
    </div>
  )
}
