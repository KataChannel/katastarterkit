# 🏗️ PageBuilder Senior Architecture - Full Specification

**Date**: 14 October 2025  
**Version**: 3.0 (Professional Edition)  
**Status**: 🚧 In Progress

---

## 🎯 Overview

Cấu trúc lại PageBuilder theo chuẩn professional với:
- ✅ Full-screen editing mode
- ✅ Visual/Backend editor modes
- ✅ Advanced panel system
- ✅ Comprehensive component library
- ✅ Responsive controls
- ✅ Template system
- ✅ Advanced features (animation, global settings, undo/redo)

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        TOP TOOLBAR                              │
│  [Logo] [Mode: Visual/Code] [Device: 📱💻] [Undo/Redo] [Save]  │
├──────────┬────────────────────────────────────────┬─────────────┤
│          │                                        │             │
│   LEFT   │           CANVAS (Live Preview)        │    RIGHT    │
│   PANEL  │                                        │    PANEL    │
│          │                                        │             │
│ Elements │  ┌──────────────────────────────┐     │  Settings   │
│ Library  │  │                              │     │  & Styles   │
│          │  │      Your Content Here       │     │             │
│ + Basic  │  │                              │     │ Typography  │
│ + Layout │  │      Drag & Drop Zone        │     │ Colors      │
│ + Content│  │                              │     │ Spacing     │
│ + Adv.   │  │                              │     │ Advanced    │
│          │  └──────────────────────────────┘     │             │
│          │                                        │             │
│ Templates│                                        │ Responsive  │
│ Saved    │                                        │ [D] [T] [M] │
│          │                                        │             │
├──────────┴────────────────────────────────────────┴─────────────┤
│                      BOTTOM FOOTER                              │
│  [Structure Tree] [Layers] [History] [Help] [Exit Fullscreen]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Component Structure

```
frontend/src/components/page-builder/
├── PageBuilder.tsx                    # Main entry (already exists)
├── FullScreenPageBuilder.tsx          # NEW: Full-screen wrapper
│
├── layout/                            # NEW: Layout components
│   ├── FullScreenLayout.tsx          # Full-screen container
│   ├── EditorToolbar.tsx             # Top toolbar
│   ├── EditorCanvas.tsx              # Center canvas area
│   ├── EditorFooter.tsx              # Bottom footer
│   └── index.ts
│
├── panels/                            # NEW: Side panels
│   ├── LeftPanel/
│   │   ├── LeftPanel.tsx             # Main left panel
│   │   ├── ElementsLibrary.tsx       # Components library
│   │   ├── TemplatesLibrary.tsx      # Pre-made templates
│   │   ├── SavedBlocks.tsx           # User saved blocks
│   │   └── index.ts
│   │
│   ├── RightPanel/
│   │   ├── RightPanel.tsx            # Main right panel
│   │   ├── StylePanel.tsx            # Style editor
│   │   ├── SettingsPanel.tsx         # Block settings
│   │   ├── ResponsivePanel.tsx       # Device-specific settings
│   │   └── index.ts
│   │
│   └── index.ts
│
├── elements/                          # NEW: Element categories
│   ├── basic/                        # Basic elements
│   │   ├── TextElement.tsx
│   │   ├── HeadingElement.tsx
│   │   ├── ImageElement.tsx
│   │   ├── ButtonElement.tsx
│   │   └── IconElement.tsx
│   │
│   ├── layout/                       # Layout elements
│   │   ├── SectionElement.tsx
│   │   ├── RowElement.tsx
│   │   ├── ColumnElement.tsx
│   │   └── SpacerElement.tsx
│   │
│   ├── content/                      # Content elements
│   │   ├── SliderElement.tsx
│   │   ├── GalleryElement.tsx
│   │   ├── VideoElement.tsx
│   │   ├── FormElement.tsx
│   │   └── TestimonialElement.tsx
│   │
│   ├── advanced/                     # Advanced elements
│   │   ├── AccordionElement.tsx
│   │   ├── TabsElement.tsx
│   │   ├── CountdownElement.tsx
│   │   ├── ProgressBarElement.tsx
│   │   └── TimelineElement.tsx
│   │
│   └── index.ts
│
├── editors/                           # NEW: Style editors
│   ├── TypographyEditor.tsx
│   ├── ColorEditor.tsx
│   ├── SpacingEditor.tsx
│   ├── BorderEditor.tsx
│   ├── BackgroundEditor.tsx
│   ├── ShadowEditor.tsx
│   ├── AnimationEditor.tsx
│   └── index.ts
│
├── features/                          # NEW: Advanced features
│   ├── DevicePreview.tsx             # Device switcher
│   ├── UndoRedo.tsx                  # History manager
│   ├── StructureTree.tsx             # DOM tree view
│   ├── LayersPanel.tsx               # Layers panel
│   ├── HistoryPanel.tsx              # Action history
│   ├── GlobalSettings.tsx            # Site-wide settings
│   └── index.ts
│
├── templates/                         # Template system
│   ├── TemplateCard.tsx
│   ├── TemplateImporter.tsx
│   ├── TemplateExporter.tsx
│   └── index.ts
│
└── blocks/                            # Existing blocks (keep)
    ├── TextBlock.tsx
    ├── ImageBlock.tsx
    ├── CarouselBlock.tsx
    └── ...
```

