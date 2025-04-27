'use client'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import {
    Lock,
    Package,
    Store,
    User,
    Users
} from 'lucide-react'
import { useState } from 'react'

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import { InventorySheet } from '@/core/gamification/inventory/components/sheets/inventory-sheet'
import { MarketplaceDialog } from '@/core/gamification/marketplace/components/dialogs/marketplace-dialog'
import Link from 'next/link'

export const SocialGroup = () => {
    const [marketplaceOpen, setMarketplaceOpen] = useState(false)
    const [inventoryOpen, setInventoryOpen] = useState(false)
  
    return (
      <>
        <SidebarGroup>
          <SidebarGroupLabel>Social</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key="marketplace">
              <SidebarMenuButton asChild>
                <button
                  onClick={() => setMarketplaceOpen(true)}
                  className="flex w-full items-center gap-2 cursor-pointer"
                >
                  <Store className="size-4" />
                  <span>Marketplace</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="inventory">
              <SidebarMenuButton asChild>
                <button
                  onClick={() => setInventoryOpen(true)}
                  className="flex w-full items-center gap-2 cursor-pointer"
                >
                  <Package className="size-4" />
                  <span>Inventory</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
  
        <MarketplaceDialog open={marketplaceOpen} onOpenChange={setMarketplaceOpen} />
        <InventorySheet open={inventoryOpen} onOpenChange={setInventoryOpen} />
      </>
    )
  }
  