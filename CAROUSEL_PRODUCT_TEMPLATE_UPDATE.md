# 🎠 Carousel Product Template - Dynamic Block Update

## 📋 Summary

Added a new **Carousel Product** sample template to the Dynamic Block Configuration. This template displays featured products in an interactive carousel format with images, pricing, discounts, ratings, and call-to-action buttons.

**Status:** ✅ Complete  
**Date:** 27 tháng 10, 2025  
**File Modified:** `frontend/src/lib/dynamicBlockSampleTemplates.ts`

---

## 🎯 What Was Added

### New Template: `carouselProductTemplate`

**Template ID:** `carousel-product`  
**Display Name:** `Carousel Product`  
**Description:** "Showcase featured products in an interactive carousel with images, pricing, and call-to-action buttons"

**Features:**
- ✅ Interactive carousel/slider for products
- ✅ Product images with hover effect (zoom animation)
- ✅ Product badges (Best Seller, New, Sale, Popular)
- ✅ Star ratings and review counts
- ✅ Original price and discount display
- ✅ Custom CTA buttons per product
- ✅ Fully responsive design (mobile-friendly)
- ✅ Smooth scroll with snap points
- ✅ Navigation dots indicator
- ✅ "View All Products" button
- ✅ Professional gradient background

**Sample Data Included:**
- 5 featured products with complete information:
  - Product name, description
  - Current price and original price
  - Discount amount
  - Badge (Best Seller, New, Sale, Popular)
  - Star rating and review count
  - High-quality product images (Unsplash)
  - Custom CTA text

**Products in Demo:**
1. Premium Wireless Headphones ($199.99, Save $100)
2. Smart Watch Pro ($349.99, Save $100)
3. Professional Camera ($1,299.00, Save $300)
4. Portable Speaker ($89.99, Save $40)
5. Tablet Device ($599.99, No discount)

---

## 🔧 Technical Details

### Template Structure

```html
<div class="carousel-product-container py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
  <!-- Header with title, subtitle, description -->
  <div class="text-center mb-10">
    <h2 class="text-4xl font-bold">{{title}}</h2>
    <p class="text-lg text-gray-600">{{subtitle}}</p>
    <p class="text-gray-500">{{description}}</p>
  </div>
  
  <!-- Carousel Track -->
  <div class="carousel-track flex gap-6 overflow-x-auto snap-x snap-mandatory">
    {{#each products}}
      <!-- Product Card -->
      <div class="carousel-slide min-w-max w-80">
        <!-- Product Image with Badge -->
        <!-- Product Info (Name, Description) -->
        <!-- Rating and Reviews -->
        <!-- Price Section (Current, Original, Discount) -->
        <!-- CTA Button -->
      </div>
    {{/each}}
  </div>
  
  <!-- Navigation Dots -->
  <div class="flex justify-center gap-2 mt-6">
    {{#each products}}
      <button class="w-3 h-3 rounded-full"></button>
    {{/each}}
  </div>
  
  <!-- View All Button -->
  <div class="text-center mt-10">
    <button>{{viewAllText}}</button>
  </div>
</div>
```

### Data Source Configuration

```typescript
dataSource: {
  type: 'static',
  staticData: {
    title: 'Featured Products',
    subtitle: 'Browse Our Best Sellers',
    description: 'Discover premium quality products handpicked for our valued customers',
    viewAllText: 'View All Products',
    products: [
      {
        id: 1,
        name: 'Product Name',
        price: '$199.99',
        originalPrice: '$299.99',
        discount: '$100',
        description: 'Product description',
        image: 'https://images.unsplash.com/...jpg',
        badge: 'Best Seller',
        rating: 5,
        reviews: 324,
        ctaText: 'Add to Cart',
      },
      // ... more products ...
    ],
  },
}
```

### Variables for Customization

```typescript
variables: {
  title: 'Featured Products',
  subtitle: 'Browse Our Best Sellers',
  description: 'Discover premium quality products handpicked for our valued customers',
  viewAllText: 'View All Products',
}
```

---

## 📊 Updated Array

The `getAllSampleTemplates()` function now includes **8 templates** (previously 7):

