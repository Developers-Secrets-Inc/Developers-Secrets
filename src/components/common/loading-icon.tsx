import { Loader2 } from 'lucide-react'

export const LoadingIcon = ({
  isLoading,
  children,
}: {
  isLoading: boolean
  children: React.ReactNode
}) => {
  return isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : children
}
