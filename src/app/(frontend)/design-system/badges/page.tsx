import { Badge } from '@/components/ui/badge'

const variants = ['pillColor', 'pillOutline', 'badgeColor'] as const
const colors = ['gray', 'purple', 'red', 'yellow', 'green', 'grayblue', 'blue', 'orange'] as const
const sizes = ['sm', 'md', 'lg'] as const

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold capitalize">{variant}</h2>
          <div className="flex flex-col gap-4">
            {colors.map((color) => (
              <div key={color} className="flex items-center gap-4">
                {sizes.map((size) => (
                  <Badge key={size} variant={variant} color={color} size={size}>
                    {color} {size}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold capitalize">Modern</h2>
        <div className="flex flex-col gap-4">
          {colors.map((color) => (
            <Badge key={color} variant="modern" color={color} withDot>
              {color}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
