/**
 * Cleanup Script: Remove Timona Settings from Rausach Database
 * 
 * This script removes WebsiteSettings that were accidentally seeded
 * for Timona Academy domain into the Rausach database.
 * 
 * The issue: 
 * - Timona settings use keys with underscore (site_name, site_tagline, etc.)
 * - Rausach settings use keys with dot (site.name, site.tagline, etc.)
 * - Both were seeded into Rausach database causing config conflicts
 * 
 * Run with: cd backend && DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:12003/rausachcore" npx ts-node scripts/cleanup-timona-settings-from-rausach.ts
 * 
 * WARNING: Make sure you're connected to the RAUSACH database!
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List of Timona-specific setting keys (using underscore naming convention)
const timonaSettingKeys = [
  // General settings
  'site_name',
  'site_tagline',
  'site_description',
  'site_logo',
  'site_logo_white',
  'site_favicon',
  'brand_color',
  'brand_color_secondary',
  
  // Contact settings with Timona data
  'contact_email',
  'contact_phone',
  'contact_hotline',
  'contact_address',
  'working_hours',
  'zalo_number',
  
  // Social settings
  'social_facebook',
  'social_youtube',
  'social_instagram',
  'social_tiktok',
  'social_zalo',
  
  // SEO settings
  'seo_title',
  'seo_description',
  'seo_keywords',
  'seo_og_image',
  
  // Header settings
  'header_logo',
  'header_phone',
  'header_email',
  'header_address',
  'header_cta_text',
  'header_cta_url',
  
  // Footer settings  
  'footer_copyright',
  'footer_description',
  'footer_logo',
  'footer_business_license',
  
  // Hero/Homepage settings (Timona Academy specific)
  'hero_title',
  'hero_subtitle',
  'hero_cta_text',
  'hero_cta_url',
  'hero_images',
  
  // Statistics settings (Timona Academy specific)
  'stats_students',
  'stats_courses',
  'stats_instructors',
  'stats_branches',
  'stats_years',
  
  // Domain/System settings
  'domain_frontend',
  'domain_api',
  'domain_storage',
  'minio_bucket',
  'frontend_port',
  'backend_port',
  
  // Academy specific settings
  'academy_registration_email',
  'academy_consultation_phone',
  'academy_scholarship_enabled',
  'academy_scholarship_text',
  'video_intro_url',
];

async function cleanup() {
  console.log('\n🧹 Cleanup: Removing Timona settings from Rausach database...');
  console.log('━'.repeat(60));
  
  // First, check current database
  const dbUrl = process.env.DATABASE_URL || '';
  console.log(`\n📍 Database: ${dbUrl.includes('rausachcore') ? 'rausachcore ✅' : 'UNKNOWN ⚠️'}`);
  
  if (!dbUrl.includes('rausachcore')) {
    console.log('\n⚠️  WARNING: You might not be connected to rausachcore database!');
    console.log('   Please verify DATABASE_URL before proceeding.\n');
  }
  
  // Count existing Timona settings
  const existingCount = await prisma.websiteSetting.count({
    where: {
      key: { in: timonaSettingKeys }
    }
  });
  
  console.log(`\n📊 Found ${existingCount} Timona settings to remove`);
  
  if (existingCount === 0) {
    console.log('✅ No Timona settings found. Database is clean!');
    return;
  }
  
  // List settings to be removed
  const settingsToRemove = await prisma.websiteSetting.findMany({
    where: {
      key: { in: timonaSettingKeys }
    },
    select: {
      key: true,
      value: true,
      label: true
    }
  });
  
  console.log('\n📋 Settings to be removed:');
  console.log('─'.repeat(60));
  settingsToRemove.forEach((setting, index) => {
    console.log(`  ${index + 1}. ${setting.key}: ${setting.value?.substring(0, 50)}${(setting.value?.length || 0) > 50 ? '...' : ''}`);
  });
  
  // Delete Timona settings
  const result = await prisma.websiteSetting.deleteMany({
    where: {
      key: { in: timonaSettingKeys }
    }
  });
  
  console.log('\n━'.repeat(60));
  console.log(`✅ Successfully removed ${result.count} Timona settings`);
  
  // Verify Rausach settings are still intact
  const rausachCount = await prisma.websiteSetting.count({
    where: {
      key: { startsWith: 'site.' }
    }
  });
  
  console.log(`✅ Rausach settings intact: ${rausachCount} settings with 'site.' prefix`);
  console.log('\n🎉 Cleanup completed successfully!');
}

cleanup()
  .catch((error) => {
    console.error('\n❌ Error during cleanup:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
