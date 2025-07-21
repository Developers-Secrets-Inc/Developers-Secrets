import { LearningPath } from "@/payload-types"
import { LearningPathCourseCard, LearningPathCourseCardSkeleton } from "./learning-path-course-card"
import { TypographyH3 } from "@/components/typography"
import { Suspense } from "react"

type LearningPathSections = LearningPath['sections']
type LearningPathSection = LearningPathSections[number]


const LearningPathSection = ({ section, userId }: { section: LearningPathSection, userId: string }) => {
    return (
        <div>
            <TypographyH3>{section.name}</TypographyH3>
            <p className="text-muted-foreground">{section.description}</p>
            <div className="mt-2 gap-2 flex flex-col">
                {section.courses.map((course) => (
                    <Suspense key={course.id} fallback={<LearningPathCourseCardSkeleton />}>
                        <LearningPathCourseCard key={course.id} course={course.course} userId={userId} />
                    </Suspense>
                ))}
            </div>
        </div>
    )
}


export const LearningPathSections = ({ sections, userId }: { sections: LearningPathSections, userId: string }) => {
  return (
    <div>
      {sections.map((section) => (
        <LearningPathSection key={section.id} section={section} userId={userId} />
      ))}
    </div>
  )
}


