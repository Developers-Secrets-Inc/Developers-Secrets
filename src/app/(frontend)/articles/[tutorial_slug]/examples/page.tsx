import { getFirstExampleArticleOfTutorial, getSlugFromTitle, getTutorial } from '@/core/articles'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params

  try {
    // Vérifie d'abord que le tutoriel existe
    const tutorial = await getTutorial(tutorial_slug)

    // Si le tutoriel n'a pas de sections d'exemples, redirige vers la page principale
    if (!tutorial.exampleSections || tutorial.exampleSections.length === 0) {
      console.log(`No example sections found for tutorial: ${tutorial_slug}`)
      return redirect(`/articles/${tutorial_slug}`)
    }

    // Récupère le premier article d'exemple
    const article = await getFirstExampleArticleOfTutorial(tutorial_slug)
    if (!article) {
      console.log(`No example articles found for tutorial: ${tutorial_slug}`)
      return redirect(`/articles/${tutorial_slug}`)
    }

    // Redirige vers l'article
    const slug = getSlugFromTitle(article.title)
    redirect(`/articles/${tutorial_slug}/examples/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
      console.error('Error in examples page:', error)
      return redirect(`/articles/${tutorial_slug}`)
    }
    throw error
  }
}
