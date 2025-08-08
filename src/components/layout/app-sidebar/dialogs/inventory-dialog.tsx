'use client'

import { useState, useEffect } from 'react'
import { useUserInventory } from '@/api/gamification/inventory/hooks/use-user-inventory'
import { useUserCurrency } from '@/api/gamification/currency/hooks/use-user-currency'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Package } from 'lucide-react'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CoinIcon } from '@/components/icons/coin'
import { getItemIcon } from '@/core/gamification/marketplace/components/dialogs/marketplace-dialog'

const getRarityClasses = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'border-primary/20 hover:border-primary bg-primary/10'
    case 'rare':
      return 'border-blue-500/20 hover:border-blue-500 bg-blue-500/10'
    case 'epic':
      return 'border-purple-500/20 hover:border-purple-500 bg-purple-500/10'
    case 'legendary':
      return 'border-yellow-500/20 hover:border-yellow-500 bg-yellow-500/10'
    default:
      return 'border-gray-500/20 hover:border-gray-500 bg-gray-500/10'
  }
}

const getRarityBadgeClasses = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'border-primary/20 text-primary bg-primary/10'
    case 'rare':
      return 'border-blue-500/20 text-blue-500 bg-blue-500/10'
    case 'epic':
      return 'border-purple-500/20 text-purple-500 bg-purple-500/10'
    case 'legendary':
      return 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'
    default:
      return 'border-gray-500/20 text-gray-500 bg-gray-500/10'
  }
}

export const InventoryDialog = () => {
  const { isOpen, close } = useSpecificDialog('inventory')
  const { data: items } = useUserInventory()
  const { data: currency } = useUserCurrency()
  const [selectedItem, setSelectedItem] = useState(items?.[0])

  useEffect(() => {
    if (items && items.length > 0 && !selectedItem) {
      setSelectedItem(items[0])
    }
  }, [items])

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="min-w-4xl flex flex-col">
        <div className="w-full flex-grow flex gap-6">
          <div className="w-2/3">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Inventory</DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              {!items || items.length === 0 ? (
                <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Inventory is empty</h3>
                    <p className="text-sm text-muted-foreground">You do not own any items yet.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[...items, ...Array(Math.max(0, 18 - items.length)).fill(null)].map(
                    (item, index) => {
                      if (!item) {
                        return (
                          <div
                            key={`empty-${index}`}
                            className="relative flex flex-col items-center justify-center border rounded-xl p-4 shadow-sm transition-all min-h-[80px] border-dashed border-muted"
                          >
                            <div className="size-10 opacity-30" />
                          </div>
                        )
                      }

                      const Icon = getItemIcon(item.item.type)

                      return (
                        <div
                          key={item.id}
                          className={`relative flex flex-col items-center justify-center border rounded-xl p-4 shadow-sm transition-all min-h-[80px] cursor-pointer ${selectedItem?.id === item.id ? 'border-primary bg-primary/10' : ''} ${typeof item.item === 'object' && 'rarity' in item.item ? getRarityClasses(item.item.rarity) : getRarityClasses('common')}`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <Icon className="size-10" />
                          <span className="absolute bottom-2 right-2 text-sm">
                            x{item.quantity}
                          </span>
                        </div>
                      )
                    },
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 border-l p-4 pr-4">
            {selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">
                    {typeof selectedItem.item === 'object' && 'name' in selectedItem.item
                      ? selectedItem.item.name
                      : 'Item #' + selectedItem.item}
                  </h3>
                  <Badge
                    className={`${typeof selectedItem.item === 'object' && 'rarity' in selectedItem.item ? getRarityBadgeClasses(selectedItem.item.rarity) : getRarityBadgeClasses('common')}`}
                  >
                    {typeof selectedItem.item === 'object' && 'rarity' in selectedItem.item
                      ? selectedItem.item.rarity
                      : 'common'}
                  </Badge>
                </div>
                <Button className="w-full">Consume</Button>
              </div>
            )}
          </div>
        </div>
        <div className="border-t p-2 pb-0 flex items-center justify-end">
           <div className="text-sm text-muted-foreground flex items-center gap-1 mr-2">
             <CoinIcon className="w-4 h-4 mr-1 text-yellow-500" />
             {currency?.toString() ?? '0'}
           </div>
           <DialogClose />
         </div>
      </DialogContent>
    </Dialog>
  )
}
