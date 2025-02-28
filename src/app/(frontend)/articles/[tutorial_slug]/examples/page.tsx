import { getFirstExampleArticleOfTutorial, getSlugFromTitle } from '@/core/articles'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: { tutorial_slug: string } }) {
  const { tutorial_slug } = params

  try {
    const article = await getFirstExampleArticleOfTutorial(tutorial_slug)
    const slug = getSlugFromTitle(article.title)
    return redirect(`/articles/${tutorial_slug}/examples/${slug}`)
  } catch (error) {
    // If it's a TutorialError (no examples found), or any other error,
    // redirect to the main tutorial page
    if (error instanceof Error) {
      console.log(`Redirecting to main tutorial page: ${error.message}`)
    }
    return redirect(`/articles/${tutorial_slug}`)
  }
}
