import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

type UserInfo = Pick<User, 'id' | 'name' | 'email' | 'role' | 'emailVerified' | 'createdAt'>

async function listUsers() {
  try {
    console.log('🔍 Fetching all users from database...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    })

    console.log('\n📋 Registered Users:')
    users.forEach((user: UserInfo) => {
      console.log('\n👤 User:', {
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.emailVerified,
        registered: user.createdAt.toLocaleString()
      })
    })
    
    console.log(`\n✅ Total users: ${users.length}`)
  } catch (error) {
    console.error('❌ Error fetching users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
