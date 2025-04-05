'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CalendarDay {
  date: string
  day: number
  completedChallenges: number
}

export const UserProfile = () => {
  // Données factices de l'utilisateur
  const dummyUser = {
    name: 'Thomas Anderson',
    avatar: 'https://github.com/shadcn.png',
    initials: 'TA',
    level: 42,
    experience: 8400,
    experienceToNextLevel: 10000,
    rank: 7,
  }

  const calendarDays = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // Obtenir le premier jour du mois (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    // Convertir pour que Lundi soit 0 et Dimanche soit 6
    const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    // Nombre total de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Créer un tableau pour chaque jour de la semaine (7 colonnes)
    const columns: (CalendarDay | null)[][] = Array.from({ length: 7 }, () => [])

    // Ajouter les jours vides avant le début du mois
    for (let i = 0; i < firstDayOffset; i++) {
      columns[i].push(null)
    }

    // Ajouter tous les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      const columnIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convertir pour que Lundi soit 0

      columns[columnIndex].push({
        date: date.toISOString().split('T')[0],
        day,
        completedChallenges: Math.floor(Math.random() * 6), // Simulation de 0-5 challenges par jour
      })
    }

    return columns
  }, [])

  const experiencePercentage = (dummyUser.experience / dummyUser.experienceToNextLevel) * 100

  return (
    <Card className="w-full py-0">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={dummyUser.avatar} alt={dummyUser.name} />
            <AvatarFallback>{dummyUser.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-lg font-semibold">{dummyUser.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Niveau {dummyUser.level}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>#{dummyUser.rank}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {dummyUser.experience} / {dummyUser.experienceToNextLevel} XP
                </span>
              </div>
              <Progress value={experiencePercentage} className="h-2" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-7">
            {/* En-têtes des jours de la semaine */}
            <div className="col-span-7 grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="flex justify-center items-center text-xs text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <Tooltip.Provider>
              {calendarDays.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col items-center gap-y-1">
                  {column.map((day, rowIndex) => (
                    <Tooltip.Root key={`${columnIndex}-${rowIndex}`}>
                      <Tooltip.Trigger asChild>
                        <div
                          className={`h-7 w-7 rounded flex items-center justify-center text-xs border cursor-pointer ${
                            day
                              ? day.completedChallenges > 0
                                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                : 'bg-muted/10 text-muted-foreground border-muted/20 hover:bg-muted/20'
                              : 'invisible'
                          }`}
                        >
                          {day?.day}
                        </div>
                      </Tooltip.Trigger>
                      {day && (
                        <TooltipContentCustom>
                          {day.completedChallenges} challenge
                          {day.completedChallenges !== 1 ? 's' : ''} completed on {day.date}
                        </TooltipContentCustom>
                      )}
                    </Tooltip.Root>
                  ))}
                </div>
              ))}
            </Tooltip.Provider>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/profile/${dummyUser.name.toLowerCase().replace(' ', '-')}`}>
            Voir le profil complet
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
