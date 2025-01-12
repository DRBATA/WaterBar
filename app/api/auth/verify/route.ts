import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user with matching verification token
    const user = await prisma.user.findFirst({
      where: { verifyToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Update user to mark email as verified and clear verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null
      }
    })

    // Redirect to login page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'Failed to verify email' },
      { status: 500 }
    )
  }
}
