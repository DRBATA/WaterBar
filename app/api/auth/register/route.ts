import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  try {
    console.log('📝 Starting registration process')
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      // Check if user already exists
      console.log('🔍 Checking if user exists:', email)
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        console.log('❌ User already exists:', email)
        return NextResponse.json(
          { message: 'An account with this email already exists' },
          { status: 400 }
        )
      }
    } catch (error) {
      console.error('💾 Database error checking user:', error)
      if (error instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
          { message: 'Unable to connect to database. Please try again later.' },
          { status: 503 }
        )
      }
      throw error
    }

    // Hash password
    console.log('🔒 Hashing password')
    const hashedPassword = await hash(password, 10)

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex')

    try {
      // Create user
      console.log('👤 Creating new user:', email)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          verifyToken,
          role: 'USER'
        }
      })

      try {
        // Send verification email
        console.log('📧 Sending verification email')
        await sendVerificationEmail(email, verifyToken)
        
        console.log('✅ Registration successful:', email)
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
      } catch (emailError) {
        console.error('📧 Failed to send verification email:', emailError)
        
        // User is created but email failed - return success with warning
        return NextResponse.json({
          message: 'Account created but verification email failed to send. Please contact support.',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified
          },
          warning: 'Verification email could not be sent'
        }, { status: 201 })
      }
    } catch (error) {
      console.error('💾 Database error creating user:', error)
      if (error instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json(
          { message: 'Unable to connect to database. Please try again later.' },
          { status: 503 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { 
        message: 'Registration failed. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
