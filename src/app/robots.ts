import { MetadataRoute } from 'next'

// Base URL from environment variable or default to localhost in development
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/(payload)/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
