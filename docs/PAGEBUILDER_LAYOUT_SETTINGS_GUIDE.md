# 📐 Page Builder - Layout Settings Guide

## ✨ Tổng Quan

Page Builder giờ hỗ trợ cấu hình **Header** và **Footer** riêng biệt cho từng page. Bạn có thể:
- Bật/tắt header và footer
- Chọn style cho header (default, transparent, fixed, sticky)
- Chọn style cho footer (default, minimal, extended)
- Gán custom menu cho header/footer (tùy chọn)

---

## 🎯 Cách Sử Dụng

### 1. Mở Page Settings

Trong **Page Builder**, click nút **Settings** (⚙️) ở header để mở Page Settings dialog.

### 2. Chuyển sang Tab "Layout"

Dialog có 3 tabs:
- **General**: Title, slug, status, description
- **Layout**: Header & Footer settings ← **MỚI!**
- **SEO**: SEO title, description, keywords

### 3. Cấu Hình Header

#### Bật/Tắt Header
```
Toggle: Show Header
- ON: Hiển thị website header
- OFF: Không hiển thị header (fullscreen content)
```

#### Header Styles (khi bật)
```
Style          | Mô Tả                              | Use Case
---------------|------------------------------------|--------------------------
Default        | Header thông thường ở top          | Trang content chuẩn
Transparent    | Overlay trên content (hero)        | Landing page với hero image
Fixed          | Luôn ở top khi scroll              | Navigation quan trọng
Sticky         | Stick khi scroll xuống             | UX tối ưu cho long page
```

#### Custom Header Menu (Optional)
```
Input: Header Menu ID
- Để trống: Dùng menu mặc định của website
- Nhập ID: Sử dụng menu tùy chỉnh (vd: "main-menu", "landing-menu")
```

### 4. Cấu Hình Footer

#### Bật/Tắt Footer
```
Toggle: Show Footer
- ON: Hiển thị website footer
- OFF: Không hiển thị footer (landing page clean)
```

#### Footer Styles (khi bật)
```
Style     | Mô Tả                           | Use Case
----------|--------------------------------|---------------------------
Default   | Footer chuẩn với đầy đủ info   | Trang content thông thường
Minimal   | Footer compact (copyright)     | Landing page, sign-up page
Extended  | Footer đầy đủ với columns      | Homepage, major pages
```

#### Custom Footer Menu (Optional)
```
Input: Footer Menu ID
- Để trống: Dùng menu mặc định
- Nhập ID: Menu tùy chỉnh (vd: "footer-links", "legal-links")
```

---

## 💡 Ví Dụ Cấu Hình

### Landing Page (Hero + CTA, No Header/Footer)
```
✅ Show Header: OFF
✅ Show Footer: OFF

Result: Fullscreen landing page với hero section và CTA
```

### Homepage (Transparent Header, Extended Footer)
```
✅ Show Header: ON
   - Header Style: Transparent
   - Header Menu ID: (empty - default)

✅ Show Footer: ON
   - Footer Style: Extended
   - Footer Menu ID: (empty - default)

Result: Hero section với header overlay, footer đầy đủ columns
```

### Blog Post (Sticky Header, Minimal Footer)
```
✅ Show Header: ON
   - Header Style: Sticky
   - Header Menu ID: (empty)

✅ Show Footer: ON
   - Footer Style: Minimal
   - Footer Menu ID: (empty)

Result: Header luôn visible khi scroll, footer compact
```

### Product Page (Fixed Header, Default Footer)
```
✅ Show Header: ON
   - Header Style: Fixed
   - Header Menu ID: "shop-menu"

✅ Show Footer: ON
   - Footer Style: Default
   - Footer Menu ID: "shop-footer"

Result: Custom menu cho shop, header luôn ở top
```

### About Page (Default Layout)
```
✅ Show Header: ON
   - Header Style: Default
   - Header Menu ID: (empty)

✅ Show Footer: ON
   - Footer Style: Default
   - Footer Menu ID: (empty)

Result: Layout chuẩn của website
```

---

## 🎨 Header Styles Chi Tiết

### Default
```css
Position: Static/Relative
Behavior: Header bình thường ở top của page
Scroll: Header scroll ra khỏi view
Best for: Content pages, blog posts
```

### Transparent
```css
Position: Absolute
Behavior: Overlay trên content phía dưới
Scroll: Scroll cùng content
Background: Transparent/Semi-transparent
Best for: Hero sections, landing pages với background image
```

### Fixed
```css
Position: Fixed top
Behavior: Luôn ở top, không scroll
Scroll: Luôn visible
Best for: App-like UX, dashboard, important navigation
```

### Sticky
```css
Position: Sticky top
Behavior: Scroll bình thường, stick khi đến top
Scroll: Stick when reaching top
Best for: Long-form content, optimal UX
```

---

## 🎨 Footer Styles Chi Tiết

### Default
```
Content:
- Company info & logo
- Navigation links (4 columns)
- Social media icons
- Copyright & legal links

Height: ~300px
Best for: Homepage, main pages
```

