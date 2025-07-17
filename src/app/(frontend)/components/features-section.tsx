import { Button } from '@/components/ui/button'
import { Bot, Code, Network, Users } from 'lucide-react'

const features = [
  {
    icon: <Code className="h-4 w-4" />,
    title: 'Interactive Challenges',
    description:
      'Solve real-world problems in our interactive coding environment. Get instant feedback and improve your skills.',
  },
  {
    icon: <Network className="h-4 w-4" />,
    title: 'Structured Learning Paths',
    description:
      'Follow curated learning paths that take you from beginner to advanced topics in a logical sequence.',
  },
  {
    icon: <Bot className="h-4 w-4" />,
    title: 'AI-Powered Assistance',
    description:
      'Stuck on a problem? Get hints and explanations from our AI assistant without revealing the solution.',
  },
  {
    icon: <Users className="h-4 w-4" />,
    title: 'Community & Leaderboards',
    description:
      'Compete with other learners, climb the leaderboards, and join a community of motivated developers.',
  },
]

export const FeaturesSection = () => {
  return (
    <>
      <div className="border-t border-border">
        <div className="w-full p-8 flex flex-col items-start gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500 mb-2 inline-block">
            The Solution
          </span>
          <h2 className="text-3xl font-bold md:text-4xl mt-1">Everything you need to succeed</h2>
          <p className="mt-4 text-muted-foreground">
            Our platform provides all the tools and resources you need to master fullstack
            development.
          </p>
        </div>
      </div>
      <section className="border-t border-border">
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 divide-x divide-y">
          {/* Première carte (Interactive Challenges) avec DisplayCards en dessous */}
          <div className="p-6 bg-card text-card-foreground border-t">
            <div className="flex flex-row items-start gap-3 mb-2">
              <div>{features[0].icon}</div>
              <h3 className="text-lg font-semibold text-left mt-1">{features[0].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground text-left">{features[0].description}</p>

            <div className="flex min-h-[400px] w-full items-center justify-center py-20">
              <div className="w-full max-w-3xl">
                <DisplayCards
                  cards={[
                    {
                      icon: <Code className="size-4 text-blue-400" />,
                      title: 'Two Sum',
                      description: 'Find two numbers that add up to a target.',
                      date: 'Easy • 5 min',
                      className:
                        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      difficulty: 'easy',
                    },
                    {
                      icon: <Code className="size-4 text-purple-400" />,
                      title: 'Palindrome',
                      description: 'Check if a string is a palindrome.',
                      date: 'Medium • 10 min',
                      className:
                        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      difficulty: 'medium',
                    },
                    {
                      icon: <Code className="size-4 text-orange-400" />,
                      title: 'FizzBuzz',
                      description: 'Print numbers with Fizz/Buzz rules.',
                      date: 'Easy • 3 min',
                      className:
                        '[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10',
                      difficulty: 'easy',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          {/* Deuxième carte normale */}
          <div className="p-6 bg-card text-card-foreground border-t">
            <div className="flex flex-row items-start gap-3 mb-2">
              <div>{features[1].icon}</div>
              <h3 className="text-lg font-semibold text-left mt-1">{features[1].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground text-left">{features[1].description}</p>
          </div>
          <div className="p-8 sm:col-span-2 flex flex-col items-center justify-center text-center bg-card">
            <h3 className="text-2xl font-bold">Ready to Elevate Your Skills?</h3>
            <p className="mt-2 text-muted-foreground">Join today and start your journey.</p>
            <Button className="mt-6">Explore Learning Paths</Button>
          </div>
          {features.slice(2).map((feature, i) => (
            <div key={i + 2} className="p-6 bg-card text-card-foreground">
              <div className="flex flex-row items-start gap-3 mb-2">
                <div className="text-muted-foreground">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-left mt-1">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground text-left">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface DisplayCardProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  date?: string
  iconClassName?: string
  titleClassName?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = 'Featured',
  description = 'Discover amazing content',
  date = 'Just now',
  iconClassName = 'text-blue-500',
  titleClassName = 'text-blue-500',
  difficulty,
}: DisplayCardProps) {
  let badge
  if (difficulty === 'easy') {
    badge = (
      <span className="absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
        Easy
      </span>
    )
  } else if (difficulty === 'medium') {
    badge = (
      <span className="absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500">
        Medium
      </span>
    )
  } else if (difficulty === 'hard') {
    badge = (
      <span className="absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500">
        Hard
      </span>
    )
  }
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className,
      )}
    >
      {badge}
      <div>
        <span className="relative inline-block rounded-full bg-blue-800 p-1">{icon}</span>
        <p className={cn('text-lg font-medium', titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg">{description}</p>
      <p className="text-muted-foreground">{date}</p>
    </div>
  )
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[]
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: '[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10',
    },
  ]

  const displayCards = cards || defaultCards

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  )
}
