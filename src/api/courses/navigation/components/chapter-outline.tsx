import { PartProgressionDot } from '../../progression/components/part-progression-dot'

export const ChapterOutline = ({
  outline,
}: {
  outline: {
    id: number
    name: string
    slug: string
    // isCurrent: boolean
    completionStatus: 'not_started' | 'in_progress' | 'completed'
  }[]
}) => {

  // This component should be client with revalidation on focus and tracking the current part status for live rerender
  return (
    <div className="flex-none flex justify-center items-center gap-2 mx-4">
      {outline.map((part) => (
        <PartProgressionDot key={part.id} part={part} currentPartSlug="" courseSlug="" chapterSlug="" />
      ))}
    </div>
  )
}
