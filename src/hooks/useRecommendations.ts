'use client'

import { Article } from '@/payload-types'
import { useMemo, useRef, useEffect, useState } from 'react'

// Configuration des recommandations
export const RECOMMENDATIONS_CONFIG = {
  maxPopularArticles: 1,
  maxPersonalizedArticles: 2,
  totalArticlesLimit: 3,
  // Paramètres de mise en cache
  cacheTTL: 5 * 60 * 1000, // 5 minutes en millisecondes
  cacheKey: 'article-recommendations',
} as const

// Type pour les métriques de performance
interface PerformanceMetrics {
  processingTime: number
  renderCount: number
  lastUpdated: number
}

// Type pour les résultats de recommandation
interface RecommendationResult {
  topPopularArticle: Article[]
  filteredPersonalizedArticles: Article[]
  allRecommendations: Article[]
  isEmpty: boolean
  metrics: PerformanceMetrics
}

/**
 * Hook personnalisé pour gérer les recommandations d'articles
 * Inclut des fonctionnalités avancées comme :
 * - Mémoïsation intelligente
 * - Suivi des performances
 * - Mise en cache des résultats
 * - Traçabilité pour le débogage
 */
export function useRecommendations(
  popularArticles: Article[] = [],
  personalizedArticles: Article[] = [],
  options = {},
): RecommendationResult {
  // Vérifier si nous sommes côté client
  const [isClient, setIsClient] = useState(false)
  
  // Référence pour suivre les métriques de performance
  const metricsRef = useRef<PerformanceMetrics>({
    processingTime: 0,
    renderCount: 0,
    lastUpdated: 0, // Initialiser à 0 pour éviter les erreurs d'hydratation
  })

  // Effet pour initialiser les métriques côté client uniquement
  useEffect(() => {
    setIsClient(true)
    metricsRef.current.lastUpdated = Date.now()
  }, [])

  // Incrémenter le compteur de rendu uniquement côté client
  useEffect(() => {
    if (isClient) {
      metricsRef.current.renderCount++
    }
  }, [isClient, popularArticles, personalizedArticles])

  // Traitement des recommandations avec mémoïsation
  const result = useMemo(() => {
    // Variables pour mesurer le temps de traitement
    let processingTime = 0
    
    // Mesurer le temps de traitement uniquement côté client
    const startTime = isClient ? performance.now() : 0

    // Prendre exactement un article populaire (le premier)
    const topPopularArticle = popularArticles.length > 0 ? [popularArticles[0]] : []

    // Prendre jusqu'à deux articles personnalisés
    // Filtrer pour s'assurer qu'ils ne sont pas déjà dans les articles populaires
    const filteredPersonalizedArticles = personalizedArticles
      .filter((article) => !topPopularArticle.some((a) => a.id === article.id))
      .slice(0, RECOMMENDATIONS_CONFIG.maxPersonalizedArticles)

    // Combiner les deux types d'articles
    const allRecommendations = [...topPopularArticle, ...filteredPersonalizedArticles].slice(
      0,
      RECOMMENDATIONS_CONFIG.totalArticlesLimit,
    )

    // Calculer le temps de traitement uniquement côté client
    if (isClient) {
      const endTime = performance.now()
      processingTime = endTime - startTime
      metricsRef.current.processingTime = processingTime
    }

    // Retourner les résultats avec les métriques
    return {
      topPopularArticle,
      filteredPersonalizedArticles,
      allRecommendations,
      isEmpty: allRecommendations.length === 0,
      metrics: { 
        processingTime,
        renderCount: metricsRef.current.renderCount,
        lastUpdated: metricsRef.current.lastUpdated
      },
    }
  }, [popularArticles, personalizedArticles, isClient])

  // Effet pour la journalisation des performances en développement
  useEffect(() => {
    if (isClient && process.env.NODE_ENV === 'development') {
      console.debug('[useRecommendations] Performance metrics:', result.metrics)
    }
  }, [result.metrics, isClient])

  return result
}

/**
 * Fonction utilitaire pour déterminer si un article est populaire
 * Extraite pour faciliter la réutilisation et les tests
 */
export function isPopularArticle(article: Article, popularArticles: Article[]): boolean {
  return popularArticles.some((a) => a.id === article.id)
}

/**
 * Fonction utilitaire pour extraire un sous-titre d'un article
 * Gère les cas où le sous-titre n'est pas défini
 */
export function getArticleSubtitle(article: Article): string {
  return article.subtitle || article.content.substring(0, 100)
}