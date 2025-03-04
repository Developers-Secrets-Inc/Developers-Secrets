import { getFirstReferenceArticleOfTutorial, getSlugFromTitle, getTutorial } from '@/core/articles'
import { redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ tutorial_slug: string }> }) {
  const { tutorial_slug } = await params

  try {
    // Vérifie d'abord que le tutoriel existe
    const tutorial = await getTutorial(tutorial_slug)

    // Si le tutoriel n'a pas de sections de références, redirige vers la page principale
    if (!tutorial.referenceSections || tutorial.referenceSections.length === 0) {
      console.log(`No reference sections found for tutorial: ${tutorial_slug}`)
      return redirect(`/articles/${tutorial_slug}`)
    }

    // Récupère le premier article de référence
    const article = await getFirstReferenceArticleOfTutorial(tutorial_slug)
    if (!article) {
      console.log(`No reference articles found for tutorial: ${tutorial_slug}`)
      return redirect(`/articles/${tutorial_slug}`)
    }

    // Redirige vers l'article
    const slug = article.slug
    redirect(`/articles/${tutorial_slug}/references/${slug}`)
  } catch (error) {
    if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
      console.error('Error in references page:', error)
      return redirect(`/articles/${tutorial_slug}`)
    }
    throw error
  }
}
