import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'


export const ChallengeBreadcrumb = ({
  challengeSlug,
  challengeTitle,
}: {
  challengeSlug: string
  challengeTitle: string
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Link
        href={`/challenges/${challengeSlug}`}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Challenge
      </Link>
      <span className="text-sm text-muted-foreground">/</span>
      <span className="text-sm font-medium truncate">{challengeTitle}</span>
    </div>
  )
}