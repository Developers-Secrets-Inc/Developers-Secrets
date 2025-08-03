import { HomeHeader } from '@/components/common/home-header'
import { TutorialHero } from '../components/tutorial-hero'
import { getTutorialExampleSections } from '@/api/articles/actions'
import { ArticlesSectionsTable } from '../components/sections-table'
import { RecommandedArticles } from '../components/recommanded-articles-section'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params
  const sections = await getTutorialExampleSections({ tutorialSlug: tutorial_slug })

  return (
    <>
      <HomeHeader />
      <div className="mb-8">
        <TutorialHero tutorialSlug={tutorial_slug} />
      </div>
      
      <div className="mb-4">
        <RecommandedArticles tutorialSlug={tutorial_slug} articles={sections[0]?.articles?.slice(0, 4) || []} type="example" />
      </div>

      <div className="mb-8">
        <ArticlesSectionsTable sections={sections} tutorialSlug={tutorial_slug} type="example" />
      </div>
    </>
  )
}