### Minimal
```
Content:
- Copyright text only
- Maybe 1-2 legal links

Height: ~80px
Best for: Landing pages, sign-up flows, minimal designs
```

### Extended
```
Content:
- All Default content
+ Newsletter signup
+ Additional info columns
+ Detailed company info

Height: ~400-500px
Best for: Homepage, major pages with rich footer
```

---

## 🔧 Technical Details

### Data Structure
```typescript
interface PageLayoutSettings {
  hasHeader?: boolean;           // Default: true
  hasFooter?: boolean;           // Default: true
  headerMenuId?: string | null;  // Default: null (use default menu)
  footerMenuId?: string | null;  // Default: null (use default menu)
  headerStyle?: 'default' | 'transparent' | 'fixed' | 'sticky';
  footerStyle?: 'default' | 'minimal' | 'extended';
}

interface Page {
  // ... existing fields
  layoutSettings?: PageLayoutSettings;
}
```

### Database
```prisma
model Page {
  // ... existing fields
  layoutSettings Json? // Stored as JSON
}
```

### Rendering Logic
```tsx
// In /website/[slug]/page.tsx
const layoutSettings = page.layoutSettings || {
  hasHeader: true,
  hasFooter: true,
  headerStyle: 'default',
  footerStyle: 'default',
};

// Conditional rendering
{layoutSettings.hasHeader && <WebsiteHeader />}
{layoutSettings.hasFooter && <WebsiteFooter />}
```

---

## 📝 Best Practices

### 1. Landing Pages
```
✅ DO: Turn off header/footer for clean landing
✅ DO: Use transparent header if keeping navigation
❌ DON'T: Use extended footer on conversion-focused pages
```

### 2. Content Pages
```
✅ DO: Use default or sticky header for easy navigation
✅ DO: Use default footer for full site info
❌ DON'T: Use transparent header on text-heavy pages
```

### 3. Homepage
```
✅ DO: Transparent header on hero section
✅ DO: Extended footer with all info
✅ DO: Consider sticky header for long homepage
```

### 4. App-like Pages
```
✅ DO: Fixed header for constant navigation
✅ DO: Minimal footer to maximize content area
❌ DON'T: Use transparent header in app interfaces
```

---

## 🚀 Migration from Old Layout

### Before (Hardcoded in layout.tsx)
```tsx
// app/website/layout.tsx
export default function WebsiteLayout({ children }) {
  return (
    <div>
      <WebsiteHeader />  {/* Always shown */}
      {children}
      <WebsiteFooter />  {/* Always shown */}
    </div>
  );
}
```

### After (Per-page Control)
```tsx
// app/website/[slug]/page.tsx
{layoutSettings.hasHeader && <WebsiteHeader />}
{children}
{layoutSettings.hasFooter && <WebsiteFooter />}
```

**Benefits:**
- ✅ Flexibility per page
- ✅ No layout nesting issues
- ✅ Landing pages can be truly fullscreen
- ✅ Custom menus per page

---

## ❓ FAQ

### Q: Header/Footer mặc định là gì nếu không set?
**A:** Default là `hasHeader: true`, `hasFooter: true`, `headerStyle: 'default'`, `footerStyle: 'default'`

### Q: Custom menu ID lấy ở đâu?
**A:** Từ Menu Management system. Nếu để trống sẽ dùng menu default của website.

### Q: Có thể override header/footer component không?
**A:** Hiện tại chỉ control show/hide và style. Để custom component, cần modify WebsiteHeader/WebsiteFooter components.

### Q: Transparent header hoạt động thế nào?
**A:** Header có position absolute, overlay lên content. Content block đầu tiên (thường là hero) nên có background image/color.

### Q: Fixed vs Sticky khác gì nhau?
**A:** 
- **Fixed**: Luôn ở top từ đầu, content scroll phía dưới
- **Sticky**: Scroll bình thường lúc đầu, stick khi đạt top viewport

---

## 🎓 Workflow Tổng Thể

```
1. Create Page in PageBuilder
   ↓
2. Click Settings → Go to Layout tab
   ↓
3. Configure Header:
   - Toggle ON/OFF
   - Select style (if ON)
   - Set custom menu ID (optional)
   ↓
4. Configure Footer:
   - Toggle ON/OFF
   - Select style (if ON)
   - Set custom menu ID (optional)
   ↓
5. Add Blocks to page content
   ↓
6. Save Page
   ↓
7. View at /website/{slug}
   ✓ Header/Footer render based on settings
```

---

## 🔥 Pro Tips

1. **Transparent Header**: Đảm bảo block đầu tiên có min-height đủ lớn (≥ 500px)
2. **Fixed Header**: Add padding-top cho main content (~80px) để tránh bị che
3. **Sticky Header**: Best cho long-form content (blog posts, guides)
4. **Minimal Footer**: Perfect cho landing pages với single CTA
5. **Extended Footer**: Great cho homepage và major pages
6. **No Header/Footer**: Ideal cho fullscreen experiences (sign-up flows, landing pages)

---

**Created:** October 13, 2025  
**Version:** 1.0  
**Feature:** Page Builder Layout Settings
