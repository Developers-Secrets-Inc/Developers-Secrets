'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Code, Brain, Database, Server, Layout, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const ProfileSkillsCard = () => {
  const skills = [
    {
      id: 1,
      name: 'Frontend Development',
      icon: Layout,
      level: 85,
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: 2,
      name: 'Backend Development',
      icon: Server,
      level: 75,
      technologies: ['Node.js', 'Express', 'MongoDB'],
    },
    {
      id: 3,
      name: 'Database Management',
      icon: Database,
      level: 70,
      technologies: ['SQL', 'PostgreSQL', 'Redis'],
    },
    {
      id: 4,
      name: 'Problem Solving',
      icon: Brain,
      level: 90,
      technologies: ['Algorithms', 'Data Structures'],
    },
    {
      id: 5,
      name: 'Clean Code',
      icon: Code,
      level: 80,
      technologies: ['SOLID', 'Design Patterns', 'Testing'],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn('overflow-hidden bg-background', 'border border-dashed')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <PlusIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">No Skills Added Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Start adding your skills and expertise to showcase your technical abilities.
            </p>
            <Button className="mt-4" variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
