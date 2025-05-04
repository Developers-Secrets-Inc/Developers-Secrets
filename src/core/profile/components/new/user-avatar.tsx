import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

export const UserAvatar = ({
  src = 'https://github.com/shadcn.png',
  alt = 'User avatar',
  fallback = 'U',
  className,
}: UserAvatarProps) => {
  return (
    <Avatar className={cn('', className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
