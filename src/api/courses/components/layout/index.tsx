import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { DefaultCourseHeader } from './header'

type WithChildren = {
  children: React.ReactNode
}

const CourseLayoutRoot: React.FC<WithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen min-h-0">
      <div className="flex flex-col h-full flex-1 min-w-0 min-h-0">{children}</div>
    </div>
  )
}

const CourseLayoutBody: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex-1 overflow-hidden">{children}</div>
}

const CourseLayoutContent: React.FC<WithChildren> = ({ children }) => {
  return (
    <div className="p-1.5 h-full">
      <ResizablePanelGroup direction="horizontal" className="gap-0.5">
        {children}
      </ResizablePanelGroup>
    </div>
  )
}

const CourseLayoutLeftPart: React.FC<WithChildren> = ({ children }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={30}>
      <div className="flex flex-col h-full border rounded-md ">{children}</div>
    </ResizablePanel>
  )
}

const CourseLayoutRightPart: React.FC<WithChildren> = ({ children }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={40}>
      <div className="flex flex-col h-full border rounded-md z-20 min-h-0 max-h-full overflow-hidden">
        {children}
      </div>
    </ResizablePanel>
  )
}

const CourseLayoutContentSeparator: React.FC = () => {
  return (
    <ResizableHandle className="w-1 bg-transparent hover:bg-border rounded-md transition-all duration-200" />
  )
}

export const CourseFooterContainer: React.FC<WithChildren> = ({ children }) => {
  return (
    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] rounded-b-md relative z-50">
      {children}
    </div>
  )
}

export const CourseFooterLeftPart: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex items-center justify-between gap-3 mb-3">{children}</div>
}

export const CourseMainContainer: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex-1 overflow-y-auto scrollbar-hide mt-0 min-h-0">{children}</div>
}

export const CourseLayout = {
  Root: CourseLayoutRoot,
  Header: DefaultCourseHeader,
  Body: CourseLayoutBody,
  Content: CourseLayoutContent,
  LeftPart: CourseLayoutLeftPart,
  RightPart: CourseLayoutRightPart,
  ContentSeparator: CourseLayoutContentSeparator,
  FooterContainer: CourseFooterContainer,
  FooterLeftPart: CourseFooterLeftPart,
  MainContainer: CourseMainContainer,
}
