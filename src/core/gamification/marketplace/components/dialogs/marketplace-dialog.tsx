import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XIcon, Sparkles, Shield, Sword, Crown, Coins, Zap, Heart, Star, Gift } from 'lucide-react'
import { getSessionUser } from '@/core/user'
import { useState, useEffect } from 'react'
import { getUserCurrency } from '@/core/gamification/marketplace/currency'
import { getMarketplaceItems } from '@/core/gamification/marketplace'
import { MarketplaceItem, Item } from '@/payload-types'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { buyItem } from '@/core/gamification/marketplace/action'

// Composant pour afficher la rareté
function RarityBadge({ rarity }: { rarity: 'common' | 'rare' | 'epic' | 'legendary' }) {
  const rarityConfig = {
    common: 'bg-slate-100 text-slate-700',
    rare: 'bg-blue-100 text-blue-700',
    epic: 'bg-purple-100 text-purple-700',
    legendary: 'bg-amber-100 text-amber-700',
  }

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${rarityConfig[rarity]}`}
    >
      <Sparkles className="size-3" />
      <span className="capitalize">{rarity}</span>
    </div>
  )
}

// Fonction pour obtenir l'icône en fonction du type d'item
function getItemIcon(type: string) {
  switch (type) {
    case 'xpBoost':
      return Zap
    case 'currencyBoost':
      return Coins
    case 'streakRestore':
      return Heart
    case 'unlockFeature':
      return Star
    default:
      return Gift
  }
}

interface MarketplaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MarketplaceDialog({ open, onOpenChange }: MarketplaceDialogProps) {
  const [userCurrency, setUserCurrency] = useState<number>(0)
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const userResult = await getSessionUser()
        if (userResult.success) {
          setUserCurrency(await getUserCurrency(userResult.value.id))
        }

        const items = await getMarketplaceItems()
        setMarketplaceItems(items)
      } catch (error) {
        console.error('Error fetching marketplace data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handlePurchase = async (marketplaceItem: MarketplaceItem) => {
    try {
      setIsPurchasing(true)
      const item = marketplaceItem.item as Item
      const result = await buyItem(item.id, marketplaceItem.price)

      if (result.success) {
        toast({
          title: 'Purchase successful',
          description: 'The item has been added to your inventory',
        })
        // Refresh user currency
        const userResult = await getSessionUser()
        if (userResult.success) {
          setUserCurrency(await getUserCurrency(userResult.value.id))
        }
      } else {
        toast({
          title: 'Purchase failed',
          description: result.error || 'Failed to purchase item',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error purchasing item:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while purchasing the item',
        variant: 'destructive',
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-4xl max-h-[85vh] overflow-y-auto gap-0 p-0 [&>button]:top-3 [&>button]:right-3 [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:transition-colors data-[state=open]:animate-none">
        <DialogHeader className="relative sticky top-0 z-10 bg-background">
          <DialogTitle className="sr-only">Marketplace</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="w-full rounded-t-lg border-b bg-muted/50 p-0 h-[48px] pr-12 sticky top-0 z-10">
            <TabsTrigger
              value="featured"
              className="rounded-none rounded-tl-lg data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary flex-1 h-full"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="consumables"
              className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary flex-1 h-full"
            >
              Consumables
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary flex-1 h-full"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="rounded-none rounded-tr-lg data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary flex-1 h-full"
            >
              Items
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="featured" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="overflow-hidden pb-0 gap-2">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Skeleton className="h-6 w-20" />
                          </div>
                          <div className="flex flex-col items-center py-4">
                            <Skeleton className="size-14 mb-4 rounded-full" />
                            <Skeleton className="h-6 w-32 mb-2" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </>
                ) : (
                  marketplaceItems?.map((marketplaceItem) => {
                    const item = marketplaceItem.item as Item
                    const Icon = getItemIcon(item.type)
                    return (
                      <Card key={marketplaceItem.id} className="overflow-hidden pb-0 gap-2">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <RarityBadge rarity={item.rarity} />
                          </div>
                          <div className="flex flex-col items-center py-4">
                            <Icon className="size-14 mb-4" />
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-center text-sm">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                          <Button
                            className="w-full gap-2 py-4"
                            onClick={() => handlePurchase(marketplaceItem)}
                            disabled={isPurchasing || userCurrency < marketplaceItem.price}
                          >
                            <Coins className="size-4" />
                            {isPurchasing
                              ? 'Purchasing...'
                              : `Purchase for ${marketplaceItem.price} coins`}
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="consumables" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <p className="text-muted-foreground">Consumable items coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <p className="text-muted-foreground">Subscription plans coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="items" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <p className="text-muted-foreground">Items coming soon...</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="sticky bottom-0 p-4 bg-background border-t flex justify-end items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="size-4" />
            <span>
              Balance: {isLoading ? <Skeleton className="h-4 w-16" /> : userCurrency} coins
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
