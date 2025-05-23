import React from 'react'

interface OnboardingCardHeaderProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function OnboardingCardHeader({
  icon,
  title,
  description,
}: OnboardingCardHeaderProps) {
  return (
    <div className="relative flex flex-col items-start overflow-hidden">
      <div className="relative mb-4">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-22 h-22 rounded-full border border-gray-200/40 opacity-20" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-32 h-32 rounded-full border border-gray-200/40 opacity-15" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-42 h-42 rounded-full border border-gray-200/40 opacity-10" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-52 h-52 rounded-full border border-gray-200/40 opacity-5" />
        </div>
        <div className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center shrink-0 bg-background relative z-10 shadow-lg">
          {icon}
        </div>
      </div>
      <h2 className="text-lg font-semibold leading-tight">{title}</h2>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
    </div>
  )
}
