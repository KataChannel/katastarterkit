/**
 * Seed Script: Timona Academy Default Pages
 * 
 * This script seeds default pages for Timona Academy domain
 * Based on: default-pages-timona.json
 * 
 * Domain: app.timona.edu.vn
 * 
 * Run with: cd backend && npx ts-node scripts/seed-timona-pages.ts
 */

import { PrismaClient, PageStatus, BlockType, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface SectionData {
  id: string;
  type: string;
  order: number;
  data: any;
}

interface PageLayoutSettings {
  hasHeader?: boolean;
  hasFooter?: boolean;
  headerVariant?: string;
  headerStyle?: string;
  footerVariant?: string;
  footerStyle?: string;
  headerConfig?: any;
  footerConfig?: any;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  isHomepage?: boolean;
  content: any;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  status: string;
  layoutSettings?: any;
}

interface TimonaPagesData {
  domain: string;
  description: string;
  pages: PageData[];
}

/**
 * Convert section to PageBlock format
 */
function sectionToPageBlock(section: SectionData, pageId: string): any {
  // Map section type to BlockType
  const typeMapping: Record<string, BlockType> = {
    'HERO_SLIDER': BlockType.CAROUSEL,
    'HERO': BlockType.HERO,
    'STATS': BlockType.STATS,
    'COURSES_GRID': BlockType.GRID,
    'FAQ': BlockType.FAQ,
    'TEAM': BlockType.TEAM,
    'TESTIMONIAL': BlockType.TESTIMONIAL,
    'CONTACT_FORM': BlockType.CONTACT_FORM,
    'CONTACT_INFO': BlockType.CONTACT_INFO,
    'BRANCHES': BlockType.GRID,
    'RICH_TEXT': BlockType.RICH_TEXT,
    'TEXT': BlockType.TEXT,
  };

  const blockType = typeMapping[section.type] || BlockType.SECTION;

  return {
    id: `block-${section.id}`,
    type: blockType,
    content: section.data,
    order: section.order,
    isVisible: true,
    pageId: pageId,
    style: {},
  };
}

async function seedTimonaPages() {
  console.log('\n🏫 Seeding Timona Academy Pages...');
  console.log('='.repeat(50));

  try {
    // Read configuration file
    const dataPath = join(process.cwd(), 'data', 'default-pages-timona.json');
    const jsonData = readFileSync(dataPath, 'utf-8');
    const timonaData: TimonaPagesData = JSON.parse(jsonData);

    console.log(`📄 Found ${timonaData.pages.length} pages to seed`);
    console.log(`📋 Domain: ${timonaData.domain}`);
    console.log(`📝 Description: ${timonaData.description}`);
    console.log('');

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const pageData of timonaData.pages) {
      console.log(`\n📄 Processing: ${pageData.title}`);
      console.log(`   Slug: /${pageData.slug}`);

      // Check if page already exists
      const existingPage = await prisma.page.findFirst({
        where: {
          OR: [
            { id: pageData.id },
            { slug: pageData.slug }
          ]
        }
      });

      if (existingPage) {
        // Update existing page
        console.log(`   ⚠️  Page exists, updating...`);
        
        // First, delete existing blocks
        await prisma.pageBlock.deleteMany({
          where: { pageId: existingPage.id }
        });

        // Update page - cast to Prisma.InputJsonValue
        await prisma.page.update({
          where: { id: existingPage.id },
          data: {
            title: pageData.title,
            content: pageData.content as Prisma.InputJsonValue,
            seoTitle: pageData.seoTitle,
            seoDescription: pageData.seoDescription,
            seoKeywords: pageData.seoKeywords,
            status: (pageData.status || 'PUBLISHED') as PageStatus,
            layoutSettings: (pageData.layoutSettings || {}) as Prisma.InputJsonValue,
            isHomepage: pageData.isHomepage || false,
          }
        });

        // Create new blocks
        if (pageData.content?.sections) {
          for (const section of pageData.content.sections) {
            const blockData = sectionToPageBlock(section, existingPage.id);
            await prisma.pageBlock.create({
              data: {
                id: blockData.id,
                type: blockData.type,
                content: blockData.content as Prisma.InputJsonValue,
                order: blockData.order,
                isVisible: blockData.isVisible,
                pageId: existingPage.id,
                style: blockData.style as Prisma.InputJsonValue,
              }
            });
          }
        }

        updatedCount++;
        console.log(`   ✅ Updated: ${pageData.title}`);
      } else {
        // Create new page
        const page = await prisma.page.create({
          data: {
            id: pageData.id,
            title: pageData.title,
            slug: pageData.slug,
            content: pageData.content as Prisma.InputJsonValue,
            seoTitle: pageData.seoTitle,
            seoDescription: pageData.seoDescription,
            seoKeywords: pageData.seoKeywords,
            status: (pageData.status || 'PUBLISHED') as PageStatus,
            layoutSettings: (pageData.layoutSettings || {}) as Prisma.InputJsonValue,
            isHomepage: pageData.isHomepage || false,
            createdBy: 'system',
          }
        });

        // Create blocks
        if (pageData.content?.sections) {
          for (const section of pageData.content.sections) {
            const blockData = sectionToPageBlock(section, page.id);
            await prisma.pageBlock.create({
              data: {
                id: blockData.id,
                type: blockData.type,
                content: blockData.content as Prisma.InputJsonValue,
                order: blockData.order,
                isVisible: blockData.isVisible,
                pageId: page.id,
                style: blockData.style as Prisma.InputJsonValue,
              }
            });
          }
        }

        createdCount++;
        console.log(`   ✅ Created: ${pageData.title}`);
      }

      // Show layout settings
      const ls = pageData.layoutSettings;
      if (ls) {
        console.log(`   📐 Layout: Header=${ls.headerVariant || 'default'}, Footer=${ls.footerVariant || 'default'}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Seed Summary:');
    console.log(`   ✅ Created: ${createdCount} pages`);
    console.log(`   🔄 Updated: ${updatedCount} pages`);
    if (skippedCount > 0) {
      console.log(`   ⏭️  Skipped: ${skippedCount} pages`);
    }
    console.log(`   📄 Total: ${timonaData.pages.length} pages`);

    // List all Timona pages
    console.log('\n📋 Timona Academy Pages:');
    const allPages = await prisma.page.findMany({
      where: {
        id: { in: timonaData.pages.map(p => p.id) }
      },
      include: {
        blocks: true
      },
      orderBy: { title: 'asc' }
    });

    for (const page of allPages) {
      console.log(`\n📄 ${page.title}`);
      console.log(`   URL: /${page.slug}`);
      console.log(`   Status: ${page.status}`);
      console.log(`   Blocks: ${page.blocks.length}`);
      console.log(`   Homepage: ${page.isHomepage ? 'Yes ⭐' : 'No'}`);
    }

    console.log('\n✅ Timona Academy pages seeding completed!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding Timona pages:', error);
    throw error;
  }
}

async function main() {
  console.log('\n🚀 Starting Timona Academy Pages Seed...');
  
  try {
    await seedTimonaPages();
    console.log('\n✨ All done!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
