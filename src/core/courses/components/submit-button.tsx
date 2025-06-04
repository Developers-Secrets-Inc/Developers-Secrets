import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

export const SubmitButton = () => {
  return (
    <Button size="sm" className="h-8">
      <Send size={14} className="mr-1" />
      <span>Submit</span>
    </Button>
  )
}
