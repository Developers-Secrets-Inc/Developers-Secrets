import { NextRequest, NextResponse } from 'next/server'
import { getRandomChallenge } from '@/core/challenges'

export async function GET(request: NextRequest) {
  const currentSlug = request.nextUrl.searchParams.get('current')

  try {
    const challenge = await getRandomChallenge(currentSlug || undefined)
    return NextResponse.json({
      slug: challenge.slug,
      title: challenge.title,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get random challenge' }, { status: 500 })
  }
}
