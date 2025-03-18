import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

// Secret token for secure revalidation requests
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'default-secret-change-me'

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { path, tag, secret } = requestData

    // Validate the secret to prevent unauthorized revalidations
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate by path (specific routes)
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        revalidated: true,
        message: `Path "${path}" revalidated successfully`,
      })
    }

    // Revalidate by cache tag (groups of related content)
    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({
        revalidated: true,
        message: `Tag "${tag}" revalidated successfully`,
      })
    }

    return NextResponse.json({ error: 'Either path or tag is required' }, { status: 400 })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ error: 'Error revalidating content' }, { status: 500 })
  }
}
