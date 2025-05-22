import React from 'react'

interface TwoColumnLayoutProps {
  children: React.ReactNode
  className?: string // Allow custom styling for the main container
}

interface ColumnProps {
  children: React.ReactNode
  className?: string // Allow custom styling for each column
}

// Le composant principal qui gère le conteneur flex
const TwoColumnLayout = ({ children, className }: TwoColumnLayoutProps) => {
  return <div className={`flex flex-col md:flex-row gap-4 ${className}`}>{children}</div>
}

// Le sous-composant pour la colonne de gauche
const LeftColumn = ({ children, className }: ColumnProps) => {
  return <div className={`flex-1 ${className}`}>{children}</div>
}

// Le sous-composant pour la colonne de droite
const RightColumn = ({ children, className }: ColumnProps) => {
  return <div className={`flex-1 ${className}`}>{children}</div>
}

// Attacher les sous-composants au composant principal
TwoColumnLayout.Left = LeftColumn
TwoColumnLayout.Right = RightColumn

export { TwoColumnLayout }
