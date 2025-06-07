import React from 'react'
import { Ripple } from '@/components/magicui/ripple'
import { Safari } from '@/components/magicui/safari'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'

interface ValueCardProps {
  title: string
  description: string
  imageSrc: string
  className?: string
  children?: React.ReactNode
}

const ValueCard: React.FC<ValueCardProps> = ({ 
  title, 
  description, 
  imageSrc, 
  className = '',
  children 
}) => (
  <div className={`group relative items-start overflow-hidden bg-background p-6 rounded-2xl border border-muted transition-all duration-500 ease-out ${className}`}>
    <div>
      <h3 className="font-semibold mb-2 text-primary">{title}</h3>
      <p className="text-foreground">{description}</p>
    </div>
    {children}
    <Safari
      imageSrc={imageSrc}
      url="/"
      className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
    />
    <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
  </div>
)

export const ValuePropsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-12 md:mb-16">
          Discover Our Platform's Strengths
        </h2>
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-6 md:max-w-3xl md:grid-cols-2 xl:grid-rows-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3">
          {/* Card 1: Coding Challenges */}
          <ValueCard
            title="Master Coding Challenges"
            description="Sharpen your skills with real-world coding problems that test your problem-solving abilities and help you prepare for technical interviews."
            imageSrc="/challenge-page.png"
          />

          {/* Card 2: Interactive Courses */}
          <ValueCard
            title="Interactive Learning (Coming Soon)"
            description="Dive into our structured courses designed by industry experts to build your skills progressively with hands-on projects and real-world applications."
            imageSrc="/course-page.png"
          />

          {/* Card 3: Progress Tracking */}
          <div className="group relative items-start overflow-hidden bg-background border border-muted p-6 rounded-2xl md:row-span-2 transition-all duration-500 ease-out">
            <div className="relative z-10">
              <h3 className="font-semibold mb-2 text-primary">Track Your Learning Journey</h3>
              <p className="text-foreground">
                Visualize your progress with detailed analytics and personalized insights. Identify your strengths, track improvements, and stay motivated as you advance through your coding journey.
              </p>
            </div>
            <FlickeringGrid
              className="size-full pointer-events-none z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
              squareSize={4}
              gridGap={6}
              color="hsl(var(--muted-foreground))"
              maxOpacity={0.3}
              flickerChance={0.05}
            />
            <Safari
              imageSrc="/challenges-home.png"
              url="/"
              className="-mb-48 ml-12 mt-16 h-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-x-[-10px] transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
          </div>

          {/* Card 4: Gamification */}
          <div className="group relative items-start overflow-hidden bg-background border border-muted p-6 rounded-2xl flex-row order-4 md:col-span-2 md:flex-row xl:order-none transition-all duration-500 ease-out">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Advanced Gamification</h3>
              <p className="text-foreground">
              Stay motivated with our gamified learning experience. Complete challenges, earn badges, and climb the leaderboard as you master new concepts and solve problems.

              </p>
              <Ripple className="translate-y-1/2" />
            </div>
            <Safari
              imageSrc="/quests-page.png"
              url="/"
              className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
