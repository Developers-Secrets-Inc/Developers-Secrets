'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Lock, Package, Store, User, Users } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { MarketplaceDialog } from '@/core/gamification/marketplace/components/dialogs/marketplace-dialog'
import { InventorySheet } from '@/core/gamification/inventory/components/sheets/inventory-sheet'

// Import necessary types
import { MarketplaceItem, UserItem } from '@/payload-types'

interface SocialGroupClientLayerProps {
  userId: string | null // Passed from parent Server Component
  initialMarketplaceItems: MarketplaceItem[] | null
  initialUserCurrency: number | null
  initialUserInventory: UserItem[] | null
  initialMarketplaceError: string | null // More specific error name
  initialInventoryError: string | null // More specific error name
}

export function SocialGroupClientLayer({
  userId,
  initialMarketplaceItems,
  initialUserCurrency,
  initialUserInventory,
  initialMarketplaceError,
  initialInventoryError,
}: SocialGroupClientLayerProps) {
  const [marketplaceOpen, setMarketplaceOpen] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)

  // Combine errors for simplicity, or handle separately if needed
  const commonError = initialMarketplaceError || initialInventoryError

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Social</SidebarGroupLabel>
        <SidebarMenu>
          {/* Marketplace Button */}
          <SidebarMenuItem key="marketplace">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setMarketplaceOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
                aria-label="Open Marketplace Dialog"
              >
                <Store className="size-4" />
                <span>Marketplace</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Inventory Button */}
          <SidebarMenuItem key="inventory">
            <SidebarMenuButton asChild>
              <button
                onClick={() => setInventoryOpen(true)}
                className="flex w-full items-center gap-2 cursor-pointer"
                aria-label="Open Inventory Sheet"
              >
                <Package className="size-4" />
                <span>Inventory</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Guild (Coming Soon) */}
          <SidebarMenuItem key="guild">
            <SidebarMenuButton asChild>
              <Link href="#" className="relative text-muted-foreground pr-8">
                <Users className="size-4" />
                <span>Guild</span>
                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <Lock className="size-4 absolute right-2" />
                  </TooltipPrimitive.Trigger>
                  <TooltipContentCustom>Coming soon</TooltipContentCustom>
                </TooltipPrimitive.Root>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Profile Link */}
          <SidebarMenuItem key="profile">
            <SidebarMenuButton asChild>
              <Link href="/profile/me" className="flex w-full items-center gap-2 cursor-pointer">
                <User className="size-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Render Dialog and Sheet */}
      <MarketplaceDialog
        open={marketplaceOpen}
        onOpenChange={setMarketplaceOpen}
        initialMarketplaceItems={initialMarketplaceItems}
        initialUserCurrency={initialUserCurrency}
        initialUserInventory={initialUserInventory}
        initialError={initialMarketplaceError} // Pass specific error
        userId={userId}
      />

      <InventorySheet
        open={inventoryOpen}
        onOpenChange={setInventoryOpen}
        initialInventory={initialUserInventory}
        initialError={initialInventoryError} // Pass specific error
        userId={userId}
      />
    </>
  )
}
