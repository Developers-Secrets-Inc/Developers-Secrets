import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center border font-medium whitespace-nowrap shrink-0 transition-all',
  {
    variants: {
      variant: {
        pillColor: 'rounded-full bg-opacity-100',
        pillOutline: 'rounded-full bg-transparent border-[1.5px]',
        badgeColor: 'rounded-[6px] bg-opacity-100',
        modern:
          'rounded-[6px] bg-white border-[#D5D7DA] text-[#414651] shadow-[0px_1px_2px_0px_#0A0D120D]',
      },
      size: {
        sm: 'px-[8px] py-[2px] text-[12px] leading-[18px]',
        md: 'px-[10px] py-[2px] text-[14px] leading-[20px]',
        lg: 'px-[12px] py-[4px] text-[14px] leading-[20px]',
      },
      color: {
        gray: '',
        purple: '',
        red: '',
        yellow: '',
        green: '',
        grayblue: '',
        lightblue: '',
        blue: '',
        indigo: '',
        rose: '',
        orange: '',
      },
      iconPosition: {
        left: '',
        right: 'flex-row-reverse',
      },
      withDot: {
        true: 'pl-2',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'pillColor',
        color: 'gray',
        className: 'bg-[#FAFAFA] border-[#E9EAEB] text-[#414651]',
      },
      {
        variant: 'pillColor',
        color: 'purple',
        className: 'bg-[#F9F5FF] border-[#E9D7FE] text-[#6941C6]',
      },
      {
        variant: 'pillColor',
        color: 'red',
        className: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      },
      {
        variant: 'pillColor',
        color: 'yellow',
        className: 'bg-[#FFFAEB] border-[#FEDF89] text-[#B54708]',
      },
      {
        variant: 'pillColor',
        color: 'green',
        className: 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]',
      },
      {
        variant: 'pillColor',
        color: 'grayblue',
        className: 'bg-[#F8F9FC] border-[#D5D9EB] text-[#363F72]',
      },
      {
        variant: 'pillColor',
        color: 'lightblue',
        className: 'bg-[#F0F9FF] border-[#B9E6FE] text-[#026AA2]',
      },
      {
        variant: 'pillColor',
        color: 'blue',
        className: 'bg-[#EFF8FF] border-[#B2DDFF] text-[#175CD3]',
      },
      {
        variant: 'pillColor',
        color: 'indigo',
        className: 'bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD]',
      },
      {
        variant: 'pillColor',
        color: 'rose',
        className: 'bg-[#FDF2FA] border-[#FCCEEE] text-[#C11574]',
      },
      {
        variant: 'pillColor',
        color: 'orange',
        className: 'bg-[#FEF6EE] border-[#F9DBAF] text-[#B93815]',
      },
      {
        variant: 'pillOutline',
        color: 'gray',
        className: 'border-[#535862] text-[#414651]',
      },
      {
        variant: 'pillOutline',
        color: 'purple',
        className: 'border-[#7F56D9] text-[#6941C6]',
      },
      {
        variant: 'pillOutline',
        color: 'red',
        className: 'border-[#D92D20] text-[#B42318]',
      },
      {
        variant: 'pillOutline',
        color: 'yellow',
        className: 'border-[#DC6803] text-[#B54708]',
      },
      {
        variant: 'pillOutline',
        color: 'green',
        className: 'border-[#079455] text-[#067647]',
      },
      {
        variant: 'pillOutline',
        color: 'grayblue',
        className: 'border-[#3E4784] text-[#363F72]',
      },
      {
        variant: 'pillOutline',
        color: 'lightblue',
        className: 'border-[#0086C9] text-[#026AA2]',
      },
      {
        variant: 'pillOutline',
        color: 'blue',
        className: 'border-[#1570EF] text-[#175CD3]',
      },
      {
        variant: 'pillOutline',
        color: 'indigo',
        className: 'border-[#444CE7] text-[#3538CD]',
      },
      {
        variant: 'pillOutline',
        color: 'rose',
        className: 'border-[#DD2590] text-[#C11574]',
      },
      {
        variant: 'pillOutline',
        color: 'orange',
        className: 'border-[#E04F16] text-[#B93815]',
      },
      {
        variant: 'badgeColor',
        color: 'gray',
        className: 'bg-[#FAFAFA] border-[#E9EAEB] text-[#414651]',
      },
      {
        variant: 'badgeColor',
        color: 'purple',
        className: 'bg-[#F9F5FF] border-[#E9D7FE] text-[#6941C6]',
      },
      {
        variant: 'badgeColor',
        color: 'red',
        className: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      },
      {
        variant: 'badgeColor',
        color: 'yellow',
        className: 'bg-[#FFFAEB] border-[#FEDF89] text-[#B54708]',
      },
      {
        variant: 'badgeColor',
        color: 'green',
        className: 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]',
      },
      {
        variant: 'badgeColor',
        color: 'grayblue',
        className: 'bg-[#F8F9FC] border-[#D5D9EB] text-[#363F72]',
      },
      {
        variant: 'badgeColor',
        color: 'lightblue',
        className: 'bg-[#F0F9FF] border-[#B9E6FE] text-[#026AA2]',
      },
      {
        variant: 'badgeColor',
        color: 'blue',
        className: 'bg-[#EFF8FF] border-[#B2DDFF] text-[#175CD3]',
      },
      {
        variant: 'badgeColor',
        color: 'indigo',
        className: 'bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD]',
      },
      {
        variant: 'badgeColor',
        color: 'rose',
        className: 'bg-[#FDF2FA] border-[#FCCEEE] text-[#C11574]',
      },
      {
        variant: 'badgeColor',
        color: 'orange',
        className: 'bg-[#FEF6EE] border-[#F9DBAF] text-[#B93815]',
      },
      {
        withDot: true,
        color: 'gray',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#717680]',
      },
      {
        withDot: true,
        color: 'purple',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#9E77ED]',
      },
      {
        withDot: true,
        color: 'red',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#F04438]',
      },
      {
        withDot: true,
        color: 'yellow',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#F79009]',
      },
      {
        withDot: true,
        color: 'green',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#17B26A]',
      },
      {
        withDot: true,
        color: 'grayblue',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#4E5BA6]',
      },
      {
        withDot: true,
        color: 'lightblue',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#0BA5EC]',
      },
      {
        withDot: true,
        color: 'blue',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#2E90FA]',
      },
      {
        withDot: true,
        color: 'indigo',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#6172F3]',
      },
      {
        withDot: true,
        color: 'rose',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#EE46BC]',
      },
      {
        withDot: true,
        color: 'orange',
        className:
          'before:content-[""] before:block before:w-[6px] before:h-[6px] before:rounded-full before:mr-1.5 before:bg-[#EF6820]',
      },
    ],
    defaultVariants: {
      variant: 'badgeColor',
      size: 'md',
      color: 'gray',
      iconPosition: 'left',
      withDot: false,
    },
  },
)

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    icon?: React.ReactNode
    withDot?: boolean
  }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    variant,
    size,
    color,
    icon,
    iconPosition,
    withDot = false,
    asChild = false,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      ref={ref}
      data-slot="badge"
      className={cn(
        badgeVariants({
          variant,
          size,
          color: color as BadgeProps['color'],
          iconPosition,
          withDot,
        }),
        className,
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {props.children}
      {icon && iconPosition === 'right' && icon}
    </Comp>
  )
})
Badge.displayName = 'Badge'

const SuccessBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'color'>>(
  function SuccessBadge(props, ref: React.ForwardedRef<HTMLSpanElement>) {
    return <Badge {...props} ref={ref} color="green" />
  },
)
SuccessBadge.displayName = 'SuccessBadge'

const WarningBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'color'>>(
  function WarningBadge(props, ref: React.ForwardedRef<HTMLSpanElement>) {
    return <Badge {...props} ref={ref} color="yellow" />
  },
)
WarningBadge.displayName = 'WarningBadge'

const ErrorBadge = React.forwardRef<HTMLSpanElement, Omit<BadgeProps, 'color'>>(function ErrorBadge(
  props,
  ref: React.ForwardedRef<HTMLSpanElement>,
) {
  return <Badge {...props} ref={ref} color="red" />
})
ErrorBadge.displayName = 'ErrorBadge'

export { Badge, badgeVariants, SuccessBadge, WarningBadge, ErrorBadge }
export type { BadgeProps }
