import { HomeHeader } from './components/home-header'
import Link from 'next/link'
import {
  MoveRight,
  BookOpen,
  Code,
  Sparkles,
  Globe,
  Zap,
  Lock,
  Star,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developer Documentation Platform',
  description: 'Comprehensive tutorials and documentation for developers',
  openGraph: {
    title: 'Developer Documentation Platform',
    description: 'Comprehensive tutorials and documentation for developers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Documentation Platform',
    description: 'Comprehensive tutorials and documentation for developers',
  },
}

import { ArrowRight, Rocket, ShieldCheck, BarChart, Users, Heart } from 'lucide-react';

function CompanySection() {
  return (
    <section
      id="company"
      className="flex flex-col items-center justify-center gap-10 py-10 pt-20 w-full relative px-6"
    >
      <p className="text-muted-foreground font-medium">Trusted by fast-growing startups</p>
      <div className="grid w-full max-w-7xl grid-cols-2 md:grid-cols-4 overflow-hidden border-y border-border items-center justify-center z-20">
        <CompanyLink icon={Rocket} label="Learn More" />
        <CompanyLink icon={ShieldCheck} label="Learn More" />
        <CompanyLink icon={BarChart} label="Learn More" />
        <CompanyLink icon={Users} label="Learn More" />
        <CompanyLink icon={Heart} label="Learn More" />
        <CompanyLink icon={Rocket} label="Learn More" />
        <CompanyLink icon={ShieldCheck} label="Learn More" />
        <CompanyLink icon={BarChart} label="Learn More" />
      </div>
    </section>
  );
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
  );
}


import {
  Quote,
  User,
  MessageSquare,
  Settings,
  Lightning,
  TrendingUp,
  Shield,
} from 'lucide-react';

function QuoteSection() {
  return (
    <section id="quote" className="flex flex-col items-center justify-center gap-8 w-full p-14 bg-accent z-20">
      <blockquote className="max-w-3xl text-left px-4">
        <p className="text-xl md:text-2xl text-primary leading-relaxed tracking-tighter font-medium mb-6">
          SkyAgent has transformed our daily operations. Tasks that once consumed hours now complete in moments,
          freeing our team to focus on creativity and strategic growth.
        </p>
        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-primary border border-border">
            <User className="size-full rounded-full object-contain text-background" /> {/* Replacing the image with an icon */}
          </div>
          <div className="text-left">
            <cite className="text-lg font-medium text-primary not-italic">Alex Johnson</cite>
            <p className="text-sm text-primary">CTO, Innovatech</p>
          </div>
        </div>
      </blockquote>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center justify-center gap-5 w-full relative">
      <div className="border-b w-full h-full p-10 md:p-14">
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
            Simple. Seamless. Smart.
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium">
            Discover how SkyAgent transforms your commands into action in four easy steps
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
                    title="Ask Your AI Agent Directly"
                    description="Speak or type your command—let SkyAgent capture your intent. Your request instantly sets the process in motion."
                  />
                  <FeatureAccordion title="Let SkyAgent Process It" />
                  <FeatureAccordion title="Receive Instant, Actionable Results" />
                  <FeatureAccordion title="Continuous Improvement">
                    <div className="p-3">
                      We are constantly updating and improving our features to provide the best experience.
                    </div>
                  </FeatureAccordion>
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
              <ul className="col-span-5 flex snap-x flex-nowrap overflow-x-auto [-ms-overflow-style:none] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)] [mask-image:linear-gradient(90deg,transparent,black_10%,white_90%,transparent)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden snap-mandatory" style={{ padding: '50px calc(50%)' }}>
                <MobileFeatureCard
                  title="Ask Your AI Agent Directly"
                  description="Speak or type your command—let SkyAgent capture your intent. Your request instantly sets the process in motion."
                />
                <MobileFeatureCard title="Let SkyAgent Process It" description="We prioritize the needs and preferences of our users in our design process." />
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
  );
}

