import { getLearningPathBySlug } from '@/core/courses/learning-paths'
import { LearningPathSections } from './components/learning-path-sections'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'

const Header = ({ learningPathName }: { learningPathName: string }) => {
  return (
    <div className="relative h-36 md:h-44 flex items-center justify-center mb-10 overflow-hidden border-b border-border">
      <DotPattern className="text-primary/10" glow width={32} height={32} cr={1.5} />
      <h1 className="relative z-10 text-3xl md:text-4xl font-bold text-center drop-shadow-lg">
        {learningPathName}
      </h1>
      <div className="absolute top-4 left-8 z-20">
        <Button asChild variant="outline" size="sm">
          <Link href="/courses">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to courses
          </Link>
        </Button>
      </div>
    </div>
  )
}

const LearningPathContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">{children}</div>
    </div>
  )
}

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ path_slug: string }>
}) {
  const { path_slug } = await params
  const learningPath = await getLearningPathBySlug(path_slug)

  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userId = user.id

  return (
    <>
      <Header learningPathName={learningPath.name} />
      <LearningPathContainer>
        {/* Colonne gauche */}
        <div className="flex-1 min-w-0">
          <LearningPathSections sections={learningPath.sections} userId={userId} />
        </div>
        {/* Colonne droite */}
        <div className="md:w-1/3 w-full rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground whitespace-pre-line">{learningPath.description}</p>
        </div>
      </LearningPathContainer>
    </>
  )
}
