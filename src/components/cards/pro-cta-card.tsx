'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSidebar } from '../ui/sidebar'
import { useUser } from '@/core/users/contexts/user-context'

export const ProCtaCard = () => {
  const { state } = useSidebar()

  return (
    state === 'expanded' &&(
      <div id="upgrade-cta" className="p-4 flex flex-col gap-4 bg-background border rounded-md">
        <div id="icon-and-text" className="flex flex-col gap-3">
          <div
            id="featured-icon"
            className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center"
          >
            <svg
              className="size-5"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17.5H3.5M6.5 12H2M9 6.5H4M17 3L10.4036 12.235C10.1116 12.6438 9.96562 12.8481 9.97194 13.0185C9.97744 13.1669 10.0486 13.3051 10.1661 13.3958C10.3011 13.5 10.5522 13.5 11.0546 13.5H16L15 21L21.5964 11.765C21.8884 11.3562 22.0344 11.1519 22.0281 10.9815C22.0226 10.8331 21.9514 10.6949 21.8339 10.6042C21.6989 10.5 21.4478 10.5 20.9454 10.5H16L17 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div id="text-and-supporting-text" className="flex flex-col gap-[4px]">
            <div id="badge-and-text" className="flex items-center justify-between gap-[6px]">
              <p className="text-sm font-medium">Upgrade to PRO</p>
              <div className="rounded-[6px] py-[2px] px-[6px] border">
                <p className="text-xs font-medium">20% OFF</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Unlock all features and support with the pro version
            </p>
          </div>
        </div>
        <Link href="/pricing" passHref>
          <Button className="w-full" asChild={false}>
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    )
  )
}
