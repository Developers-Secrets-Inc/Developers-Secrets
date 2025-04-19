import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { getUserInventory, consumeItem } from '@/core/gamification/inventory'
import { getSessionUser } from '@/core/user'
import { UserItem } from '@/payload-types'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Backpack } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface InventorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InventorySheet({ open, onOpenChange }: InventorySheetProps) {
  const [inventory, setInventory] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [consumingItemId, setConsumingItemId] = useState<number | null>(null)

  const handleConsumeItem = async (userItemId: number) => {
    try {
      setConsumingItemId(userItemId)
      const result = await consumeItem(userItemId)
      if (result.success) {
        toast.success('Item consumed successfully!')
        // Refresh inventory
        const userResult = await getSessionUser()
        if (userResult.success) {
          const items = await getUserInventory(userResult.value.id)
          setInventory(items)
        }
      } else {
        toast.error(result.error || 'Failed to consume item')
      }
    } catch (error) {
      toast.error('An error occurred while consuming the item')
    } finally {
      setConsumingItemId(null)
    }
  }

  useEffect(() => {
    async function fetchInventory() {
      try {
        setIsLoading(true)
        const userResult = await getSessionUser()
        if (userResult.success) {
          const items = await getUserInventory(userResult.value.id)
          setInventory(items)
        }
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      fetchInventory()
    }
  }, [open])

  return (
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
              // Loading skeletons
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
            ) : inventory.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Backpack className="size-12 mb-4" />
                <h3 className="font-medium mb-2">Your inventory is empty</h3>
                <p className="text-sm">Visit the marketplace to get some items!</p>
              </div>
            ) : (
              // Inventory items
              inventory.map((userItem) => {
                const item = userItem.item as any // TODO: Fix type
                return (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                        <Backpack className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {userItem.quantity}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConsumeItem(userItem.id)}
                      disabled={consumingItemId === userItem.id}
                    >
                      {consumingItemId === userItem.id ? 'Consuming...' : 'Consume'}
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
