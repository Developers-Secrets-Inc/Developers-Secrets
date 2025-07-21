import React from 'react'

interface CrossProps {
  className?: string
}

export function Cross({ className }: CrossProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 text-muted-foreground ${className ?? ''}`}
      aria-hidden="true"
    >
      <line
        x1="10"
        y1="4"
        x2="10"
        y2="16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="10"
        x2="16"
        y2="10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}
