'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Gift, Coins, Star, X } from 'lucide-react'
import { Item } from '@/payload-types'
import { cn } from '@/lib/utils'

type ChestRewards = {
  coins: number
  xp: number
  items: {
    common: Item[]
    rare: Item[]
    epic: Item[]
    legendary: Item[]
  }
}

interface ChestOpeningDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rewards: ChestRewards
}

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-600',
  rare: 'bg-blue-100 text-blue-600',
  epic: 'bg-purple-100 text-purple-600',
  legendary: 'bg-amber-100 text-amber-600',
}

const RARITY_BORDERS = {
  common: 'border-gray-200',
  rare: 'border-blue-200',
  epic: 'border-purple-200',
  legendary: 'border-amber-200',
}

const RARITY_SHADOWS = {
  common: 'shadow-gray-200/50',
  rare: 'shadow-blue-200/50',
  epic: 'shadow-purple-200/50',
  legendary: 'shadow-amber-200/50',
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  }),
}

const fadeVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export function ChestOpeningDialog({ open, onOpenChange, rewards }: ChestOpeningDialogProps) {
  const [[page, direction], setPage] = React.useState([0, 0])

  // Create an array of all rewards to display
  const rewardSteps = React.useMemo(() => {
    const steps = []

    // Add coins if any
    if (rewards.coins > 0) {
      steps.push({
        type: 'coins',
        value: rewards.coins,
      })
    }

    // Add XP if any
    if (rewards.xp > 0) {
      steps.push({
        type: 'xp',
        value: rewards.xp,
      })
    }

    // Add items by rarity (legendary first)
    const rarityOrder = ['legendary', 'epic', 'rare', 'common'] as const
    rarityOrder.forEach((rarity) => {
      rewards.items[rarity]?.forEach((item) => {
        steps.push({
          type: 'item',
          item,
          rarity,
        })
      })
    })

    return steps
  }, [rewards])

  const paginate = (newDirection: number) => {
    if (
      (newDirection === 1 && page + 1 < rewardSteps.length) ||
      (newDirection === -1 && page > 0)
    ) {
      setPage([page + newDirection, newDirection])
    }
  }

  // Reset to first page when dialog opens
  React.useEffect(() => {
    if (open) {
      setPage([0, 0])
    }
  }, [open])

  const currentIndex = Math.abs(page % rewardSteps.length)

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowLeft') paginate(-1)
      if (e.key === 'ArrowRight') paginate(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, page])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Opening Chest</DialogTitle>
        </DialogHeader>

        <motion.div
          className="relative flex flex-col items-center justify-center min-h-[400px] p-6"
          initial="hidden"
          animate="visible"
          variants={fadeVariants}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              {(() => {
                const reward = rewardSteps[currentIndex]
                if (!reward) return null

                switch (reward.type) {
                  case 'coins':
                    return (
                      <div className="flex flex-col items-center gap-6 p-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-200/30 blur-2xl rounded-full" />
                          <div className="relative rounded-full bg-yellow-100 p-8 shadow-lg shadow-yellow-200/50">
                            <Coins className="h-16 w-16 text-yellow-600" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-4xl font-bold text-yellow-600">
                            {reward.value.toLocaleString()}
                          </h3>
                          <p className="text-lg text-muted-foreground">Coins</p>
                        </div>
                      </div>
                    )

                  case 'xp':
                    return (
                      <div className="flex flex-col items-center gap-6 p-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-200/30 blur-2xl rounded-full" />
                          <div className="relative rounded-full bg-blue-100 p-8 shadow-lg shadow-blue-200/50">
                            <Star className="h-16 w-16 text-blue-600" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-4xl font-bold text-blue-600">
                            {reward.value.toLocaleString()}
                          </h3>
                          <p className="text-lg text-muted-foreground">Experience Points</p>
                        </div>
                      </div>
                    )

                  case 'item':
                    const colorClass = RARITY_COLORS[reward.rarity as keyof typeof RARITY_COLORS]
                    const borderClass = RARITY_BORDERS[reward.rarity as keyof typeof RARITY_BORDERS]
                    const shadowClass = RARITY_SHADOWS[reward.rarity as keyof typeof RARITY_SHADOWS]

                    return (
                      <div className="flex flex-col items-center gap-6 p-4">
                        <div className="relative">
                          <div
                            className={cn(
                              'absolute inset-0 blur-2xl rounded-full',
                              reward.rarity === 'common'
                                ? 'bg-gray-200/30'
                                : reward.rarity === 'rare'
                                  ? 'bg-blue-200/30'
                                  : reward.rarity === 'epic'
                                    ? 'bg-purple-200/30'
                                    : 'bg-amber-200/30',
                            )}
                          />
                          <div
                            className={cn(
                              'relative rounded-full p-8 shadow-lg border-2',
                              colorClass,
                              borderClass,
                              shadowClass,
                            )}
                          >
                            <Gift className="h-16 w-16" />
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-bold">{reward.item.name}</h3>
                          <p className="text-lg text-muted-foreground capitalize">
                            {reward.rarity} Item
                          </p>
                        </div>
                      </div>
                    )
                }
              })()}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              disabled={page === 0}
              className="h-10 w-10 rounded-full shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="text-sm font-medium text-muted-foreground">
              {currentIndex + 1} of {rewardSteps.length}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              disabled={currentIndex === rewardSteps.length - 1}
              className="h-10 w-10 rounded-full shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
