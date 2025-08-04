import { Metadata } from 'next'
import Link from 'next/link'

import { AuthButtons } from '@/components/buttons/AuthButtons'
import { MainNavigationMenu } from '@/components/navigation-menu/header-navigation-menu'
import { Eclipse } from 'lucide-react'
import { CoursesSection } from './components/courses-section'
import { FAQ } from './components/faq'
import { FeaturesSection } from './components/features-section'
import { FinalCTA } from './components/final-cta'
import { Footer7 } from './components/footer'
import { HeroSection } from './components/hero-section'
import ProblemsSection from './components/problems-section'

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
