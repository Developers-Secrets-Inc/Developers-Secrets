'use client'

import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useEffect } from 'react'

interface LevelUpAnimationProps {
  level: number
  onComplete: () => void
}

export function LevelUpAnimation({ level, onComplete }: LevelUpAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 p-8 bg-background rounded-lg shadow-xl"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
      >
        <Trophy className="w-16 h-16 text-yellow-500" />
        <motion.h2
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Level Up!
        </motion.h2>
        <motion.p
          className="text-4xl font-extrabold text-primary"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          Level {level}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
