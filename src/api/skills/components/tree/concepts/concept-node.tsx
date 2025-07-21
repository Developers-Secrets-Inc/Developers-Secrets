import { CheckCircle2, Lock } from 'lucide-react'
import React from 'react'
import { Handle, Position } from 'reactflow'

type ConceptNodeProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const ConceptNodeRoot = ({ children, onClick, className }: ConceptNodeProps) => {
  return (
    <div
      onClick={onClick}
      className={
        `px-4 py-2 shadow-md rounded-lg border border-border min-w-[120px] max-w-[200px] relative bg-background` +
        className
      }
    >
      {children}
      <Handle type="target" position={Position.Top} className="w-12 h-1 !bg-primary rounded-full" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-12 h-1 !bg-primary rounded-full"
      />
    </div>
  )
}

const ConceptNodeHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>
}

const ConceptNodeTitle = ({ title }: { title: string }) => {
  return (
    <div className="text-base font-semibold text-white truncate flex-1" title={title}>
      {title}
    </div>
  )
}

const ConceptNode = {
  Root: ConceptNodeRoot,
  Header: ConceptNodeHeader,
  Title: ConceptNodeTitle,
}

type WithTitle = { title: string }
type HasProgress = { progress: number }

export const CompletedConceptNode: React.FC<WithTitle> = ({ title }) => {
  return (
    <ConceptNode.Root onClick={() => {}}>
      <ConceptNode.Header>
        <ConceptNode.Title title={title} />
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      </ConceptNode.Header>
    </ConceptNode.Root>
  )
}

export const UncompletedConceptNode = ({
  title,
  progress: currentProgress,
}: WithTitle & HasProgress) => {
  return (
    <ConceptNode.Root onClick={() => {}}>
      <ConceptNode.Header>
        <ConceptNode.Title title={title} />
      </ConceptNode.Header>
      <div className="mt-1">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-xs text-muted-foreground">{currentProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>
    </ConceptNode.Root>
  )
}

export const LockedConceptNode = ({ title }: WithTitle) => {
  return (
    <ConceptNode.Root onClick={() => {}} className="opacity-50 grayscale pointer-events-none">
      <ConceptNode.Header>
        <ConceptNode.Title title={title} />
      </ConceptNode.Header>
      <Lock className="h-4 w-4 text-muted-foreground" />
    </ConceptNode.Root>
  )
}

export const UnknownConceptNode = () => {
  return (
    <ConceptNode.Root className="opacity-50 grayscale pointer-events-none">
      <Lock className="h-4 w-4 text-muted-foreground" />
    </ConceptNode.Root>
  )
}
