import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { BookingStatus } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Count pending bookings for user
    const count = await prisma.booking.count({
      where: {
        user: {
          email: session.user.email
        },
        status: BookingStatus.PENDING_PAYMENT
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to get booking count:', error)
    return NextResponse.json(
      { message: 'Failed to get booking count' },
      { status: 500 }
    )
  }
}
