import { User } from './user'

/*  

- On a des informations principales sur l'article : Son titre, son contenu et son slug
- On a des informations sur les méta-données : Sa date de création, sa date de mise à jour, son auteur, sa date de publication.
- On a des informations sur le SEO de l'article : Son titre, sa description, ses mots clés.


- Un article est rédigé dans un ensemble de langues. On pourrait associer dans le futur la traduction d'un article à un auteur. Chaque langue est simplement un champ supplémentaire qui possède la langue de la traduction et le contenu de la traduction. La langue par défaut est l'anglais.
- Au niveau des recommandations d'articles, on peut le faire en fonction de la similarité (boucle for -> boucle while), de si c'est une prérequis (décorateurs -> fonctions) et en fonction d'un parcours d'apprentissage (fonctions -> décorateurs -> ParamSpec -> ...) 


*/

// États de publication gérés par PayloadCMS via le système de versions
export type ArticleStatus = 'draft' | 'published'

// États de visibilité gérés par notre champ personnalisé
export type ArticleVisibility = 'active' | 'archived'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' // ? Should be add more levels ?

/**
 * Langues supportées par le système
 * L'anglais (en) est la langue par défaut
 */
export type Language = 'en' | 'fr' | 'es' // Limité aux langues actuellement configurées dans Articles.ts
export type TranslationLanguage = Exclude<Language, 'en'> // Toutes les langues sauf l'anglais

type ArticleMetadata = {
  createdAt: string
  updatedAt: string

  // The date when the article was published. Only set if status is 'published'
  publishedAt?: string

  // L'auteur de l'article
  author: User | string // Peut être un objet User complet ou juste l'ID

  // Visibilité de l'article (remplace l'ancien champ status)
  articleStatus: ArticleVisibility
}

type ArticleSEO = {
  title?: string
  description?: string
  keywords?: Array<{ keyword: string }> // Adapté pour correspondre à la structure dans Articles.ts
}

/**
 * Représente la traduction d'un article dans une langue spécifique
 */
export type ArticleTranslation = {
  title: string
  subtitle?: string
  content: string

  // L'auteur de la traduction (optionnel)
  translator?: User | string

  // SEO spécifique à cette traduction
  seo?: ArticleSEO
}

export type Article = {
  id: string
  title: string // Titre en langue par défaut (anglais)
  subtitle?: string // Sous-titre en langue par défaut (anglais)
  slug: string

  content: string // Contenu en langue par défaut (anglais)

  metadata: ArticleMetadata

  seo: ArticleSEO

  difficultyLevel: DifficultyLevel

  // Traductions de l'article (excluant la langue par défaut)
  translations?: Record<TranslationLanguage, ArticleTranslation>

  // Articles liés, prérequis et étapes suivantes dans le parcours d'apprentissage
  relatedArticles?: string[] // IDs ou slugs
  prerequisites?: string[] // IDs ou slugs
  nextSteps?: string[] // IDs ou slugs
}