```typescript
export const getAllSampleTemplates = (): SampleTemplate[] => {
  return [
    productGridTemplate,           // 1. Product Grid
    taskDashboardTemplate,         // 2. Task Dashboard
    categoryShowcaseTemplate,      // 3. Category Showcase
    heroSectionTemplate,           // 4. Hero Section
    testimonialsTemplate,          // 5. Testimonials
    contactFormTemplate,           // 6. Contact Form
    faqTemplate,                   // 7. FAQ Section
    carouselProductTemplate,       // 8. Carousel Product ✨ NEW
  ];
};
```

---

## 🎨 Design Features

### Color Scheme
- **Background:** Gradient from blue-50 to indigo-50
- **Cards:** White with shadow effects
- **Buttons:** Blue gradient (from-blue-500 to blue-600)
- **Badges:** Red, Green, Yellow backgrounds
- **Text:** Gray scale for readability

### Animations & Transitions
- Hover: Product images zoom in (scale-110)
- Hover: Card shadow increases
- Button hover: Scale up slightly (scale-105)
- Smooth scroll in carousel
- Color transitions on hover

### Responsive Design
- Mobile: Single column view (overflow carousel)
- Tablet: Flexible product width
- Desktop: Full carousel with multiple products visible
- All elements scale properly on different screen sizes

---

## 🔄 How It Works

### When User Adds Dynamic Block

1. **User clicks "Add Block" → Selects "Dynamic Block"**
2. **System randomly picks from 8 available templates** (now includes carousel-product)
3. **Carousel Product Template loaded with:**
   - 5 featured products with high-quality images
   - Pricing and discount information
   - Ratings and reviews
   - Professional styling
4. **Block renders immediately** in the page builder canvas
5. **User can:**
   - Edit carousel content
   - Modify products, prices, descriptions
   - Change template variables
   - Connect to GraphQL data source
   - Adjust colors and styling

### Probability
- Each template has **1/8 chance** (12.5%) of being randomly selected
- Users can also manually select carousel-product template from template list

---

## ✅ Verification

### TypeScript Compilation
- ✅ No type errors
- ✅ All interfaces implemented correctly
- ✅ Export statements valid
- ✅ Template structure valid

### File Status
- **File:** `/chikiet/kataoffical/shoprausach/frontend/src/lib/dynamicBlockSampleTemplates.ts`
- **Total Lines:** 690 (previously 518)
- **New Lines Added:** 172 lines
- **Status:** ✅ Ready for deployment

---

## 🚀 Testing

### Quick Test Steps

1. **Start Development Server:**
   ```bash
   cd /chikiet/kataoffical/shoprausach/frontend
   npm run dev
   ```

2. **Open Page Builder:**
   ```
   http://localhost:12000/admin/pagebuilder
   ```

3. **Add Dynamic Block:**
   - Click "Add Block" → Select "Dynamic Block"
   - Repeat multiple times to see carousel-product template

4. **Verify Template:**
   - Check that carousel renders with 5 products
   - Verify images load correctly
   - Check hover animations work
   - Confirm responsive design on mobile

5. **Check Browser Console:**
   - Look for: `[PageBuilder] Dynamic Block with sample template: { ... }`
   - Verify no TypeScript errors

---

## 📝 Related Files

- `frontend/src/lib/dynamicBlockSampleTemplates.ts` - **Modified** ✅
- `frontend/src/components/page-builder/blocks/DynamicBlock.tsx` - Uses templates
- `frontend/src/components/page-builder/contexts/PageActionsContext.tsx` - Loads templates

---

## 🎁 Benefits

✅ **More Template Variety** - 8 templates instead of 7  
✅ **E-commerce Ready** - Carousel product template for online stores  
✅ **Professional Design** - Modern, clean styling  
✅ **Production Data** - Realistic sample products included  
✅ **Responsive** - Works on all devices  
✅ **Customizable** - Easy to modify and personalize  
✅ **Zero Breaking Changes** - Backward compatible  

---

## 📌 Notes

- Carousel product template uses HTML carousel with scroll-snap
- All product images from Unsplash (high quality)
- Template is fully responsive and mobile-friendly
- Can be easily connected to GraphQL for real product data
- Supports Handlebars-style templating syntax

---

**Created by:** GitHub Copilot  
**Date:** 27 tháng 10, 2025  
**Version:** 1.0  
