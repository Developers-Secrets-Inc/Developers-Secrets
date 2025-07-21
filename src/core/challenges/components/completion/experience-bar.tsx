interface ExperienceBarProps {
  currentExp: number
  maxExp: number
}

export function ExperienceBar({ currentExp, maxExp }: ExperienceBarProps) {
  const percentage = (currentExp / maxExp) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="tabular-nums">
          {currentExp} / {maxExp} XP
        </span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary origin-left" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
