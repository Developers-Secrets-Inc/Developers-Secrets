'use client'

import { useState, useId } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Clock,
  Award,
  Zap,
  Shield,
  Sparkles,
  CheckCircle,
  X,
  Code,
  BookOpen,
  Laptop,
  Gift,
  Coins,
  TrendingUp,
  Gem,
  Scroll,
  Swords,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface QuestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Quest type definition
interface Quest {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  xp: number
  timeEstimate: string
  icon: React.ElementType
  progress?: {
    current: number
    total: number
  }
  canDecline?: boolean
  completed?: boolean
}

// Reward type definition
interface Reward {
  type: 'xp' | 'coins' | 'gem' | 'scroll' | 'weapon'
  amount: number
  name: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  icon: React.ElementType
}

export function QuestsDialog({ open, onOpenChange }: QuestDialogProps) {
  const baseId = useId()
  const [declinedQuests, setDeclinedQuests] = useState<string[]>([])
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [claimedRewards, setClaimedRewards] = useState<string[]>([])
  const [replacementQuests, setReplacementQuests] = useState<Quest[]>([])
  const [questKey, setQuestKey] = useState(100) // For generating unique keys for new quests
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [currentRewards, setCurrentRewards] = useState<Reward[]>([])
  const [currentQuestId, setCurrentQuestId] = useState<string>('')
  const [isChestOpening, setIsChestOpening] = useState(false)

  // Initial quest data
  const initialQuests: Quest[] = [
    {
      id: 'quest-1',
      title: 'First Steps',
      description: 'Complete your first introduction to programming course.',
      difficulty: 'easy',
      xp: 50,
      timeEstimate: '15 min',
      icon: Zap,
      progress: {
        current: 0,
        total: 1,
      },
      canDecline: true, // Only this quest can be declined
    },
    {
      id: 'quest-2',
      title: 'Code Explorer',
      description: 'Examine 5 different code examples in the library.',
      difficulty: 'easy',
      xp: 75,
      timeEstimate: '20 min',
      icon: CheckCircle,
      progress: {
        current: 2,
        total: 5,
      },
      canDecline: false, // This quest cannot be declined
    },
    {
      id: 'quest-3',
      title: 'Algorithm Challenge',
      description: 'Solve a medium difficulty algorithm problem in the challenges section.',
      difficulty: 'medium',
      xp: 150,
      timeEstimate: '45 min',
      icon: Shield,
      canDecline: false, // Changed to false - cannot be declined
    },
    {
      id: 'quest-4',
      title: 'Complete Project',
      description: 'Create a complete application by following the advanced tutorial.',
      difficulty: 'hard',
      xp: 300,
      timeEstimate: '2 hours',
      icon: Sparkles,
      canDecline: false, // Changed to false - cannot be declined
    },
  ]

  // Replacement quests by difficulty
  const replacementQuestTemplates: Record<string, Quest[]> = {
    easy: [
      {
        id: `replacement-easy-1`,
        title: 'Documentation Review',
        description:
          'Read and summarize the documentation for a programming language of your choice.',
        difficulty: 'easy',
        xp: 60,
        timeEstimate: '25 min',
        icon: BookOpen,
        canDecline: false, // Changed to false - cannot be declined
      },
      {
        id: `replacement-easy-2`,
        title: 'Syntax Practice',
        description: 'Complete 10 basic syntax exercises to reinforce your understanding.',
        difficulty: 'easy',
        xp: 55,
        timeEstimate: '20 min',
        icon: Code,
        canDecline: false, // Changed to false - cannot be declined
      },
    ],
    medium: [
      {
        id: `replacement-medium-1`,
        title: 'Data Structure Implementation',
        description: 'Implement a linked list or binary tree from scratch.',
        difficulty: 'medium',
        xp: 140,
        timeEstimate: '40 min',
        icon: Code,
        canDecline: false, // Changed to false - cannot be declined
      },
      {
        id: `replacement-medium-2`,
        title: 'API Integration',
        description: 'Connect your application to a third-party API and display the data.',
        difficulty: 'medium',
        xp: 160,
        timeEstimate: '50 min',
        icon: Laptop,
        canDecline: false, // Changed to false - cannot be declined
      },
    ],
    hard: [
      {
        id: `replacement-hard-1`,
        title: 'Performance Optimization',
        description: 'Identify and fix performance bottlenecks in a complex application.',
        difficulty: 'hard',
        xp: 280,
        timeEstimate: '1.5 hours',
        icon: Laptop,
        canDecline: false, // Changed to false - cannot be declined
      },
      {
        id: `replacement-hard-2`,
        title: 'Advanced Algorithm',
        description: 'Implement a complex algorithm like A* pathfinding or a neural network.',
        difficulty: 'hard',
        xp: 320,
        timeEstimate: '2.5 hours',
        icon: Shield,
        canDecline: false, // Changed to false - cannot be declined
      },
    ],
  }

  // Function to decline a quest and add a replacement
  const handleDeclineQuest = (questId: string, difficulty: Quest['difficulty']) => {
    if (!declinedQuests.includes(questId)) {
      // Mark quest as declined
      setDeclinedQuests([...declinedQuests, questId])

      // Generate a replacement quest of the same difficulty
      const templates = replacementQuestTemplates[difficulty]
      if (templates && templates.length > 0) {
        // Pick a random template
        const randomIndex = Math.floor(Math.random() * templates.length)
        const template = templates[randomIndex]

        // Create a new quest with a unique ID
        const newQuest = {
          ...template,
          id: `new-quest-${questKey}`,
        }

        // Add the new quest to replacements
        setReplacementQuests([...replacementQuests, newQuest])

        // Increment the key for next time
        setQuestKey(questKey + 1)
      }
    }
  }

  // Function to get difficulty text
  const getDifficultyText = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'Easy'
      case 'medium':
        return 'Medium'
      case 'hard':
        return 'Hard'
      default:
        return 'Unknown'
    }
  }

  // Function to get color based on difficulty
  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      case 'hard':
        return 'bg-red-500/10 text-red-600 border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    }
  }

  // Function to get icon style based on difficulty
  const getIconStyle = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/20'
      case 'medium':
        return 'bg-amber-500/15 text-amber-500 ring-amber-500/20'
      case 'hard':
        return 'bg-red-500/15 text-red-500 ring-red-500/20'
      default:
        return 'bg-slate-500/15 text-slate-500 ring-slate-500/20'
    }
  }

  // Function to mark a quest as completed
  const handleCompleteQuest = (questId: string) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests([...completedQuests, questId])
    }
  }

  // Function to check if a quest is completed
  const isQuestCompleted = (questId: string) => {
    return completedQuests.includes(questId)
  }

  // Function to check if a quest reward has been claimed
  const isRewardClaimed = (questId: string) => {
    return claimedRewards.includes(questId)
  }

  // Function to generate random rewards
  const generateRewards = (difficulty: Quest['difficulty']): Reward[] => {
    const rewards: Reward[] = []

    // Always give XP
    const baseXP = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 150 : 300
    const xpVariation = Math.floor(Math.random() * (baseXP * 0.2)) // Up to 20% variation
    rewards.push({
      type: 'xp',
      amount: baseXP + xpVariation,
      name: 'Experience Points',
      rarity: 'common',
      icon: TrendingUp,
    })

    // Always give coins
    const baseCoins = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 250 : 500
    const coinVariation = Math.floor(Math.random() * (baseCoins * 0.3)) // Up to 30% variation
    rewards.push({
      type: 'coins',
      amount: baseCoins + coinVariation,
      name: 'Gold Coins',
      rarity: 'common',
      icon: Coins,
    })

    // Chance for special rewards based on difficulty
    const specialRewardChance = difficulty === 'easy' ? 0.3 : difficulty === 'medium' ? 0.6 : 0.9
    if (Math.random() < specialRewardChance) {
      // Determine rarity based on difficulty
      let possibleRarities: Reward['rarity'][] = ['common', 'uncommon']
      if (difficulty === 'medium') {
        possibleRarities = ['uncommon', 'rare']
      } else if (difficulty === 'hard') {
        possibleRarities = ['rare', 'epic', 'legendary']
      }

      const rarity = possibleRarities[Math.floor(Math.random() * possibleRarities.length)]

      // Pick a random special reward type
      const specialTypes: { type: Reward['type']; name: string; icon: React.ElementType }[] = [
        { type: 'gem', name: 'Magic Gem', icon: Gem },
        { type: 'scroll', name: 'Ancient Scroll', icon: Scroll },
        { type: 'weapon', name: 'Enchanted Weapon', icon: Swords },
      ]

      const specialReward = specialTypes[Math.floor(Math.random() * specialTypes.length)]

      // Amount based on rarity
      const rarityMultiplier =
        rarity === 'common'
          ? 1
          : rarity === 'uncommon'
            ? 2
            : rarity === 'rare'
              ? 3
              : rarity === 'epic'
                ? 5
                : 10 // legendary

      rewards.push({
        type: specialReward.type,
        amount: rarityMultiplier,
        name: specialReward.name,
        rarity: rarity,
        icon: specialReward.icon,
      })
    }

    return rewards
  }

  // Function to handle claiming a reward
  const handleClaimReward = (questId: string, difficulty: Quest['difficulty']) => {
    setCurrentQuestId(questId)
    const rewards = generateRewards(difficulty)
    setCurrentRewards(rewards)
    setRewardDialogOpen(true)
  }

  // Function to finalize claiming the reward
  const finalizeRewardClaim = () => {
    if (currentQuestId) {
      setClaimedRewards([...claimedRewards, currentQuestId])
      setRewardDialogOpen(false)
      setIsChestOpening(false)
      setCurrentRewards([])
      setCurrentQuestId('')
    }
  }

  // Function to get rarity color
  const getRarityColor = (rarity: Reward['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
      case 'uncommon':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'rare':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      case 'epic':
        return 'text-purple-500 bg-purple-500/10 border-purple-500/20'
      case 'legendary':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    }
  }

  // Combine initial and replacement quests, filtering out declined ones
  const allQuests = [...initialQuests, ...replacementQuests]
  const activeQuests = allQuests.filter((quest) => !declinedQuests.includes(quest.id))

  // Sort quests by difficulty (easy -> medium -> hard)
  const sortedActiveQuests = [...activeQuests].sort((a, b) => {
    // First sort by completion status (incomplete first)
    const aCompleted = completedQuests.includes(a.id) ? 1 : 0
    const bCompleted = completedQuests.includes(b.id) ? 1 : 0

    if (aCompleted !== bCompleted) {
      return aCompleted - bCompleted
    }

    // Then sort by difficulty
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  })

  // Animation variants
  const questVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-6 w-6 text-amber-500" />
            Available Quests
          </DialogTitle>
          <DialogDescription>
            Progress in your learning journey by completing these quests to earn experience.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {sortedActiveQuests.map((quest) => {
              const questId = `${baseId}-${quest.id}`

              return (
                <motion.div
                  key={quest.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={questVariants}
                  layout
                  className={cn(
                    'border-input relative flex w-full items-start gap-3 rounded-md border p-4 shadow-xs outline-none',
                    isQuestCompleted(quest.id) && 'bg-emerald-950/40 border-emerald-800/40',
                  )}
                >
                  {quest.canDecline && !isQuestCompleted(quest.id) && (
                    <button
                      onClick={() => handleDeclineQuest(quest.id, quest.difficulty)}
                      className="absolute top-2 right-2 p-1 rounded-full text-slate-400/80 hover:text-red-400 transition-colors z-10"
                      aria-label="Decline quest"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <div className="flex grow items-start gap-3">
                    <div
                      className={cn(
                        'mt-1 rounded-full p-2 shrink-0 ring-1 ring-inset',
                        isQuestCompleted(quest.id)
                          ? 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/20'
                          : getIconStyle(quest.difficulty),
                      )}
                    >
                      {isQuestCompleted(quest.id) ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <quest.icon className="h-5 w-5" />
                      )}
                    </div>

                    <div className="grid grow gap-2">
                      <div className="flex items-center gap-2 pr-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-sm text-xs font-medium',
                            isQuestCompleted(quest.id)
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : getDifficultyColor(quest.difficulty),
                          )}
                        >
                          {isQuestCompleted(quest.id)
                            ? 'Completed'
                            : getDifficultyText(quest.difficulty)}
                        </Badge>
                        <span className="text-muted-foreground text-xs leading-[inherit] font-normal flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {quest.xp} XP
                        </span>
                      </div>

                      <p
                        className={cn(
                          'text-sm',
                          isQuestCompleted(quest.id)
                            ? 'text-slate-400 line-through'
                            : 'text-muted-foreground',
                        )}
                      >
                        {quest.description}
                      </p>

                      {quest.progress && !isQuestCompleted(quest.id) && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{
                                width: `${(quest.progress.current / quest.progress.total) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {quest.progress.current}/{quest.progress.total}
                          </span>
                        </div>
                      )}

                      {!isQuestCompleted(quest.id) && (
                        <button
                          onClick={() => handleCompleteQuest(quest.id)}
                          className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 self-start"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark as completed
                        </button>
                      )}

                      {isQuestCompleted(quest.id) && !isRewardClaimed(quest.id) && (
                        <Button
                          onClick={() => handleClaimReward(quest.id, quest.difficulty)}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs font-medium text-amber-500 hover:text-amber-600 border-amber-500/20 hover:border-amber-500/30 hover:bg-amber-500/10 flex items-center gap-1.5"
                        >
                          <Gift className="h-3.5 w-3.5" />
                          Claim Reward
                        </Button>
                      )}

                      {isQuestCompleted(quest.id) && isRewardClaimed(quest.id) && (
                        <span className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                          <Gift className="h-3.5 w-3.5" />
                          Reward claimed
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </DialogContent>

      {/* Reward Dialog */}
      <Dialog
        open={rewardDialogOpen}
        onOpenChange={(open) => !isChestOpening && setRewardDialogOpen(open)}
      >
        <DialogContent className="sm:max-w-[400px] text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Quest Reward</DialogTitle>
            <DialogDescription className="text-center">
              {!isChestOpening ? 'Open the treasure chest to claim your rewards!' : 'You received:'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            {!isChestOpening ? (
              <motion.div
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsChestOpening(true)}
              >
                <div className="w-32 h-32 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500 mb-4">
                  <Gift className="w-16 h-16" />
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">Open Chest</Button>
              </motion.div>
            ) : (
              <motion.div className="space-y-4 w-full">
                <AnimatePresence>
                  {currentRewards.map((reward, index) => (
                    <motion.div
                      key={`${reward.type}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-md border',
                        getRarityColor(reward.rarity),
                      )}
                    >
                      <div
                        className={cn(
                          'rounded-full p-2 shrink-0 ring-1 ring-inset',
                          getRarityColor(reward.rarity),
                        )}
                      >
                        <reward.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{reward.name}</p>
                        <p className="text-xs capitalize">{reward.rarity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">+{reward.amount}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <Button onClick={finalizeRewardClaim} className="w-full mt-4">
                  Collect All
                </Button>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
