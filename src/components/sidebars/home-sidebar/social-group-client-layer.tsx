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
import { useSidebar } from '@/components/ui/sidebar'
import { HiddenOnIconSidebar } from '@/components/common/hidden-on-icon-sidebar'
import { ShowOnlyOnIconSidebar } from '@/components/common/show-only-on-icon-sidebar'

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

  const { open } = useSidebar()

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
                <HiddenOnIconSidebar>
                  <Store className="size-4" />
                  <span>Marketplace</span>
                </HiddenOnIconSidebar>
                <ShowOnlyOnIconSidebar>
                  <TooltipPrimitive.Root delayDuration={200}>
                    <TooltipPrimitive.Trigger asChild>
                      <span><Store className="size-4" /></span>
                    </TooltipPrimitive.Trigger>
                    <TooltipContentCustom side="right">Marketplace</TooltipContentCustom>
                  </TooltipPrimitive.Root>
                </ShowOnlyOnIconSidebar>
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
                <HiddenOnIconSidebar>
                  <Package className="size-4" />
                  <span>Inventory</span>
                </HiddenOnIconSidebar>
                <ShowOnlyOnIconSidebar>
                  <TooltipPrimitive.Root delayDuration={200}>
                    <TooltipPrimitive.Trigger asChild>
                      <span><Package className="size-4" /></span>
                    </TooltipPrimitive.Trigger>
                    <TooltipContentCustom side="right">Inventory</TooltipContentCustom>
                  </TooltipPrimitive.Root>
                </ShowOnlyOnIconSidebar>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Guild Button (Coming Soon) */}
          <SidebarMenuItem key="guild">
            <SidebarMenuButton asChild>
              <Link href="#" className="relative text-muted-foreground pr-8">
                <HiddenOnIconSidebar>
                  <Users className="size-4" />
                  <span>Guild</span>
                </HiddenOnIconSidebar>
                <ShowOnlyOnIconSidebar>
                  <TooltipPrimitive.Root delayDuration={200}>
                    <TooltipPrimitive.Trigger asChild>
                      <span><Users className="size-4" /></span>
                    </TooltipPrimitive.Trigger>
                    <TooltipContentCustom side="right">Guild</TooltipContentCustom>
                  </TooltipPrimitive.Root>
                </ShowOnlyOnIconSidebar>
                {open && (
                  <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger asChild>
                      <Lock className="size-4 absolute right-2" />
                    </TooltipPrimitive.Trigger>
                    <TooltipContentCustom>Coming soon</TooltipContentCustom>
                  </TooltipPrimitive.Root>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Profile Link */}
          <SidebarMenuItem key="profile">
            <SidebarMenuButton asChild>
              <Link href="/profile/me" className="flex w-full items-center gap-2 cursor-pointer">
                <HiddenOnIconSidebar>
                  <User className="size-4" />
                  <span>Profile</span>
                </HiddenOnIconSidebar>
                <ShowOnlyOnIconSidebar>
                  <TooltipPrimitive.Root delayDuration={200}>
                    <TooltipPrimitive.Trigger asChild>
                      <span><User className="size-4" /></span>
                    </TooltipPrimitive.Trigger>
                    <TooltipContentCustom side="right">Profile</TooltipContentCustom>
                  </TooltipPrimitive.Root>
                </ShowOnlyOnIconSidebar>
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
