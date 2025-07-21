'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ComponentPropsWithoutRef, useEffect, useMemo, useState } from 'react'

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring' as const, stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode
  delay?: number
  limit?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, limit, ...props }: AnimatedListProps) => {
    const childrenArray = useMemo(() => React.Children.toArray(children), [children])
    const [start, setStart] = useState(0)

    // Carousel infini si limit défini
    useEffect(() => {
      if (!limit) {
        // Old behavior: progressive reveal, puis reset
        let index = 0
        const animate = () => {
          if (index < childrenArray.length - 1) {
            setTimeout(() => {
              setStart(++index)
              animate()
            }, delay)
          } else if (childrenArray.length > 0) {
            setTimeout(() => {
              setStart(0)
              index = 0
              animate()
            }, delay * 2)
          }
        }
        setStart(0)
        animate()
        return () => {}
      } else {
        // Carousel infini
        const interval = setInterval(() => {
          setStart((prev) => (prev + 1) % childrenArray.length)
        }, delay)
        return () => clearInterval(interval)
      }
    }, [delay, childrenArray.length, limit])

    let itemsToShow: React.ReactNode[] = []
    if (!limit) {
      itemsToShow = useMemo(() => {
        const result = childrenArray.slice(0, start + 1).reverse()
        return result
      }, [start, childrenArray])
    } else {
      itemsToShow = useMemo(() => {
        if (childrenArray.length === 0) return []
        const res = []
        for (let i = 0; i < Math.min(limit, childrenArray.length); i++) {
          res.push(childrenArray[(start + i) % childrenArray.length])
        }
        return res
      }, [start, limit, childrenArray])
    }

    return (
      <div className={cn(`flex flex-col items-center gap-4`, className)} {...props}>
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  },
)

AnimatedList.displayName = 'AnimatedList'
