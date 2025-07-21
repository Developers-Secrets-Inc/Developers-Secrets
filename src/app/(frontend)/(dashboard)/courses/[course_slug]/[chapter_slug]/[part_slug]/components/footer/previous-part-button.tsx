import { LinkButton } from '@/components/common/link-button'
import { ChevronLeft } from 'lucide-react'

// ? Still not quite sure at the moment, but I think that this component does not have any dynamic behavior. So it should be a server component.

type PreviousPartButtonProps = {
  isFirstPart: boolean
  isStartOfChapter: boolean
  href: string
}

export const PreviousPartButton = ({
  isFirstPart,
  isStartOfChapter,
  href,
}: PreviousPartButtonProps) => {
  const content = isStartOfChapter ? 'Previous Chapter' : 'Previous'

  return (
    <LinkButton variant="outline" disabled={isFirstPart} href={href}>
      <ChevronLeft className="h-4 w-4 mr-2" />
      {content}
    </LinkButton>
  )
}
