import Link from 'next/link'
import { Polar } from '@polar-sh/sdk'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { getUser } from '@/core/user'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2Icon } from 'lucide-react'
import { getSubscriptionsByCustomerId } from '@/core/payments/subscriptions'

const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
})

interface Benefit {
  id: string
  description: string
}

interface BasePrice {
  amountType: 'fixed' | 'free' | 'pay_what_you_want'
  amount?: number
  minimumAmount?: number
}

interface Product {
  id: string
  name: string
  description: string | null
  benefits: Benefit[]
  prices: BasePrice[]
}

interface PricingCardProps {
  product: Product
}

const PRODUCT_ORDER = ['Lite Membership', 'Pro Membership', 'Max Membership']

const PricingCard = ({ product }: { product: any }) => {
  const firstPrice = product.prices[0]
  const price =
    firstPrice.amountType === 'fixed' && firstPrice.amount
      ? `$${firstPrice.amount / 100}`
      : firstPrice.amountType === 'free'
        ? 'Free'
        : 'Pay what you want'

  return (
    <Card className="w-full max-w-sm group relative overflow-hidden rounded-lg border bg-background hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {price}
          </Badge>
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {product.benefits.map((benefit: any) => (
            <li
              key={benefit.id}
              className="flex items-center gap-x-2 text-sm text-muted-foreground"
            >
              <CheckCircle2Icon className="h-4 w-4 text-primary" />
              {benefit.description}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          className="w-full h-9 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center hover:bg-primary/90 transition-colors"
          href={`/api/checkout?productId=${product.id}`}
        >
          Get Started
        </Link>
      </CardFooter>
    </Card>
  )
}

export const dynamic = 'force-dynamic'

export default async function Page() {
  const { result } = await api.products.list({
    isArchived: false,
  })

  const sortedProducts = [...result.items].sort((a, b) => {
    const indexA = PRODUCT_ORDER.indexOf(a.name)
    const indexB = PRODUCT_ORDER.indexOf(b.name)
    return indexA - indexB
  })

  const user = await getUser()
  const customerId = user?.informations?.customerId
  const subscriptions = customerId ? await getSubscriptionsByCustomerId(customerId) : null
  // console.log(subscriptions)

  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-muted-foreground">Get started with our flexible pricing options</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {sortedProducts.map((product) => (
              <PricingCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
