import React from 'react'

export const ChallengeFooterContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-none p-4 bg-background sticky bottom-0 shadow-[0_-1px_2px_rgba(0,0,0,0.1)] relative z-50">
      {children}
    </div>
  )
}

export const ChallengeFooterLeftPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between gap-3 mb-3">{children}</div>
}
