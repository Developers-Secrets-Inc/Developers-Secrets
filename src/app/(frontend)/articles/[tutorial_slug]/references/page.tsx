import { getFirstReferenceArticleOfTutorial, getSlugFromTitle } from '@/core/articles'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params

  try {
    const article = await getFirstReferenceArticleOfTutorial(tutorial_slug)
    // Get the slug from the article title
    const slug = getSlugFromTitle(article.title)

    return redirect(`/articles/${tutorial_slug}/references/${slug}`)
  } catch (error) {
    // If there are no reference articles, redirect to the main tutorial page
    return redirect(`/articles/${tutorial_slug}`)
  }
}
