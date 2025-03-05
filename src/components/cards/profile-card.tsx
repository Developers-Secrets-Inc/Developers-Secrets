'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useState, useEffect } from 'react'

// Définir l'interface pour les données de streak
interface StreakDay {
  date: Date
  activityLevel: number
}

// Fonction pour générer des données de streak aléatoires pour la démonstration
const generateStreakData = (): StreakDay[] => {
  const data: StreakDay[] = []
  for (let i = 0; i < 30; i++) {
    // Générer un niveau d'activité aléatoire entre 0 et 4
    // 0 = pas d'activité, 1-4 = niveaux d'activité croissants
    const activityLevel = Math.floor(Math.random() * 5)

    // Calculer la date (aujourd'hui - i jours)
    const date = new Date()
    date.setDate(date.getDate() - i)

    data.push({
      date,
      activityLevel,
    })
  }
  // Trier par date croissante
  return data.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export const ProfileCard = () => {
  const [streakData, setStreakData] = useState<StreakDay[]>([])

  useEffect(() => {
    setStreakData(generateStreakData())
  }, [])

  // Fonction pour obtenir la couleur en fonction du niveau d'activité
  const getActivityColor = (level: number): string => {
    switch (level) {
      case 0:
        return 'bg-gray-200 dark:bg-gray-800' // Pas d'activité
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-900' // Peu d'activité
      case 2:
        return 'bg-emerald-300 dark:bg-emerald-700' // Activité moyenne
      case 3:
        return 'bg-emerald-400 dark:bg-emerald-600' // Bonne activité
      case 4:
        return 'bg-emerald-500 dark:bg-emerald-500' // Excellente activité
      default:
        return 'bg-gray-200 dark:bg-gray-800'
    }
  }

  // Formater la date pour l'affichage dans le tooltip
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card className="w-full h-auto flex flex-col pb-4 self-start bg-background">
      <CardHeader className="flex flex-col items-center text-center pb-2">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage src="/avatars/user-01.png" alt="User avatar" />
          <AvatarFallback>DV</AvatarFallback>
        </Avatar>
        <h3 className="font-medium">David Vantyghem</h3>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4">
            Lvl 24
          </Badge>
          <div className="flex items-center text-xs text-amber-500">
            <svg
              className="size-3 mr-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 19v-9.8c0-1 .1-1.9-.4-2.7a3 3 0 0 0-2.2-1.2H2" />
              <path d="M18 5h.3c.8 0 1.5.4 2 1l.2.2c.5.7.5 1.7.5 2.7V19" />
              <path d="M6 19h12" />
              <path d="M12 5v4" />
              <path d="M10 9h4" />
            </svg>
            <span>42 days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grille de streak style GitHub */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Activité des 30 derniers jours</span>
          </div>
          <div className="flex flex-wrap -mx-6 px-6 w-[204px] gap-[6px]">
            {streakData.map((day, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={`w-4.5 h-4.5 rounded-[3px] flex-shrink-0 ${getActivityColor(day.activityLevel)} cursor-pointer`}
                    aria-label={`Activité du ${formatDate(day.date)}`}
                  />
                </TooltipTrigger>
                <TooltipContent className="border border-border bg-background text-foreground [&>div[data-slot=arrow]]:hidden">
                  {formatDate(day.date)}:{' '}
                  {day.activityLevel === 0
                    ? "Pas d'activité"
                    : `Niveau d'activité: ${day.activityLevel}`}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Experience</span>
            <span>7,450 XP</span>
          </div>
          <div className="space-y-1">
            <Progress value={75} className="h-1.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level 24</span>
              <span>Level 25</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}
