import { Button } from '../ui/button'

const SignupButton = () => {
  return <Button className="w-full">Start Now</Button>
}

const CTABody = () => {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-2">
        <p className="text-sm leading-5 font-[600] text-[#181D27]">Create an account</p>
        <div className="rounded-md py-0.5 px-1.5 border border-[#D5D7DA] shadow-[0_1px_2px_0_#0A0D120D]">
          <p className="text-xs leading-[18px] font-[500] text-[#414651]">20% OFF</p>
        </div>
      </div>
      <p className="text-sm leading-5 font-[400] text-[#535862]">
        Unlock 200+ integrations, 40 GB data, and advanced reporting.
      </p>
    </div>
  )
}

const CTAIcon = () => {
  return (
    <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center border-[#E9EAEB] shadow-[0_1px_2px_0_#0A0D120D,inset_0_-2px_0_0_#0A0D120D,inset_0_0_0_1px_#0A0D122E]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#414651] size-5"
      >
        <path
          d="M9 17.5H3.5M6.5 12H2M9 6.5H4M17 3L10.4036 12.235C10.1116 12.6438 9.96562 12.8481 9.97194 13.0185C9.97744 13.1669 10.0486 13.3051 10.1661 13.3958C10.3011 13.5 10.5522 13.5 11.0546 13.5H16L15 21L21.5964 11.765C21.8884 11.3562 22.0344 11.1519 22.0281 10.9815C22.0226 10.8331 21.9514 10.6949 21.8339 10.6042C21.6989 10.5 21.4478 10.5 20.9454 10.5H16L17 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export const AccountCreationCard = () => {
  return (
    <div className="flex flex-col gap-4 rounded-[12px] p-4 border border-[#E9EAEB] shadow-[0_1px_2px_0_#0A0D120D]">
      <div className="flex flex-col gap-3">
        <CTAIcon />
        <CTABody />
      </div>
      <SignupButton />
    </div>
  )
}
