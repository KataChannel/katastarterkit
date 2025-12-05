/**
 * Migration Script: Migrate WebsiteSetting domain field
 * 
 * This script updates all existing WebsiteSetting records to have the correct domain
 * based on the SITE_DOMAIN environment variable.
 * 
 * Usage:
 *   SITE_DOMAIN=rausach bun run scripts/migrate-website-settings-domain.ts
 *   SITE_DOMAIN=timona bun run scripts/migrate-website-settings-domain.ts
 *   SITE_DOMAIN=tazagroup bun run scripts/migrate-website-settings-domain.ts
 * 
 * Note: Run this AFTER applying the Prisma migration that adds the domain field.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const siteDomain = process.env.SITE_DOMAIN || 'default';
  
  console.log('='.repeat(60));
  console.log('Website Settings Domain Migration');
  console.log('='.repeat(60));
  console.log(`Target Domain: ${siteDomain}`);
  console.log(`Database: ${process.env.DATABASE_URL?.replace(/:[^@]+@/, ':***@')}`);
  console.log('='.repeat(60));

  // Check if domain column exists (in case migration hasn't been applied yet)
  try {
    // Count all settings
    const totalSettings = await prisma.websiteSetting.count();
    console.log(`\nTotal WebsiteSettings: ${totalSettings}`);

    if (totalSettings === 0) {
      console.log('\n⚠️  No WebsiteSettings found. Nothing to migrate.');
      return;
    }

    // Count settings with default domain
    const settingsWithDefaultDomain = await prisma.websiteSetting.count({
      where: { domain: 'default' }
    });
    console.log(`Settings with 'default' domain: ${settingsWithDefaultDomain}`);

    // Count settings already with target domain
    const settingsWithTargetDomain = await prisma.websiteSetting.count({
      where: { domain: siteDomain }
    });
    console.log(`Settings already with '${siteDomain}' domain: ${settingsWithTargetDomain}`);

    if (settingsWithDefaultDomain === 0) {
      console.log(`\n✅ All settings already have a domain assigned. Nothing to migrate.`);
      return;
    }

    // Preview mode - show what will be updated
    console.log('\n📋 Preview of settings to be updated:');
    const settingsToUpdate = await prisma.websiteSetting.findMany({
      where: { domain: 'default' },
      select: { id: true, key: true, label: true, category: true },
      take: 20
    });

    settingsToUpdate.forEach((s, i) => {
      console.log(`  ${i + 1}. [${s.category}] ${s.key}: ${s.label}`);
    });

    if (settingsWithDefaultDomain > 20) {
      console.log(`  ... and ${settingsWithDefaultDomain - 20} more settings`);
    }

    // Ask for confirmation
    console.log(`\n⚠️  This will update ${settingsWithDefaultDomain} settings to domain '${siteDomain}'`);
    
    // Auto-confirm if running in CI or with --force flag
    const isAutoConfirm = process.argv.includes('--force') || process.env.CI === 'true';
    
    if (!isAutoConfirm) {
      console.log('\nRun with --force to apply changes automatically.');
      console.log('Example: bun run scripts/migrate-website-settings-domain.ts --force');
      
      // Interactive confirmation
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question('\nDo you want to proceed? (yes/no): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        console.log('\n❌ Migration cancelled by user.');
        return;
      }
    }

    // Perform the migration
    console.log('\n🔄 Migrating settings...');
    
    const result = await prisma.websiteSetting.updateMany({
      where: { domain: 'default' },
      data: { domain: siteDomain }
    });

    console.log(`\n✅ Successfully updated ${result.count} settings to domain '${siteDomain}'`);

    // Verify the migration
    const verifyCount = await prisma.websiteSetting.count({
      where: { domain: siteDomain }
    });
    console.log(`\n📊 Verification:`);
    console.log(`   Total settings with '${siteDomain}' domain: ${verifyCount}`);
    
    const remainingDefault = await prisma.websiteSetting.count({
      where: { domain: 'default' }
    });
    console.log(`   Remaining settings with 'default' domain: ${remainingDefault}`);

  } catch (error: any) {
    if (error.message?.includes('Unknown argument `domain`') || 
        error.message?.includes('column "domain" does not exist')) {
      console.error('\n❌ Error: The domain column does not exist in the database.');
      console.error('   Please run Prisma migration first:');
      console.error('   bun run db:migrate');
      process.exit(1);
    }
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
