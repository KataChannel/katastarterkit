# PageBuilder Phase 5 - Template System Implementation Plan

**Date**: October 15, 2025  
**Status**: In Progress  
**Objective**: Build a complete template system for saving, loading, and managing page templates

---

## Overview

Phase 5 introduces a template system that allows users to:
- Browse pre-made templates
- Create and save custom templates
- Import/export templates as JSON
- Organize templates by category
- Preview templates before applying
- Quick-start new pages from templates

---

## Architecture

### Core Components

1. **TemplateLibrary.tsx** - Main template browser UI
2. **TemplateCard.tsx** - Individual template preview card
3. **TemplatePreview.tsx** - Full template preview modal
4. **TemplateManager.ts** - Template CRUD operations
5. **useTemplates.ts** - React hook for template state
6. **templateStore.ts** - Local storage management

### Data Structure

```typescript
interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: 'landing' | 'blog' | 'ecommerce' | 'portfolio' | 'custom';
  thumbnail: string; // Base64 or URL
  structure: PageElement[]; // Full page structure
  styles: GlobalStyles; // Global page styles
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
  isDefault?: boolean; // Pre-made templates
}

interface PageElement {
  id: string;
  type: string;
  content?: string;
  styles: ElementStyles;
  children?: PageElement[];
}

interface ElementStyles {
  typography?: TypographySettings;
  color?: ColorSettings;
  spacing?: SpacingSettings;
  border?: BorderSettings;
  background?: BackgroundSettings;
  shadow?: ShadowSettings;
}
```

---

## Implementation Phases

### Phase 5.1: Template Data Layer (Day 1, Morning)

**Files to Create:**
- `src/types/template.ts` - TypeScript interfaces
- `src/lib/templateStore.ts` - Local storage utilities
- `src/lib/templateDefaults.ts` - 10 pre-made templates
- `src/hooks/useTemplates.ts` - Template state management hook

**Tasks:**
1. Define complete type system
2. Implement localStorage CRUD operations
3. Create 10 default templates:
   - Blank Page
   - Hero Landing
   - Feature Showcase
   - Blog Post
   - Product Page
   - Pricing Table
   - Contact Form
   - Portfolio Grid
   - About Page
   - FAQ Page

**Deliverables:**
- Type-safe template interfaces
- Persistent storage with validation
- 10 ready-to-use templates

---

### Phase 5.2: Template UI Components (Day 1, Afternoon)

**Files to Create:**
- `src/components/page-builder/templates/TemplateLibrary.tsx`
- `src/components/page-builder/templates/TemplateCard.tsx`
- `src/components/page-builder/templates/TemplatePreview.tsx`
- `src/components/page-builder/templates/TemplateCategoryFilter.tsx`

**Tasks:**
1. Build template library grid layout
2. Create template card with thumbnail and metadata
3. Implement preview modal with zoom
4. Add category filtering (All/Landing/Blog/etc.)
5. Add search functionality

**UI Features:**
- Masonry/Grid layout for templates
- Hover effects showing quick actions
- Preview button → opens modal
- Use button → applies template
- Delete button (custom only)
- Export button → downloads JSON

**Deliverables:**
- Beautiful template browser UI
- Smooth preview experience
- Intuitive filtering and search

---

### Phase 5.3: Template Operations (Day 2, Morning)

**Files to Create:**
- `src/lib/templateManager.ts` - Template business logic
- `src/components/page-builder/templates/SaveTemplateDialog.tsx`
- `src/components/page-builder/templates/ImportTemplateDialog.tsx`

**Tasks:**
1. Implement save current page as template
2. Add import from JSON file
3. Add export to JSON file
4. Template validation and error handling
5. Duplicate detection and versioning

**Operations:**
- **Save Template**: Capture current page structure + styles
- **Load Template**: Apply template to canvas (with confirmation)
- **Delete Template**: Remove custom template (prevent default deletion)
- **Export Template**: Generate JSON file download
- **Import Template**: Parse and validate JSON upload
- **Duplicate Template**: Clone existing template

