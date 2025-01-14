const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    const hashedPassword = await hash('test123', 12)

    const user = await prisma.user.upsert({
      where: { email: 'azambata.1984@gmail.com' },
      update: {
        emailVerified: true, // Force update existing user to be verified
        password: hashedPassword
      },
      create: {
        name: 'Test User',
        email: 'azambata.1984@gmail.com',
        password: hashedPassword,
        emailVerified: true, // This must be true to allow immediate login
        role: 'USER'
      }
    })

    console.log('Created test user:', user)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
