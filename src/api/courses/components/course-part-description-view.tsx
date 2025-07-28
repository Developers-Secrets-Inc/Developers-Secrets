import { PearlToggleButton } from '@/core/ai/components/pearl-toggle-button'
import { CoursePartDescriptionLayout } from './layout/course-part-description'

export const CoursePartDescriptionView = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">{children}</div>
      <CoursePartDescriptionLayout.FooterContainer>
        <CoursePartDescriptionLayout.FooterLeftPart>
          {''}
          {/* {user && challenge && (
                <>
                  <EngagementButtons userId={user.id} challengeId={challenge.id} />
                  <RatingDialogButton userId={user.id} challengeId={challenge.id} />
                </>
              )} */}
        </CoursePartDescriptionLayout.FooterLeftPart>
        <PearlToggleButton onClick={() => {}} />
      </CoursePartDescriptionLayout.FooterContainer>
    </div>
  )
}
