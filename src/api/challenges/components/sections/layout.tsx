import React from 'react'
import { DefaultChallengeHeader } from './header'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

type WithChildren = {
  children: React.ReactNode
}

const ChallengeLayoutRoot: React.FC<WithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen min-h-0">
      <div className="flex flex-col h-full flex-1 min-w-0 min-h-0">{children}</div>
    </div>
  )
}

const ChallengeLayoutBody: React.FC<WithChildren> = ({ children }) => {
  return <div className="flex-1 overflow-hidden">{children}</div>
}

const ChallengeLayoutContent: React.FC<WithChildren> = ({ children }) => {
  return (
    <div className="p-1 h-full">
      <ResizablePanelGroup direction="horizontal" className="gap-0.5">
        {children}
      </ResizablePanelGroup>
    </div>
  )
}

const ChallengeLayoutLeftPart: React.FC<WithChildren> = ({ children }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={30}>
      <div className="flex flex-col h-full border rounded-md ">{children}</div>
    </ResizablePanel>
  )
}

const ChallengeLayoutRightPart: React.FC<WithChildren> = ({ children }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={40}>
      <div className="flex flex-col h-full border rounded-md z-20">{children}</div>
    </ResizablePanel>
  )
}

const ChallengeLayoutContentSeparator: React.FC = () => {
  return (
    <ResizableHandle className="w-1 bg-transparent hover:bg-border rounded-md transition-all duration-200" />
  )
}

export const ChallengeLayout = {
  Root: ChallengeLayoutRoot,
  Header: DefaultChallengeHeader,
  Body: ChallengeLayoutBody,
  Content: ChallengeLayoutContent,
  LeftPart: ChallengeLayoutLeftPart,
  RightPart: ChallengeLayoutRightPart,
  ContentSeparator: ChallengeLayoutContentSeparator,
}
