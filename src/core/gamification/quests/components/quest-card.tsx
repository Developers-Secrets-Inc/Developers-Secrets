import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Award, CheckCircle, X, Gift, RefreshCw, Loader2 } from 'lucide-react'
import { Quest as PayloadQuest, UserQuest as PayloadUserQuest } from '@/payload-types'

type QuestDifficulty = 'easy' | 'medium' | 'hard'

type Quest = PayloadQuest & {
  title: string
  difficulty: QuestDifficulty
  experience: number
  value: number
}

interface UserQuest extends PayloadUserQuest {
  quest: Quest
  currentProgression: number
  isCompleted: boolean
}

const QuestDifficultyBadge = ({
  difficulty,
  isCompleted,
}: {
  difficulty: QuestDifficulty
  isCompleted: boolean
}) => {
  const difficultyColors: Record<QuestDifficulty, string> = {
    easy: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    hard: 'bg-red-500/10 text-red-600 border-red-500/20',
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-sm text-xs font-medium',
        isCompleted
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          : difficultyColors[difficulty],
      )}
    >
      {isCompleted ? 'Completed' : difficulty}
    </Badge>
  )
}

const QuestChestIcon = ({ difficulty }: { difficulty: QuestDifficulty }) => {
  const difficultyColors: Record<QuestDifficulty, string> = {
    easy: 'text-slate-500',
    medium: 'text-blue-500',
    hard: 'text-purple-500',
  }
  return <Gift className={cn('h-3.5 w-3.5', difficultyColors[difficulty])} />
}

const QuestRewardDisplay = ({
  experience,
  difficulty,
  onReplaceQuest,
  canReplace,
  isReplacing,
}: {
  experience: number
  difficulty: QuestDifficulty
  onReplaceQuest?: () => void
  canReplace?: boolean
  isReplacing?: boolean
}) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-xs leading-[inherit] font-normal">
      <span className="flex items-center gap-1">
        <Award className="h-3 w-3" />
        {experience} XP
      </span>
      <span className="flex items-center gap-1">
        <QuestChestIcon difficulty={difficulty} />
      </span>
      {onReplaceQuest && (
        <button
          onClick={onReplaceQuest}
          disabled={!canReplace}
          className="p-1 rounded-full text-slate-400/80 hover:text-blue-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Replace quest"
        >
          {isReplacing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
        </button>
      )}
    </div>
  )
}

const QuestDescription = ({
  description,
  isCompleted,
}: {
  description: string
  isCompleted: boolean
}) => {
  return (
    <p
      className={cn(
        'text-sm',
        isCompleted ? 'text-slate-400 line-through' : 'text-muted-foreground',
      )}
    >
      {description}
    </p>
  )
}

const QuestProgress = ({ current, total }: { current: number; total: number }) => {
  const percent = (current / total) * 100;
  const textColor = percent >= 40 ? "text-white" : "text-muted-foreground";
  return (
    <div className="relative">
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{
            width: `${percent}%`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-medium ${textColor}`}>
            {current}/{total}
          </span>
        </div>
      </div>
    </div>
  )
}

const QuestIcon = ({
  Icon,
  difficulty,
  isCompleted,
}: {
  Icon: React.ElementType
  difficulty: QuestDifficulty
  isCompleted: boolean
}) => {
  const getIconStyle = (difficulty: QuestDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/20'
      case 'medium':
        return 'bg-amber-500/15 text-amber-500 ring-amber-500/20'
      case 'hard':
        return 'bg-red-500/15 text-red-500 ring-red-500/20'
      default:
        return 'bg-slate-500/15 text-slate-500 ring-slate-500/20'
    }
  }

  return (
    <div
      className={cn(
        'rounded-full p-2 shrink-0 ring-1 ring-inset',
        isCompleted
          ? 'bg-emerald-500/15 text-emerald-500 ring-emerald-500/20'
          : getIconStyle(difficulty),
      )}
    >
      {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
    </div>
  )
}

export const QuestCard = ({
  userQuest,
  onReplaceQuest,
  onCompleteQuest,
  canReplace,
  isReplacing,
}: {
  userQuest: UserQuest
  onReplaceQuest?: () => void
  onCompleteQuest?: () => void
  canReplace?: boolean
  isReplacing?: boolean
}) => {
  const { quest, currentProgression, isCompleted } = userQuest
  const { title, difficulty, experience: xp, value: total } = quest

  return (
    <div
      className={cn(
        'border-input relative flex w-full items-start gap-4 rounded-md border p-4 py-5 shadow-xs outline-none',
        isCompleted && 'bg-emerald-950/40 border-emerald-800/40',
      )}
    >
      <QuestIcon Icon={CheckCircle} difficulty={difficulty} isCompleted={isCompleted} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <QuestDescription description={title} isCompleted={isCompleted} />
            {/* <QuestDifficultyBadge difficulty={difficulty} isCompleted={isCompleted} /> */}
          </div>
          <QuestRewardDisplay 
            experience={xp} 
            difficulty={difficulty} 
            onReplaceQuest={!isCompleted ? onReplaceQuest : undefined}
            canReplace={canReplace}
            isReplacing={isReplacing}
          />
        </div>

        {!isCompleted && total > 0 && (
          <div className="mt-2">
            <QuestProgress current={currentProgression} total={total} />
          </div>
        )}

        {/* {!isCompleted && onCompleteQuest && process.env.NODE_ENV === 'development' && (
          <button
            onClick={onCompleteQuest}
            className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Mark as completed
          </button>
        )} */}
      </div>
    </div>
  )
}
