import { CssLogoIcon } from '@/components/icons/css-logo-icon'
import { DjangoLogoIcon } from '@/components/icons/django-logo-icon'
import { FastApiLogoIcon } from '@/components/icons/fastapi-logo-icon'
import { GoLogoIcon } from '@/components/icons/go-logo-icon'
import { GraphQLLogoIcon } from '@/components/icons/graphql-logo-icon'
import { HtmlLogoIcon } from '@/components/icons/html-logo-icon'
import { JsLogoIcon } from '@/components/icons/js-logo-icon'
import { NextjsLogoIcon } from '@/components/icons/nextjs-logo-icon'
import { PostgreSqlLogoIcon } from '@/components/icons/postgresql-logo-icon'
import { PythonLogoIcon } from '@/components/icons/python-logo-icon'
import { ReactLogoIcon } from '@/components/icons/react-logo-icon'
import { ReactRouterLogoIcon } from '@/components/icons/react-router-logo-icon'
import { TailwindLogoIcon } from '@/components/icons/tailwind-logo-icon'
import { TypescriptLogoIcon } from '@/components/icons/typescript-logo-icon'
import { VueLogoIcon } from '@/components/icons/vue-logo-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, Code, Network, Users } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { AuthButtons } from '@/components/buttons/AuthButtons'
import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { Eclipse } from 'lucide-react'
import ProblemsSection from './components/problems-section'
import { FeaturesSection } from './components/features-section'
import { CoursesSection } from './components/courses-section'
import { FinalCTA } from './components/final-cta'
import { Testimonials } from './components/testimonals'
import { FAQ } from './components/faq'
import { Footer7 } from './components/footer'
import { WhatYouReallyWant } from './components/desire'
import { HeroSection } from './components/hero-section'
import { Companies } from './components/compagnies'

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



export default async function Home() {

  
  return (
    <div>
      <HomeHeader />
      <main className="flex border-x border-border flex-col max-w-7xl mx-auto min-h-screen">
        <HeroSection />
        {/* <Companies /> */}
        <ProblemsSection />
        {/* <WhatYouReallyWant /> */}
        <FeaturesSection />
        <CoursesSection />
        <FinalCTA />
        {/* <Testimonials /> */}
        <FAQ />
      </main>
      <Footer7 />
    </div>
  )
}
