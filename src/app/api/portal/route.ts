// app/portal/route.ts
import { getUser } from "@/core/user";
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
  getCustomerId: async (_req) => {
    const user = await getUser()
    return user?.informations.customerId ?? ''
  },
});