/**
 * Script: Fix Storage URLs for Rausach Domain
 * Chuyển đổi URL từ storage.tazagroup.vn sang storage.rausachtrangia.com
 * 
 * Chạy: npx ts-node backend/scripts/fix-storage-urls.ts
 * Hoặc: bun run backend/scripts/fix-storage-urls.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OLD_DOMAIN = 'storage.tazagroup.vn';
const NEW_DOMAIN = 'storage.rausachtrangia.com';

async function main() {
  console.log('🔧 Fix Storage URLs Script');
  console.log('==========================');
  console.log(`Old Domain: ${OLD_DOMAIN}`);
  console.log(`New Domain: ${NEW_DOMAIN}`);
  console.log('');

  // 1. Update Product.thumbnail using Prisma Client
  console.log('📦 Updating Product thumbnails...');
  const productsToUpdate = await prisma.product.findMany({
    where: { thumbnail: { contains: OLD_DOMAIN } },
    select: { id: true, thumbnail: true }
  });
  console.log(`   Found ${productsToUpdate.length} products with old URLs`);

  for (const product of productsToUpdate) {
    if (product.thumbnail) {
      await prisma.product.update({
        where: { id: product.id },
        data: { thumbnail: product.thumbnail.replace(OLD_DOMAIN, NEW_DOMAIN) }
      });
    }
  }
  if (productsToUpdate.length > 0) {
    console.log(`   ✅ Updated ${productsToUpdate.length} product thumbnails`);
  }

  // 2. Update ProductImage.url using Prisma Client
  console.log('🖼️  Updating ProductImage URLs...');
  const imagesToUpdate = await prisma.productImage.findMany({
    where: { url: { contains: OLD_DOMAIN } },
    select: { id: true, url: true }
  });
  console.log(`   Found ${imagesToUpdate.length} images with old URLs`);

  for (const image of imagesToUpdate) {
    await prisma.productImage.update({
      where: { id: image.id },
      data: { url: image.url.replace(OLD_DOMAIN, NEW_DOMAIN) }
    });
  }
  if (imagesToUpdate.length > 0) {
    console.log(`   ✅ Updated ${imagesToUpdate.length} product images`);
  }

  // 3. Update Category.image using Prisma Client
  console.log('📁 Updating Category images...');
  const categoriesToUpdate = await prisma.category.findMany({
    where: { image: { contains: OLD_DOMAIN } },
    select: { id: true, image: true }
  });
  console.log(`   Found ${categoriesToUpdate.length} categories with old URLs`);

  for (const category of categoriesToUpdate) {
    if (category.image) {
      await prisma.category.update({
        where: { id: category.id },
        data: { image: category.image.replace(OLD_DOMAIN, NEW_DOMAIN) }
      });
    }
  }
  if (categoriesToUpdate.length > 0) {
    console.log(`   ✅ Updated ${categoriesToUpdate.length} category images`);
  }

  // 4. Update WebsiteSetting.value using Prisma Client
  console.log('⚙️  Updating WebsiteSettings...');
  const settingsToUpdate = await prisma.websiteSetting.findMany({
    where: { value: { contains: OLD_DOMAIN } },
    select: { id: true, value: true }
  });
  console.log(`   Found ${settingsToUpdate.length} settings with old URLs`);

  for (const setting of settingsToUpdate) {
    if (setting.value) {
      await prisma.websiteSetting.update({
        where: { id: setting.id },
        data: { value: setting.value.replace(OLD_DOMAIN, NEW_DOMAIN) }
      });
    }
  }
  if (settingsToUpdate.length > 0) {
    console.log(`   ✅ Updated ${settingsToUpdate.length} website settings`);
  }

  // 5. Update Blog (if exists)
  console.log('📝 Checking Blog posts...');
  try {
    const blogsBefore = await prisma.$queryRaw<{count: bigint}[]>`
      SELECT COUNT(*) as count FROM "Blog" 
      WHERE "featuredImage" LIKE ${'%' + OLD_DOMAIN + '%'}
      OR content LIKE ${'%' + OLD_DOMAIN + '%'}
    `;
    const blogCount = Number(blogsBefore[0]?.count || 0);
    console.log(`   Found ${blogCount} blogs with old URLs`);

    if (blogCount > 0) {
      await prisma.$executeRaw`
        UPDATE "Blog" 
        SET "featuredImage" = REPLACE("featuredImage", ${OLD_DOMAIN}, ${NEW_DOMAIN})
        WHERE "featuredImage" LIKE ${'%' + OLD_DOMAIN + '%'}
      `;
      await prisma.$executeRaw`
        UPDATE "Blog" 
        SET content = REPLACE(content, ${OLD_DOMAIN}, ${NEW_DOMAIN})
        WHERE content LIKE ${'%' + OLD_DOMAIN + '%'}
      `;
      console.log(`   ✅ Updated blog posts`);
    }
  } catch (e) {
    console.log('   ⏭️  Blog table not found, skipping...');
  }

  // Summary
  console.log('');
  console.log('📊 Summary:');
  console.log('===========');
  
  const productsAfter = await prisma.product.count({
    where: { thumbnail: { contains: OLD_DOMAIN } }
  });
  const imagesAfter = await prisma.productImage.count({
    where: { url: { contains: OLD_DOMAIN } }
  });
  const categoriesAfter = await prisma.category.count({
    where: { image: { contains: OLD_DOMAIN } }
  });
  const settingsAfter = await prisma.websiteSetting.count({
    where: { value: { contains: OLD_DOMAIN } }
  });

  console.log(`Products remaining with old URLs: ${productsAfter}`);
  console.log(`Images remaining with old URLs: ${imagesAfter}`);
  console.log(`Categories remaining with old URLs: ${categoriesAfter}`);
  console.log(`Settings remaining with old URLs: ${settingsAfter}`);

  if (productsAfter === 0 && imagesAfter === 0 && categoriesAfter === 0 && settingsAfter === 0) {
    console.log('');
    console.log('✅ All URLs have been updated successfully!');
  } else {
    console.log('');
    console.log('⚠️  Some URLs may still contain old domain. Please check manually.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
