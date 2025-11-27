# Analytics Tab Added to Website Settings UI

## ✅ Changes Made

### 1. Added ANALYTICS Tab
**File:** `frontend/src/app/admin/settings/website/page.tsx`

```typescript
const CATEGORIES = [
  { value: 'GENERAL', label: 'Chung', icon: Globe },
  { value: 'HEADER', label: 'Header', icon: Layout },
  { value: 'FOOTER', label: 'Footer', icon: Layout },
  { value: 'CONTACT', label: 'Liên hệ', icon: Mail },
  { value: 'SOCIAL', label: 'Mạng xã hội', icon: MessageSquare },
  { value: 'SEO', label: 'SEO', icon: BarChart },
  { value: 'ANALYTICS', label: 'Analytics', icon: BarChart }, // ← NEW
  { value: 'SUPPORT_CHAT', label: 'Support Chat', icon: MessageCircle },
  { value: 'AUTH', label: 'Xác thực', icon: Shield },
];
```

### 2. Added Group Labels
```typescript
const labels: Record<string, string> = {
  // ... existing labels
  'google': 'Google Analytics & Tag Manager',  // ← NEW
  'facebook': 'Facebook Pixel',                // ← NEW
  'tiktok': 'TikTok Pixel',                    // ← NEW
};
```

## 📍 Access URL

**Admin UI:** `/admin/settings/website` → Tab **"Analytics"**

**Full URL:** `https://rausachtrangia.com/admin/settings/website`

## 📊 Available Settings

### Google Analytics & Tag Manager (group: google)
- `analytics.google_analytics_id` - TEXT
- `analytics.google_analytics_enabled` - BOOLEAN
- `analytics.google_tag_manager_id` - TEXT
- `analytics.google_tag_manager_enabled` - BOOLEAN

### Facebook Pixel (group: facebook)
- `analytics.facebook_pixel_id` - TEXT
- `analytics.facebook_pixel_enabled` - BOOLEAN
- `analytics.facebook_pixel_events` - JSON

### TikTok Pixel (group: tiktok)
- `analytics.tiktok_pixel_id` - TEXT
- `analytics.tiktok_pixel_enabled` - BOOLEAN

## 🎯 Usage

1. Login as Admin
2. Navigate to `/admin/settings/website`
3. Click **"Analytics"** tab
4. Input tracking IDs
5. Toggle enabled switches
6. Click **"Lưu thay đổi"** (Save changes)

## 🔧 Build Status

✅ Frontend built successfully
✅ Backend enum registration fixed
✅ All 9 analytics settings seeded in database

## 📝 Related Docs

- `ANALYTICS_UI_GUIDE.md` - Detailed user guide
- `GRAPHQL_ENUM_REGISTRATION_FIX.md` - Technical fix details
- `ANALYTICS_INTEGRATION.md` - Complete analytics system architecture

## 🚀 Ready to Deploy

All changes are ready for deployment:
- ✅ Backend: Enum registered, schema synced
- ✅ Frontend: UI updated with Analytics tab
- ✅ Database: Settings seeded
- ✅ GraphQL: Queries working

**Next:** Deploy to production to make Analytics settings available to admins.
