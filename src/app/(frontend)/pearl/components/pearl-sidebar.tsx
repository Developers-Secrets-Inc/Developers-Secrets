import * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarRail
} from "@/components/ui/sidebar"



export function PearlSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
