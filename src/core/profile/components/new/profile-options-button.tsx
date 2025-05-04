import { Button } from "@/components/ui/button"
import { EllipsisVertical } from "lucide-react"



export const ProfileOptionsButton = () => {
  return (
    <Button variant="outline" size="icon">
      <EllipsisVertical className="h-4 w-4" />
      <span className="sr-only">Profile Options</span>
    </Button>
  )
}
