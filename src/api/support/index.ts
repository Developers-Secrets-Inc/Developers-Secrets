'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

// Rate limiting using a Map (in-memory storage)
// In a production environment, consider using Redis or a database
const ipRateLimits = new Map<string, { count: number; lastReset: number }>()

// Constants for rate limiting
const MAX_REQUESTS = 5 // Maximum number of requests per time window
const TIME_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export async function sendSupportEmail(formData: FormData) {
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

    // Email sending logic removed as requested
    // In a real implementation, you would send an email to davidddpereiraaa6@gmail.com here
    console.log('Support request received:', {
      message,
      articleSlug,
      tutorialSlug,
      ip,
      date: new Date().toISOString(),
    })

    // Update rate limit
    userRateLimit.count += 1
    ipRateLimits.set(ip, userRateLimit)

    return { success: true, message: 'Support request sent successfully' }
  } catch (error) {
    console.error('Error processing support request:', error)
    return {
      success: false,
      message:
        'Failed to send support request. Please try again later or email us directly at support@developerssecrets.com.',
    }
  }
}

export async function getSupportStatus() {
  try {
    // Get payload client
    let payload
    try {
      payload = await getPayload({ config })
    } catch (error) {
      // Default to online if payload is not available (during build time)
      console.error('Error initializing payload:', error)
      return { status: 'online', message: '' }
    }

    const supportSettings = await payload.find({
      collection: 'support-settings',
      limit: 1,
    })

    if (supportSettings.totalDocs === 0) {
      // No settings found, default to online
      return { status: 'online', message: '' }
    }

    const settings = supportSettings.docs[0]

    // Return appropriate message based on status
    if (settings.status === 'maintenance') {
      return {
        status: 'maintenance',
        message:
          settings.maintenanceMessage ||
          'Support is currently under maintenance. Please try again later.',
      }
    } else if (settings.status === 'offline') {
      return {
        status: 'offline',
        message:
          settings.offlineMessage ||
          'Support is currently offline. Please email us at support@developerssecrets.com.',
      }
    }

    return { status: 'online', message: '' }
  } catch (error) {
    console.error('Error getting support status:', error)
    // Default to online if there's an error
    return { status: 'online', message: '' }
  }
}
