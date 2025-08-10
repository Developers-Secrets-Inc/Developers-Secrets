import { BluePotionIcon } from '@/components/icons/blue-potion'
import { CoinIcon } from '@/components/icons/coin'
import { GiftIcon } from '@/components/icons/gift'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { getUserInventory } from '@/core/gamification/inventory'
import { buyItem } from '@/core/gamification/marketplace/action'
import { getUserCurrency } from '@/core/gamification/marketplace/currency'
import { Item, MarketplaceItem, UserItem } from '@/payload-types'
import { Heart, ShieldAlert, Sparkles, Star } from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'

// Configuration for the glow effect based on rarity - moved outside component
export const rarityGlowConfig = {
  common: 'bg-emerald-500/20',
  rare: 'bg-orange-500/20',
  epic: 'bg-purple-500/20',
  legendary: 'bg-amber-500/20',
}

// Composant pour afficher la rareté
export function RarityBadge({ rarity }: { rarity: 'common' | 'rare' | 'epic' | 'legendary' }) {
  const rarityConfig = {
    common: 'bg-emerald-500/10 text-emerald-500',
    rare: 'bg-orange-500/10 text-orange-500',
    epic: 'bg-purple-500/10 text-purple-500',
    legendary: 'bg-amber-500/10 text-amber-500',
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${rarityConfig[rarity]}`}
    >
      <Sparkles className="size-3" />
      <span className="capitalize">{rarity}</span>
    </div>
  )
}

// Fonction pour obtenir l'icône en fonction du type d'item
export function getItemIcon(type: string) {
  switch (type) {
    case 'xpBoost':
      return BluePotionIcon
    case 'currencyBoost':
      return CoinIcon
    case 'streakRestore':
      return Heart
    case 'unlockFeature':
      return Star
    default:
      return GiftIcon
  }
}

interface ItemCardProps {
  marketplaceItem: MarketplaceItem
  userCurrency: number
  isPurchasing: boolean
  isOwned: boolean
  onPurchase: (item: MarketplaceItem) => void
}

// Updated Helper component for rendering item cards
const ItemCard: React.FC<ItemCardProps> = ({
  marketplaceItem,
  userCurrency,
  isPurchasing,
  isOwned,
  onPurchase,
}) => {
  const item = marketplaceItem.item as Item
  if (!item) return null
  const Icon = getItemIcon(item.type)
  const isPassive = item.activationMode === 'passive'
  const alreadyOwnedPassive = isPassive && isOwned

  return (
    <Card key={marketplaceItem.id} className="overflow-hidden pb-0 gap-2 flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <RarityBadge rarity={item.rarity} />
        </div>
        <div className="flex flex-col items-center pt-4">
          <div className="relative mb-4">
            {' '}
            {/* Wrapper for icon and glow */}
            <div
              className={`absolute inset-0 rounded-full blur-lg opacity-75 ${rarityGlowConfig[item.rarity]}`}
            ></div>{' '}
            {/* Glow element */}
            <Icon className="relative z-10 size-16" />{' '}
            {/* Icon itself, increased size slightly to better show glow */}
          </div>
          <CardTitle className="text-lg">{item.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-center text-sm">{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t mt-auto">
        <Button
          className="w-full gap-2 py-4"
          onClick={() => onPurchase(marketplaceItem)}
          disabled={isPurchasing || userCurrency < marketplaceItem.price || alreadyOwnedPassive}
        >
          {alreadyOwnedPassive ? (
            'Owned'
          ) : isPurchasing ? (
            'Purchasing...'
          ) : (
            <>{`Purchase for ${marketplaceItem.price} coins`}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper component for rendering loading skeletons
const LoadingSkeleton: React.FC = () => (
  <Card className="overflow-hidden pb-0 gap-2">
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
)

interface MarketplaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMarketplaceItems: MarketplaceItem[] | null
  initialUserCurrency: number | null
  initialUserInventory: UserItem[] | null
  initialError: string | null
  userId: string | null
}

export function MarketplaceDialog({
  open,
  onOpenChange,
  initialMarketplaceItems,
  initialUserCurrency,
  initialUserInventory,
  initialError,
  userId,
}: MarketplaceDialogProps) {
  const [isPurchasingItemId, setIsPurchasingItemId] = useState<number | null>(null)
  const [userCurrency, setUserCurrency] = useState(initialUserCurrency)
  const [userInventory, setUserInventory] = useState(initialUserInventory)
  const { toast } = useToast()

  useEffect(() => {
    setUserCurrency(initialUserCurrency)
    setUserInventory(initialUserInventory)
  }, [initialUserCurrency, initialUserInventory])

  const handlePurchase = async (marketplaceItem: MarketplaceItem) => {
    const item = marketplaceItem.item as Item
    if (!item || !userId) {
      toast({ title: 'Error', description: 'User not identified.', variant: 'destructive' })
      return
    }

    try {
      setIsPurchasingItemId(item.id)
      const result = await buyItem(item.id, marketplaceItem.price)

      if (result.success) {
        toast({
          title: 'Purchase successful',
          description: 'The item has been added to your inventory',
        })
        try {
          const updatedCurrency = await getUserCurrency(userId)
          const updatedInventory = await getUserInventory(userId)
          setUserCurrency(updatedCurrency)
          setUserInventory(updatedInventory)
        } catch (refreshError) {
          console.error('Failed to refresh user data after purchase:', refreshError)
          toast({
            title: 'Info',
            description: 'Could not refresh balance/inventory display.',
            variant: 'default',
          })
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
      setIsPurchasingItemId(null)
    }
  }

  const isLoading = initialMarketplaceItems === null && initialError === null
  const error = initialError
  const marketplaceItems = initialMarketplaceItems ?? []

  const featuredItems = marketplaceItems.slice(0, 6)
  const consumableItems = marketplaceItems.filter((mpItem) => {
    const item = mpItem.item as Item
    return (
      item &&
      (item.activationMode === 'consumableDuration' || item.activationMode === 'consumableInstant')
    )
  })
  const itemsTabItems = marketplaceItems.filter((mpItem) => {
    const item = mpItem.item as Item
    return item && item.activationMode === 'passive'
  })

  const isPassiveItemOwned = (itemId: number): boolean => {
    return (userInventory ?? []).some((userItem) => {
      const invItem = userItem.item as Item
      return invItem && invItem.activationMode === 'passive' && invItem.id === itemId
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-4xl h-[80vh] flex flex-col overflow-hidden gap-0 p-0 [&>button]:top-3 [&>button]:right-3 [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:transition-colors data-[state=open]:animate-none">
        <DialogHeader className="relative sticky top-0 z-10 bg-background shrink-0">
          <DialogTitle className="sr-only">Marketplace</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="featured" className="w-full flex flex-col flex-grow overflow-hidden">
          <TabsList className="w-full rounded-t-lg border-b bg-muted/50 p-0 h-[48px] pr-12 shrink-0">
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

          <div className="p-6 flex-grow overflow-y-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="col-span-full text-center text-red-500 py-10">
                <ShieldAlert className="mx-auto size-10 mb-2" />
                {error}
              </div>
            ) : (
              <>
                <TabsContent value="featured" className="m-0">
                  {featuredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredItems.map((mpItem) => {
                        const item = mpItem.item as Item
                        if (!item) return null
                        return (
                          <ItemCard
                            key={mpItem.id}
                            marketplaceItem={mpItem}
                            userCurrency={userCurrency ?? 0}
                            isPurchasing={isPurchasingItemId === item.id}
                            isOwned={isPassiveItemOwned(item.id)}
                            onPurchase={handlePurchase}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No featured items available.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="consumables" className="m-0">
                  {consumableItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {consumableItems.map((mpItem) => {
                        const item = mpItem.item as Item
                        if (!item) return null
                        return (
                          <ItemCard
                            key={mpItem.id}
                            marketplaceItem={mpItem}
                            userCurrency={userCurrency ?? 0}
                            isPurchasing={isPurchasingItemId === item.id}
                            isOwned={false}
                            onPurchase={handlePurchase}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No consumable items available.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="subscription" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <p className="text-muted-foreground">Subscription plans coming soon...</p>
                  </div>
                </TabsContent>

                <TabsContent value="items" className="m-0">
                  {itemsTabItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {itemsTabItems.map((mpItem) => {
                        const item = mpItem.item as Item
                        if (!item) return null
                        return (
                          <ItemCard
                            key={mpItem.id}
                            marketplaceItem={mpItem}
                            userCurrency={userCurrency ?? 0}
                            isPurchasing={isPurchasingItemId === item.id}
                            isOwned={isPassiveItemOwned(item.id)}
                            onPurchase={handlePurchase}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No passive items available.</p>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        <DialogFooter className="sticky bottom-0 p-4 bg-background border-t flex justify-end items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CoinIcon className="size-4" />
            <span>
              Balance:{' '}
              {userCurrency === null ? (
                <Skeleton className="h-4 w-16 inline-block" />
              ) : (
                `${userCurrency} coins`
              )}
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
