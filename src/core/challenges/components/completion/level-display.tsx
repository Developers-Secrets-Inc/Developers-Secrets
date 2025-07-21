interface LevelDisplayProps {
  level: number
}

export function LevelDisplay({ level }: LevelDisplayProps) {
  return (
    <div className="text-sm font-medium flex items-center gap-2">
      <span>Level</span>
      <span className="font-bold">{level}</span>
    </div>
  )
}
