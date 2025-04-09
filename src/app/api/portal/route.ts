// app/portal/route.ts
import { getUser } from "@/core/user";
import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: 'sandbox',
  getCustomerId: async (_req) => {
    const user = await getUser()
    return user?.informations.customerId ?? ''
  },
});