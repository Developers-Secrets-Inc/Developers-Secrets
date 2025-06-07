import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const CTA = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="bg-card border border-muted p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-center">
          <div className="bg-primary/10 p-3 rounded-lg inline-flex mb-6">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Ready to Elevate Your Coding Journey?
          </h2>
          <p className="text-card-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join us today to elevate your career with our hands-on platform. 
            Build real projects, master in-demand skills, and join a thriving community of passionate coders.
          </p>
          <Button size="lg" className="text-lg h-12 px-8 group" asChild>
            <Link href="/auth/signup">
              Start learning for free
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTA
