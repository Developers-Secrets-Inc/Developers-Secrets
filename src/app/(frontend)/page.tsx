import { Metadata } from 'next'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'

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

import { ArrowRight, BarChart, Heart, Rocket, ShieldCheck, Users } from 'lucide-react'

function CompanySection() {
  return (
    <section
      id="company"
      className="flex flex-col items-center justify-center gap-10 py-10 pt-20 w-full relative px-6"
    >
      <p className="text-muted-foreground font-medium">Trusted by leading tech companies</p>
      <div className="grid w-full max-w-7xl grid-cols-2 md:grid-cols-4 overflow-hidden border-y border-border items-center justify-center z-20">
        <CompanyLink icon={Rocket} label="Success Stories" />
        <CompanyLink icon={ShieldCheck} label="Learning Path" />
        <CompanyLink icon={BarChart} label="Progress" />
        <CompanyLink icon={Users} label="Community" />
        <CompanyLink icon={Heart} label="Projects" />
        <CompanyLink icon={Rocket} label="Challenges" />
        <CompanyLink icon={ShieldCheck} label="Mentorship" />
        <CompanyLink icon={BarChart} label="Analytics" />
      </div>
    </section>
  )
}

function CompanyLink({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <a
      className="group w-full h-28 flex items-center justify-center relative p-4 before:absolute before:-left-1 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-1 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-['']"
      href="#"
    >
      <div className="transition-all duration-200 [cubic-bezier(0.165, 0.84, 0.44, 1)] translate-y-0 group-hover:-translate-y-4 duration-300 flex items-center justify-center w-full h-full">
        <Icon className="dark:text-white text-black w-10 h-10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-4 transition-all duration-300 ease-[cubic-bezier(0.165, 0.84, 0.44, 1)]">
        <span className="flex items-center gap-2 text-sm font-medium">
          {label} <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </a>
  )
}

import { MessageSquare, User } from 'lucide-react'

function QuoteSection() {
  return (
    <section
      id="quote"
      className="flex flex-col items-center justify-center gap-8 w-full p-14 bg-accent z-20"
    >
      <blockquote className="max-w-3xl text-left px-4">
        <p className="text-xl md:text-2xl text-primary leading-relaxed tracking-tighter font-medium mb-6">
          "This platform transformed my journey into fullstack development. The hands-on challenges
          and real-world projects helped me land my dream developer role in just 6 months."
        </p>
        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-primary border border-border">
            <User className="size-full rounded-full object-contain text-background" />
          </div>
          <div className="text-left">
            <cite className="text-lg font-medium text-primary not-italic">Sarah Chen</cite>
            <p className="text-sm text-primary">Software Engineer at TechCorp</p>
          </div>
        </div>
      </blockquote>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="flex flex-col items-center justify-center gap-5 w-full relative"
    >
      <div className="border-b w-full h-full p-10 md:p-14">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
            Learn. Code. Build. Deploy.
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            Master fullstack development through our comprehensive learning path
          </p>
        </div>
      </div>
      <div className="w-full h-full lg:h-[450px] flex items-center justify-center">
        <div className="w-full">
          <div className="flex w-full flex-col items-center justify-center max-w-7xl mx-auto">
            <div className="grid h-full grid-cols-5 gap-x-10 px-10 md:px-20 items-center w-full">
              <div className="col-span-2 w-full h-full hidden lg:flex md:items-center justify-start">
                <div className="w-full h-full flex flex-col gap-8" data-orientation="vertical">
                  <FeatureAccordion
                    title="Interactive Challenges"
                    description="Practice with real-world coding challenges that simulate actual development scenarios."
                  />
                  <FeatureAccordion
                    title="Project-Based Learning"
                    description="Build complete applications from scratch using modern tech stacks."
                  />
                  <FeatureAccordion
                    title="Expert Mentorship"
                    description="Get guidance from experienced developers who've worked at top tech companies."
                  />
                  <FeatureAccordion
                    title="Career Support"
                    description="Resume reviews, mock interviews, and job placement assistance to help you land your dream role."
                  />
                </div>
              </div>
              <div className="col-span-5 h-[350px] min-h-[200px] w-auto lg:col-span-3 false">
                <div className="relative h-full w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 rounded-xl border border-neutral-300/50 transition-all duration-150 opacity-0" />
                  {/* Replacing the image with a background color and an icon */}
                  <div className="aspect-auto h-full w-full rounded-xl border border-neutral-300/50 object-cover p-1 transition-all duration-300 opacity-100 blur-0 bg-gray-100 flex items-center justify-center">
                    <MessageSquare className="w-24 h-24 text-gray-500" />
                  </div>
                </div>
              </div>
              <ul
                className="col-span-5 flex snap-x flex-nowrap overflow-x-auto [-ms-overflow-style:none] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)] [mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden snap-mandatory"
                style={{ padding: '50px calc(50%)' }}
              >
                <MobileFeatureCard
                  title="Ask Your AI Agent Directly"
                  description="Speak or type your command—let SkyAgent capture your intent. Your request instantly sets the process in motion."
                />
                <MobileFeatureCard
                  title="Let SkyAgent Process It"
                  description="We prioritize the needs and preferences of our users in our design process."
                />
                <MobileFeatureCard
                  title="Receive Instant, Actionable Results"
                  description="Our features seamlessly integrate with your existing systems for a smooth experience."
                />
                <MobileFeatureCard
                  title="Continuous Improvement"
                  description="We are constantly updating and improving our features to provide the best experience."
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GrowthSection() {
  return (
    <section
      id="growth"
      className="flex flex-col items-center justify-center w-full relative px-5 md:px-10"
    >
      <div className="border-x mx-5 md:mx-10 relative">
        <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-gray-950/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-gray-950/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="border-b w-full h-full p-10 md:p-14">
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
              Built for Career Growth
            </h2>
            <p className="text-muted-foreground text-center text-balance font-medium">
              From beginner to professional developer—our platform grows with you at every step of
              your journey.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0">
          <div className="flex flex-col items-start justify-end gap-2 p-6 min-h-[500px]">
            <div className="relative flex size-full items-center justify-center overflow-hidden transition-all duration-300 hover:[mask-image:none] hover:[webkit-mask-image:none] bg-gray-100">
              <ShieldCheck className="w-40 h-40 text-gray-500" />
            </div>
            <h3 className="text-lg tracking-tighter font-semibold">Industry-Standard Practices</h3>
            <p className="text-muted-foreground">
              Learn best practices, clean code principles, and modern development workflows used by
              top tech companies.
            </p>
          </div>
          <div className="flex flex-col items-start justify-end gap-2 p-6 min-h-[500px]">
            <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden [mask-image:linear-gradient(to_top,transparent,black_50%)] -translate-y-20">
              <div className="absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px] top-28">
                <div className="size-full opacity-100 transition-opacity duration-500 [contain:layout_paint_size] bg-gray-100 flex items-center justify-center rounded-full">
                  <Users className="w-32 h-32 text-gray-500" />
                </div>
              </div>
            </div>
            <h3 className="text-lg tracking-tighter font-semibold">Active Learning Community</h3>
            <p className="text-muted-foreground">
              Join a vibrant community of learners, collaborate on projects, and get help when you
              need it.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureAccordion({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-state="closed"
      data-orientation="vertical"
      className="mt-px overflow-hidden focus-within:relative focus-within:z-10 relative data-[state=open]:bg-white dark:data-[state=open]:bg-[#27272A] rounded-lg data-[state=closed]:rounded-none data-[state=closed]:border-0 dark:data-[state=open]:shadow-[0px_0px_0px_1px_rgba(249,250,251,0.06),0px_0px_0px_1px_var(--color-zinc-800,#27272A),0px_1px_2px_-0.5px_rgba(0,0,0,0.24),0px_2px_4px_-1px_rgba(0,0,0,0.24)] data-[state=open]:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.16),0px_1px_2px_-0.5px_rgba(0,0,0,0.16)]"
    >
      <div
        className="absolute overflow-hidden rounded-lg transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100 bg-neutral-300/50 dark:bg-neutral-300/30 left-0 right-0 bottom-0 h-0.5 w-full"
        data-state="closed"
      >
        <div
          className="absolute transition-all ease-linear bg-secondary left-0 top-0 h-full w-0"
          style={{ transitionDuration: '0s' }}
        />
      </div>
      <h3 data-orientation="vertical" data-state="closed" className="flex">
        <button
          type="button"
          aria-controls="radix-«R56af5b»"
          aria-expanded="false"
          data-state="closed"
          data-orientation="vertical"
          id="radix-«R16af5b»"
          className="group flex h-[45px] flex-1 cursor-pointer items-center justify-between p-3 outline-none font-semibold text-lg tracking-tight text-left"
          data-radix-collection-item=""
        >
          {title}
        </button>
      </h3>
      <div
        data-state="closed"
        id="radix-«R56af5b»"
        role="region"
        aria-labelledby="radix-«R16af5b»"
        data-orientation="vertical"
        className="overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down text-sm font-medium"
        style={{
          '--radix-accordion-content-height': 'var(--radix-collapsible-content-height)',
          '--radix-accordion-content-width': 'var(--radix-collapsible-content-width)',
        }}
        hidden=""
      >
        {description && <div className="p-3">{description}</div>}
        {children}
      </div>
    </div>
  )
}

function MobileFeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <a
      className="card relative grid h-full max-w-64 shrink-0 items-start justify-center p-3 bg-background border-l last:border-r border-t border-b first:rounded-tl-xl last:rounded-tr-xl"
      style={{ scrollSnapAlign: 'center' }}
    >
      <div
        className="absolute overflow-hidden rounded-lg transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100 bg-neutral-300/50 dark:bg-neutral-300/30 left-0 right-0 bottom-0 h-0.5 w-full"
        data-state="closed"
      >
        <div
          className="absolute transition-all ease-linear bg-secondary left-0 top-0 h-full w-0"
          style={{ transitionDuration: '0s' }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mx-0 max-w-sm text-balance text-sm font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </a>
  )
}

import { Globe, Zap, Lock, Star, CircleCheck } from 'lucide-react'

function HeroSection() {
  return (
    <section className="py-32">
      <div className="relative">
        <div className="absolute inset-0 -z-10 mx-auto h-full w-full max-w-3xl bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        <h1 className="relative mx-auto mb-8 max-w-3xl flex-wrap text-center text-4xl font-semibold md:mb-10 md:text-6xl md:leading-snug">
          <span>
            Master<span className="ml-1 opacity-50">Fullstack</span> Development by Practice
          </span>
          <div className="absolute -top-10 -left-20 hidden w-fit -rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            <Zap className="lucide lucide-zap h-auto w-3" />
            Interactive
          </div>
          <div className="absolute top-14 -left-24 hidden w-fit -rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            <Lock className="lucide lucide-lock h-auto w-3" />
            Hands-on
          </div>
          <div className="absolute -top-10 -right-24 hidden w-fit rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            Real Projects
            <Star className="lucide lucide-star h-auto w-3" />
          </div>
          <div className="absolute top-14 -right-28 hidden w-fit rotate-12 gap-1 border-b border-dashed border-muted-foreground text-sm font-normal text-muted-foreground underline-offset-3 lg:flex">
            Job-Ready
            <CircleCheck className="lucide lucide-circle-check h-auto w-3" />
          </div>
        </h1>
        <p className="mx-auto mb-10 max-w-screen-md text-center font-medium text-muted-foreground md:text-xl">
          Learn fullstack development through hands-on challenges, real-world projects, and expert
          mentorship. Build your portfolio while mastering modern tech stacks.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-3 pb-12">
          <button
            data-slot="button"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6 has-[>svg]:px-4"
          >
            Start Learning
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <HomeHeader />
      <HeroSection />
    </div>
  )
}
