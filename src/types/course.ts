import { Article } from './article'
import { User } from './user'

/**
 * Types pour le système de formation
 * Une formation est composée de chapitres, chaque chapitre est composé d'articles
 */

// États de publication gérés par PayloadCMS via le système de versions
export type CourseStatus = 'draft' | 'published'

// États de visibilité gérés par notre champ personnalisé
export type CourseVisibility = 'active' | 'archived'

export type CourseDifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels'

/**
 * Langues supportées par le système
 * L'anglais (en) est la langue par défaut
 */
export type Language = 'en' | 'fr' | 'es'
export type TranslationLanguage = Exclude<Language, 'en'> // Toutes les langues sauf l'anglais

/**
 * Langages de programmation supportés pour les challenges
 */
export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'

/**
 * Type de test pour les challenges
 */
export type TestType = 'unit' | 'integration' | 'e2e'

/**
 * Représente un test pour un challenge
 */
export type ChallengeTest = {
  id: string
  description: string // Description du test
  type: TestType // Type de test
  code: string // Code du test
  expectedOutput?: string // Sortie attendue (pour les tests simples)
  isHidden: boolean // Si true, le test n'est pas visible par l'utilisateur avant soumission
  points: number // Points attribués si le test passe
}

/**
 * Représente un challenge de programmation
 */
export type Challenge = {
  id: string
  title: string
  description: string
  difficulty: CourseDifficultyLevel

  // Code initial fourni à l'utilisateur
  initialCode: string

  // Langage de programmation du challenge
  language: ProgrammingLanguage

  // Tests à passer pour valider le challenge
  tests: ChallengeTest[]

  // Solution proposée
  solution: {
    code: string
    explanation: string // Explication détaillée de la solution
  }

  // Indices pour aider l'utilisateur
  hints?: string[]

  // Temps estimé pour compléter le challenge (en minutes)
  estimatedTime?: number

  // Ressources supplémentaires pour aider l'utilisateur
  resources?: Array<{
    title: string
    url: string
    type: 'article' | 'video' | 'documentation'
  }>
}

/**
 * Métadonnées communes aux formations et chapitres
 */
type CommonMetadata = {
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author: User | string // Peut être un objet User complet ou juste l'ID
}

/**
 * Métadonnées spécifiques aux formations
 */
type CourseMetadata = CommonMetadata & {
  courseStatus: CourseVisibility
  estimatedDuration: number // Durée estimée en minutes
  enrollmentCount: number // Nombre d'inscrits
  completionCount: number // Nombre de personnes ayant terminé la formation
}

/**
 * Métadonnées spécifiques aux chapitres
 */
type ChapterMetadata = CommonMetadata & {
  orderInCourse: number // Position du chapitre dans la formation
}

/**
 * SEO pour les formations et chapitres
 */
type SEO = {
  title?: string
  description?: string
  keywords?: Array<{ keyword: string }>
}

/**
 * Traduction pour les formations et chapitres
 */
type Translation = {
  title: string
  subtitle?: string
  description: string
  translator?: User | string
  seo?: SEO
}

/**
 * Métriques d'analyse pour une formation
 */
export type CourseAnalytics = {
  views: number
  uniqueViews: number
  enrollments: number
  completionRate: number // Pourcentage de personnes ayant terminé la formation
  averageRating: number // Note moyenne (1-5)
  ratingCount: number
  averageCompletionTime: number // Temps moyen pour terminer la formation (en minutes)
}

/**
 * État de progression d'un chapitre ou d'une formation pour un utilisateur
 */
export type CourseProgressStatus = 'not_started' | 'in_progress' | 'completed'

/**
 * État de disponibilité d'une formation ou d'un chapitre
 */
export type CourseAvailabilityStatus = 'available' | 'locked'

/**
 * Raison pour laquelle un chapitre est bloqué
 */
export type ChapterBlockReason =
  | 'prerequisites_not_completed' // Les prérequis n'ont pas été complétés
  | 'previous_chapter_not_completed' // Le chapitre précédent n'a pas été complété
  | 'course_locked' // La formation entière est verrouillée
  | 'time_restricted' // Bloqué temporairement (sera disponible à une date ultérieure)
  | 'admin_restricted' // Bloqué par un administrateur
  | 'payment_required' // Nécessite un paiement ou un abonnement

/**
 * Informations détaillées sur l'état de blocage d'un chapitre
 */
export type ChapterBlockStatus = {
  isBlocked: boolean
  reason?: ChapterBlockReason
  message?: string // Message explicatif à afficher à l'utilisateur
  unblockDate?: string // Date à laquelle le chapitre sera débloqué (pour time_restricted)
  requiredPaymentPlan?: string // Plan d'abonnement requis (pour payment_required)
}

/**
 * Conditions de déblocage d'une formation ou d'un chapitre
 */
export type CourseUnlockCondition = {
  // Formations qui doivent être terminées pour débloquer cette formation
  requiredCourses: string[] // IDs des formations requises

  // Chapitres qui doivent être terminés pour débloquer cette formation ou ce chapitre
  requiredChapters?: string[] // IDs des chapitres requis

  // Si true, toutes les formations/chapitres requis doivent être terminés
  // Si false, au moins une des formations/chapitres requis doit être terminé
  requireAll: boolean
}

