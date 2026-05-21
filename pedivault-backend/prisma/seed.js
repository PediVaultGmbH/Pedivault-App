// prisma/seed.js — Run with: npm run db:seed
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hash = await bcrypt.hash('Test1234!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'lena@example.de' },
    update: {},
    create: {
      firstName:    'Lena',
      lastName:     'Müller',
      email:        'lena@example.de',
      phone:        '15100000000',
      countryCode:  '+49',
      passwordHash: hash,
      isVerified:   true,
    },
  });
  console.log(`✓ User: ${user.email}`);

  const child = await prisma.child.upsert({
    where: { id: 'seed-child-aanya' },
    update: {},
    create: {
      id:          'seed-child-aanya',
      userId:      user.id,
      name:        'Aanya',
      dateOfBirth: new Date('2021-10-15'),
      gender:      'FEMALE',
      color:       '#C47A92',
    },
  });
  console.log(`✓ Child: ${child.name}`);

  console.log('\n✅ Seed complete!');
  console.log('   Email: lena@example.de');
  console.log('   Password: Test1234!\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
