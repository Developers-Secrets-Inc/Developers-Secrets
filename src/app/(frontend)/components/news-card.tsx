'use client'

import { Markdown } from '@/components/markdown'
import React from 'react'

// Nouvelle fonction pour le badge de type de contenu
function getContentBadgeProps(type: NewsArticle['type']) {
  switch (type) {
    case 'trusted':
      return {
        className:
          'rounded-md px-2 py-0.5 text-xs font-medium bg-primary/10 border border-primary/20 text-primary',
        label: 'Trusted',
      }
    case 'sponsored':
      return {
        className:
          'rounded-md px-2 py-0.5 text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-600',
        label: 'Sponsored',
      }
    case 'community':
      return {
        className:
          'rounded-md px-2 py-0.5 text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500',
        label: 'Community',
      }
    case 'questionable':
      return {
        className:
          'rounded-md px-2 py-0.5 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500',
        label: 'Questionable',
      }
    default:
      return {
        className:
          'rounded-md px-2 py-0.5 text-xs font-medium bg-muted border border-border text-muted-foreground',
        label: 'Resource',
      }
  }
}
export interface NewsArticle {
  title: string
  summary: string
  type: 'trusted' | 'sponsored' | 'community' | 'questionable'
  content: string // contenu markdown unique par carte
  image?: string
}

// --- News component for future use ---

export interface NewsArticle {
  title: string
  summary: string
  image?: string // rendu optionnel
}

const OFFSET_FACTOR = 4
const SCALE_FACTOR = 0.03
const OPACITY_FACTOR = 0.1

export function News({ articles }: { articles: NewsArticle[] }) {
  const [order, setOrder] = React.useState(articles.map((_, idx) => idx))
  const cards = order.map((idx) => articles[idx])
  const cardCount = cards.length
  const [showCompleted, setShowCompleted] = React.useState(cardCount > 0)

  React.useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined
    if (cardCount === 0) timeout = setTimeout(() => setShowCompleted(false), 2700)
    return () => clearTimeout(timeout)
  }, [cardCount])

  return cards.length || showCompleted ? (
    <div className="group px-3 pb-3" data-active={cardCount !== 0}>
      <div className="relative size-full">
        {cards.reverse().map((card, idx) => (
          <div
            key={order[cardCount - 1 - idx]}
            className={
              'absolute left-0 top-0 size-full scale-[var(--scale)] transition-[opacity,transform] duration-200' +
              (cardCount - idx > 3
                ? [
                    ' opacity-0 sm:group-hover:translate-y-[var(--y)] sm:group-hover:opacity-[var(--opacity)]',
                    ' sm:group-has-[*[data-dragging=true]]:translate-y-[var(--y)] sm:group-has-[*[data-dragging=true]]:opacity-[var(--opacity)]',
                  ].join('')
                : ' translate-y-[var(--y)] opacity-[var(--opacity)]')
            }
            style={
              {
                '--y': `-${(cardCount - (idx + 1)) * OFFSET_FACTOR}%`,
                '--scale': 1 - (cardCount - (idx + 1)) * SCALE_FACTOR,
                '--opacity':
                  cardCount - (idx + 1) >= 6 ? 0 : 1 - (cardCount - (idx + 1)) * OPACITY_FACTOR,
              } as React.CSSProperties
            }
            aria-hidden={idx !== cardCount - 1}
          >
            <NewsCard
              title={card.title}
              description={card.summary}
              image={card.image}
              hideContent={cardCount - idx > 2}
              active={idx === cardCount - 1}
              onDismiss={() => {
                const currentIdx = order[cardCount - 1 - idx]
                setOrder((prev) => {
                  const newOrder = prev.filter((i) => i !== currentIdx)
                  newOrder.push(currentIdx)
                  return newOrder
                })
              }}
              type={card.type}
              content={card.content}
            />
          </div>
        ))}
        <div className="pointer-events-none invisible" aria-hidden>
          <NewsCard title="Title" description="Description" type="trusted" content="" />
        </div>
      </div>
    </div>
  ) : null
}

