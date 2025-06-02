import { EditorStateProvider } from "@/core/courses/contexts/editor-state-context"
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PartHeader } from './components/part-header'
import { getCourseOutline } from '@/core/courses'

export default async function NewCoursePartLayout({
  content,
  editor,
  footer,
  params,
}: {
  content: React.ReactNode
  editor: React.ReactNode
  footer: React.ReactNode
  params: Promise<{ course_slug: string; chapter_slug: string; part_slug: string }>
}) {
  const { course_slug } = await params
  const courseOutline = await getCourseOutline(course_slug)

  return (
    <SidebarProvider open={false}>
      <div className="flex h-screen min-h-0 min-w-0">
        <HomeSidebar defaultOpen={false} />
        <SidebarInset className="flex-1 min-w-0">
          <div className="flex flex-col h-full flex-1 min-w-0 min-h-0">
            <PartHeader courseOutline={courseOutline} courseSlug={course_slug} />
            <div className="flex-1 overflow-hidden min-w-0">
                <ResizablePanelGroup direction="horizontal" className="min-w-0 flex-1">
                  <ResizablePanel defaultSize={50} minSize={40} className="min-w-0 flex-1">
                    {content}
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={40} className="min-w-0 flex-1">
                    {editor}
                  </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            {footer}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
