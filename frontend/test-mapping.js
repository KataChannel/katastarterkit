// Test category mapping logic
const settings = [
  { key: 'header.logo', group: 'branding' },
  { key: 'header.enabled', group: 'visibility' },
  { key: 'footer.enabled', group: 'visibility' },
  { key: 'contact.email', group: 'company' },
  { key: 'social.facebook', group: 'links' },
  { key: 'seo.meta_title', group: 'meta' },
  { key: 'support_chat.enabled', group: 'general' },
  { key: 'auth_login_redirect', group: 'redirect' },
  { key: 'site.name', group: 'basic' },
];

const mappedData = settings.map((setting) => {
  let category = 'GENERAL';
  const keyPrefix = setting.key.split('.')[0];
  
  switch (keyPrefix) {
    case 'header':
      category = 'HEADER';
      break;
    case 'footer':
      category = 'FOOTER';
      break;
    case 'contact':
      category = 'CONTACT';
      break;
    case 'social':
      category = 'SOCIAL';
      break;
    case 'seo':
      category = 'SEO';
      break;
    case 'support_chat':
      category = 'SUPPORT_CHAT';
      break;
    case 'auth':
    case 'auth_login_redirect':
    case 'auth_logout_redirect':
    case 'auth_register_redirect':
    case 'auth_redirect_admin':
    case 'auth_redirect_user':
    case 'auth_redirect_guest':
    case 'auth_role_based_redirect':
      category = 'AUTH';
      break;
    default:
      category = 'GENERAL';
  }
  
  return {
    key: setting.key,
    group: setting.group,
    category
  };
});

console.log('Category Mapping Test:\n');
mappedData.forEach(item => {
  console.log(`${item.key.padEnd(30)} | ${item.group.padEnd(15)} → ${item.category}`);
});

// Count by category
const counts = mappedData.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

console.log('\nCounts by category:');
Object.entries(counts).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
