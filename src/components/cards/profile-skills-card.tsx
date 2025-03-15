'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Code, Brain, Database, Server, Layout } from 'lucide-react'

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
      <Card className="overflow-hidden shadow-xl bg-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <skill.icon className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <Badge variant="secondary">{skill.level}%</Badge>
                </div>
                <Progress value={skill.level} className="h-2" />
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="text-xs bg-blue-500/10 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
