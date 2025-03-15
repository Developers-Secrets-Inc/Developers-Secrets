'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { List } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  TrophyIcon,
  UsersIcon,
  XCircleIcon,
  ZapIcon,
} from 'lucide-react'
import Link from 'next/link'

export const ChallengeCard = () => {
  const challengeData = {
    title: 'API Authentication Challenge',
    difficulty: 'Intermediate',
    baseExperience: 250,
    boostedExperience: 375,
    timeRemaining: { hours: 16, minutes: 45 },
    isCompleted: false,
    completedChallenges: 4,
    totalExperience: 1000,
    slug: 'api-auth-challenge',
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-background text-foreground shadow-lg">
        <CardContent className="p-6">
          <motion.div
            className="flex justify-between items-start mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <Badge variant="secondary" className="mb-2">
                Challenge du jour
              </Badge>
              <motion.h3
                className="text-2xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {challengeData.title}
              </motion.h3>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
            >
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Badge variant="outline">{challengeData.difficulty}</Badge>
            <div className="flex items-center">
              <ZapIcon className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-yellow-500">{challengeData.baseExperience} XP</span>
              {challengeData.timeRemaining.hours > 0 || challengeData.timeRemaining.minutes > 0 ? (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-green-500/20 text-green-700 dark:bg-green-900 dark:text-green-300 border-none"
                >
                  +{challengeData.boostedExperience} XP Boost
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-green-500/20 text-green-700 dark:bg-green-900 dark:text-green-300 border-none"
                >
                  Boost d&apos;XP : Terminé
                </Badge>
              )}
            </div>
          </motion.div>
          <motion.div
            className="flex items-center justify-between mb-4 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2 text-green-500" />
              {challengeData.timeRemaining.hours > 0 || challengeData.timeRemaining.minutes > 0 ? (
                <span>
                  Boost d&apos;XP disponible : {challengeData.timeRemaining.hours}h{' '}
                  {challengeData.timeRemaining.minutes}m
                </span>
              ) : (
                <span>Boost d&apos;XP : Terminé</span>
              )}
            </div>
            {challengeData.isCompleted ? (
              <Badge
                variant="outline"
                className="bg-green-500/20 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                Complété
              </Badge>
            ) : (
              <div className="flex items-center">
                <XCircleIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Non complété</span>
              </div>
            )}
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-border pt-4">
          <motion.div
            className="flex justify-between w-full text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center">
              <TrophyIcon className="h-4 w-4 mr-1" />
              <span>{challengeData.completedChallenges} défis terminés</span>
            </div>
            <div className="flex items-center">
              <ZapIcon className="h-4 w-4 mr-1" />
              <span>{challengeData.totalExperience} XP gagnés</span>
            </div>
          </motion.div>
          <motion.div
            className="flex gap-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button className="flex-1 group" asChild>
              <Link
                href={`/challenges/${challengeData.slug}`}
                className="flex flex-row items-center"
              >
                <UsersIcon className="mr-1 h-4 w-4" />
                Commencer
                <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 group" asChild>
              <Link href={'/challenges'} className="flex flex-row items-center">
                <UsersIcon className="mr-1 h-4 w-4" />
                Tous les défis
                <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
