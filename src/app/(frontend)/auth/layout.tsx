import { DotPattern } from '@/components/magicui/dot-pattern'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { RedirectIfSignedIn } from '@/core/user/components/signed-in'
import { cn } from '@/lib/utils'

const AuthLayoutGridPattern = () => {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-background">
      <DotPattern
        width={20}
        height={20}
        glow={true}
        cx={1}
        cy={1}
        cr={1}
        className={cn('[mask-image:linear-gradient(to_bottom_left,white,transparent)] ')}
      />
    </div>
  )
}

const AuthLayoutLeftPart = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:w-1/2 pr-4 md:pr-8 border-r border-border py-8 md:py-12 flex flex-col items-center justify-center">
      {children}
    </div>
  )
}

const AuthLayoutRightPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="hidden md:block md:w-1/2 relative overflow-hidden">{children}</div>
}

const AuthLayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-grow justify-center">
      <div className="flex w-full flex-col md:flex-row">{children}</div>
    </div>
  )
}

const AuthLayout = {
  Container: AuthLayoutContainer,
  LeftPart: AuthLayoutLeftPart,
  RightPart: AuthLayoutRightPart,
  GridPattern: AuthLayoutGridPattern,
}

export default function AuthLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    // <RedirectIfSignedIn redirectTo="/home">
    <div className="flex flex-col h-screen">
      <HomeHeader />
      <AuthLayout.Container>
        <AuthLayout.LeftPart>{children}</AuthLayout.LeftPart>

        <AuthLayout.RightPart>
          <AuthLayout.GridPattern />
        </AuthLayout.RightPart>
      </AuthLayout.Container>
    </div>
    // </RedirectIfSignedIn>
  )
}
