import { Button } from '@/components/ui/button'

const buttonSizes = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
const buttonVariants = ['primary', 'secondary', 'secondary_gray', 'tertiary', 'tertiary_gray', 'link', 'link_gray'] as const;

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      {buttonVariants.map(variant => (
        <div key={variant} className="flex flex-col gap-2" id={variant}>
          {buttonSizes.map(size => (
            <div key={size} className="flex gap-2">
              <Button variant={variant} size={size}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
              <Button disabled variant={variant} size={size}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Disabled
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
