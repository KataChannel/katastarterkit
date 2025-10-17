# 📚 Template Library User Guide

## How to Use the Template Library

### 1. Accessing Templates
1. Open PageBuilder
2. Look for the sidebar on the left
3. Click on the "Templates" tab (next to "Blocks")

### 2. Browsing Templates
- **Search**: Use the search box to find templates by name or description
- **Filter**: Use the category dropdown to filter by type (Hero, Features, etc.)
- **Thumbnails**: Each template shows a preview thumbnail

### 3. Using Templates
- **Preview**: Click "Preview" button to see template structure
- **Apply**: Click "Apply" to add template blocks to your page
- **Delete**: Click trash icon to delete custom templates (only)

### 4. Creating Custom Templates
1. Build your page with blocks
2. Click "Save as Template" in the toolbar
3. Fill in name, description, and category
4. Click "Save"

### 5. Template Categories
- **Hero**: Header/banner sections
- **Features**: Feature showcase sections
- **Pricing**: Pricing tables and plans
- **Team**: Team member displays
- **Contact**: Contact forms and info
- **Custom**: Your saved templates

## Troubleshooting

### Templates Not Showing
1. Check browser console for errors
2. Verify localStorage is enabled
3. Try refreshing the page
4. Clear browser cache

### Templates Not Applying
1. Ensure page is saved first (for new pages)
2. Check for validation errors
3. Try applying one block at a time

### Can't Save Templates
1. Verify localStorage permissions
2. Check form validation
3. Ensure all required fields are filled

## Browser Debug Tools

Open browser console and run:
```javascript
// Check templates
window.templateDebug.checkTemplates();

// Clear all templates
window.templateDebug.clearTemplates();

// Add test template
window.templateDebug.addTestTemplate();
```

## Support

If issues persist:
1. Check browser DevTools Console tab
2. Check Application tab → Local Storage
3. Try in incognito/private browsing mode
4. Report specific error messages