---

## 🎨 1. Full-Screen Layout

### FullScreenPageBuilder.tsx

**Features**:
- Full-screen mode toggle
- Escape key to exit
- Save state before entering
- Restore on exit

**Props**:
```typescript
interface FullScreenPageBuilderProps {
  pageId?: string;
  onExit?: () => void;
  initialMode?: 'visual' | 'code';
}
```

**Usage**:
```tsx
<FullScreenPageBuilder
  pageId="page-123"
  onExit={() => router.back()}
  initialMode="visual"
/>
```

---

## 🎛️ 2. Editor Modes

### Visual Editor (Default)
- Live WYSIWYG preview
- Drag & drop interface
- Click to select/edit
- Inline editing for text
- Visual style controls

### Code/Backend Editor
- Raw HTML/JSON view
- Syntax highlighting
- Schema validation
- Direct code editing
- Switch to visual anytime

**Mode Switcher**:
```tsx
<Tabs value={editorMode} onValueChange={setEditorMode}>
  <TabsList>
    <TabsTrigger value="visual">
      <Eye className="w-4 h-4 mr-2" />
      Visual
    </TabsTrigger>
    <TabsTrigger value="code">
      <Code className="w-4 h-4 mr-2" />
      Code
    </TabsTrigger>
  </TabsList>
</Tabs>
```

---

## 📚 3. Component Library (Left Panel)

### Categories

#### 🔤 Basic Elements
```typescript
const basicElements = [
  { id: 'text', icon: Type, label: 'Text', category: 'basic' },
  { id: 'heading', icon: Heading, label: 'Heading', category: 'basic' },
  { id: 'image', icon: Image, label: 'Image', category: 'basic' },
  { id: 'button', icon: MousePointer, label: 'Button', category: 'basic' },
  { id: 'icon', icon: Star, label: 'Icon', category: 'basic' },
  { id: 'divider', icon: Minus, label: 'Divider', category: 'basic' },
];
```

#### 📐 Layout Elements
```typescript
const layoutElements = [
  { id: 'section', icon: Square, label: 'Section', category: 'layout' },
  { id: 'row', icon: Columns, label: 'Row', category: 'layout' },
  { id: 'column', icon: Layout, label: 'Column', category: 'layout' },
  { id: 'spacer', icon: MoveVertical, label: 'Spacer', category: 'layout' },
  { id: 'grid', icon: Grid3x3, label: 'Grid', category: 'layout' },
];
```

#### 🎨 Content Elements
```typescript
const contentElements = [
  { id: 'carousel', icon: Images, label: 'Carousel', category: 'content' },
  { id: 'gallery', icon: Image, label: 'Gallery', category: 'content' },
  { id: 'video', icon: Video, label: 'Video', category: 'content' },
  { id: 'form', icon: FormInput, label: 'Form', category: 'content' },
  { id: 'testimonial', icon: Quote, label: 'Testimonial', category: 'content' },
  { id: 'team', icon: Users, label: 'Team', category: 'content' },
  { id: 'stats', icon: BarChart, label: 'Stats', category: 'content' },
];
```

#### ⚡ Advanced Elements
```typescript
const advancedElements = [
  { id: 'accordion', icon: ChevronDown, label: 'Accordion', category: 'advanced' },
  { id: 'tabs', icon: Tabs, label: 'Tabs', category: 'advanced' },
  { id: 'countdown', icon: Clock, label: 'Countdown', category: 'advanced' },
  { id: 'progress', icon: TrendingUp, label: 'Progress Bar', category: 'advanced' },
  { id: 'timeline', icon: GitBranch, label: 'Timeline', category: 'advanced' },
  { id: 'pricing', icon: DollarSign, label: 'Pricing Table', category: 'advanced' },
  { id: 'map', icon: MapPin, label: 'Map', category: 'advanced' },
];
```