function NewsCard({
  title,
  description,
  image,
  onDismiss,
  hideContent,
  active,
  type,
  content,
}: {
  title: string
  description: string
  image?: string
  onDismiss?: () => void
  hideContent?: boolean
  active?: boolean
  type: NewsArticle['type']
  content: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef<{
    start: number
    delta: number
    startTime: number
    maxDelta: number
  }>({
    start: 0,
    delta: 0,
    startTime: 0,
    maxDelta: 0,
  })
  const animation = React.useRef<Animation>(null)
  const [dragging, setDragging] = React.useState(false)

  const onDragMove = (e: PointerEvent) => {
    if (!ref.current) return
    const { clientX } = e
    const dx = clientX - drag.current.start
    drag.current.delta = dx
    drag.current.maxDelta = Math.max(drag.current.maxDelta, Math.abs(dx))
    ref.current.style.setProperty('--dx', dx.toString())
  }

  const dismiss = () => {
    if (!ref.current) return
    const cardWidth = ref.current.getBoundingClientRect().width
    const translateX = Math.sign(drag.current.delta) * cardWidth
    animation.current = ref.current.animate(
      { opacity: 0, transform: `translateX(${translateX}px)` },
      { duration: 150, easing: 'ease-in-out', fill: 'forwards' },
    )
    animation.current.onfinish = () => onDismiss?.()
  }

  const stopDragging = (cancelled: boolean) => {
    if (!ref.current) return
    unbindListeners()
    setDragging(false)
    const dx = drag.current.delta
    if (Math.abs(dx) > ref.current.clientWidth / (cancelled ? 2 : 3)) {
      dismiss()
      return
    }
    animation.current = ref.current.animate(
      { transform: 'translateX(0)' },
      { duration: 150, easing: 'ease-in-out' },
    )
    animation.current.onfinish = () => ref.current?.style.setProperty('--dx', '0')
    drag.current = { start: 0, delta: 0, startTime: 0, maxDelta: 0 }
  }

  const onDragEnd = () => stopDragging(false)
  const onDragCancel = () => stopDragging(true)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active || !ref.current || animation.current?.playState === 'running') return
    bindListeners()
    setDragging(true)
    drag.current.start = e.clientX
    drag.current.startTime = Date.now()
    drag.current.delta = 0
    ref.current.style.setProperty('--w', ref.current.clientWidth.toString())
  }

  const bindListeners = () => {
    document.addEventListener('pointermove', onDragMove)
    document.addEventListener('pointerup', onDragEnd)
    document.addEventListener('pointercancel', onDragCancel)
  }

  const unbindListeners = () => {
    document.removeEventListener('pointermove', onDragMove)
    document.removeEventListener('pointerup', onDragEnd)
    document.removeEventListener('pointercancel', onDragCancel)
  }

  const badge = getContentBadgeProps(type)

  return (
    <div
      ref={ref}
      className={
        'relative select-none gap-2 p-3 text-[0.8125rem] bg-background border rounded-lg shadow-sm flex flex-col cursor-pointer ' +
        'translate-x-[calc(var(--dx,0)*1px)] rotate-[calc(var(--dx,0)*0.05deg)] opacity-[calc(1-max(var(--dx,0),-1*var(--dx,0))/var(--w,1)/2)] transition-shadow data-[dragging=true]:shadow-md'
      }
      data-dragging={dragging}
      onPointerDown={onPointerDown}
    >
      <div className={hideContent ? 'invisible' : undefined}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base md:text-lg text-foreground truncate flex-1">
            {title}
          </span>
          <span className={badge.className}>{badge.label}</span>
        </div>
        <p className="line-clamp-2 h-10 leading-5 text-muted-foreground">{description}</p>
        <div className="my-2 border-t border-border" />
        <Markdown className="text-xs mt-2">{content}</Markdown>
      </div>
    </div>
  )
}
