import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('test123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'azambata.1984@gmail.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'azambata.1984@gmail.com',
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
