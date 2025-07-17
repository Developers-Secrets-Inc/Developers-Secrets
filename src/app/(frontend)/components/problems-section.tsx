'use client'

import { AnimatedList } from '@/components/animated-list'
import { DjangoLogoIcon } from '@/components/icons/django-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { Markdown } from '@/components/markdown'
import { HelpCircle, ShieldAlert, Volume2 } from 'lucide-react'
import React, { useState } from 'react'
import { News } from './news-card'
import { NoSkillGraph } from './no-skill-graph'
import { Cross } from './cross'


// In less than 5 years, learning to code became almost impossible alone.

const TABS = [
  {
    key: 'noise',
    label: 'Noise',
    title: 'Overwhelming noise',
    icon: Volume2,
    content:
      'Tech stacks, tutorials, and AI everywhere. Too many options make it hard to focus or choose a clear path.',
  },
  {
    key: 'trust',
    label: 'Trust',
    title: 'Who can you trust?',
    icon: ShieldAlert,
    content:
      'Content quality keeps dropping. It’s tough to know which resources are reliable or worth your time.',
  },
  {
    key: 'clarity',
    label: 'Clarity',
    title: 'No clarity on your skills',
    icon: HelpCircle,
    content:
      'With so much noise, it’s hard to know what you really know or what to learn next to progress.',
  },
]

const TECHS = [
  {
    name: 'React',
    description: 'A popular UI library for building interfaces.',
    icon: <ReactLogoIcon className="h-6 w-6" />,
    color: '#61dafb',
    time: '2 weeks',
    difficulty: 'medium',
  },
  {
    name: 'Python',
    description: 'A versatile language for web, data, and automation.',
    icon: <PythonLogoIcon className="h-6 w-6" />,
    color: '#3776AB',
    time: '3 weeks',
    difficulty: 'easy',
  },
  {
    name: 'Next.js',
    description: 'A React framework for production-grade web apps.',
    icon: <NextjsLogoIcon className="h-6 w-6" />,
    color: '#000000',
    time: '2 weeks',
    difficulty: 'hard',
  },
  {
    name: 'TypeScript',
    description: 'Typed superset of JavaScript for safer code.',
    icon: <TypescriptLogoIcon className="h-6 w-6" />,
    color: '#3178c6',
    time: '2 weeks',
    difficulty: 'medium',
  },
  {
    name: 'Django',
    description: 'A high-level Python web framework.',
    icon: <DjangoLogoIcon className="h-6 w-6" />,
    color: '#44b78b',
    time: '2 weeks',
    difficulty: 'hard',
  },
]

function getDifficultyBadgeProps(difficulty: string) {
  if (difficulty === 'easy') {
    return {
      className:
        'rounded-md px-2 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary',
      label: 'Easy',
    }
  }
  if (difficulty === 'hard') {
    return {
      className:
        'rounded-md px-2 py-0.5 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500',
      label: 'Hard',
    }
  }
  // medium
  return {
    className:
      'rounded-md px-2 py-0.5 text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500',
    label: 'Medium',
  }
}

// Mise à jour de l'interface NewsArticle
export interface NewsArticle {
  title: string
  summary: string
  type: 'trusted' | 'sponsored' | 'community' | 'questionable'
  content: string // contenu markdown unique par carte
  image?: string
}

