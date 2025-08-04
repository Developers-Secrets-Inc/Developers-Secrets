
import 'server-only'

import { Polar } from '@polar-sh/sdk'
import { Customer } from '@polar-sh/sdk/models/components/customer.js'

const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NEXT_PUBLIC_POLAR_SERVER as 'sandbox' | 'production',
})

export const getCustomerById = async (customerId: string): Promise<Customer> => {
  return await api.customers.get({ id: customerId })
}

export const getCustomerByExternalId = async (externalCustomerId: string): Promise<Customer> => {
  return await api.customers.getExternal({ externalId: externalCustomerId })
}

export const getCustomerByEmail = async (customerEmail: string): Promise<Customer> => {
  const customers = await api.customers.list({
    organizationId: process.env.POLAR_ORGANIZATION_ID
  })

  const customer = customers.result.items.filter((customer) => customer.email === customerEmail)
  return customer[0]
}

export const isCustomer = async (userId: string): Promise<boolean> => {
  try {
    await getCustomerByExternalId(userId)
    return true
  } catch (e) {
    return false
  }
}
