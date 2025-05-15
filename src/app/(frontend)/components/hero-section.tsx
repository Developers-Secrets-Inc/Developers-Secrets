import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
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
import { GraphqlLogoIcon } from '@/components/icons/graphql-logo-icon'
import React from 'react'

export interface Integration {
  id: string
  icon: React.ReactNode
  name?: string
}

export interface Hero32Props {
  heading?: string
  description?: string
  button?: {
    text: string
    url: string
  }
  integrations?: Integration[][]
}

export const HeroSection = ({
  heading = "It's never been easier to become a fullstack developer",
  description = 'Fully decomposable components, all the images and background patterns are individual images or svgs that can be replaced.',
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
        icon: <GraphqlLogoIcon className="h-full w-full" />,
        name: 'GraphQL',
      },
    ],
  ],
}: Hero32Props) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://shadcnblocks.com/images/block/patterns/square-alt-grid.svg"
          className="opacity-10 [mask-image:radial-gradient(75%_75%_at_center,white,transparent)]"
        />
      </div>
      <div className="relative">
        <div className="relative flex flex-col items-start md:flex-row md:items-center md:-space-x-26 md:px-24 mx-auto">
          <div className="z-20 -mx-4 w-full shrink-0 bg-background px-4 pt-32 md:w-1/2 md:bg-transparent md:pb-32">
            <div className="flex flex-col items-start text-left">
              <div className="max-w-xl">
                <h1 className="my-6 text-4xl font-bold text-pretty lg:text-6xl">{heading}</h1>
                <p className="text-muted-foreground">{description}</p>
                <Button asChild size="lg" className="mt-10">
                  <a href={button.url}>{button.text}</a>
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div className="relative z-30">
              <div className="flex flex-col gap-16 pt-12 pb-8 md:py-32">
                {integrations.map((line, i) => (
                  <div key={i} className="flex gap-x-22 odd:-translate-x-22">
                    {line.map((integration) => (
                      <TooltipProvider key={integration.id} delayDuration={0.5}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {integration.id === 'integration-1' ? (
                              <Link href="/tutorials/python" passHref>
                                <div className="size-22 rounded-xl border border-background bg-muted shadow-xl cursor-pointer">
                                  <div className="h-full w-full bg-muted/20 p-4">
                                    {integration.icon}
                                  </div>
                                </div>
                              </Link>
                            ) : (
                              <div className="size-22 rounded-xl bg-muted shadow-xl cursor-pointer">
                                <div className="h-full w-full bg-muted/20 p-4">
                                  {integration.icon}
                                </div>
                              </div>
                            )}
                          </TooltipTrigger>
                          {integration.name && (
                            <TooltipContentCustom>
                              <p>{integration.name}</p>
                            </TooltipContentCustom>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
