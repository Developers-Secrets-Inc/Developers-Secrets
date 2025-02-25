import {
    BookOpen,
    ChevronsUpDown,
    Code2,
    FileText,
    GalleryVerticalEnd,
    Wrench
} from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenuButton
} from '@/components/ui/sidebar'

export const TutorialNavigation = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" asChild>
          <div
            className="flex items-center gap-4 rounded-[12px] border border-[#E9EAEB] bg-[#FFFFFF] p-3 shadow-[0_1px_2px_0_#0A0D120D]"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-[#717680]">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className=" text-[#181D27] font-[600]">Documentation</span>
              <span className="text-[#535862] font-[400]">v1.0.0</span>
            </div>
            <div className="ml-auto text-[#A4A7AE]">
              <ChevronsUpDown className="size-4" />
            </div>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border border-[#E9EAEB] p-2 space-y-0.5 shadow-[0_2px_2px_-1px_#0A0D120A,0_4px_6px_-2px_#0A0D1208,0_12px_16px_-4px_#0A0D1214]"
        align="start"
        side="right"
        sideOffset={4}
        avoidCollisions={false}
        style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
      >
        <DropdownMenuItem className="flex items-center gap-3 rounded-lg bg-white hover:bg-[#FAFAFA] px-3 py-2">
          <BookOpen className="size-5 text-[#7F56D9]" />
          <div className="flex flex-col">
            <span className="leading-6 font-[600] text-[#181D27]">Tutorial</span>
            <span className="leading-5 font-[400] text-[#535862]">Learn step by step</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3 rounded-lg bg-white hover:bg-[#FAFAFA] px-3 py-2">
          <Code2 className="size-5 text-[#7F56D9]" />
          <div className="flex flex-col">
            <span className="leading-6 font-[600] text-[#181D27]">Examples</span>
            <span className="leading-5 font-[400] text-[#535862]">View example projects</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3 rounded-lg bg-white hover:bg-[#FAFAFA] px-3 py-2">
          <FileText className="size-5 text-[#7F56D9]" />
          <div className="flex flex-col">
            <span className="leading-6 font-[600] text-[#181D27]">References</span>
            <span className="leading-5 font-[400] text-[#535862]">API documentation</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3 rounded-lg bg-white hover:bg-[#FAFAFA] px-3 py-2">
          <Wrench className="size-5 text-[#7F56D9]" />
          <div className="flex flex-col">
            <span className="leading-6 font-[600] text-[#181D27]">Compiler</span>
            <span className="leading-5 font-[400] text-[#535862]">Configuration options</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
