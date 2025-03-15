'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Award, Users, UserPlus, UserCheck, ChevronRight, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const ProfileInfoCard = () => {
  const userData = {
    name: 'David Vantyghem',
    avatar: '/avatars/user-01.png',
    level: 24,
    experience: 7450,
    maxExperience: 10000,
    isPremium: true,
    achievements: 12,
    followers: 12,
    following: 8,
  }

  const friendsData = [
    {
      id: 1,
      name: 'Marie Laurent',
      avatar: '/avatars/user-02.png',
      level: 28,
      achievements: 15,
      isOnline: true,
      isPremium: true,
    },
    {
      id: 2,
      name: 'Jean Dupont',
      avatar: '/avatars/user-03.png',
      level: 22,
      achievements: 8,
      isOnline: false,
      isPremium: false,
    },
    {
      id: 3,
      name: 'Sophie Martin',
      avatar: '/avatars/user-04.png',
      level: 31,
      achievements: 20,
      isOnline: true,
      isPremium: true,
    },
    {
      id: 4,
      name: 'Pierre Dubois',
      avatar: '/avatars/user-05.png',
      level: 19,
      achievements: 6,
      isOnline: false,
      isPremium: false,
    },
  ]

  const xpPercentage = (userData.experience / userData.maxExperience) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl bg-background">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>
                {userData.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                {userData.isPremium && (
                  <Badge className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">Level {userData.level}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Award className="h-3 w-3" />
                  <span>{userData.achievements} achievements</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <UserPlus className="h-4 w-4" />
                  <span className="text-xs">{userData.followers} Followers</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Followers
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  {friendsData.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          {friend.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                          {friend.isPremium && (
                            <div className="absolute -top-1 -right-1">
                              <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {friend.name}
                            {friend.isPremium && (
                              <Badge
                                variant="secondary"
                                className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs"
                              >
                                Premium
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              Level {friend.level}
                            </Badge>
                            <span>•</span>
                            <span>{friend.achievements} achievements</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/profile/${friend.id}`} className="text-xs">
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-xs">{userData.following} Following</span>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Following
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  {friendsData.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-background">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          {friend.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                          )}
                          {friend.isPremium && (
                            <div className="absolute -top-1 -right-1">
                              <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {friend.name}
                            {friend.isPremium && (
                              <Badge
                                variant="secondary"
                                className="bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 text-xs"
                              >
                                Premium
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              Level {friend.level}
                            </Badge>
                            <span>•</span>
                            <span>{friend.achievements} achievements</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/profile/${friend.id}`} className="text-xs">
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Experience</span>
              <span className="text-muted-foreground">
                {userData.experience} / {userData.maxExperience} XP
              </span>
            </div>
            <Progress value={xpPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