// Mise à jour des articles de démo sans href
const DEMO_ARTICLES: NewsArticle[] = [
  {
    title: 'Solid TypeScript Patterns',
    summary: 'A deep dive into advanced TypeScript techniques for large codebases.',
    type: 'trusted',
    content: `**Key Takeaways:**\n\n- Use strict types for safety\n- Prefer composition over inheritance\n- [Read the full article](#)\n\n---\n\nModern TypeScript enables you to write robust, maintainable code at scale. By leveraging advanced type features, you can catch more bugs at compile time and improve your team's productivity.\n\n> "TypeScript is a game changer for large JavaScript codebases."\n\nRemember to always keep your types as strict as possible, and refactor regularly to take advantage of new language features.`,
  },
  {
    title: 'How I Made $10,000 Overnight with AI (sponsored)',
    summary: 'A too-good-to-be-true story about instant success with minimal effort.',
    type: 'sponsored',
    content: `> _This article is sponsored. Results may vary._\n\n**Claim:** Make $10,000 overnight with AI!\n\n- No technical skills required\n- Just follow our secret method\n- [Sign up here](#)\n\n---\n\n**Disclaimer:** This method is not guaranteed. Many users have reported no results.\n\n> "I made $0, but maybe you'll be luckier!"\n\nAlways be cautious with get-rich-quick claims, especially those that require upfront payment.`,
  },
  {
    title: 'Why does my React app crash on load?',
    summary: 'A Stack Overflow thread with conflicting answers and mixed votes.',
    type: 'community',
    content: `**Top Answers:**\n\n- Try clearing your node_modules\n- Check your React version\n- See [this related thread](#)\n\n---\n\n**Discussion:**\n\nSome users suggest downgrading React, others recommend checking for duplicate packages.\n\n> "It worked for me after deleting package-lock.json!"\n\nIf you find a solution, consider upvoting helpful answers and sharing your findings.`,
  },
  {
    title: "Secret SEO Hacks They Don't Want You To Know",
    summary: 'Dubious advice with clickbait title and no sources.',
    type: 'questionable',
    content: `> _Warning: This advice is not verified and may be misleading._\n\n- Use this one weird trick for instant SEO\n- No sources provided\n- [More info](#)\n\n---\n\n**Red Flags:**\n\n- Promises of instant results\n- No reputable references\n- Overuse of buzzwords\n\n> "I doubled my traffic overnight!" (anonymous comment)\n\nBe skeptical of any advice that sounds too good to be true, especially without evidence.`,
  },
  {
    title: '10 Modern CSS Tips',
    summary: 'A curated list of practical CSS techniques for 2024.',
    type: 'trusted',
    content: `**Highlights:**\n\n- Use :is() and :where() for cleaner selectors\n- Embrace logical properties for better layouts\n- [Read the full guide](https://css-tricks.com/modern-css-tips/)\n\n---\n\nCSS evolves quickly. Stay up to date with the latest features to write more maintainable and powerful stylesheets.`,
  },
  {
    title: 'Ultimate React Bootcamp (Ad)',
    summary: 'Sponsored: Become a React pro in 7 days with our paid course.',
    type: 'sponsored',
    content: `> _Sponsored Content_\n\n- Lifetime access for $299\n- 100+ video lessons\n- "Guaranteed job offer"\n\n---\n\n**Note:** Always research course reviews and instructor credibility before purchasing.`,
  },
  {
    title: 'Should I Learn Vue or React?',
    summary: 'A heated debate in the dev.to community.',
    type: 'community',
    content: `**Popular Opinions:**\n\n- Vue is easier for beginners\n- React has more jobs\n- Svelte is the future?\n\n---\n\n> "Use what your team uses!"\n\nCommunity threads can be subjective—look for consensus and real-world examples.`,
  },
  {
    title: 'AI Will Replace All Developers by 2025!',
    summary: 'A sensationalist article with little evidence.',
    type: 'questionable',
    content: `> _Caution: This article contains speculation and lacks credible sources._\n\n- Claims all dev jobs will disappear\n- No data, just opinions\n- [Fact check this claim](#)\n\n---\n\n**Critical Thinking:**\n\n- Who benefits from this narrative?\n- What do reputable experts say?\n\n> "Don't believe everything you read online."`,
  },
  {
    title: 'How to fix CORS error in Express?',
    summary: 'A Stack Overflow Q&A with multiple accepted answers.',
    type: 'community',
    content: `**Top Solutions:**\n\n- Use the cors middleware\n- Set proper headers\n- Check browser console for details\n\n---\n\n**Extra Tips:**\n\n- CORS issues are often misdiagnosed\n- Always read the official Express docs\n\n> "It finally worked after I restarted my server!"`,
  },
]

