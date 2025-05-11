import { Skeleton } from '@/components/ui/skeleton'

export const HeaderPlaceholder = () => {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 pl-8">
      {/* Left section: Logo and Nav Menu */}
      <div className="flex items-center gap-2">
        {/* Logo placeholder */}
        <Skeleton className="h-6 w-6 rounded-sm" />
        {/* Nav menu items placeholder */}
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>

      {/* Right section: Auth Buttons placeholder */}
      <div className="ml-auto flex items-center gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}
