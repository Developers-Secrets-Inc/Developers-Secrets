import { getFirstArticleOfTutorial, getSlugFromTitle } from '@/core/articles'
import { TutorialNotFoundError } from '@/core/articles/errors'
import { notFound, redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params

  try {
    const article = await getFirstArticleOfTutorial(tutorial_slug)
    const slug = getSlugFromTitle(article.title)

    return redirect(`/articles/${tutorial_slug}/${slug}`)
  } catch (error) {
    if (error instanceof TutorialNotFoundError) {
      notFound()
    }
    throw error
  }
}
