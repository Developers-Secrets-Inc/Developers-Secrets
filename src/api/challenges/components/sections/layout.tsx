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
  return <ResizablePanelGroup direction="horizontal">{children}</ResizablePanelGroup>
}

const ChallengeLayoutLeftPart: React.FC<WithChildren> = ({ children }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={40}>
      <div className="flex flex-col h-full">{children}</div>
    </ResizablePanel>
  )
}

const ChallengeLayoutRightPart: React.FC<WithChildren> = ({ children }) => {
  return (
    <ResizablePanel defaultSize={50} minSize={40} className="flex flex-col h-full">
      {children}
    </ResizablePanel>
  )
}

const ChallengeLayoutContentSeparator: React.FC = () => {
    return <ResizableHandle withHandle />
}

export const ChallengeLayout = {
  Root: ChallengeLayoutRoot,
  Header: DefaultChallengeHeader,
  Body: ChallengeLayoutBody,
  Content: ChallengeLayoutContent,
  LeftPart: ChallengeLayoutLeftPart,
  RightPart: ChallengeLayoutRightPart,
  ContentSeparator: ChallengeLayoutContentSeparator
}
