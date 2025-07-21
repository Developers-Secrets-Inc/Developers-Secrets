import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'

interface ExperienceSectionProps {
  // Assuming experience is a number, adjust if it's fetched differently
  experience: number | string
}

export const ExperienceSection = ({ experience }: ExperienceSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        {' '}
        {/* Flex container for title and button */}
        <h2 className="text-lg font-semibold">Experience</h2>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Options</span>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{experience} XP</p> {/* Add margin-top */}
    </div>
  )
}