### Drag & Drop Implementation
```typescript
// Using @dnd-kit
const { attributes, listeners, setNodeRef, transform } = useDraggable({
  id: element.id,
  data: {
    type: element.category,
    element: element,
  },
});

<div
  ref={setNodeRef}
  {...listeners}
  {...attributes}
  className="element-item"
>
  <element.icon className="w-5 h-5" />
  <span>{element.label}</span>
</div>
```

---

## 🎨 4. Style Panel (Right Panel)

### Typography Editor
```typescript
interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
}
```

### Color Editor
```typescript
interface ColorSettings {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string;
  opacity: number;
}
```

### Spacing Editor
```typescript
interface SpacingSettings {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  gap: number;
}
```

### Border Editor
```typescript
interface BorderSettings {
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  radius: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
}
```

### Background Editor
```typescript
interface BackgroundSettings {
  type: 'color' | 'gradient' | 'image' | 'video';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
  image?: {
    url: string;
    size: 'cover' | 'contain' | 'auto';
    position: string;
    repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    attachment: 'scroll' | 'fixed';
  };
  overlay?: {
    color: string;
    opacity: number;
  };
}
```

### Shadow Editor
```typescript
interface ShadowSettings {
  boxShadow: {
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    inset: boolean;
  }[];
  textShadow: {
    x: number;
    y: number;
    blur: number;
    color: string;
  }[];
}
```

### Animation Editor
```typescript
interface AnimationSettings {
  entrance: {
    effect: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
    duration: number;
    delay: number;
    easing: string;
  };
  hover: {
    effect: 'scale' | 'rotate' | 'translate' | 'none';
    duration: number;
  };
  scroll: {
    parallax: boolean;
    speed: number;
    sticky: boolean;
  };
}
```

---

## 📱 5. Responsive Controls

### Device Breakpoints
```typescript
const breakpoints = {
  mobile: { width: 375, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1440, icon: Monitor, label: 'Desktop' },
};
```

### Responsive Settings
```typescript
interface ResponsiveSettings {
  display: {
    mobile: 'block' | 'flex' | 'grid' | 'none';
    tablet: 'block' | 'flex' | 'grid' | 'none';
    desktop: 'block' | 'flex' | 'grid' | 'none';
  };
  fontSize: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  padding: {
    mobile: SpacingSettings;
    tablet: SpacingSettings;
    desktop: SpacingSettings;
  };
  // ... more responsive properties
}
```

### Device Preview
```tsx
<DevicePreview device={currentDevice}>
  <Canvas blocks={blocks} />
</DevicePreview>
```

---

## 📦 6. Template System

### Template Structure
```typescript
interface PageTemplate {
  id: string;
  name: string;
  category: 'landing' | 'homepage' | 'about' | 'contact' | 'blog' | 'custom';
  thumbnail: string;
  description: string;
  blocks: PageBlock[];
  globalSettings?: GlobalSettings;
  tags: string[];
  author?: string;
  createdAt: string;
  isPublic: boolean;
  downloadCount: number;
}
```

### Template Categories
- **Landing Pages**: Hero sections, CTAs, forms
- **Homepage**: Full homepage layouts
- **About**: Team, company info
- **Contact**: Contact forms, maps
- **Blog**: Blog layouts, post templates
- **E-commerce**: Product pages, checkout
- **Custom**: User-created templates

### Template Actions
```typescript
// Import template
const importTemplate = async (templateId: string) => {
  const template = await fetchTemplate(templateId);
  setBlocks(template.blocks);
  applyGlobalSettings(template.globalSettings);
};

// Export template
const exportTemplate = async () => {
  const template: PageTemplate = {
    name: templateName,
    category: selectedCategory,
    blocks: blocks,
    globalSettings: getGlobalSettings(),
    tags: tags,
  };
  await saveTemplate(template);
};

// Save as custom block
const saveAsBlock = (blockId: string) => {
  const block = findBlockById(blockId);
  const savedBlock = {
    ...block,
    id: generateId(),
    isSaved: true,
  };
  addToSavedBlocks(savedBlock);
};
```

---

## ⚙️ 7. Advanced Features

### Undo/Redo System
```typescript
interface HistoryState {
  past: PageBlock[][];
  present: PageBlock[];
  future: PageBlock[][];
}

const useHistory = () => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: [],
  });

  const undo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    setHistory({
      past: newPast,
      present: previous,
      future: [history.present, ...history.future],
    });
  };

  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: newFuture,
    });
  };

  return { undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0 };
};
```

