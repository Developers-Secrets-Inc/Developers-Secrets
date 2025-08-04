// src/app/api/webhook/polar/route.ts
import { getUserByEmail } from '@/core/user'
import { isError } from '@/core/user/result'
import { updateUserCustomerId, updateUserRole } from '@/core/user/user-informations'
import { Webhooks } from '@polar-sh/nextjs'

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
  onPayload: async (payload) => {
    switch (payload.type) {
    //   case 'checkout.created':
    //     console.log('🛍️ New checkout created:', payload.data.id)
    //     // Vous pourriez sauvegarder ceci dans votre base de données
    //     break
    //   case 'checkout.updated':
    //     console.log('💳 Checkout updated:', payload.data.id)
    //     console.log('New status:', payload.data.status)
    //     break
    //   case 'subscription.created':
    //     console.log('✨ New subscription:', payload.data.id)
    //     break
    //   case 'subscription.updated':
    //     console.log('📝 Subscription updated:', payload.data.id)
    //     break
      case 'subscription.active':
        const user = await getUserByEmail(payload.data.customer.email)

        if (isError(user)) {
          console.error('❌ User not found:', payload.data.customer.email)
          break
        }
        if (payload.data.product.name === 'Pro Membership') {
          await updateUserRole(user.value.id, 'pro')
        } else if (payload.data.product.name === 'Max Membership') {
          await updateUserRole(user.value.id, 'max')
        } else if (payload.data.product.name === 'Lite Membership') {
          await updateUserRole(user.value.id, 'lite')
        }

        await updateUserCustomerId(user.value.id, payload.data.customer.id)

        break
    //   case 'subscription.revoked':
    //     console.log('❌ Subscription revoked:', payload.data.id)
    //     break
    //   case 'subscription.canceled':
    //     console.log('🚫 Subscription canceled:', payload.data.id)
    //     break
      default:
        console.log('⚠️ Unknown event:', payload.type)
        break
    }
  },
})
