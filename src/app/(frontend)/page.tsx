import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { HtmlLogoIcon } from '@/components/icons/html-logo-icon'
import { CssLogoIcon } from '@/components/icons/css-logo-icon'
import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { DjangoLogoIcon } from '@/components/icons/django-logo-icon'
import { FastApiLogoIcon } from '@/components/icons/fastapi-logo-icon'
import { TailwindLogoIcon } from '@/components/icons/tailwind-logo-icon'
import { GoLogoIcon } from '@/components/icons/go-logo-icon'
import { VueLogoIcon } from '@/components/icons/vue-logo-icon'
import { PostgreSqlLogoIcon } from '@/components/icons/postgresql-logo-icon'
import { ReactRouterLogoIcon } from '@/components/icons/react-router-logo-icon'
import Link from 'next/link'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Feature197 } from './components/features'
import { ValuePropsSection } from './components/value-props-section'
import { Footer7 } from './components/footer'
import { ProblemSection } from './components/problem'
import { GraphQLLogoIcon } from '@/components/icons/graphql-logo-icon'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Bot, Code, Network, Users } from 'lucide-react'


import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { Eclipse } from 'lucide-react'
import { AuthButtons } from '@/components/buttons/AuthButtons'

const HomeHeader = () => {
  return (
    <header className="flex z-40 sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 pl-8">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Eclipse />
        </Link>
        <MainNavigationMenu />

      </div>
      <AuthButtons />
    </header>
  )
}




export const metadata: Metadata = {
  title: 'Developers Secrets',
  description: 'Master fullstack development through interactive coding challenges',
  openGraph: {
    title: 'Developers Secrets',
    description: 'Master fullstack development through interactive coding challenges',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developers Secrets',
    description: 'Master fullstack development through interactive coding challenges',
  },
}

interface Integration {
  id: string
  icon: React.ReactNode
  name?: string
}

interface Hero32Props {
  heading?: string
  description?: string
  button?: {
    text: string
    url: string
  }
  integrations?: Integration[][]
}

