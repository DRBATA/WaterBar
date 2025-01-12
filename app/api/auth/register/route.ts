import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex')

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
        role: 'USER'
      }
    })

    // Send verification email
    await sendVerificationEmail(email, verifyToken)

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    )
  }
}
