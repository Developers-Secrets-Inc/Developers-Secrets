import { getLearningPaths } from '@/core/courses/learning-paths'
import { LearningPath } from '@/payload-types'
import { LearningPathCard, NoLearningPathsCard } from './learning-path-card'

const MAX_ITEMS = 3

export const LearningPathsGrid = async () => {
  const learningPaths = await getLearningPaths()

  return (
    <div>
      <LearningPathsSectionTitle />
      <LearningPathsCardsGrid items={learningPaths} maxItems={MAX_ITEMS} />
    </div>
  )
}

export const LearningPathsCardsGrid = ({
  items,
  maxItems,
}: {
  items: LearningPath[]
  maxItems?: number
}) => {

  if (!items?.length) {
    return <NoLearningPathsCard />
  }



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <LearningPathCard key={item.id || item.slug} path={item} />
      ))}
    </div>
  )
}

export const LearningPathsSectionTitle = () => {
  return <h2 className="text-xl font-semibold tracking-tight mb-4">Learning Paths</h2>
}
