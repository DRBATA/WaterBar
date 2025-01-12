import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

export async function GET(request: Request) {
  try {
    // Get user from session
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is staff
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'STAFF') {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all bookings with user and time slot info
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        timeSlot: {
          select: {
            startTime: true,
            endTime: true
          }
        }
      },
      orderBy: [
        {
          date: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Admin bookings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// Update booking status
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')
    const body = await request.json()
    const { status } = body

    if (!bookingId || !status) {
      return NextResponse.json(
        { message: 'Booking ID and status are required' },
        { status: 400 }
      )
    }

    // Get user from session
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is staff
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'STAFF') {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    // Update booking status
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        timeSlot: {
          select: {
            startTime: true,
            endTime: true
          }
        }
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { message: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
