#!/usr/bin/env node

/**
 * Test VAPID Configuration
 * Kiểm tra xem VAPID keys đã được load đúng chưa
 */

require('dotenv').config();

console.log('\n🔍 VAPID Configuration Test\n');
console.log('================================\n');

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT;

if (!publicKey) {
  console.error('❌ VAPID_PUBLIC_KEY is missing!');
} else {
  console.log('✅ VAPID_PUBLIC_KEY:', publicKey.substring(0, 20) + '...');
}

if (!privateKey) {
  console.error('❌ VAPID_PRIVATE_KEY is missing!');
} else {
  console.log('✅ VAPID_PRIVATE_KEY:', privateKey.substring(0, 20) + '...');
}

if (!subject) {
  console.warn('⚠️  VAPID_SUBJECT is missing (optional)');
} else {
  console.log('✅ VAPID_SUBJECT:', subject);
}

console.log('\n================================\n');

if (publicKey && privateKey) {
  console.log('✅ VAPID configuration is valid!\n');
  console.log('Push notifications should work now. ✨\n');
  process.exit(0);
} else {
  console.error('❌ VAPID configuration is incomplete!\n');
  process.exit(1);
}
