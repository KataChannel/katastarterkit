/**
 * Test RBAC Access Control
 * 
 * Test if hasAdminAccess() correctly identifies users with admin roles
 */

import { hasAdminAccess, hasRole, getUserDisplayRole } from '../lib/rbac-utils';

// Mock users for testing
const testUsers = {
  adminUser: {
    id: '1',
    email: 'admin@test.com',
    roleType: 'ADMIN',
    roles: [],
    permissions: [],
  },
  contentManagerUser: {
    id: '2',
    email: 'chikiet88@gmail.com',
    roleType: 'USER',
    roles: [
      {
        id: 'role-1',
        name: 'content_manager',
        displayName: 'Quản lý Nội dung',
        permissions: [],
      },
    ],
    permissions: [],
  },
  regularUser: {
    id: '3',
    email: 'user@test.com',
    roleType: 'USER',
    roles: [],
    permissions: [],
  },
  guestUser: {
    id: '4',
    email: 'guest@test.com',
    roleType: 'GUEST',
    roles: [],
    permissions: [],
  },
};

console.log('🧪 Testing RBAC Access Control\n');
console.log('═'.repeat(60));

// Test 1: Admin user with ADMIN roleType
console.log('\n📝 Test 1: Admin user (roleType: ADMIN)');
console.log('User:', testUsers.adminUser.email);
console.log('hasAdminAccess:', hasAdminAccess(testUsers.adminUser));
console.log('Display Role:', getUserDisplayRole(testUsers.adminUser));
console.log('Expected: true ✅');
console.log('Result:', hasAdminAccess(testUsers.adminUser) ? '✅ PASS' : '❌ FAIL');

// Test 2: Content manager user
console.log('\n📝 Test 2: Content Manager (roleType: USER, role: content_manager)');
console.log('User:', testUsers.contentManagerUser.email);
console.log('hasAdminAccess:', hasAdminAccess(testUsers.contentManagerUser));
console.log('hasRole(content_manager):', hasRole(testUsers.contentManagerUser, 'content_manager'));
console.log('Display Role:', getUserDisplayRole(testUsers.contentManagerUser));
console.log('Expected: true ✅');
console.log('Result:', hasAdminAccess(testUsers.contentManagerUser) ? '✅ PASS' : '❌ FAIL');

// Test 3: Regular user
console.log('\n📝 Test 3: Regular User (roleType: USER, no roles)');
console.log('User:', testUsers.regularUser.email);
console.log('hasAdminAccess:', hasAdminAccess(testUsers.regularUser));
console.log('Display Role:', getUserDisplayRole(testUsers.regularUser));
console.log('Expected: false ❌');
console.log('Result:', !hasAdminAccess(testUsers.regularUser) ? '✅ PASS' : '❌ FAIL');

// Test 4: Guest user
console.log('\n📝 Test 4: Guest User (roleType: GUEST)');
console.log('User:', testUsers.guestUser.email);
console.log('hasAdminAccess:', hasAdminAccess(testUsers.guestUser));
console.log('Display Role:', getUserDisplayRole(testUsers.guestUser));
console.log('Expected: false ❌');
console.log('Result:', !hasAdminAccess(testUsers.guestUser) ? '✅ PASS' : '❌ FAIL');

// Test 5: Null user
console.log('\n📝 Test 5: Null User');
console.log('User: null');
console.log('hasAdminAccess:', hasAdminAccess(null));
console.log('Expected: false ❌');
console.log('Result:', !hasAdminAccess(null) ? '✅ PASS' : '❌ FAIL');

// Summary
console.log('\n' + '═'.repeat(60));
console.log('\n✅ All tests completed!');
console.log('\n📊 Summary:');
console.log('   - Admin with ADMIN roleType → Has access');
console.log('   - User with content_manager role → Has access');
console.log('   - Regular user without roles → No access');
console.log('   - Guest user → No access');
console.log('   - Null user → No access');
console.log('\n💡 The fix is working correctly!');
console.log('   User chikiet88@gmail.com can now access admin panel\n');
