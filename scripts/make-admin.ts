import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'ADMIN') {
      console.log(`✅ User "${email}" is already an admin`);
      process.exit(0);
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ Successfully promoted "${updatedUser.email}" to ADMIN`);
    console.log(`   Name: ${updatedUser.name || 'N/A'}`);
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Role: ${updatedUser.role}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npm run make-admin <email>');
  process.exit(1);
}

makeAdmin(email);
