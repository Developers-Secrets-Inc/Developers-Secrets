import React from 'react'
import { cn } from '@/lib/utils'

interface TwoColumnLayoutProps {
  children: React.ReactNode
  className?: string // Allow custom styling for the main container
}

interface ColumnProps {
  children: React.ReactNode
  className?: string // Allow custom styling for each column
}

// Main component that manages the flex container
const TwoColumnLayout = ({ children, className }: TwoColumnLayoutProps) => {
  return <div className={cn('flex flex-col md:flex-row gap-4', className)}>{children}</div>
}

// Sub-component for the left column
const LeftColumn = ({ children, className }: ColumnProps) => {
  return <div className={cn('flex-1', className)}>{children}</div>
}

// Sub-component for the right column
const RightColumn = ({ children, className }: ColumnProps) => {
  return <div className={cn('flex-1', className)}>{children}</div>
}

// Attach sub-components to the main component
TwoColumnLayout.Left = LeftColumn
TwoColumnLayout.Right = RightColumn

export { TwoColumnLayout }
