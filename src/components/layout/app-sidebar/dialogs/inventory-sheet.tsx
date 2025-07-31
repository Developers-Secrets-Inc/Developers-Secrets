'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Package } from 'lucide-react'
import { useSpecificDialog } from '../stores/sidebar-dialogs-store'

export const InventorySheet = () => {
  const { isOpen, close } = useSpecificDialog('inventory')

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Inventory</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
            <div className="text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Feature Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Inventory system is under development and will be available soon!
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}