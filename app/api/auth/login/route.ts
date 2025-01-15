import { NextResponse } from 'next/server'

// Test credentials:
// email: test@waterbar.com
// password: test123

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check test credentials
    if (email !== 'test@waterbar.com' || password !== 'test123') {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return test user
    return NextResponse.json({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@waterbar.com',
        role: 'USER',
        emailVerified: true
      }
    })

  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    )
  }
}
