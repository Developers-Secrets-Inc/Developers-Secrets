'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

// Rate limiting using a Map (in-memory storage)
// In a production environment, consider using Redis or a database
const ipRateLimits = new Map<string, { count: number; lastReset: number }>()

// Constants for rate limiting
const MAX_REQUESTS = 10 // Maximum number of feedback submissions per time window
const TIME_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function submitFeedback(formData: FormData) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown-ip'

    // Check rate limit
    const now = Date.now()
    const userRateLimit = ipRateLimits.get(ip) || { count: 0, lastReset: now }

    // Reset count if time window has passed
    if (now - userRateLimit.lastReset > TIME_WINDOW_MS) {
      userRateLimit.count = 0
      userRateLimit.lastReset = now
    }

    // Check if user has exceeded rate limit
    if (userRateLimit.count >= MAX_REQUESTS) {
      return {
        success: false,
        message: `Rate limit exceeded. Please try again later or email us directly at support@developerssecrets.com.`,
      }
    }

    // Extract form data
    const message = formData.get('message') as string
    const articleSlug = formData.get('articleSlug') as string
    const tutorialSlug = formData.get('tutorialSlug') as string

    if (!message || message.trim() === '') {
      return { success: false, message: 'Message is required' }
    }

    // Get payload client
    const payload = await getPayload({ config })

    // Create feedback in database
    await payload.create({
      collection: 'feedbacks',
      data: {
        message,
        articleSlug,
        tutorialSlug,
        ipAddress: ip,
      },
    })

    // Update rate limit
    userRateLimit.count += 1
    ipRateLimits.set(ip, userRateLimit)

    return { success: true, message: 'Feedback submitted successfully' }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return {
      success: false,
      message:
        'Failed to submit feedback. Please try again later or email us directly at support@developerssecrets.com.',
    }
  }
}
