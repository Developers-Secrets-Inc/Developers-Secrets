'use client'

import React from 'react'
import type { TooltipRenderProps } from 'react-joyride'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function CustomTooltip(props: TooltipRenderProps) {
  const {
    backProps,
    closeProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    size,
    skipProps,
    step,
    tooltipProps,
  } = props

  return (
    <Card
      {...tooltipProps}
      className={[
        (tooltipProps as any).className ?? '',
        'shadow-xl outline-none max-w-[420px] w-[min(90vw,420px)] py-0 gap-2',
      ].join(' ')}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 border-b border-border">
        {step.title ? <CardTitle className="text-base font-semibold">{step.title}</CardTitle> : <span />}
        <Button
          {...closeProps}
          variant="ghost"
          size="icon"
          className={[
            (closeProps as any).className ?? '',
            'ml-2 h-8 w-8 text-muted-foreground hover:text-foreground',
          ].join(' ')}
          aria-label={(closeProps as any)['aria-label'] ?? 'Close'}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardHeader>

      <CardContent className="p-2 text-sm">
        {typeof step.content === 'string' ? (
          <p className="leading-relaxed">{step.content}</p>
        ) : (
          step.content
        )}
      </CardContent>

      <CardFooter className="border-t border-border p-2">
        <div className="grid w-full grid-cols-2 gap-2">
          {index === 0 && (
            <Button
              {...skipProps}
              variant="ghost"
              size="sm"
              className={[(skipProps as any).className ?? '', 'w-full text-muted-foreground hover:bg-muted'].join(' ')}
            >
              {skipProps.title}
            </Button>
          )}

          {index > 0 && (
            <Button
              {...backProps}
              variant="secondary"
              size="sm"
              className={[(backProps as any).className ?? '', 'w-full'].join(' ')}
            >
              {backProps.title}
            </Button>
          )}

          {continuous && (
            <Button
              {...primaryProps}
              variant="default"
              size="sm"
              className={[(primaryProps as any).className ?? '', 'w-full'].join(' ')}
            >
              {primaryProps.title}
            </Button>
          )}

          {!continuous && isLastStep && (
            <Button
              {...primaryProps}
              variant="default"
              size="sm"
              className={[(primaryProps as any).className ?? '', 'w-full'].join(' ')}
            >
              {primaryProps.title}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
