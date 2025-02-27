import { getFirstExampleArticleOfTutorial, getSlugFromTitle } from '@/core/articles'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params

  try {
    const article = await getFirstExampleArticleOfTutorial(tutorial_slug)
    // Get the slug from the article title
    const slug = getSlugFromTitle(article.title)

    return redirect(`/articles/${tutorial_slug}/examples/${slug}`)
  } catch (error) {
    // If there are no example articles, redirect to the main tutorial page
    return redirect(`/articles/${tutorial_slug}`)
  }
}
