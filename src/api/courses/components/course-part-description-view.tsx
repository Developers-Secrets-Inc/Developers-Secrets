'use client'

import { PearlToggleButton } from '@/core/ai/components/pearl-toggle-button'
import { CoursePartDescriptionLayout } from './layout/course-part-description'
import { EngagementButtons } from '../engagement/components/engagement-buttons'
import { useCoursePart } from '../contexts/course-part-context'
import { useUser } from '@/core/users/contexts/user-context'
import { RatingDialogButton } from '../engagement/rating-dialog'

export const CoursePartDescriptionView = ({ children }: { children: React.ReactNode }) => {
  const { coursePart } = useCoursePart()
  const { user } = useUser()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">{children}</div>
      <CoursePartDescriptionLayout.FooterContainer>
        <CoursePartDescriptionLayout.FooterLeftPart>

          {/* TODO: These components need to have a suspense or a client loading to prevent long page loading */}
          <EngagementButtons userId={user.id} coursePartId={coursePart.id} />
          <RatingDialogButton userId={user.id} coursePartId={coursePart.id} />
        </CoursePartDescriptionLayout.FooterLeftPart>
        <PearlToggleButton onClick={() => {}} />
      </CoursePartDescriptionLayout.FooterContainer>
    </div>
  )
}
