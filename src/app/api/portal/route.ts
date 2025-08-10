// app/portal/route.ts
import { getUser } from "@/core/users";
import { CustomerPortal } from "@polar-sh/nextjs";
import { isFailure } from "@/lib/result";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
  getCustomerId: async (_req) => {
    const user = await getUser()
    if (isFailure(user)) return ''
    return user.value.informations.customerId ?? ''
  },
});