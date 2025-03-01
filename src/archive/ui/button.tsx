import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[#7F56D9] text-white relative before:absolute before:inset-0 before:rounded-md before:border-2 before:border-[linear-gradient(180deg,#FFFFFF1F_0%,#FFFFFF00_100%)] before:pointer-events-none shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E] hover:bg-[#6941C6] hover:before:border-2 hover:before:border-[linear-gradient(180deg,#FFFFFF1F_0%,#FFFFFF00_100%)] hover:shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E] disabled:bg-[#F5F5F5] disabled:border disabled:border-[1px] disabled:border-[#E9EAEB] disabled:shadow-[0_1px_2px_0_#0A0D120D] disabled:before:border-0 disabled:text-[#A4A7AE]',
        secondary:
          'bg-white text-[#6941C6] border border-[#D6BBFB] shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E] hover:bg-[#F9F5FF] hover:text-[#53389E] hover:border-[#D6BBFB] hover:shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E] disabled:bg-white disabled:border disabled:border-[#E9EAEB] disabled:shadow-[0_1px_2px_0_#0A0D120D] disabled:text-[#A4A7AE]',
        secondary_gray:
          'bg-white text-[#414651] border border-[#D5D7DA] shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E] hover:bg-[#FAFAFA] hover:text-[#252B37] hover:border-[#D5D7DA] hover:shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E] disabled:bg-white disabled:border disabled:border-[#E9EAEB] disabled:shadow-[0_1px_2px_0_#0A0D120D] disabled:text-[#A4A7AE]',
        tertiary: '',
        tertiary_gray: '',
        link: '',
        link_gray: '',
      },
      size: {
        sm: 'px-3 py-2 gap-1 text-sm leading-5',
        md: 'px-3.5 py-2.5 gap-1 text-sm leading-5',
        lg: 'px-4 py-2.5 gap-1.5 text-base leading-6',
        xl: 'px-[18px] py-3 gap-1.5 text-base leading-6',
        '2xl': 'px-[22px] py-4 gap-2 text-lg leading-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
