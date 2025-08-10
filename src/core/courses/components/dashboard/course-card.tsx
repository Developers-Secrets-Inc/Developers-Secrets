import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LockIcon, Target } from 'lucide-react'

import { Course } from '@/payload-types'
import { GridCourseInformations } from '../../actions'
import { CourseLastVisitDate } from './course-last-visit-date'
import { CourseProgressionGauge } from './course-progression-gauge'
type CourseDifficulty = Course['difficulty']
type BadgeStyle = `bg-${string}-500/10 text-${string}-500 border-${string}-500/20`

const CourseCardBadges = ({
  isLocked,
  difficulty,
}: {
  isLocked: boolean
  difficulty: CourseDifficulty
}) => {
  const styles: Record<CourseDifficulty, BadgeStyle> = {
    beginner: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    intermediate: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
    expert: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  }

  return (
    <>
      {isLocked && <LockIcon className="h-4 w-4 text-muted-foreground" />}
      <Badge className={cn(styles[difficulty], 'text-xs')} variant="secondary">
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    </>
  )
}

export const CourseCard = ({ course, userId }: { course: GridCourseInformations, userId: string }) => {
  const isLocked = course.isLocked

    return (
    <Card className="w-full h-full hover:shadow-lg transition-shadow flex flex-col p-1 pb-0 relative gap-0 hover:border-primary/50">
      <CardContent className="space-y-3 flex-grow flex flex-col justify-between pt-3 px-3">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-muted/50 rounded-md flex items-center justify-center w-10 h-10">
            <PythonLogoIcon className="w-7 h-7" />
          </div>
          {/* Container pour Badge et LockIcon */}
          <div className="flex items-center gap-2">
            <CourseCardBadges isLocked={isLocked} difficulty={course.difficulty} />
          </div>
        </div>
        <CardTitle className="text-lg font-medium mb-1">{course.name}</CardTitle>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {course.description || 'No description provided.'}
          </p>
          {/* Section pour les tags de compétences */}
          <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="secondary">Python Basics</Badge>
            <Badge variant="secondary">Loops</Badge>
            <Badge variant="secondary">Functions</Badge>
            <Badge variant="secondary">...</Badge>
          </div>

          {/* Ajouter la bordure pointillée */}
          <div className="border-b border-dashed border-border my-3"></div>
        </div>
      </CardContent>
      {/* Nouveau conteneur pour les infos et le bouton en bas */}
      <div className="flex justify-between items-center px-3 pb-3 mt-auto">
        <div className="flex items-center text-xs text-muted-foreground">
          <CourseLastVisitDate courseSlug={course.slug} />
          <span className="mx-1">·</span>
          <Target className="h-3 w-3 mr-1" />
          <span>{course.totalPartsCount ?? 0} challenges</span>
        </div>
        {/* Gauge component replaces the Button */}
        <div className="transform scale-75">
          <CourseProgressionGauge course={course} userId={userId} />
        </div>
      </div>
      {/* Overlay seulement si verrouillé et PAS à l'intérieur de la Card */}
    </Card>
    )
}
