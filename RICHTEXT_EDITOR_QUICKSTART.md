# BlockType.TEXT - Rich Text Editor Quick Start

## What Changed?

The TEXT block in the page builder has been upgraded from a basic text input to a **full-featured rich text editor** with professional formatting capabilities.

## How to Use

### Adding a Text Block

**Method 1: Drag & Drop**
1. Locate "Text" in the Elements Library (under "Basic Elements")
2. Drag it onto your canvas
3. Click the "Edit" button to start editing

**Method 2: Double-Click**
1. Double-click the "Text" element in the Elements Library
2. It's automatically added to your canvas
3. Click "Edit" to start formatting

### Editing Text with Rich Formatting

Once in edit mode, you'll see the rich text editor with a toolbar:

```
┌─────────────────────────────────────────────────────────┐
│ [B] [I] [U] [S] | [H1] [H2] [H3] | [•] [1.] | [" ] [{}] │
│ [Link] [Image] | [↶] [↷]                                 │
└─────────────────────────────────────────────────────────┘
│                                                           │
│  Your rich text content goes here...                      │
│  You can format it with the toolbar above                 │
│                                                           │
├─────────────────────────────────────────────────────────┤
│                                [Cancel]  [Save]          │
└─────────────────────────────────────────────────────────┘
```

### Available Formatting Options

| Icon | Action | Keyboard Shortcut |
|------|--------|-------------------|
| **B** | Bold | Ctrl+B (Cmd+B) |
| *I* | Italic | Ctrl+I (Cmd+I) |
| U | Underline | |
| ~~S~~ | Strikethrough | |
| H1 | Heading 1 | |
| H2 | Heading 2 | |
| H3 | Heading 3 | |
| • | Bullet List | |
| 1. | Ordered List | |
| " | Blockquote | |
| {} | Code Block | |
| Link | Add Hyperlink | |
| Image | Insert Image | |
| ↶ | Undo | Ctrl+Z (Cmd+Z) |
| ↷ | Redo | Ctrl+Shift+Z (Cmd+Shift+Z) |

### Adding Links

1. Select the text you want to make a link
2. Click the **Link** button (🔗) in the toolbar
3. Enter the URL when prompted (e.g., `https://example.com`)
4. The text becomes a clickable link

### Adding Images

1. Click the **Image** button (🖼) in the toolbar
2. Enter the image URL when prompted
3. The image is inserted at the cursor position
4. Supports: JPG, PNG, GIF, WebP, etc.

### Example Content Structures

**Blog Post Style**
```
# Welcome to My Blog

## Introduction

This is **bold text** and this is *italic text*.

### Key Points:
• First point with **emphasis**
• Second point with a [link](https://example.com)
• Third point with more content

## Conclusion

Here's a blockquote:

> "The only way to do great work is to love what you do." - Steve Jobs

For more information, visit our website.
```

**Product Description**
```
# Premium Widget

**Price**: $99.99

## Features

1. Long-lasting battery (48 hours)
2. Waterproof design
3. Fast charging support
4. **Limited time offer** - 20% off!

## Technical Specs

```
Model: Widget Pro v2
Dimensions: 10cm x 5cm x 2cm
Weight: 150g
```

[Buy Now](https://shop.example.com)
```

## Display Mode

Once you save your content, it displays in view mode with all formatting applied:

```
┌─────────────────────────────────────────┐
│                                         │
│  # Your Formatted Heading               │
│                                         │
│  This is **bold** and *italic* text.    │
│                                         │
│  • Bullet point 1                       │
│  • Bullet point 2                       │
│                                         │
│  [Click for more...](https://...)       │
│                                         │
│  [Edit] [Delete]  ← Hover to see buttons│
│                                         │
└─────────────────────────────────────────┘
```

## Tips & Tricks

### 1. **Fast Editing with Keyboard**
- Select text and press Ctrl+B for bold
- Use Ctrl+Z to undo mistakes
- Use Ctrl+Shift+Z to redo

### 2. **Copy & Paste**
- Copy formatted text from Word, Google Docs, etc.
- Paste it directly into the editor
- Formatting is automatically preserved

### 3. **Lists**
- Click bullet list button to create a list
- Press Enter to add new items
- Press Backspace twice to exit the list

### 4. **Code Blocks**
- Click the code block button `{}`
- Great for showing code, formulas, or technical content
- Supports monospace font automatically

### 5. **Heading Hierarchy**
- Use H1 for main title
- Use H2 for section headers
- Use H3 for subsections
- Maintains proper document structure

## Keyboard Shortcuts Reference

### Formatting
- `Ctrl+B` / `Cmd+B` - **Bold**
- `Ctrl+I` / `Cmd+I` - *Italic*
- `Ctrl+U` / `Cmd+U` - Underline
- `Ctrl+Shift+X` - ~~Strikethrough~~

### Undo/Redo
- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` - Redo

### Block Elements
- `Ctrl+Alt+1` to `Ctrl+Alt+3` - Heading levels 1-3
- `Ctrl+Shift+B` - Bullet list
- `Ctrl+Shift+O` - Ordered list

## Common Issues & Solutions

### Issue: Formatting not saved
**Solution**: Click the "Save" button at the bottom of the editor. Red X means unsaved changes.

### Issue: Link doesn't work
**Solution**: Make sure you included the full URL with `https://` prefix.

### Issue: Image won't load
**Solution**: Check that the image URL is correct and publicly accessible.

### Issue: Text looks too small
**Solution**: Use H1, H2, or H3 headings for larger text, or increase font size in block styling.

### Issue: Lost my formatting
**Solution**: Use Ctrl+Z to undo recent changes. You have full undo/redo history.

## What's Different from Before?

### Old TEXT Block
- ❌ Simple textarea
- ❌ Limited to plain text
- ❌ No formatting options
- ❌ No undo/redo
- ❌ Poor user experience

### New TEXT Block (Rich Text Editor)
- ✅ Professional editor with toolbar
- ✅ Full HTML formatting support
- ✅ 20+ formatting options
- ✅ Complete undo/redo history
- ✅ Enterprise-grade experience

## Next Steps

1. **Create your first text block** - Drag the TEXT element to your page
2. **Explore the toolbar** - Try each formatting option
3. **Add links and images** - Make your content interactive
4. **Style your blocks** - Adjust colors, sizes, spacing
5. **Save and preview** - See how it looks on your published page

## Need Help?

- **Hover over toolbar buttons** - Tooltips explain each function
- **Check documentation** - See `/BLOCKTYPE_TEXT_UPGRADE.md` for technical details
- **Keyboard shortcuts** - Use Ctrl+B, Ctrl+I, Ctrl+Z for common operations

---

**Version**: 1.0.0  
**Last Updated**: October 23, 2025  
**Status**: ✅ Production Ready