/**
 * Représente un chapitre dans une formation
 */
export type Chapter = {
  id: string
  title: string
  subtitle?: string
  description: string
  slug: string

  metadata: ChapterMetadata

  seo?: SEO

  // Articles contenus dans ce chapitre
  articles: Array<CourseArticle | string> // Peut être un objet CourseArticle complet ou juste l'ID

  // Traductions du chapitre
  translations?: Record<TranslationLanguage, Translation>

  // État de disponibilité du chapitre (disponible ou verrouillé)
  availabilityStatus: CourseAvailabilityStatus

  // Informations détaillées sur l'état de blocage du chapitre
  blockStatus?: ChapterBlockStatus

  // Conditions de déblocage du chapitre
  unlockConditions?: CourseUnlockCondition

  // Formations qui seront débloquées lorsque ce chapitre sera terminé
  unlocksCoursesIds?: string[] // IDs des formations à débloquer

  // Chapitres qui seront débloqués lorsque ce chapitre sera terminé
  unlocksChaptersIds?: string[] // IDs des chapitres à débloquer

  // Indique si ce chapitre est requis pour compléter la formation
  isRequired: boolean
}



/**
 * Résultat d'un test de challenge
 */
export type ChallengeTestResult = {
  testId: string
  passed: boolean
  output?: string
  error?: string
  points: number
}

/**
 * Progression d'un challenge
 */
export type ChallengeProgress = {
  challengeId: string
  attempts: number
  completed: boolean
  completedAt?: string
  lastSubmission?: string // Code soumis lors de la dernière tentative
  testResults?: ChallengeTestResult[]
  score: number // Score total obtenu
  maxScore: number // Score maximum possible
}

/**
 * Progression d'un article dans un chapitre
 */
export type ArticleProgress = {
  articleId: string
  isCompleted: boolean
  completedAt?: string
  timeSpent?: number // Temps passé en secondes

  // Progression du challenge associé à l'article (si applicable)
  challengeProgress?: ChallengeProgress
}

/**
 * Progression d'un chapitre
 */
export type ChapterProgress = {
  chapterId: string
  status: CourseProgressStatus
  startedAt: string
  lastAccessedAt: string
  completedAt?: string

  // Progression des articles dans ce chapitre
  articlesProgress: ArticleProgress[]

  // Pourcentage de progression dans ce chapitre (0-100)
  progressPercentage: number
}

/**
 * Progression d'un utilisateur dans une formation
 */
export type UserCourseProgress = {
  userId: string
  courseId: string
  status: CourseProgressStatus
  startedAt: string
  lastAccessedAt: string
  completedAt?: string

  // Progression par chapitre
  chaptersProgress: ChapterProgress[]

  // Pourcentage global de progression (0-100)
  overallProgressPercentage: number
}

/**
 * Représente un article spécifique à une formation
 */
export type CourseArticle = {
  id: string
  title: string
  subtitle?: string
  slug: string
  content: string // Contenu principal de l'article (markdown, html, etc.)

  // Métadonnées de l'article
  metadata: {
    createdAt: string
    updatedAt: string
    publishedAt?: string
    author: User | string
  }

  // SEO de l'article
  seo?: SEO

  // Traductions de l'article
  translations?: Record<
    TranslationLanguage,
    {
      title: string
      subtitle?: string
      content: string
      translator?: User | string
    }
  >

  // Challenge associé à l'article (optionnel)
  challenge?: Challenge

  // Temps estimé de lecture (en minutes)
  estimatedReadingTime?: number

  // Indique si cet article est requis pour compléter le chapitre
  isRequired: boolean

  // Ordre de l'article dans le chapitre
  orderInChapter: number
}





/**
 * Représente une formation complète
 */
export type Course = {
  id: string
  title: string
  subtitle?: string
  description: string
  slug: string

  metadata: CourseMetadata

  seo: SEO

  difficultyLevel: CourseDifficultyLevel

  // Chapitres de la formation
  chapters: Array<Chapter | string> // Peut être un objet Chapter complet ou juste l'ID

  // Traductions de la formation
  translations?: Record<TranslationLanguage, Translation>

  // Formations liées, prérequises et recommandées
  relatedCourses?: string[] // IDs ou slugs
  prerequisites?: string[] // IDs ou slugs
  nextCourses?: string[] // IDs ou slugs

  // Tags/concepts liés à la formation
  tags?: string[] // IDs des tags

  // État de disponibilité de la formation (disponible ou verrouillée)
  availabilityStatus: CourseAvailabilityStatus

  // Conditions de déblocage de la formation
  unlockConditions?: CourseUnlockCondition

  // Formations qui seront débloquées lorsque cette formation sera terminée
  unlocksCoursesIds?: string[] // IDs des formations à débloquer

  // Métriques d'analyse et d'engagement
  analytics?: CourseAnalytics
}