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
import { XIcon, Sparkles, Shield, Sword, Crown, Coins } from 'lucide-react'
import { getSessionUser } from '@/core/user'
import { useState, useEffect } from 'react'
import { getUserCurrency } from '@/core/gamification/marketplace/currency'
// Types pour les items
interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: React.ElementType
}

// Données de démonstration
const featuredItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Premium Shield',
    description: 'A rare shield that provides extra protection during challenges.',
    price: 1500,
    rarity: 'rare',
    icon: Shield,
  },
  {
    id: '2',
    name: 'Legendary Sword',
    description: 'An ancient sword passed down through generations of warriors.',
    price: 5000,
    rarity: 'legendary',
    icon: Sword,
  },
  {
    id: '3',
    name: 'Epic Crown',
    description: 'A symbol of authority and leadership within your guild.',
    price: 3000,
    rarity: 'epic',
    icon: Crown,
  },
]

// Composant pour afficher la rareté
function RarityBadge({ rarity }: { rarity: MarketplaceItem['rarity'] }) {
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

interface MarketplaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MarketplaceDialog({ open, onOpenChange }: MarketplaceDialogProps) {
  const [userCurrency, setUserCurrency] = useState<number>(0)

  useEffect(() => {
    async function fetchUserCurrency() {
      const userResult = await getSessionUser()
      if (userResult.success) {
        setUserCurrency(await getUserCurrency(userResult.value.id))
      }
    }
    fetchUserCurrency()
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-4xl max-h-[85vh] overflow-y-auto gap-0 p-0 [&>button]:top-3 [&>button]:right-3 [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:transition-colors">
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
                {featuredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden pb-0 gap-2">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <RarityBadge rarity={item.rarity} />
                      </div>
                      <div className="flex flex-col items-center py-4">
                        <item.icon className="size-14 mb-4" />
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-sm">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                      <Button className="w-full gap-2 py-4">
                        <Coins className="size-4" />
                        Purchase for {item.price} coins
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consumables" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Consumable items will go here */}
                <p className="text-muted-foreground">Consumable items coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="subscription" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription plans will go here */}
                <p className="text-muted-foreground">Subscription plans coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="items" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Regular items will go here */}
                <p className="text-muted-foreground">Items coming soon...</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="sticky bottom-0 p-4 bg-background border-t flex justify-end items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="size-4" />
            <span>Balance: {userCurrency} coins</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
