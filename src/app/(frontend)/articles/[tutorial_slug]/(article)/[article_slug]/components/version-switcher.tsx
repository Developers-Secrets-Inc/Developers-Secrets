'use client'

import * as React from 'react'
import {
  BookOpen,
  Check,
  ChevronsUpDown,
  Code2,
  FileText,
  GalleryVerticalEnd,
  Wrench,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function VersionSwitcher({
  versions,
  defaultVersion,
}: {
  versions: string[]
  defaultVersion: string
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-4 p-3 shadow-sm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-foreground">Documentation</span>
                  <span className="text-muted-foreground">v{selectedVersion}</span>
                </div>
                <div className="ml-auto text-muted-foreground">
                  <ChevronsUpDown className="size-4" />
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border border-border p-2 space-y-0.5 shadow-md"
            align="start"
            side="right"
            sideOffset={4}
            avoidCollisions={false}
            style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
          >
            <DropdownMenuItem
              className="flex items-center gap-3 rounded-lg bg-background hover:bg-muted px-3 py-2"
              onSelect={() => {}}
            >
              <BookOpen className="size-5" />
              <div className="flex flex-col">
                <span className="leading-6 font-semibold text-foreground">Tutorial</span>
                <span className="leading-5 text-muted-foreground">Learn step by step</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3 rounded-lg bg-background hover:bg-muted px-3 py-2"
              onSelect={() => {}}
            >
              <Code2 className="size-5" />
              <div className="flex flex-col">
                <span className="leading-6 font-semibold text-foreground">Examples</span>
                <span className="leading-5 text-muted-foreground">View example projects</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3 rounded-lg bg-background hover:bg-muted px-3 py-2"
              onSelect={() => {}}
            >
              <FileText className="size-5" />
              <div className="flex flex-col">
                <span className="leading-6 font-semibold text-foreground">References</span>
                <span className="leading-5 text-muted-foreground">API documentation</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3 rounded-lg bg-background hover:bg-muted px-3 py-2"
              onSelect={() => {}}
            >
              <Wrench className="size-5" />
              <div className="flex flex-col">
                <span className="leading-6 font-semibold text-foreground">Compiler</span>
                <span className="leading-5 text-muted-foreground">Configuration options</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
