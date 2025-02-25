import { Button } from './ui/button'
import { Volleyball } from 'lucide-react'

export const HeaderNavigation = () => {
  return (
    <div className="flex gap-5">
      <p className="font-semibold text-base leading-6 text-[#535862] p-4">Products</p>
      <p className="font-semibold text-base leading-6 text-[#535862] p-4">Services</p>
      <p className="font-semibold text-base leading-6 text-[#535862] p-4">Pricing</p>
      <p className="font-semibold text-base leading-6 text-[#535862] p-4">Resources</p>
      <p className="font-semibold text-base leading-6 text-[#535862] p-4">About</p>
    </div>
  )
}

export const AuthButtons = () => {
  return (
    <div className="flex items-center gap-3">
      <Button variant={'secondary_gray'}>
        Log in
      </Button>
      <Button>Sign Up</Button>
    </div>
  )
}

export const Header = () => {
  return (
    <header className="h-[80px] flex items-center border-b border-[#EAECF0]">
      <div className="px-8 max-w-[1280px] w-full mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <Volleyball size={32} />
            </div>
            <HeaderNavigation />
          </div>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