function GrowthSection() {
  return (
    <section id="growth" className="flex flex-col items-center justify-center w-full relative px-5 md:px-10">
      <div className="border-x mx-5 md:mx-10 relative">
        <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-gray-950/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-gray-950/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="border-b w-full h-full p-10 md:p-14">
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
              Built for Secure Growth
            </h2>
            <p className="text-muted-foreground text-center text-balance font-medium">
              Where advanced security meets seamless scalability—designed to protect your data and empower your growth.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0">
          <div className="flex flex-col items-start justify-end gap-2 p-6 min-h-[500px]">
            {/* Image replaced with an Icon  */}
            <div className="relative flex size-full items-center justify-center overflow-hidden transition-all duration-300 hover:[mask-image:none] hover:[webkit-mask-image:none] bg-gray-100">
              <ShieldCheck className="w-40 h-40 text-gray-500" />
            </div>
            <h3 className="text-lg tracking-tighter font-semibold">Advanced Task Security</h3>
            <p className="text-muted-foreground">
              Safeguard your tasks with state-of-art encryption and secure access to your workflow data.
            </p>
          </div>
          <div className="flex flex-col items-start justify-end gap-2 p-6 min-h-[500px]">
            <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden [mask-image:linear-gradient(to_top,transparent,black_50%)] -translate-y-20">
              <div className="absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px] top-28">
                {/* Scalability icon with a background color */}
                <div className="size-full opacity-100 transition-opacity duration-500 [contain:layout_paint_size] bg-gray-100 flex items-center justify-center rounded-full">
                  <Users className="w-32 h-32 text-gray-500" />
                </div>
              </div>
            </div>
            <h3 className="text-lg tracking-tighter font-semibold">Scalable for Teams</h3>
            <p className="text-muted-foreground">
              Grow with your team. Track tasks across multiple workspaces and all team members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureAccordion({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div data-state="closed" data-orientation="vertical" className="mt-px overflow-hidden focus-within:relative focus-within:z-10 relative data-[state=open]:bg-white dark:data-[state=open]:bg-[#27272A] rounded-lg data-[state=closed]:rounded-none data-[state=closed]:border-0 dark:data-[state=open]:shadow-[0px_0px_0px_1px_rgba(249,250,251,0.06),0px_0px_0px_1px_var(--color-zinc-800,#27272A),0px_1px_2px_-0.5px_rgba(0,0,0,0.24),0px_2px_4px_-1px_rgba(0,0,0,0.24)] data-[state=open]:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.16),0px_1px_2px_-0.5px_rgba(0,0,0,0.16)]">
      <div className="absolute overflow-hidden rounded-lg transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100 bg-neutral-300/50 dark:bg-neutral-300/30 left-0 right-0 bottom-0 h-0.5 w-full" data-state="closed">
        <div className="absolute transition-all ease-linear bg-secondary left-0 top-0 h-full w-0" style={{ transitionDuration: '0s' }} />
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
  );
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
        <div className="absolute transition-all ease-linear bg-secondary left-0 top-0 h-full w-0" style={{ transitionDuration: '0s' }} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mx-0 max-w-sm text-balance text-sm font-medium leading-relaxed">{description}</p>
      </div>
    </a>
  );
}





export default async function HomePage() {
  return (
    <>
      <HomeHeader />
      <div className="max-w-7xl mx-auto border-x relative">
        <main className="flex flex-col items-center justify-center divide-y divide-border min-h-screen w-full">
          <section id="hero" className="w-full relative">
            <div className="relative flex flex-col items-center w-full px-6">
              <div className="absolute inset-0">
                <div className="absolute inset-0 -z-10 h-[600px] md:h-[800px] w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--secondary)_100%)] rounded-b-xl"></div>
              </div>
              <div className="relative z-10 pt-32 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
                <p className="border border-border bg-accent rounded-full text-sm h-8 px-3 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="dark:fill-white fill-[#364153]"
                  >
                    <path d="M7.62758 1.09876C7.74088 1.03404 7.8691 1 7.99958 1C8.13006 1 8.25828 1.03404 8.37158 1.09876L13.6216 4.09876C13.7363 4.16438 13.8316 4.25915 13.8979 4.37347C13.9642 4.48779 13.9992 4.6176 13.9992 4.74976C13.9992 4.88191 13.9642 5.01172 13.8979 5.12604C13.8316 5.24036 13.7363 5.33513 13.6216 5.40076L8.37158 8.40076C8.25828 8.46548 8.13006 8.49952 7.99958 8.49952C7.8691 8.49952 7.74088 8.46548 7.62758 8.40076L2.37758 5.40076C2.26287 5.33513 2.16753 5.24036 2.10123 5.12604C2.03492 5.01172 2 4.88191 2 4.74976C2 4.6176 2.03492 4.48779 2.10123 4.37347C2.16753 4.25915 2.26287 4.16438 2.37758 4.09876L7.62758 1.09876Z"></path>
                    <path d="M2.56958 7.23928L2.37758 7.34928C2.26287 7.41491 2.16753 7.50968 2.10123 7.624C2.03492 7.73831 2 7.86813 2 8.00028C2 8.13244 2.03492 8.26225 2.10123 8.37657C2.16753 8.49089 2.26287 8.58566 2.37758 8.65128L7.62758 11.6513C7.74088 11.716 7.8691 11.75 7.99958 11.75C8.13006 11.75 8.25828 11.716 8.37158 11.6513L13.6216 8.65128C13.7365 8.58573 13.8321 8.49093 13.8986 8.3765C13.965 8.26208 14 8.13211 14 7.99978C14 7.86745 13.965 7.73748 13.8986 7.62306C13.8321 7.50864 13.7365 7.41384 13.6216 7.34828L13.4296 7.23828L9.11558 9.70328C8.77568 9.89744 8.39102 9.99956 7.99958 9.99956C7.60814 9.99956 7.22347 9.89744 6.88358 9.70328L2.56958 7.23928Z"></path>
                    <path d="M2.37845 10.5993L2.57045 10.4893L6.88445 12.9533C7.22435 13.1474 7.60901 13.2496 8.00045 13.2496C8.39189 13.2496 8.77656 13.1474 9.11645 12.9533L13.4305 10.4883L13.6225 10.5983C13.7374 10.6638 13.833 10.7586 13.8994 10.8731C13.9659 10.9875 14.0009 11.1175 14.0009 11.2498C14.0009 11.3821 13.9659 11.5121 13.8994 11.6265C13.833 11.7409 13.7374 11.8357 13.6225 11.9013L8.37245 14.9013C8.25915 14.966 8.13093 15 8.00045 15C7.86997 15 7.74175 14.966 7.62845 14.9013L2.37845 11.9013C2.2635 11.8357 2.16795 11.7409 2.10148 11.6265C2.03501 11.5121 2 11.3821 2 11.2498C2 11.1175 2.03501 10.9875 2.10148 10.8731C2.16795 10.7586 2.2635 10.6638 2.37845 10.5983V10.5993Z"></path>
                  </svg>
                  Introducing custom automations
                </p>
                <div className="flex flex-col items-center justify-center gap-5">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary">
                    Meet your AI Agent Streamline your workflow
                  </h1>
                  <p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight">
                    AI assistant designed to streamline your digital workflows and handle mundane
                    tasks, so you can focus on what truly matters
                  </p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap justify-center">
                  <a
                    className="bg-secondary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-secondary-foreground w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-secondary/80 transition-all ease-out active:scale-95"
                    href="#"
                  >
                    Try for Free
                  </a>
                  <a
                    className="h-10 flex items-center justify-center w-32 px-5 text-sm font-normal tracking-wide text-primary rounded-full transition-all ease-out active:scale-95 bg-white dark:bg-background border border-[#E5E7EB] dark:border-[#27272A] hover:bg-white/80 dark:hover:bg-background/80"
                    href="#"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
            <div className="relative px-6 mt-10">
              <div className="relative size-full shadow-xl rounded-2xl overflow-hidden">
                <div className="relative block dark:hidden">
                  <div className="group relative cursor-pointer">
                    <div className="w-full aspect-video bg-background rounded-2xl"></div>
                    <div className="absolute isolate inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
                      <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-t from-secondary/20 to-[#ACC3F7/15] backdrop-blur-md">
                        <div className="relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-t from-secondary to-white/10 shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-play size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                            style={{
                              filter:
                                'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
                            }}
                          >
                            <polygon points="6 3 20 12 6 21 6 3"></polygon>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative hidden dark:block">
                  <div className="group relative cursor-pointer">
                    <div className="w-full aspect-video bg-background rounded-2xl"></div>
                    <div className="absolute isolate inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
                      <div className="flex size-28 items-center justify-center rounded-full bg-gradient-to-t from-secondary/20 to-[#ACC3F7/15] backdrop-blur-md">
                        <div className="relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-t from-secondary to-white/10 shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-play size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                            style={{
                              filter:
                                'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
                            }}
                          >
                            <polygon points="6 3 20 12 6 21 6 3"></polygon>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <CompanySection />
          <section
            id="bento"
            className="flex flex-col items-center justify-center w-full relative px-5 md:px-10"
          >
            <div className="border-x mx-5 md:mx-10 relative">
              <div className="absolute top-0 -left-4 md:-left-14 h-full w-4 md:w-14 text-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]"></div>
              <div className="absolute top-0 -right-4 md:-right-14 h-full w-4 md:w-14 text-primary/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]"></div>
              <div className="border-b w-full h-full p-10 md:p-14">
                <div className="max-w-xl mx-auto flex flex-col items-center justify-center gap-2">
                  <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance pb-1">
                    Empower Your Workflow with AI
                  </h2>
                  <p className="text-muted-foreground text-center text-balance font-medium">
                    Ask your AI Agent for real-time collaboration, seamless integrations, and
                    actionable insights to streamline your operations.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-pointer max-h-[400px] group">
                  <div className="relative flex size-full items-center justify-center h-full overflow-hidden">
                    <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-5">
                      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-background to-transparent z-20"></div>
                      <div
                        className="max-w-md mx-auto w-full flex flex-col gap-2"
                        style={{ transform: 'none' }}
                      >
                        <div className="flex items-end justify-end gap-3">
                          <div
                            className="max-w-[280px] bg-secondary text-white p-4 rounded-2xl ml-auto shadow-[0_0_10px_rgba(0,0,0,0.05)]"
                            style={{ opacity: 1, transform: 'none' }}
                          >
                            <p className="text-sm">
                              Hey, I need help scheduling a team meeting that works well for
                              everyone. Any suggestions for finding an optimal time slot?
                            </p>
                          </div>
                          <div className="flex items-center bg-background rounded-full w-fit border border-border flex-shrink-0">
                            <img
                              src="https://randomuser.me/api/portraits/women/79.jpg"
                              alt="User Avatar"
                              className="size-8 rounded-full flex-shrink-0"
                            />
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="flex items-center bg-background rounded-full size-10 flex-shrink-0 justify-center shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-border">
                            <svg
                              width="42"
                              height="24"
                              viewBox="0 0 42 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="fill-[var(--secondary)] size-4"
                            >
                              <g clipPath="url(#clip0_322_9172)">
                                <path
                                  d="M22.3546 0.96832C22.9097 0.390834 23.6636 0.0664062 24.4487 0.0664062C27.9806 0.0664062 31.3091 0.066408 34.587 0.0664146C41.1797 0.0664284 44.481 8.35854 39.8193 13.2082L29.6649 23.7718C29.1987 24.2568 28.4016 23.9133 28.4016 23.2274V13.9234L29.5751 12.7025C30.5075 11.7326 29.8472 10.0742 28.5286 10.0742H13.6016L22.3546 0.96832Z"
                                  fill="current"
                                ></path>
                                <path
                                  d="M19.6469 23.0305C19.0919 23.608 18.338 23.9324 17.5529 23.9324C14.021 23.9324 10.6925 23.9324 7.41462 23.9324C0.821896 23.9324 -2.47942 15.6403 2.18232 10.7906L12.3367 0.227022C12.8029 -0.257945 13.6 0.0855283 13.6 0.771372L13.6 10.0754L12.4265 11.2963C11.4941 12.2662 12.1544 13.9246 13.473 13.9246L28.4001 13.9246L19.6469 23.0305Z"
                                  fill="current"
                                ></path>
                              </g>
                              <defs>
                                <clipPath id="clip0_322_9172">
                                  <rect width="42" height="24" fill="white"></rect>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                          <div className="relative">
                            <div
                              className="absolute left-0 top-0 bg-background p-4 rounded-2xl border border-border"
                              style={{ opacity: 1, transform: 'none' }}
                            >
                              <div className="flex gap-1">
                                <div
                                  className="w-2 h-2 bg-primary/50 rounded-full"
                                  style={{ transform: 'translateY(-1.52904px)' }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-primary/50 rounded-full"
                                  style={{ transform: 'translateY(-0.83548px)' }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-primary/50 rounded-full"
                                  style={{ transform: 'translateY(-4.97574px)' }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg tracking-tighter font-semibold">
                      Real-time AI Collaboration
                    </h3>
                    <p className="text-muted-foreground">
                      Experience real-time assistance. Ask your AI Agent to coordinate tasks, answer
                      questions, and maintain team alignment.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-pointer max-h-[400px] group">
                  <div className="relative flex size-full items-center justify-center h-full overflow-hidden">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-background to-transparent z-20"></div>
                      <div className="pointer-events-none absolute top-0 left-0 h-20 w-full bg-gradient-to-b from-background to-transparent z-20"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 size-16 bg-secondary p-2 rounded-full z-30 md:bottom-0 md:top-auto">
                        <svg
                          width="42"
                          height="24"
                          viewBox="0 0 42 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-white size-10"
                        >
                          <g clipPath="url(#clip0_322_9172)">
                            <path
                              d="M22.3546 0.96832C22.9097 0.390834 23.6636 0.0664062 24.4487 0.0664062C27.9806 0.0664062 31.3091 0.066408 34.587 0.0664146C41.1797 0.0664284 44.481 8.35854 39.8193 13.2082L29.6649 23.7718C29.1987 24.2568 28.4016 23.9133 28.4016 23.2274V13.9234L29.5751 12.7025C30.5075 11.7326 29.8472 10.0742 28.5286 10.0742H13.6016L22.3546 0.96832Z"
                              fill="current"
                            ></path>
                            <path
                              d="M19.6469 23.0305C19.0919 23.608 18.338 23.9324 17.5529 23.9324C14.021 23.9324 10.6925 23.9324 7.41462 23.9324C0.821896 23.9324 -2.47942 15.6403 2.18232 10.7906L12.3367 0.227022C12.8029 -0.257945 13.6 0.0855283 13.6 0.771372L13.6 10.0754L12.4265 11.2963C11.4941 12.2662 12.1544 13.9246 13.473 13.9246L28.4001 13.9246L19.6469 23.0305Z"
                              fill="current"
                            ></path>
                          </g>
                          <defs>
                            <clipPath id="clip0_322_9172">
                              <rect width="42" height="24" fill="white"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                        <div className="relative flex h-full w-full items-center justify-center translate-y-0 md:translate-y-32">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg tracking-tighter font-semibold">
                      Seamless Integrations
                    </h3>
                    <p className="text-muted-foreground">
                      Unite your favorite tools for effortless connectivity. Boost productivity
                      through interconnected workflows.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-pointer max-h-[400px] group">
                  <div className="relative flex size-full items-center justify-center h-full overflow-hidden">
                    <div
                      className="relative flex size-full items-center justify-center h-[300px] pt-10 overflow-hidden"
                      style={{ '--color': 'rgba(21 93 252 / 1)' }}
                    >
                      <div
                        className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-[var(--color)] to-[var(--color-transparent)]"
                        style={{ opacity: 0 }}
                      ></div>
                      <div className="opacity-0 transition-opacity duration-300 ease-in-out absolute top-32 left-[42%] -translate-x-1/2 text-sm bg-[#1A1B25] border border-white/[0.07] text-white px-4 py-1 rounded-full h-8 flex items-center justify-center font-mono shadow-[0px_1.1px_0px_0px_rgba(255,255,255,0.20)_inset,0px_4.4px_6.6px_0px_rgba(255,255,255,0.01)_inset,0px_2.2px_6.6px_0px_rgba(18,43,105,0.04),0px_1.1px_2.2px_0px_rgba(18,43,105,0.08),0px_0px_0px_1.1px_rgba(18,43,105,0.08)]">
                        <number-flow-react className="font-mono"></number-flow-react>
                      </div>
                      <svg
                        width="600"
                        height="200"
                        viewBox="0 0 600 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(21 93 252 / 0.30196078431372547)" />
                            <stop offset="100%" stopColor="rgba(21 93 252 / 0)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 157.33333333333331 C 20,153.06666666666666 60,138.13333333333333 100,136 C 120,138.13333333333333 160,153.0666666666667 200,146.66666666666669 C 220,138.13333333333335 260,110.4 300,104 C 320,106.13333333333333 360,118.93333333333332 400,114.66666666666666 C 420,108.26666666666667 460,97.60000000000001 500,82.66666666666667 L 600 40 L 600,200 L 0,200 Z"
                          fill="url(#lineGradient)"
                          opacity="0"
                          transformOrigin="300px 120px"
                          style={{ transform: 'scale(0.95)', transformOrigin: '300px 120px' }}
                        ></path>
                        <path
                          d="M 0 157.33333333333331 C 20,153.06666666666666 60,138.13333333333333 100,136 C 120,138.13333333333333 160,153.0666666666667 200,146.66666666666669 C 220,138.13333333333335 260,110.4 300,104 C 320,106.13333333333333 360,118.93333333333332 400,114.66666666666666 C 420,108.26666666666667 460,97.60000000000001 500,82.66666666666667 L 600 40"
                          stroke="rgba(21 93 252 / 1)"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          pathLength="1"
                          strokeDashoffset="0px"
                          strokeDasharray="0px 1px"
                        ></path>
                        <circle
                          cx="300"
                          cy="104"
                          r="4"
                          fill="rgba(21 93 252 / 1)"
                          opacity="0"
                          transformOrigin="300px 104px"
                          style={{ transform: 'scale(0)', transformOrigin: '300px 104px' }}
                        ></circle>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg tracking-tighter font-semibold">
                      Instant Insight Reporting
                    </h3>
                    <p className="text-muted-foreground">
                      Transform raw data into clear insights in seconds. Empower smarter decisions
                      with real-time, always-learning intelligence.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-pointer max-h-[400px] group">
                  <div className="relative flex size-full items-center justify-center h-full overflow-hidden">
                    <div className="w-full h-full flex flex-col relative">
                      <div className="absolute inset-0 flex -z-10 [mask:linear-gradient(180deg,transparent,black_40%,black_40%,transparent)] ">
                        <div className=" w-1/2 h-full flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                        <div className="w-1/2 h-full border-x border-border/70 border-dashed flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                        <div className=" w-1/2 h-full flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                        <div className="w-1/2 h-full border-x border-border/70 border-dashed flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent "></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent "></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent "></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent "></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent "></div>
                        </div>
                        <div className=" w-1/2 h-full flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                        <div className="w-1/2 h-full border-x border-border/70 border-dashed flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                        <div className=" w-1/2 h-full flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                        <div className="w-1/2 h-full border-x border-border/70 border-dashed flex items-start justify-between">
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                          <div className="w-px h-5 bg-primary first:bg-transparent"></div>
                        </div>
                      </div>
                      <div className="absolute top-4 left-0 right-0 flex justify-between max-w-md mx-auto px-8 text-sm text-gray-500">
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>
                      <div
                        className="absolute top-10 w-[2px] h-[calc(100%-80px)] bg-gradient-to-b from-black dark:from-accent to-transparent z-10"
                        style={{ opacity: 1, transform: 'translateX(277px) translateX(-50%)' }}
                      ></div>
                      <div
                        className="absolute top-14 bg-black dark:bg-accent h-6 z-20 flex items-center justify-center text-xs p-2 rounded-md shadow-[0px_2.2px_6.6px_0px_rgba(18,43,105,0.04),0px_1.1px_2.2px_0px_rgba(18,43,105,0.08),0px_0px_0px_1.1px_rgba(18,43,105,0.08),0px_1.1px_0px_0px_rgba(255,255,255,0.20)_inset,0px_4.4px_6.6px_0px_rgba(255,255,255,0.01)_inset]"
                        style={{ opacity: 1, transform: 'translateX(277px) translateX(-50%)' }}
                      >
                        <span className="text-white">12:00 AM</span>
                      </div>
                      <div className="w-full absolute grid gap-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/3">
                        <div
                          className="flex items-center h-8 justify-center gap-2 rounded-lg w-[250px] p-2 shadow-[0px_9px_5px_0px_#00000005,0px_4px_4px_0px_#00000009,0px_1px_2px_0px_#00000010] bg-secondary text-white"
                          style={{ opacity: 0, transform: 'translateX(-50px)' }}
                        >
                          <p className="font-medium text-sm">Bento grid</p>
                        </div>
                        <div
                          className="flex items-center h-8 justify-center gap-2 rounded-lg w-[250px] p-2 shadow-[0px_9px_5px_0px_#00000005,0px_4px_4px_0px_#00000009,0px_1px_2px_0px_#00000010] bg-secondary/40 text-white"
                          style={{ opacity: 0, transform: 'translateX(539.5px)' }}
                        >
                          <p className="font-medium text-sm">Landing Page</p>
                        </div>
                        <div
                          className="flex items-center h-8 justify-center gap-2 rounded-lg w-[250px] p-2 shadow-[0px_9px_5px_0px_#00000005,0px_4px_4px_0px_#00000009,0px_1px_2px_0px_#00000010] bg-secondary/20 border border-secondary border-dashed text-secondary"
                          style={{ opacity: 0, transform: 'translateX(-50px)' }}
                        >
                          <p className="font-medium text-sm">Add Task</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex-col gap-2 p-6">
                    <h3 className="text-lg tracking-tighter font-semibold">Smart Automation</h3>
                    <p className="text-muted-foreground">
                      Set it, forget it. Your AI Agent tackles repetitive tasks so you can focus on
                      strategy, innovation, and growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <QuoteSection />
          <FeaturesSection />
          <GrowthSection />
        </main>
      </div>
    </>
  )
}
