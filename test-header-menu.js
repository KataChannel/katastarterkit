// Test script to verify HEADER menus are returned correctly
// Run with: node --loader tsx test-header-menu.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testHeaderMenus() {
  try {
    console.log('Fetching all menu items...');
    
    const allMenus = await prisma.menuItem.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    console.log(`\nTotal menus: ${allMenus.length}`);
    
    allMenus.forEach(menu => {
      const metadata = menu.metadata || {};
      console.log(`\n- ${menu.title}:`);
      console.log(`  ID: ${menu.id}`);
      console.log(`  Type: ${metadata.type || 'N/A'}`);
      console.log(`  isVisible: ${metadata.isVisible !== undefined ? metadata.isVisible : 'undefined'}`);
      console.log(`  isPublic: ${metadata.isPublic !== undefined ? metadata.isPublic : 'undefined'}`);
      console.log(`  isActive: ${menu.isActive}`);
    });

    console.log('\n--- Filtering for HEADER menus ---');
    const headerMenus = allMenus.filter(m => {
      const metadata = m.metadata || {};
      return metadata.type === 'HEADER';
    });

    console.log(`\nHEADER menus: ${headerMenus.length}`);
    headerMenus.forEach(menu => {
      const metadata = menu.metadata || {};
      console.log(`\n- ${menu.title}:`);
      console.log(`  Should be visible: ${metadata.isVisible !== false && metadata.isPublic !== false}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHeaderMenus();
