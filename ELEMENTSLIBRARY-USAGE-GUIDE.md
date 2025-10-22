# ElementsLibrary - Usage Guide

## 🎯 Quick Start

The refactored ElementsLibrary now provides a professional, senior-level interface for selecting page elements.

### Basic Usage

1. **Open the Page Builder** → Elements panel appears on the left
2. **Search** → Type to find elements by name or description
3. **Browse** → Expand categories using the chevron (▼) buttons
4. **Add Element**:
   - Double-click any element to add it directly
   - Drag element to canvas for placement

## 📋 Features Explained

### Search

```
[🔍 Search elements...]
```

- Searches element **names** and **descriptions**
- Real-time filtering
- Shows count of matching elements
- Type to filter:
  - "text" → finds Text element
  - "horizontal" → finds Flex Row
  - "product" → finds Product List, Product Detail

### Category Management

Each category can be **expanded** or **collapsed**:

```
⚡ Basic Elements          [5] ▼
   Description of category
   ├─ [⚡] Text
   ├─ [Aa] Heading
   └─ ...

📐 Layout                  [5] ▲
   (collapsed)
```

- **▼** = Collapsed (click to expand)
- **▲** = Expanded (click to collapse)
- Shows count in badge
- Default: Basic and Layout expanded

### Element Badges

#### 🔥 Hot Badge (Red)
Frequently used elements:
- Text
- Button
- Section

**Use these** for most common layouts.

#### ✨ New Badge (Blue)
Recently added elements:
- Carousel

**Try these** for latest features.

### Element Descriptions

Each element shows:
- **Name**: What is it called?
- **Description**: What does it do?
- **Popularity**: Is it hot or new?

Example:
```
[⚡] Text
    Rich text content
```

## 🎨 How to Add Elements

### Method 1: Double-Click (Fast)

```
1. Find element in list
2. Double-click the element
3. Element adds to canvas instantly
✨ Shows "Adding..." animation
✅ Best for quick workflow
```

### Method 2: Drag to Canvas (Precise)

```
1. Find element in list
2. Click and hold on element
3. Drag to canvas
4. Drop at desired position
✨ Shows "Dragging..." animation
✅ Best for placing at specific location
```

## 🔍 Searching Tips

### Find by Name
```
Search: "text"
Results: Text element
```

### Find by Description
```
Search: "media"
Results: Image, Video, Carousel
```

### Find by Category
```
Search: "flex"
Results: Flex Row, Flex Column
```

### Partial Matching
```
Search: "prod"
Results: Product List, Product Detail
```

## 📊 Understanding Categories

### ⚡ Basic Elements
For fundamental page content:
- Text blocks
- Headings
- Buttons
- Images
- Dividers

**When to use:** Starting a page, adding content

### 📐 Layout
For page structure:
- Sections
- Grids
- Flex containers
- Spacers

**When to use:** Organizing content, responsive design

### 🎨 Content
For rich media:
- Carousels
- Videos
- Team showcase
- Statistics

**When to use:** Engaging visitors, showing data

### 🏪 E-commerce
For product features:
- Product List
- Product Detail

**When to use:** Selling products

### ✨ Advanced
For complex features:
- Custom components
- Integrations

**When to use:** Advanced layouts

## 💡 Pro Tips

### Tip 1: Start with Basic Elements
```
1. Add Text for heading
2. Add Button for CTA
3. Add Section for grouping
```

### Tip 2: Use Sections for Organization
```
Section (container)
├─ Text (heading)
├─ Paragraph (content)
└─ Button (CTA)
```

### Tip 3: Grid for Multi-Column Layouts
```
Grid (auto-columns)
├─ Image 1
├─ Image 2
└─ Image 3
```

### Tip 4: Search Instead of Scroll
```
Rather than expanding all categories,
use search to find what you need quickly
```

### Tip 5: Drag for Precise Placement
```
When you need element at specific spot,
use drag instead of double-click
```