### Global Settings
```typescript
interface GlobalSettings {
  typography: {
    primaryFont: string;
    secondaryFont: string;
    baseFontSize: number;
    headingScale: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  spacing: {
    baseUnit: number;
    containerWidth: number;
    sectionPadding: number;
  };
  effects: {
    borderRadius: number;
    boxShadow: string;
    transition: string;
  };
}
```

### Structure Tree View
```tsx
<StructureTree>
  <TreeItem id="section-1" label="Hero Section" icon={Square}>
    <TreeItem id="row-1" label="Row" icon={Columns}>
      <TreeItem id="col-1" label="Column 1/2" icon={Layout}>
        <TreeItem id="text-1" label="Heading" icon={Type} />
        <TreeItem id="button-1" label="CTA Button" icon={MousePointer} />
      </TreeItem>
      <TreeItem id="col-2" label="Column 2/2" icon={Layout}>
        <TreeItem id="image-1" label="Hero Image" icon={Image} />
      </TreeItem>
    </TreeItem>
  </TreeItem>
</StructureTree>
```

### Layers Panel
```tsx
<LayersPanel>
  {blocks.map((block, index) => (
    <LayerItem
      key={block.id}
      block={block}
      index={index}
      isVisible={block.isVisible}
      isLocked={block.isLocked}
      onToggleVisibility={() => toggleVisibility(block.id)}
      onToggleLock={() => toggleLock(block.id)}
      onDuplicate={() => duplicateBlock(block.id)}
      onDelete={() => deleteBlock(block.id)}
    />
  ))}
</LayersPanel>
```

---

## 🎬 User Workflows

### Workflow 1: Build Landing Page from Scratch
1. Click "New Page" → Select "Blank"
2. Enter full-screen mode
3. Drag "Hero Section" from Layout → Canvas
4. Drag "Heading" into Hero Section
5. Edit text inline: "Welcome to Our Product"
6. Drag "Button" below heading
7. Right panel → Style button (colors, size)
8. Drag "Features Section" below hero
9. Switch to Mobile preview → Adjust spacing
10. Save → Exit full-screen

### Workflow 2: Use Pre-made Template
1. Click "Templates" in left panel
2. Browse categories → Select "Landing Page"
3. Click "Import" on desired template
4. Template loads with all sections
5. Customize text, images, colors
6. Adjust responsive settings
7. Save as custom template for reuse

### Workflow 3: Advanced Customization
1. Select element on canvas
2. Right panel → Go to "Advanced" tab
3. Add entrance animation: "Fade In"
4. Set animation delay: 200ms
5. Go to "Responsive" tab
6. Hide element on mobile
7. Adjust font size per device
8. Preview on all devices
9. Save changes

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Carousel advanced features (DONE)
- [ ] Full-screen layout structure
- [ ] Basic toolbar
- [ ] Left panel skeleton
- [ ] Right panel skeleton
- [ ] Canvas with drag-drop

### Phase 2: Component Library (Week 2)
- [ ] Basic elements (Text, Image, Button)
- [ ] Layout elements (Section, Row, Column)
- [ ] Content elements (Slider, Gallery, Form)
- [ ] Drag & drop from library to canvas

### Phase 3: Style System (Week 3)
- [ ] Typography editor
- [ ] Color editor
- [ ] Spacing editor
- [ ] Border & shadow editors
- [ ] Background editor

### Phase 4: Responsive (Week 4)
- [ ] Device preview switcher
- [ ] Breakpoint system
- [ ] Responsive style controls
- [ ] Device-specific visibility

### Phase 5: Templates (Week 5)
- [ ] Template structure
- [ ] Template library UI
- [ ] Import/Export functionality
- [ ] Pre-made templates (5-10)

### Phase 6: Advanced Features (Week 6)
- [ ] Undo/Redo system
- [ ] Structure tree view
- [ ] Layers panel
- [ ] History panel
- [ ] Global settings

### Phase 7: Polish & Optimization (Week 7)
- [ ] Performance optimization
- [ ] Animation system
- [ ] Keyboard shortcuts
- [ ] User testing & fixes

---

## 📊 Success Metrics

- [ ] Full-screen mode working smoothly
- [ ] 50+ elements in library
- [ ] Responsive preview for 3 devices
- [ ] 10+ pre-made templates
- [ ] Undo/Redo working perfectly
- [ ] Save & load templates
- [ ] Performance: <100ms interactions
- [ ] Mobile-friendly editing experience

---

**Status**: 🚧 Architecture defined, ready to implement  
**Next**: Start Phase 1 - Foundation components
