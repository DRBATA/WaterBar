import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { message: 'Database error occurred' },
      { status: 500 }
    )
  }
}

// Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
