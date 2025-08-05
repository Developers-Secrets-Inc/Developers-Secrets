'use server'

import 'server-only'

import { Customer } from '@polar-sh/sdk/models/components/customer.js'
import { Maybe, none, some } from '@/lib/maybe'
import { api } from './api'


export const getCustomerById = async (customerId: string): Promise<Customer> => {
  return await api.customers.get({ id: customerId })
}

export const getCustomerByExternalId = async (externalCustomerId: string): Promise<Customer> => {
  return await api.customers.getExternal({ externalId: externalCustomerId })
}

export const getCustomerByEmail = async (customerEmail: string): Promise<Customer> => {
  const customers = await api.customers.list({
    organizationId: process.env.POLAR_ORGANIZATION_ID,
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

export const getCustomerPortalUrl = async (userId: string): Promise<Maybe<string>> => {
  const needPortal = await isCustomer(userId)
  if (needPortal) {
    const result = await api.customerSessions.create({
      customerExternalId: userId,
    })

    return some(result.customerPortalUrl)
  }

  return none()
}
