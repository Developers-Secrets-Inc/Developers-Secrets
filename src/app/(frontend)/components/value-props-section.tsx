import React from 'react'
import { Ripple } from '@/components/magicui/ripple'
import { Safari } from '@/components/magicui/safari'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'

export const ValuePropsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-12 md:mb-16">
          Discover Our Platform's Strengths
        </h2>
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-6 md:max-w-3xl md:grid-cols-2 xl:grid-rows-2 md:grid-rows-3 xl:max-w-6xl xl:auto-rows-fr xl:grid-cols-3">
          {/* Card 1: Advanced AI Algorithms */}
          <div
            className="group relative items-start overflow-hidden bg-background p-6 rounded-2xl border border-muted transition-all duration-500 ease-out"
            style={{ opacity: 1, transform: 'none', willChange: 'auto' }}
          >
            <div>
              <h3 className="font-semibold mb-2 text-primary">Advanced AI Algorithms</h3>
              <p className="text-foreground">
                Our platform utilizes cutting-edge AI algorithms to provide accurate and efficient
                solutions for your business needs.
              </p>
            </div>
            <Safari
              imageSrc="/challenge-page.png"
              url="https://developerssecrets.com"
              className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
          </div>

          {/* Card 2: Secure Data Handling */}
          <div
            className="group relative items-start overflow-hidden bg-background p-6 rounded-2xl border border-muted transition-all duration-500 ease-out"
            style={{ opacity: 1, transform: 'none', willChange: 'auto' }}
          >
            <div>
              <h3 className="font-semibold mb-2 text-primary">Secure Data Handling</h3>
              <p className="text-foreground">
                We prioritize your data security with state-of-the-art encryption and strict privacy
                protocols, ensuring your information remains confidential.
              </p>
            </div>
            <Safari
              imageSrc="/course-page.png"
              url="https://developerssecrets.com"
              className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
          </div>

          {/* Card 3: Seamless Integration */}
          <div
            className="group relative items-start overflow-hidden bg-background border border-muted p-6 rounded-2xl md:row-span-2 transition-all duration-500 ease-out"
            style={{ opacity: 1, transform: 'none', willChange: 'auto' }}
          >
            <div className="relative z-10">
              <h3 className="font-semibold mb-2 text-primary">Seamless Integration</h3>
              <p className="text-foreground">
                Easily integrate our AI solutions into your existing workflows and systems for a
                smooth and efficient operation.
              </p>
            </div>
            <FlickeringGrid
              className="size-full pointer-events-none z-0 absolute inset-0 [mask:radial-gradient(circle_at_center,#fff_400px,transparent_0)]"
              squareSize={4}
              gridGap={6}
              color="hsl(var(--muted-foreground))"
              maxOpacity={0.5}
              flickerChance={0.1}
            />
            <Safari
              imageSrc="/challenges-home.png"
              url="https://developerssecrets.com"
              className="-mb-48 ml-12 mt-16 h-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-x-[-10px] transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
          </div>

          {/* Card 4: Customizable Solutions */}
          <div
            className="group relative items-start overflow-hidden bg-background border border-muted p-6 rounded-2xl flex-row order-4 md:col-span-2 md:flex-row xl:order-none transition-all duration-500 ease-out"
            style={{ opacity: 1, transform: 'none', willChange: 'auto' }}
          >
            <div>
              <h3 className="font-semibold mb-2 text-primary">Advanced Gamification</h3>
              <p className="text-foreground">
                Tailor our AI services to your specific needs with flexible customization options,
                allowing you to get the most out of our platform.
              </p>
            </div>
            <Ripple className="translate-y-1/2" />
            <Safari
              imageSrc="/quests-page.png"
              url="https://developerssecrets.com"
              className="-mb-32 mt-4 max-h-64 w-full px-4 select-none drop-shadow-[0_0_28px_rgba(0,0,0,.1)] group-hover:translate-y-[-10px] transition-all duration-300"
            />
            <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
