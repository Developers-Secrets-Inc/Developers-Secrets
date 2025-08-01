'use client'

import { useEvaluationStore } from '../store/evaluation-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, XCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'excellent':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'good':
      return <CheckCircle className="h-5 w-5 text-blue-500" />
    case 'average':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case 'needs_improvement':
      return <AlertCircle className="h-5 w-5 text-orange-500" />
    case 'poor':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'excellent':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'average':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'needs_improvement':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const ScoreDisplay = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-blue-600'
    if (score >= 4) return 'text-yellow-600'
    if (score >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="flex items-center gap-2">
      <Star className="h-5 w-5 text-yellow-500" />
      <span className={cn('text-2xl font-bold', getScoreColor(score))}>
        {score}/10
      </span>
    </div>
  )
}

export const AIPromptsEvaluationDisplay = () => {
  const { evaluation, isLoading, error } = useEvaluationStore()

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Évaluation en cours...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Erreur lors de l'évaluation</span>
          </div>
          <p className="text-sm text-red-500 mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!evaluation) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Aucune évaluation disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score et catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Résultat de l'évaluation</span>
            <Badge className={getCategoryColor(evaluation.category)}>
              <div className="flex items-center gap-1">
                {getCategoryIcon(evaluation.category)}
                <span className="capitalize">
                  {evaluation.category.replace('_', ' ')}
                </span>
              </div>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreDisplay score={evaluation.score} />
        </CardContent>
      </Card>

      {/* Points forts */}
      {evaluation.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Points forts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Améliorations */}
      {evaluation.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              Améliorations suggérées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {evaluation.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Star className="h-5 w-5" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}