function TechCard({
  name,
  description,
  icon,
  time,
  difficulty,
}: {
  name: string
  description: string
  icon: React.ReactNode
  time: string
  difficulty: string
}) {
  const badge = getDifficultyBadgeProps(difficulty)
  return (
    <div className="relative flex items-center gap-4 rounded-md border border-border bg-background p-4 shadow-sm transition hover:scale-[1.03] flex-1">
      <span className={badge.className + ' absolute top-2 right-2 z-10'}>{badge.label}</span>
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col overflow-hidden flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base truncate">{name}</span>
          <span className="text-xs text-gray-500 ml-2">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-tight truncate">{description}</p>
      </div>
    </div>
  )
}

export default function ProblemsSection() {
  const [selected, setSelected] = useState('noise')
  const current = TABS.find((tab) => tab.key === selected)

  return (
    <>
      {/* Mini section décorative avec le pattern de lignes */}
      <div
        className="w-full h-4 border-t border-border"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg stroke-width='3.5' stroke='hsla(0, 0%25, 100%25, 1.00)' fill='none'%3E%3Cline x1='0' y1='0' x2='400' y2='400'%3E%3C/line%3E%3Cline x1='400' y1='0' x2='800' y2='400'%3E%3C/line%3E%3Cline x1='800' y1='0' x2='1200' y2='400'%3E%3C/line%3E%3Cline x1='0' y1='400' x2='400' y2='800'%3E%3C/line%3E%3Cline x1='400' y1='400' x2='800' y2='800'%3E%3C/line%3E%3Cline x1='800' y1='400' x2='1200' y2='800'%3E%3C/line%3E%3Cline x1='0' y1='800' x2='400' y2='1200'%3E%3C/line%3E%3Cline x1='400' y1='800' x2='800' y2='1200'%3E%3C/line%3E%3Cline x1='800' y1='800' x2='1200' y2='1200'%3E%3C/line%3E%3C/g%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
      {/* Section intermédiaire avec titre */}
      <div className="border-t border-border">
        <div className="w-full p-8 flex flex-col items-start gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
            Modern hell
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground text-left">
            Why learning online became so hard for developers
          </h2>
        </div>
      </div>
      <section className="relative border-t border-border py-12">
        {/* Cross icons bottom left/right */}
        <Cross className="absolute left-0 bottom-0 translate-y-1/2 -translate-x-1/2 z-0" />
        <Cross className="absolute right-0 bottom-0 translate-y-1/2 translate-x-1/2 z-0" />
        <div className="px-8 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-row gap-16 w-full">
              <div className="flex flex-col min-w-[50%] max-w-md w-full gap-3">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelected(tab.key)}
                    className={
                      `text-left text-base font-medium p-5 rounded-md border transition-colors shadow-sm ` +
                      (selected === tab.key
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-background border-border text-foreground hover:bg-muted')
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <tab.icon className="h-4 w-4 shrink-0" />
                      <span>{tab.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground leading-normal">
                      {tab.content}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex-1 flex flex-col items-stretch justify-start">
                <div>
                  {selected === 'noise' ? (
                    <div className="relative flex h-[400px] w-full flex-col overflow-hidden p-2">
                      <AnimatedList limit={4} delay={1200}>
                        {TECHS.map((tech) => (
                          <TechCard key={tech.name} {...tech} />
                        ))}
                      </AnimatedList>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
                    </div>
                  ) : selected === 'trust' ? (
                    <div className="relative flex h-[400px] w-full flex-col overflow-hidden p-2">
                      <News articles={DEMO_ARTICLES} />
                    </div>
                  ) : (
                    <NoSkillGraph />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
