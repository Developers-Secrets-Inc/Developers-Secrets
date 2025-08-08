import { updateUserCustomerId, updateUserRole } from '@/core/user/user-informations'
import { Webhooks } from '@polar-sh/nextjs'

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
  onPayload: async (payload) => {
    switch (payload.type) {
      case 'subscription.active':
        if (!payload.data.customer.externalId) {
          console.error('❌ User not found:', payload.data.customer.email)
          break
        }

        console.log(payload.data.product)
        if (payload.data.product.name === 'Pro Membership') {
          await updateUserRole(payload.data.customer.externalId, 'pro')
        } else if (payload.data.product.name === 'Max Membership') {
          await updateUserRole(payload.data.customer.externalId, 'max')
        } else if (payload.data.product.name === 'Lite Membership') {
          await updateUserRole(payload.data.customer.externalId, 'lite')
        }

        await updateUserCustomerId(payload.data.customer.externalId, payload.data.customer.id)

        break
      case 'subscription.created':
        if (!payload.data.customer.externalId) {
          console.error('❌ User not found:', payload.data.customer.email)
          break
        }

        console.log(payload.data.product)
        if (payload.data.product.name === 'Pro Membership') {
          await updateUserRole(payload.data.customer.externalId, 'pro')
        } else if (payload.data.product.name === 'Max Membership') {
          await updateUserRole(payload.data.customer.externalId, 'max')
        } else if (payload.data.product.name === 'Lite Membership') {
          await updateUserRole(payload.data.customer.externalId, 'lite')
        }

        await updateUserCustomerId(payload.data.customer.externalId, payload.data.customer.id)

        break
      case 'subscription.revoked':
        if (!payload.data.customer.externalId) {
          console.error('❌ User not found:', payload.data.customer.email)
          break
        }

        await updateUserRole(payload.data.customer.externalId, 'basic')

        break

      default:
        console.log('⚠️ Unknown event:', payload.type)
        break
    }
  },
})