**Deliverables:**
- Complete template CRUD
- Import/export functionality
- Data validation

---

### Phase 5.4: Integration & Polish (Day 2, Afternoon)

**Files to Update:**
- `EditorToolbar.tsx` - Add "Templates" button
- `FullScreenPageBuilder.tsx` - Integrate template system
- `RightPanel.tsx` - Add "Save as Template" action

**Tasks:**
1. Add template library button to toolbar
2. Add "Save as Template" to page actions
3. Implement template application logic
4. Add confirmation dialogs for destructive actions
5. Add toast notifications for operations
6. Add keyboard shortcuts (Ctrl+Shift+S for save template)

**Polish:**
- Loading states for operations
- Success/error feedback
- Smooth transitions
- Empty states (no templates yet)
- Responsive design for template library

**Deliverables:**
- Seamless integration
- Professional UX
- Complete feature set

---

## Pre-made Templates Design

### 1. Blank Page
- Single container
- Minimal styles
- Starting point for custom designs

### 2. Hero Landing
- Full-screen hero section with CTA
- Features grid (3 columns)
- Footer

### 3. Feature Showcase
- Header with navigation
- Feature cards with icons
- Testimonial section
- CTA section

### 4. Blog Post
- Article header (title, author, date)
- Content sections with typography
- Sidebar with related posts
- Comment section

### 5. Product Page
- Product gallery
- Product details
- Add to cart section
- Related products

### 6. Pricing Table
- Pricing cards (3 tiers)
- Feature comparison
- FAQ accordion
- CTA buttons

### 7. Contact Form
- Contact form fields
- Map section
- Contact information
- Social links

### 8. Portfolio Grid
- Project grid (masonry)
- Project filters
- Project details modal
- About section

### 9. About Page
- Team member cards
- Company timeline
- Mission/Vision sections
- Contact CTA

### 10. FAQ Page
- FAQ accordion
- Search bar
- Category filters
- Contact support CTA

---

## Technical Considerations

### Storage Strategy
- **localStorage**: Store templates locally (limit ~5MB)
- **Format**: JSON with compression for large templates
- **Fallback**: IndexedDB for larger storage needs

### Performance
- Lazy load template thumbnails
- Virtualize template list for 100+ templates
- Debounce search input
- Cache template data

### Data Validation
- JSON schema validation on import
- Type checking with Zod or similar
- Version compatibility checks
- Sanitize user input

### Error Handling
- Invalid JSON import
- Storage quota exceeded
- Corrupted template data
- Missing required fields

---

## Success Metrics

**Phase 5 Complete When:**
- ✅ 10 pre-made templates available
- ✅ Users can save current page as template
- ✅ Users can load templates to canvas
- ✅ Users can import/export JSON files
- ✅ Templates persist across sessions
- ✅ Category filtering works
- ✅ Search works
- ✅ Preview modal works
- ✅ 0 TypeScript errors
- ✅ Responsive UI
- ✅ Professional UX with feedback

---

## Timeline

**Day 1 (6-8 hours):**
- Morning: Phase 5.1 - Data layer + default templates (3-4 hours)
- Afternoon: Phase 5.2 - UI components (3-4 hours)

**Day 2 (6-8 hours):**
- Morning: Phase 5.3 - Operations (3-4 hours)
- Afternoon: Phase 5.4 - Integration & polish (3-4 hours)

**Total: 12-16 hours estimated**

---

## Next Steps

1. Create type definitions (`template.ts`)
2. Build template storage layer (`templateStore.ts`)
3. Create 10 default templates (`templateDefaults.ts`)
4. Build template hook (`useTemplates.ts`)
5. Create UI components
6. Integrate with PageBuilder
7. Test and polish

Let's begin! 🚀
