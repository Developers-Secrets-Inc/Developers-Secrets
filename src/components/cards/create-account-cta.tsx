import { Button } from '@/components/ui/button'

export const CreateAccountCTA = () => {
  return (
    <div
      id="create-account-cta"
      className="p-4 flex flex-col gap-4 bg-background border rounded-md"
    >
      <div id="icon-and-text" className="flex flex-col gap-3">
        <div
          id="featured-icon"
          className="w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center"
        >
          <svg
            className="size-5"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 21V19C3 17.9391 3.42143 16.9217 4.17157 16.1716C4.92172 15.4214 5.93913 15 7 15H17C18.0609 15 19.0783 15.4214 19.8284 16.1716C20.5786 16.9217 21 17.9391 21 19V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div id="text-and-supporting-text" className="flex flex-col gap-[4px]">
          <div id="badge-and-text" className="flex items-center justify-between gap-[6px]">
            <p className="text-sm font-medium">Create an Account</p>
            <div className="rounded-[6px] py-[2px] px-[6px] border">
              <p className="text-xs font-medium">FREE</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Join our community to access more courses.
          </p>
        </div>
      </div>
      <Button className="w-full">Create Account</Button>
    </div>
  )
}
