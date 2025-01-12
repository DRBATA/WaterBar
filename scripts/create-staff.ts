const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();

  try {
    const hashedPassword = await bcrypt.hash(process.env.STAFF_PASSWORD!, 10);

    const staff = await prisma.user.create({
      data: {
        email: process.env.STAFF_EMAIL!,
        name: 'Staff User',
        password: hashedPassword,
        role: 'STAFF',
        emailVerified: true
      }
    });

    console.log('Staff user created:', staff);
  } catch (error) {
    console.error('Error creating staff user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
