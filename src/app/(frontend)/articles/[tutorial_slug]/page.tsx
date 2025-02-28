import { getFirstArticleOfTutorial, getSlugFromTitle } from '@/core/articles'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params

  const article = await getFirstArticleOfTutorial(tutorial_slug)
  const slug = getSlugFromTitle(article.title)

  return redirect(`/articles/${tutorial_slug}/${slug}`)
}