const NewHeroSection = ({
  heading = 'Become a real software engineer. Or stay stuck shipping toy projects.',
  description = 'Discover our interactive fullstack development learning platform. Master the most in-demand technologies through practical coding challenges and structured progression.',
  button = {
    text: 'Start Learning',
    url: '/auth/signup',
  },
  integrations = [
    [
      {
        id: 'integration-1',
        icon: <PythonLogoIcon className="h-full w-full" />,
        name: 'Python',
      },
      {
        id: 'integration-2',
        icon: <ReactLogoIcon className="h-full w-full" />,
        name: 'React',
      },
      {
        id: 'integration-3',
        icon: <NextjsLogoIcon className="h-full w-full" />,
        name: 'Next.js',
      },
      {
        id: 'integration-4',
        icon: <HtmlLogoIcon className="h-full w-full" />,
        name: 'HTML5',
      },
      {
        id: 'integration-5',
        icon: <CssLogoIcon className="h-full w-full" />,
        name: 'CSS3',
      },
    ],
    [
      {
        id: 'integration-6',
        icon: <JsLogoIcon className="h-full w-full" />,
        name: 'JavaScript',
      },
      {
        id: 'integration-7',
        icon: <TypescriptLogoIcon className="h-full w-full" />,
        name: 'TypeScript',
      },
      {
        id: 'integration-8',
        icon: <DjangoLogoIcon className="h-full w-full" />,
        name: 'Django',
      },
      {
        id: 'integration-9',
        icon: <FastApiLogoIcon className="h-full w-full" />,
        name: 'FastAPI',
      },
      {
        id: 'integration-10',
        icon: <TailwindLogoIcon className="h-full w-full" />,
        name: 'Tailwind CSS',
      },
    ],
    [
      {
        id: 'integration-11',
        icon: <GoLogoIcon className="h-full w-full" />,
        name: 'Go',
      },
      {
        id: 'integration-12',
        icon: <VueLogoIcon className="h-full w-full" />,
        name: 'Vue.js',
      },
      {
        id: 'integration-13',
        icon: <PostgreSqlLogoIcon className="h-full w-full" />,
        name: 'PostgreSQL',
      },
      {
        id: 'integration-14',
        icon: <ReactRouterLogoIcon className="h-full w-full" />,
        name: 'React Router',
      },
      {
        id: 'integration-15',
        icon: <GraphQLLogoIcon className="h-full w-full" />,
        name: 'GraphQL',
      },
    ],
  ],
}: Hero32Props) => {
  const leftIcons = integrations.map((line) => line.slice(0, 2))
  const rightIcons = integrations.map((line) => line.slice(2))

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://shadcnblocks.com/images/block/patterns/square-alt-grid.svg"
          className="opacity-10 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
        />
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 z-10 flex w-1/4 flex-col items-start pt-32 gap-16 overflow-hidden pl-12 opacity-30">
          {leftIcons.map((line, i) => (
            <div key={`left-${i}`} className="flex gap-x-22 odd:-translate-x-11">
              {line.map((integration) => (
                <div key={integration.id} className="size-22 rounded-xl bg-muted shadow-xl">
                  <div className="h-full w-full bg-muted/20 p-4">{integration.icon}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="absolute top-0 right-0 z-10 flex w-1/4 flex-col items-end pt-32 gap-16 overflow-hidden pr-12 opacity-30">
          {rightIcons.map((line, i) => (
            <div key={`right-${i}`} className="flex gap-x-22 odd:translate-x-11">
              {line.map((integration) => (
                <div key={integration.id} className="size-22 rounded-xl bg-muted shadow-xl">
                  <div className="h-full w-full bg-muted/20 p-4">{integration.icon}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col items-center justify-center md:px-24 mx-auto">
          <div className="z-20 -mx-4 w-full shrink-0 bg-background px-4 pt-32 md:bg-transparent md:pb-32">
            <div className="flex flex-col items-center text-center">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-2 text-sm pr-4 pl-1 py-1 rounded-full gap-2">
                  <Badge className="rounded-full bg-primary/10 border-primary/20 text-primary">
                    New
                  </Badge>
                  Join our free alpha version!
                </Badge>
                <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">{heading}</h1>
                <p className="text-muted-foreground">{description}</p>
                <Button asChild size="lg" className="mt-10">
                  <a href={button.url}>{button.text}</a>
                </Button>
              </div>
              <div className="mt-12">
                <Image
                  src="/dashboard-image.png"
                  alt="Dashboard preview"
                  width={1100}
                  height={700}
                  className="rounded-lg border shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const companies = [
  'Google',
  'Microsoft',
  'Amazon',
  'Netflix',
  'YouTube',
  'Instagram',
  'Uber',
  'Spotify',
]

export function Companies() {
  return (
    <section id="companies" className="border-t border-border">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-center text-sm font-semibold text-muted-foreground">
            APPROVED BY DEVELOPERS AT
          </h3>
          <div className="relative mt-6 flex justify-center">
            <div className="grid grid-cols-2 place-items-center gap-2 md:grid-cols-4 xl:grid-cols-8 xl:gap-4">
              {companies.map((logo, idx) => (
                <img
                  key={idx}
                  src={`https://cdn.magicui.design/companies/${logo}.svg`}
                  className="h-10 w-40 px-2 dark:brightness-0 dark:invert"
                  alt={logo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const ProblemsSection = () => {
  return <div className="border-t border-border"></div>
}

const features = [
  {
    icon: <Code className="h-8 w-8" />,
    title: 'Interactive Challenges',
    description:
      'Solve real-world problems in our interactive coding environment. Get instant feedback and improve your skills.',
  },
  {
    icon: <Network className="h-8 w-8" />,
    title: 'Structured Learning Paths',
    description:
      'Follow curated learning paths that take you from beginner to advanced topics in a logical sequence.',
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI-Powered Assistance',
    description:
      'Stuck on a problem? Get hints and explanations from our AI assistant without revealing the solution.',
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Community & Leaderboards',
    description:
      'Compete with other learners, climb the leaderboards, and join a community of motivated developers.',
  },
]

export const FeaturesSection = () => {
  return (
    <section className="border-t border-border py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Everything you need to succeed</h2>
        <p className="mt-4 text-muted-foreground">
          Our platform provides all the tools and resources you need to master fullstack
          development.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 divide-x divide-y">
        {features.slice(0, 2).map((feature, i) => (
          <div key={i} className="p-6 bg-card text-card-foreground border-t">
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-center">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">{feature.description}</p>
          </div>
        ))}
        <div className="p-8 sm:col-span-2 flex flex-col items-center justify-center text-center bg-card">
          <h3 className="text-2xl font-bold">Ready to Elevate Your Skills?</h3>
          <p className="mt-2 text-muted-foreground">Join today and start your journey.</p>
          <Button className="mt-6">Explore Learning Paths</Button>
        </div>
        {features.slice(2).map((feature, i) => (
          <div key={i + 2} className="p-6 bg-card text-card-foreground">
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-center">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <HomeHeader />
      <main className="flex border-x border-border flex-col max-w-6xl mx-auto min-h-screen">
        <NewHeroSection />
        <Companies />
        <ProblemsSection />
        <FeaturesSection />
      </main>
    </div>
  )
}
