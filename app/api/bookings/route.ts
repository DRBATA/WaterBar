import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, date } = body

    if (!userId || !date) {
      return NextResponse.json(
        { message: 'User ID and date are required' },
        { status: 400 }
      )
    }

    // Parse and validate the date
    const bookingDate = new Date(date)
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Ensure date is in the future
    const now = new Date()
    if (bookingDate < now) {
      return NextResponse.json(
        { message: 'Booking date must be in the future' },
        { status: 400 }
      )
    }

    // Create the booking with UTC date
    const booking = await prisma.booking.create({
      data: {
        userId,
        date: bookingDate.toISOString(),
      }
    })

    return NextResponse.json({
      booking,
      message: 'Booking created successfully'
    })
  } catch (error) {
    console.error('Booking creation error:', error)
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
        userId
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
