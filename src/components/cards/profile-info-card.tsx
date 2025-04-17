'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, UserPlus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ProfileInfoCard = () => {
  const userData = {
    name: 'David Vantyghem',
    avatar: '/avatars/user-01.png',
    level: 24,
    experience: 7450,
    maxExperience: 10000,
    isPremium: true,
    followers: 12,
    following: 8,
  }

  const xpPercentage = (userData.experience / userData.maxExperience) * 100

  return (
    <Card className="overflow-hidden shadow-xl bg-background">
      <CardHeader className="pb-0">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>
              {userData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              {userData.isPremium && (
                <Badge className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="mt-2">
              Level {userData.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Experience</span>
            <span className="text-muted-foreground">
              {userData.experience} / {userData.maxExperience} XP
            </span>
          </div>
          <Progress value={xpPercentage} className="h-2" />
        </div>

        <Button className="w-full" variant="outline">
          Follow
        </Button>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span className="font-medium">{userData.followers}</span>
            </div>
            <span className="text-xs text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              <span className="font-medium">{userData.following}</span>
            </div>
            <span className="text-xs text-muted-foreground">Following</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
