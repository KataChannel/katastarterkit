import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAnalyticsSettings() {
  console.log('🔍 Checking ANALYTICS settings in database...\n');

  const settings = await prisma.websiteSetting.findMany({
    where: { category: 'ANALYTICS' },
    orderBy: { order: 'asc' },
  });

  console.log(`Found ${settings.length} analytics settings:\n`);

  settings.forEach((s) => {
    const enabled = s.key.includes('enabled') ? (s.value === 'true' ? '✅' : '❌') : '';
    console.log(`${enabled} ${s.key}`);
    console.log(`   Value: ${s.value || '(empty)'}`);
    console.log(`   Label: ${s.label}`);
    console.log(`   Group: ${s.group}`);
    console.log('');
  });

  await prisma.$disconnect();
}

checkAnalyticsSettings();
