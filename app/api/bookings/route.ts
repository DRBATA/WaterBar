import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date } = body

    // Get user from session
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Parse date string to Date object
    const bookingDate = new Date(date)
    const dayOfWeek = bookingDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 // 0 = Sunday, 6 = Saturday

    // Find or create time slot
    const timeSlot = await prisma.timeSlot.findFirst({
      where: {
        date: {
          equals: bookingDate
        },
        startTime: {
          equals: new Date(
            bookingDate.setHours(isWeekend ? 9 : 6, 0, 0, 0)
          )
        },
        endTime: {
          equals: new Date(
            bookingDate.setHours(isWeekend ? 12 : 9, 0, 0, 0)
          )
        }
      },
      include: {
        bookings: true
      }
    })

    if (timeSlot && timeSlot.bookings.length >= timeSlot.capacity) {
      return NextResponse.json(
        { message: 'Time slot is fully booked' },
        { status: 400 }
      )
    }

    // Create or get time slot
    const startTime = new Date(bookingDate)
    startTime.setHours(isWeekend ? 9 : 6, 0, 0, 0)
    
    const endTime = new Date(bookingDate)
    endTime.setHours(isWeekend ? 12 : 9, 0, 0, 0)

    const slot = await prisma.timeSlot.upsert({
      where: {
        date_startTime: {
          date: bookingDate,
          startTime
        }
      },
      update: {},
      create: {
        date: bookingDate,
        startTime,
        endTime,
        isWeekend,
        capacity: 100
      }
    })

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        date: bookingDate,
        slotId: slot.id,
        status: 'ACTIVE'
      }
    })


    return NextResponse.json(booking)
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { message: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        timeSlot: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
