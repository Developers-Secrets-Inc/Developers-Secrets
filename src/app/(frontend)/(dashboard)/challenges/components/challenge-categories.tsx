'use client'

import {
  CodeIcon,
  BrainCircuitIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  GanttChartIcon,
  BinaryIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useState } from 'react'
import Link from 'next/link'

type Category = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  totalChallenges: number
  slug: string
}

const categories: Category[] = [
  {
    id: '1',
    title: 'Object Oriented Programming',
    description: 'Master OOP concepts and design patterns',
    icon: <CodeIcon className="h-6 w-6" />,
    totalChallenges: 12,
    slug: 'oop',
  },
  {
    id: '2',
    title: 'Python Programming',
    description: 'Learn Python through practical challenges',
    icon: <BrainCircuitIcon className="h-6 w-6" />,
    totalChallenges: 15,
    slug: 'python',
  },
  {
    id: '3',
    title: 'Algorithms',
    description: 'Solve algorithmic problems and optimize solutions',
    icon: <GanttChartIcon className="h-6 w-6" />,
    totalChallenges: 20,
    slug: 'algorithms',
  },
  {
    id: '4',
    title: 'Database Security',
    description: 'Learn database security best practices',
    icon: <DatabaseIcon className="h-6 w-6" />,
    totalChallenges: 8,
    slug: 'database',
  },
  {
    id: '5',
    title: 'Web Security',
    description: 'Master web application security concepts',
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    totalChallenges: 10,
    slug: 'web-security',
  },
  {
    id: '6',
    title: 'Binary Exploitation',
    description: 'Learn about binary exploitation and reverse engineering',
    icon: <BinaryIcon className="h-6 w-6" />,
    totalChallenges: 6,
    slug: 'binary',
  },
]

export const ChallengeCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className="group relative overflow-hidden rounded-lg border bg-background/50 p-4 hover:border-primary/50 transition-colors cursor-not-allowed opacity-75"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-primary/10 text-primary">{category.icon}</div>
                <span className="text-sm text-muted-foreground">
                  {category.totalChallenges} challenges
                </span>
              </div>
              <h3 className="font-semibold leading-none tracking-tight">{category.title}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
            <div className="absolute inset-0 bg-background/10" />
          </button>
        ))}
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon!</DialogTitle>
            <DialogDescription>
              The {selectedCategory?.title} challenges are currently in development and will be
              available soon. Stay tuned for exciting new content!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
