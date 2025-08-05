import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isCustomer } from '@/core/customers'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'
import { Polar } from '@polar-sh/sdk'
import Link from 'next/link'
import React from 'react'

const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
})

type User = Awaited<ReturnType<typeof getUser>>

const CheckIcon = () => {
  return (
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
      className="lucide lucide-badge-check size-5 text-muted-foreground"
      aria-hidden="true"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  )
}

const Feature = ({ content }: { content: string }) => {
  return (
    <li className="flex items-center">
      <CheckIcon />
      <span className="ml-3 text-sm text-muted-foreground">{content}</span>
    </li>
  )
}

export default async function Page() {
  const user = await getUser()

  return (
    <>
      <HomeHeader />
      <div className="container flex flex-col gap-13 py-10">
        <h1 className="text-center text-6xl font-bold tracking-tighter text-foreground">
          Simple Pricing Plans
        </h1>
        <div className="flex justify-center">
          <Tabs defaultValue="monthly">
            <TabsList className="mx-auto">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="flex flex-wrap justify-center gap-7">
                <BasicPlanCard
                  price="$0"
                  subtitle="Per month"
                  description="Start your journey with essential free resources. Perfect for beginners and those exploring coding at their own pace."
                  user={user}
                />

                <PremiumPlanCard
                  price="$20"
                  subtitle="Per month"
                  description="Unlock more learning: AI challenges, engineering course intro, more Pearl, and all projects. Ideal for ambitious learners."
                  user={user}
                />
                <MaxPlanCard
                  price="$35"
                  subtitle="Per month"
                  description="Experience the full power of our platform. Ideal for ambitious individuals and teams aiming for excellence."
                  user={user}
                />
              </div>
            </TabsContent>
            <TabsContent value="yearly">
              <div className="flex flex-wrap justify-center gap-7">
                <BasicPlanCard
                  price="$0"
                  subtitle="Per year"
                  description="Start your journey with essential free resources. Perfect for beginners and those exploring coding at their own pace."
                  user={user}
                />
                <PremiumPlanCard
                  price="$150"
                  subtitle="Per year"
                  description="Unlock more learning: AI challenges, engineering course intro, more Pearl, and all projects. Ideal for ambitious learners."
                  user={user}
                />
                <MaxPlanCard
                  price="$210"
                  subtitle="Per year"
                  description="Experience the full power of our platform. Ideal for ambitious individuals and teams aiming for excellence."
                  user={user}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

const BasicPlanCard = ({
  price,
  subtitle,
  description,
  user,
}: {
  price: string
  subtitle: string
  description: string
  user: User
}) => {
  return (
    <PricingCard.Root>
      <PricingCard.Header>
        <div data-slot="card-title" className="text-lg font-medium text-foreground">
          Basic Plan
        </div>
        <div className="mt-4">
          <div className="text-5xl font-semibold tracking-tight text-muted-foreground">{price}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </PricingCard.Header>
      <PricingCard.Content>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button
          asChild
          data-slot="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 mt-6 w-full"
        >
          {isFailure(user) ? (
            <Link href="/auth/login">Start for Free</Link>
          ) : (
            <Link href={'/home'}>Go to dashboard</Link>
          )}
        </Button>
        <PricingCard.FeaturesSection>
          <Feature content="Access to free coding challenges" />
          <Feature content="Access to free courses" />
          <Feature content="Skills tracking" />
          <Feature content="Limited access to AI assistant Pearl" />
          <Feature content="Advanced gamification" />
        </PricingCard.FeaturesSection>
      </PricingCard.Content>
    </PricingCard.Root>
  )
}

export const MaxPlanCard = async ({
  price,
  subtitle,
  description,
  user,
}: {
  price: string
  subtitle: string
  description: string
  user: User
}) => {
  const isLoggedIn = !isFailure(user)

  let url = '/auth/login'
  let needPortal = false
  let isCurrentPlan = false

  if (isLoggedIn) {
    const maxCheckout = await api.checkouts.create({
      products: ['a0710348-4f0a-46e9-97db-eff94c746d28'],
      customerExternalId: user.value.id,
    })

    needPortal = await isCustomer(user.value.id)
    if (needPortal) {
      const result = await api.customerSessions.create({
        customerExternalId: user.value.id,
      })
      url = result.customerPortalUrl
      isCurrentPlan = !isFailure(user) && user.value.informations.role === 'max'
    } else {
      url = maxCheckout.url
    }
  }

  return (
    <div
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 py-6 max-w-sm rounded-3xl border border-border shadow-sm"
    >
      <div
        data-slot="card-header"
        className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
      >
        <div data-slot="card-title" className="text-lg font-medium text-foreground">
          Max Plan
        </div>
        <div className="mt-4">
          <div className="text-5xl font-semibold tracking-tight text-muted-foreground">{price}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div data-slot="card-content" className="px-7">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button
          disabled={isCurrentPlan}
          asChild
          data-slot="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 mt-6 w-full"
        >
          <Link href={url}>
            {needPortal
              ? isCurrentPlan
                ? 'Your current plan'
                : 'Update subscription'
              : 'Get Started'}
          </Link>
        </Button>

        <PricingCard.FeaturesSection>
          <Feature content="Everything in premium plus..." />
          <Feature content="Access to AI coding challenge" />
          <Feature content="Access to software engineering courses" />
          <Feature content="Unlimited usage of Pearl" />
          <Feature content="More advanced skill tracking" />
          <Feature content="Deep analysis of your code" />
          <Feature content="Access to all AI projects" />
        </PricingCard.FeaturesSection>
      </div>
    </div>
  )
}

export const PremiumPlanCard = async ({
  price,
  subtitle,
  description,
  user,
}: {
  price: string
  subtitle: string
  description: string
  user: User
}) => {
  const isLoggedIn = !isFailure(user)

  let url = '/auth/login'
  let needPortal = false
  let isCurrentPlan

  if (isLoggedIn) {
    const premiumCheckout = await api.checkouts.create({
      products: ['d5c47912-f301-4eaa-9351-6e87eb83a209'],
      customerExternalId: user.value.id,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/home?subscribed=true`,
    })

    needPortal = await isCustomer(user.value.id)
    if (needPortal) {
      const result = await api.customerSessions.create({
        customerExternalId: user.value.id,
      })
      isCurrentPlan = !isFailure(user) && user.value.informations.role === 'pro'
      url = result.customerPortalUrl
    } else {
      url = premiumCheckout.url
    }
  }

  return (
    <div
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 py-6 max-w-sm rounded-3xl border-2 border-primary shadow-sm"
    >
      <div
        data-slot="card-header"
        className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
      >
        <div data-slot="card-title" className="text-lg font-medium text-foreground">
          Premium Plan
        </div>
        <div className="mt-4">
          <div className="text-5xl font-semibold tracking-tight text-muted-foreground">{price}</div>
          <div className="text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <div data-slot="card-content" className="px-7">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button
          disabled={isCurrentPlan}
          asChild
          data-slot="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 mt-6 w-full"
        >
          <Link href={url}>
            {needPortal
              ? isCurrentPlan
                ? 'Your current plan'
                : 'Update subscription'
              : 'Get Started'}
          </Link>
        </Button>
        <PricingCard.FeaturesSection>
          <Feature content="Everything in basic plus..." />
          <Feature content="Limited access to AI coding challenges" />
          <Feature content="Access to software engineering course introduction" />
          <Feature content="More usage of Pearl" />
          <Feature content="Access to all projects" />
        </PricingCard.FeaturesSection>
      </div>
    </div>
  )
}

const PricingCardRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      data-slot="card"
      className="bg-card text-card-foreground flex flex-col gap-6 py-6 max-w-sm rounded-3xl border border-border shadow-sm"
    >
      {children}
    </div>
  )
}

const PricingCardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      data-slot="card-header"
      className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6"
    >
      {children}
    </div>
  )
}

const PricingCardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-slot="card-content" className="px-7">
      {children}
    </div>
  )
}

const PricingCardFeaturesSections = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative mt-12 mb-4 flex items-center justify-center overflow-hidden">
        <div
          data-orientation="horizontal"
          role="none"
          data-slot="separator-root"
          className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
        ></div>
        <span className="px-3 text-xs text-muted-foreground opacity-50">FEATURES</span>
        <div
          data-orientation="horizontal"
          role="none"
          data-slot="separator-root"
          className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
        ></div>
      </div>
      <ul className="mt-6 space-y-4">{children}</ul>
    </>
  )
}

const PricingCard = {
  Root: PricingCardRoot,
  Header: PricingCardHeader,
  Content: PricingCardContent,
  FeaturesSection: PricingCardFeaturesSections,
}
