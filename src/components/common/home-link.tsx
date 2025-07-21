import Link from 'next/link'
import { Eclipse } from 'lucide-react'

export const HomeLink = () => {
  return (
    <Link href="/" prefetch={true}>
      <Eclipse size={23} />
    </Link>
  )
}
