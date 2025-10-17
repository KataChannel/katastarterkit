# 📊 PageBuilder Dialog Architecture

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  /admin/pagebuilder                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  📄 Page Builder                          [+ New Page] │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │                                                         │  │
│  │  🔍 Search pages...                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │  Home Page  │  │  About Us   │  │  Products   │   │  │
│  │  │  /home      │  │  /about-us  │  │  /products  │   │  │
│  │  │  [Edit][👁️] │  │  [Edit][👁️] │  │  [Edit][👁️] │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Dialog Overlay (When editing)                      │   │
│  │  ╔═════════════════════════════════════════════════╗│   │
│  │  ║  PageBuilder Editor (Fullscreen)                ║│   │
│  │  ║  ──────────────────────────────────────────────  ║│   │
│  │  ║  [🔙][💾][👁️][📱][💻][⛶]                        ║│   │
│  │  ║  ──────────────────────────────────────────────  ║│   │
│  │  ║                                                   ║│   │
│  │  ║  [Canvas Area with Blocks]                       ║│   │
│  │  ║                                                   ║│   │
│  │  ║  ┌──────────────────────────┐                   ║│   │
│  │  ║  │  Hero Block              │                   ║│   │
│  │  ║  └──────────────────────────┘                   ║│   │
│  │  ║  ┌──────────────────────────┐                   ║│   │
│  │  ║  │  Section Block           │                   ║│   │
│  │  ║  └──────────────────────────┘                   ║│   │
│  │  ║                                                   ║│   │
│  │  ╚═════════════════════════════════════════════════╝│   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
AdminPageBuilderPage
│
└── Suspense (Loading Fallback)
    │
    └── PageBuilderContent
        │
        ├── Page List UI (Always Rendered)
        │   │
        │   ├── Header
        │   │   ├── Title: "Page Builder"
        │   │   └── Button: "New Page"
        │   │
        │   ├── Search Input
        │   │
        │   └── Grid of Page Cards
        │       ├── Card 1: Home
        │       ├── Card 2: About Us
        │       └── Card 3: Products
        │
        └── Dialog (Conditional Visibility)
            │
            ├── DialogOverlay (Dark backdrop)
            │
            └── DialogContent (Fullscreen)
                │
                └── FullScreenPageBuilder
                    │
                    ├── EditorToolbar
                    ├── Canvas
                    └── BlocksList
```

## State Flow Diagram

```
Initial State (Page List)
      │
      ├─── User clicks "New Page"
      │    └─→ setIsEditorOpen(true) ─→ Dialog Opens
      │
      ├─── User clicks "Edit" on page
      │    └─→ router.push('?pageId=xxx')
      │         └─→ useEffect detects pageId
      │              └─→ setIsEditorOpen(true) ─→ Dialog Opens
      │
      └─── User navigates to /admin/pagebuilder?pageId=xxx
           └─→ useEffect detects pageId
                └─→ setIsEditorOpen(true) ─→ Dialog Opens

Dialog Open State
      │
      ├─── User presses ESC
      │    └─→ Dialog.onOpenChange(false)
      │         └─→ handleCloseEditor()
      │              ├─→ setIsEditorOpen(false)
      │              ├─→ router.push('/admin/pagebuilder')
      │              └─→ refetch() ─→ Dialog Closes
      │
      ├─── User clicks backdrop
      │    └─→ [Same as ESC]
      │
      └─── User clicks close button in toolbar
           └─→ onExit() called
                └─→ handleCloseEditor()
                     └─→ [Same as ESC]
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Component Lifecycle                                         │
└─────────────────────────────────────────────────────────────┘

Mount
  ↓
usePages() fetches page list
  ↓
Render page list
  ↓
[Wait for user action]
  ↓
User clicks "Edit" on page
  ↓
URL changes: /admin/pagebuilder?pageId=xxx
  ↓
useEffect detects pageId
  ↓
setIsEditorOpen(true)
  ↓
Dialog renders
  ↓
FullScreenPageBuilder mounts with pageId
  ↓
FullScreenPageBuilder fetches page data
  ↓
User edits blocks
  ↓
Auto-save triggers (every 30s)
  ↓
User closes dialog
  ↓
handleCloseEditor() called
  ↓
setIsEditorOpen(false)
  ↓
Dialog unmounts
  ↓
FullScreenPageBuilder cleanup
  ↓
router.push('/admin/pagebuilder')
  ↓
refetch() - Refresh page list
  ↓
Page list re-renders with updated data
  ↓
[Back to waiting for user action]
```

## Z-Index Stack

```
Layer 5: Dialog Content          (z-index: 50)
         └── FullScreenPageBuilder
             └── Editor UI
                 └── Dropdowns, Tooltips
──────────────────────────────────────────────
Layer 4: Dialog Overlay          (z-index: 50)
         └── Semi-transparent backdrop
──────────────────────────────────────────────
Layer 3: Page List UI            (z-index: auto)
         └── Cards, Buttons