## 🎯 Common Workflows

### Workflow 1: Create a Landing Page

```
1. Search: "section"
2. Double-click: Section
3. Search: "text"
4. Double-click: Text (for heading)
5. Drag: Button to same section
6. Search: "grid"
7. Double-click: Grid (for gallery)
Result: Professional landing page structure
```

### Workflow 2: Build Product Page

```
1. Double-click: Section
2. Double-click: Text (title)
3. Expand: E-commerce category
4. Drag: Product Detail to canvas
5. Double-click: Button (Buy now)
Result: Product showcase
```

### Workflow 3: Create Team Page

```
1. Double-click: Section
2. Double-click: Text (Team heading)
3. Expand: Content category
4. Double-click: Team showcase
Result: Team member display
```

## 🔧 Customization

### Collapsing Categories

Click the chevron to collapse:
```
⚡ Basic Elements [5] ▼
                        ↓ Click
⚡ Basic Elements [5] ▲ (hidden)
```

**Pro tip**: Collapsed categories take less space!

### Searching While Collapsed

Even collapsed categories appear in search:
```
Search: "carousel"
↓
🎨 Content [4] ▼
├─ [🖼] Carousel ✨ New
                (appears even if Content was collapsed)
```

## ⚙️ Settings

### Default Expanded Categories
Currently: "Basic" and "Layout"

To change, modify:
```tsx
const defaultExpanded = new Set(['basic', 'layout']);
```

### Adding New Element
```tsx
const element = {
  id: BlockType.NEW_ELEMENT,
  icon: IconComponent,
  label: 'Element Name',
  description: 'What it does',
  category: 'basic',
  popularity: 'new' // or 'hot' or null
};
elements.push(element);
```

### Marking as Hot/New
```tsx
// Hot (frequently used)
popularity: 'hot'

// New (recently added)
popularity: 'new'

// No badge
popularity: null
```

## 🆘 Troubleshooting

### Issue: Can't find element
**Solution**: 
- Try searching by different keywords
- Check if category is expanded
- Element might be in different category than expected

### Issue: Search not working
**Solution**:
- Clear search box
- Try shorter keywords
- Check spelling

### Issue: Double-click not adding
**Solution**:
- Wait for animation to complete
- Check if element added to canvas
- Try drag instead

### Issue: Drag not working
**Solution**:
- Make sure you're clicking and holding
- Drag clearly to canvas area
- Try double-click instead

## 📱 Mobile Usage

On mobile devices:
- ✅ Search still works great
- ✅ Categories expand/collapse
- ✅ Double-click is easier than drag
- ✅ Responsive layout adapts

**Tip**: Use double-click on mobile for best experience

## 🎓 Learning Path

### Beginner
1. Read this guide
2. Double-click to add elements
3. Use Basic Elements
4. Expand categories as needed

### Intermediate
1. Use drag-and-drop for placement
2. Combine categories
3. Use Section for organization
4. Search for specific elements

### Advanced
1. Use Grid for complex layouts
2. Nest containers
3. Combine multiple categories
4. Create reusable layouts

## 🚀 Performance Notes

- **Optimized search**: Only filters when you type
- **Smart grouping**: Only updates when needed
- **Memoized rendering**: Prevents unnecessary re-renders
- **Smooth animations**: 200ms transitions

## ✅ Checklist for Best Results

- [x] Understand Basic vs Layout categories
- [x] Know where to find e-commerce elements
- [x] Can search by name and description
- [x] Comfortable with double-click method
- [x] Can drag elements to canvas
- [x] Know how to expand/collapse categories
- [x] Understand hot/new badges
- [x] Can read element descriptions

## 📞 Need Help?

- **Quick question**: Check this guide
- **Report issue**: Check Troubleshooting section
- **Feature request**: Contact development team
- **Tutorial**: See Learning Path section

---

**Version**: Senior-Level Refactor v1  
**Last Updated**: October 2025  
**Status**: Ready to use ✅

