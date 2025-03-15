'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Award, Info, Lock, Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

export function UserStats({ achievements }: { achievements: number }) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 border p-3 rounded-md col-span-2">
        <Award className="h-5 w-5 text-primary" />
        <span>{achievements} Récompenses débloquées</span>
      </div>
    </motion.div>
  )
}

export function LevelProgress({ level, xp, maxXp }: { level: number; xp: number; maxXp: number }) {
  const xpPercentage = (xp / maxXp) * 100
  const count = useMotionValue(0)

  useEffect(() => {
    const animation = animate(count, xpPercentage, { duration: 2 })
    return animation.stop
  })

  return (
    <div>
      <div className="flex justify-between text-sm font-medium mb-2">
        <span className="text-lg">Niveau {level}</span>
        <span>
          {xp} / {maxXp} XP
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative pt-1">
              <div className="overflow-hidden h-3 text-xs flex rounded bg-primary/20">
                <motion.div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{maxXp - xp} XP nécessaires pour le niveau suivant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export function UserInfo({ name, isPremium = false }: { name: string; isPremium?: boolean }) {
  return (
    <div>
      <CardTitle className="text-2xl font-bold">{name}</CardTitle>
      {isPremium ? (
        <CardDescription className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          Utilisateur Premium
        </CardDescription>
      ) : (
        <CardDescription className="flex items-center gap-1">
          <Info className="h-4 w-4" />
          Utilisateur Standard
        </CardDescription>
      )}
    </div>
  )
}

export function UserAvatar({
  src,
  alt,
  isPremium = false,
}: {
  src: string
  alt: string
  isPremium?: boolean
}) {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Image src={src} alt={alt} width={90} height={90} className="rounded-full" />
      {isPremium && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Badge className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900">
            Premium
          </Badge>
        </motion.div>
      )}
    </motion.div>
  )
}

export function ProfileButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <Button disabled className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <Lock className="h-4 w-4" />
        Voir le profil complet
      </Button>
    </motion.div>
  )
}

export const ProfileCard = () => {
  const userData = {
    name: 'David Vantyghem',
    isPremium: true,
    currentLevel: 24,
    currentExperience: 7450,
    experienceRequiredForNextLevel: 10000,
    achievements: 12,
    avatar: '/avatars/user-01.png',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4">
            <UserAvatar src={userData.avatar} alt="User Avatar" isPremium={userData.isPremium} />
            <UserInfo name={userData.name} isPremium={userData.isPremium} />
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <LevelProgress
            level={userData.currentLevel}
            xp={userData.currentExperience}
            maxXp={userData.experienceRequiredForNextLevel}
          />
          <UserStats achievements={userData.achievements} />
          <ProfileButton />
        </CardContent>
      </Card>
    </motion.div>
  )
}
