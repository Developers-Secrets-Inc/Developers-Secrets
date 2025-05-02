import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { getUserInventory, consumeItem } from '@/core/gamification/inventory'
import { UserItem, Item } from '@/payload-types'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Backpack, InfinityIcon, Gift, Coins, Star, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ChestOpeningDialog } from '../dialogs/chest-opening-dialog'

// Helper function to format rewards for the toast message
function formatRewardsForToast(rewards: any): React.ReactNode {
  // Ensure rewards and rewards.items exist
  if (!rewards) return 'No rewards received.'

  const elements: React.ReactNode[] = []

  // Display Coins if received
  if (rewards.coins > 0) {
    elements.push(
      <div key="coins" className="flex items-center gap-2">
        <Coins className="size-4 text-yellow-500" />
        <span className="font-medium">{rewards.coins} Coins</span>
      </div>,
    )
  }

  // Display XP if received
  if (rewards.xp > 0) {
    elements.push(
      <div key="xp" className="flex items-center gap-2 mt-1">
        <Star className="size-4 text-blue-500" />
        <span className="font-medium">{rewards.xp} XP</span>
      </div>,
    )
  }

  // Display Items if received
  if (rewards.items) {
    const rarityOrder: (keyof typeof rewards.items)[] = ['legendary', 'epic', 'rare', 'common']
    let itemsFound = false

    rarityOrder.forEach((rarity) => {
      const rarityKey = String(rarity)
      if (rewards.items[rarityKey] && rewards.items[rarityKey].length > 0) {
        itemsFound = true
        elements.push(
          <div key={rarityKey} className="mt-2">
            <strong className="capitalize font-medium">{rarityKey} Items:</strong>
            <ul className="list-disc list-inside text-sm">
              {rewards.items[rarityKey].map((item: Item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>,
        )
      }
    })

    // If no items but coins/xp were given, add a separator
    if (itemsFound && (rewards.coins > 0 || rewards.xp > 0)) {
      elements.splice(2, 0, <hr key="separator" className="my-2" />) // Add separator after coins/xp
    }
  }

  if (elements.length === 0) {
    return 'Nothing received from the chest.' // More specific message
  }

  return <>{elements}</>
}

interface InventorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialInventory: UserItem[] | null
  initialError: string | null
  userId: string | null
}

export function InventorySheet({
  open,
  onOpenChange,
  initialInventory,
  initialError,
  userId,
}: InventorySheetProps) {
  const [inventory, setInventory] = useState(initialInventory)
  const [consumingItemId, setConsumingItemId] = useState<number | null>(null)
  const [chestRewards, setChestRewards] = useState<any>(null)
  const [isChestDialogOpen, setIsChestDialogOpen] = useState(false)

  useEffect(() => {
    setInventory(initialInventory)
  }, [initialInventory])

  const handleConsumeItem = async (userItemId: number, itemType: string) => {
    if (!userId) {
      toast.error('User not identified for inventory refresh.')
      return
    }
    try {
      setConsumingItemId(userItemId)
      const result = await consumeItem(userItemId)
      if (result.success) {
        if (itemType === 'chest' && result.rewards) {
          setChestRewards(result.rewards)
          setIsChestDialogOpen(true)
        } else {
          toast.success('Item consumed successfully!')
        }

        try {
          const items = await getUserInventory(userId)
          setInventory(items)
        } catch (refreshError) {
          console.error('Failed to refresh inventory after consume:', refreshError)
          toast.error('Could not refresh inventory display.')
        }
      } else {
        toast.error(result.error || 'Failed to consume item')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast.error(`An error occurred: ${errorMessage}`)
    } finally {
      setConsumingItemId(null)
    }
  }

  const isLoading = initialInventory === null && initialError === null
  const error = initialError

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent>
          <SheetHeader>
            <div className="flex items-center gap-2">
              <Backpack className="size-5" />
              <SheetTitle>Inventory</SheetTitle>
            </div>
            <SheetDescription>View and manage your items</SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="space-y-4 py-4 px-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="size-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[160px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-red-500">
                  <ShieldAlert className="size-12 mb-4" />
                  <h3 className="font-medium mb-2">Error Loading Inventory</h3>
                  <p className="text-sm">{error}</p>
                </div>
              ) : !inventory || inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Backpack className="size-12 mb-4" />
                  <h3 className="font-medium mb-2">Your inventory is empty</h3>
                  <p className="text-sm">Visit the marketplace to get some items!</p>
                </div>
              ) : (
                inventory.map((userItem) => {
                  if (!userItem.item || typeof userItem.item !== 'object') {
                    return null
                  }
                  if (userItem.quantity <= 0) {
                    return null
                  }
                  const item = userItem.item as Item
                  const isPassive = item.activationMode === 'passive'
                  const isChest = item.type === 'chest'
                  const Icon = isChest ? Gift : Backpack

                  return (
                    <div
                      key={userItem.id}
                      className="flex items-center justify-between gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-1.5">
                            {item.name}
                            {isPassive && (
                              <InfinityIcon className="size-3.5 text-muted-foreground" />
                            )}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs capitalize px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {item.rarity}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {userItem.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      {!isPassive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConsumeItem(userItem.id, item.type)}
                          disabled={consumingItemId === userItem.id || userItem.quantity <= 0}
                        >
                          {consumingItemId === userItem.id
                            ? isChest
                              ? 'Opening...'
                              : 'Consuming...'
                            : isChest
                              ? 'Open'
                              : 'Consume'}
                        </Button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {chestRewards && (
        <ChestOpeningDialog
          open={isChestDialogOpen}
          onOpenChange={setIsChestDialogOpen}
          rewards={chestRewards}
        />
      )}
    </>
  )
}
