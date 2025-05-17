import { SignUpCard } from '../components/SignUpCard'
import { signup } from '@/actions/auth'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { DotPattern } from '@/components/DotPattern'

export default function SignUpPage() {
  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
    rememberMe: boolean,
  ) => {
    'use server'
    return await signup(username, email, password)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <div className="flex-grow flex">
        {/* Left Column for SignUpCard */}
        <div className="w-1/2 flex flex-col items-center justify-center p-6 md:p-12 border-r border-border">
          <SignUpCard onSubmit={handleSignUp} />
        </div>
        {/* Right Column (empty or for illustration) */}
        <div className="w-1/2 hidden md:flex relative overflow-hidden">
          <div className="relative flex size-full items-center justify-center overflow-hidden bg-background">
            <DotPattern
              width={20}
              height={20}
              glow={true}
              cx={1}
              cy={1}
              cr={1}
              className="[mask-image:linear-gradient(to_bottom_left,white,transparent)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
