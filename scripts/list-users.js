const { PrismaClient } = require('@prisma/client')

async function listUsers() {
  const prisma = new PrismaClient()
  
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
    users.forEach(user => {
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
