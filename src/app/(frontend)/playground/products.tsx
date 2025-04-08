'use client'
import type { Product } from '@polar-sh/sdk/models/components'
import { useMemo } from 'react'
// src/polar.ts
import { useRouter } from 'next/navigation'
import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
  accessToken: process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN ?? '',
  server: 'sandbox',
})

interface ProductCardProps {
    product: Product
  }
  
  export const ProductCard = ({ product }: ProductCardProps) => {
    const router = useRouter()
    // Handling just a single price for now
    // Remember to handle multiple prices for products if you support monthly & yearly pricing plans
    const firstPrice = product.prices[0]
  
    const price = useMemo(() => {
      switch (firstPrice.amountType) {
        case 'fixed':
          // The Polar API returns prices in cents - Convert to dollars for display
          return `$${firstPrice.priceAmount / 100}`
        case 'free':
          return 'Free'
        default:
          return 'Pay what you want'
      }
    }, [firstPrice])
  
    const handleCheckout = async () => {
      try {
        const checkout = await polar.checkouts.create({
          productId: product.id,
        })
        router.push(checkout.url)
      } catch (error) {
        console.error('Failed to create checkout:', error)
      }
    }
  
    return (
      <div className="flex flex-col gap-y-24 justify-between p-12 rounded-3xl bg-neutral-950 h-full border border-neutral-900">
        <div className="flex flex-col gap-y-8">
          <h1 className="text-3xl">{product.name}</h1>
          <p className="text-neutral-400">{product.description}</p>
          <ul>
            {product.benefits.map((benefit) => (
              <li key={benefit.id} className="flex flex-row gap-x-2 items-center">
                {benefit.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-row gap-x-4 justify-between items-center">
          <button
            onClick={handleCheckout}
            className="h-8 flex flex-row items-center justify-center rounded-full bg-white text-black font-medium px-4"
          >
            Buy
          </button>
          <span className="text-neutral-500">{price}</span>
        </div>
      </div>
    )
  }