──────────────────────────────────────────────
Layer 2: Header                  (z-index: auto)
         └── Title, Search
──────────────────────────────────────────────
Layer 1: Background              (z-index: auto)
         └── Gray background
```

## Event Propagation

```
User Action → Component → Handler → State Update → UI Update

Click "New Page"
  → Button in Header
    → handleCreateNewPage()
      → setIsEditorOpen(true)
        → Dialog opens (empty editor)

Click "Edit" on card
  → Button in Card
    → handleEditPage(pageId)
      → router.push('?pageId=xxx')
        → URL changes
          → useEffect triggers
            → setIsEditorOpen(true)
              → Dialog opens (with page data)

Press ESC key
  → Dialog component
    → onOpenChange(false)
      → handleCloseEditor()
        → setIsEditorOpen(false) + router.push() + refetch()
          → Dialog closes + URL updates + List refreshes

Click Backdrop
  → DialogOverlay
    → [Same as ESC]

Click Close in Editor
  → EditorToolbar Button
    → onExit prop
      → handleCloseEditor()
        → [Same as ESC]
```

## Performance Optimization

```
┌─────────────────────────────────────────────┐
│  Optimization Strategy                      │
└─────────────────────────────────────────────┘

Page List Component
  ├── Always mounted (no remount cost)
  ├── Data cached by React Query
  └── Only refetches on dialog close

Dialog Component
  ├── Lazy renders content
  ├── Only mounts when open=true
  └── Smooth CSS transitions (GPU accelerated)

FullScreenPageBuilder
  ├── Code-split with dynamic import
  ├── Mounts only when dialog opens
  ├── Auto-save debounced (30s)
  └── Cleanup on unmount

Data Fetching
  ├── usePages() - Cached, background refresh
  ├── usePage(id) - Individual page data
  └── refetch() - Manual refresh on demand
```

## Mobile Responsiveness

```
Desktop (>= 1024px)
┌─────────────────────────────────┐
│  [Header]                       │
│  [Search]                       │
│  ┌───────┐ ┌───────┐ ┌───────┐ │
│  │ Card  │ │ Card  │ │ Card  │ │ (3 columns)
│  └───────┘ └───────┘ └───────┘ │
│  ┌───────┐ ┌───────┐ ┌───────┐ │
│  │ Card  │ │ Card  │ │ Card  │ │
│  └───────┘ └───────┘ └───────┘ │
└─────────────────────────────────┘

Tablet (768px - 1023px)
┌─────────────────────────────────┐
│  [Header]                       │
│  [Search]                       │
│  ┌───────────┐ ┌───────────┐   │
│  │   Card    │ │   Card    │   │ (2 columns)
│  └───────────┘ └───────────┘   │
│  ┌───────────┐ ┌───────────┐   │
│  │   Card    │ │   Card    │   │
│  └───────────┘ └───────────┘   │
└─────────────────────────────────┘

Mobile (< 768px)
┌─────────────────┐
│  [Header]       │
│  [Search]       │
│  ┌───────────┐  │
│  │   Card    │  │ (1 column)
│  └───────────┘  │
│  ┌───────────┐  │
│  │   Card    │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │   Card    │  │
│  └───────────┘  │
└─────────────────┘

Dialog (All Sizes)
┌─────────────────┐
│ ╔═════════════╗ │
│ ║  Fullscreen ║ │ (100vw x 100vh)
│ ║   Editor    ║ │
│ ╚═════════════╝ │
└─────────────────┘
```

## Error Handling Flow

```
Error Scenarios
│
├── Network Error
│   └─→ usePages() returns error
│       └─→ Show error card with retry button
│           └─→ Page list not rendered
│
├── Invalid pageId
│   └─→ FullScreenPageBuilder handles error
│       └─→ Shows "Page not found" in dialog
│           └─→ User can close and return to list
│
├── Save Error
│   └─→ Auto-save fails
│       └─→ Toast notification shows error
│           └─→ Manual save button available
│               └─→ Can retry or discard changes
│
└── Render Error
    └─→ ErrorBoundary catches error
        └─→ Shows error UI with reload option
            └─→ User can reload or report issue
```

## Keyboard Shortcuts

```
Keyboard Shortcut Map
│
├── ESC
│   └─→ Close dialog (from Dialog component)
│
├── F11
│   └─→ Toggle browser fullscreen (from FullScreenPageBuilder)
│
├── Ctrl + Shift + F
│   └─→ Toggle fullscreen mode (from FullScreenPageBuilder)
│
├── Ctrl + S
│   └─→ Manual save (from FullScreenPageBuilder)
│
└── Ctrl + Z / Ctrl + Y
    └─→ Undo / Redo (from FullScreenPageBuilder)
```

---

**Legend:**
- 🔙 Back button
- 💾 Save button  
- 👁️ Preview button
- 📱 Mobile view
- 💻 Desktop view
- ⛶ Fullscreen toggle
- [+] Create new
- [Edit] Edit button
