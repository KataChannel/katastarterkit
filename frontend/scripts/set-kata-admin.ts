#!/usr/bin/env bun

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setKataAsAdmin() {
  try {
    console.log('🔧 Setting katachanneloffical@gmail.com as ADMIN...\n');

    const email = 'katachanneloffical@gmail.com';
    const password = await bcrypt.hash('Kata@@2024', 10);

    // Upsert user - create if not exists, update if exists
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        roleType: 'ADMIN',
        isActive: true,
        isVerified: true,
        firstName: 'Phạm',
        lastName: 'Chí Kiệt',
        phone: '0977272967',
      },
      create: {
        email,
        username: 'admin_kataofficial',
        firstName: 'Phạm',
        lastName: 'Chí Kiệt',
        phone: '0977272967',
        password,
        roleType: 'ADMIN',
        isActive: true,
        isVerified: true,
      },
    });

    console.log('✅ User updated successfully:');
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Username: ${user.username}`);
    console.log(`   🔐 Role Type: ${user.roleType}`);
    console.log(`   📱 Phone: ${user.phone}`);
    console.log(`   ✅ Active: ${user.isActive}`);
    console.log(`   ✅ Verified: ${user.isVerified}`);

    console.log('\n🎉 Done! User is now ADMIN');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: Kata@@2024`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setKataAsAdmin();
