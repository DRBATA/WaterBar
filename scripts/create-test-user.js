const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('test123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'test@waterbar.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'test@waterbar.com',
      password: hashedPassword,
      emailVerified: true,
      role: 'USER'
    }
  })

  console.log('Created test user:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
