type HotnessArticle = {
  _status: "draft" | "published" | null | undefined
  createdAt: string 
  analytics: {
    views: number 
    ratingSum: number 
    recommendationClicks: number
  }
}

export const calculateHotnessScore = (article: HotnessArticle, alpha: number = 1.5): number => {
  if (!article.analytics) {
    return 0
  }

  // Use createdAt as a fallback if publishedAt is not available
  const publishDate = article._status === 'published' ? article.createdAt : new Date().toISOString()
  const publishedAt = new Date(publishDate)
  const hoursSincePublication = Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60))

  // Simple engagement score based on views and ratings
  const views = article.analytics.views || 0
  const ratingSum = article.analytics.ratingSum || 0
  const recommendationClicks = article.analytics.recommendationClicks || 0

  const engagement = views + ratingSum * 10 + recommendationClicks * 5

  // Calculate hotness score
  return engagement / Math.pow(hoursSincePublication + 2, alpha)
}