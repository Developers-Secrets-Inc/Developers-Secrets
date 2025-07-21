import { Tag as TagType } from '@/payload-types'
import { cn } from '@/lib/utils'

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tag: TagType
  showStatus?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Tag = ({ tag, showStatus = false, size = 'md', className, ...props }: TagProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const statusClasses = {
    test: 'bg-gray-100 text-gray-700 border-gray-200',
    public: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        sizeClasses[size],
        statusClasses[tag.status],
        className,
      )}
      {...props}
    >
      <span>{tag.name}</span>
      {showStatus && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-gray-500': tag.status === 'test',
            'bg-blue-500': tag.status === 'public',
          })}
        />
      )}
    </span>
  )
}
