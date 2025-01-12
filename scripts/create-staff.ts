import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function createStaffUser() {
  try {
    const email = process.env.STAFF_EMAIL || 'staff@waterbar.com'
    const password = process.env.STAFF_PASSWORD || 'StaffPass123!'

    // Check if staff user already exists
    const existingStaff = await prisma.user.findUnique({
      where: { email }
    })

    if (existingStaff) {
      console.log('Staff user already exists')
      return
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create staff user
    const staff = await prisma.user.create({
      data: {
        name: 'Staff Admin',
        email,
        password: hashedPassword,
        role: 'STAFF',
        emailVerified: true // Staff user is pre-verified
      }
    })

    console.log('Staff user created successfully:', {
      id: staff.id,
      email: staff.email,
      role: staff.role
    })

    console.log('\nLogin credentials:')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nPlease change the password after first login.')
  } catch (error) {
    console.error('Failed to create staff user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createStaffUser()
