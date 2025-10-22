# 🎨 Page Builder - Review & MVP Development Plan

**Ngày đánh giá:** 22 tháng 10, 2025  
**Reviewer:** Senior Full-stack Engineer  
**Trạng thái:** Production Ready với các cải tiến khuyến nghị

---

## 📊 EXECUTIVE SUMMARY

Page Builder hiện tại đã được triển khai với **kiến trúc vững chắc** và **tính năng đầy đủ** cho việc xây dựng trang web động. Tuy nhiên, còn nhiều cơ hội để nâng cấp lên enterprise-level với các tính năng AI, collaboration, và performance optimization.

### 🎯 Overall Score: **8.2/10**

| Category | Score | Status |
|----------|-------|--------|
| Architecture | 9/10 | ✅ Excellent |
| Code Quality | 8/10 | ✅ Good |
| Features | 7/10 | ⚠️ Needs Enhancement |
| Performance | 7/10 | ⚠️ Optimization Required |
| UX/UI | 8/10 | ✅ Good |
| Testing | 5/10 | ❌ Needs Improvement |
| Documentation | 8/10 | ✅ Good |

---

## 🔍 DETAILED REVIEW

### 1. ✅ Architecture & Design (9/10)

#### **Strengths:**
```typescript
// ✅ Excellent: Context-based state management
<PageBuilderProvider pageId={pageId}>
  <PageBuilderHeader />
  <PageBuilderSidebar />
  <PageBuilderCanvas />
</PageBuilderProvider>

// ✅ Excellent: Clear separation of concerns
- PageBuilder.tsx (151 lines) - Main orchestrator
- PageBuilderProvider.tsx (928 lines) - State management
- PageBuilderCanvas.tsx - Rendering logic
- Block components - Isolated and reusable
```

**Strong Points:**
- ✅ Clean component hierarchy
- ✅ Proper use of React Context
- ✅ GraphQL integration with hooks
- ✅ Type-safe with TypeScript
- ✅ Modular block system

**Areas for Improvement:**
```typescript
// ⚠️ PageBuilderProvider is too large (928 lines)
// Should split into multiple contexts:
- PageStateContext (page, blocks, loading)
- PageActionsContext (CRUD operations)
- TemplateContext (template management)
- UIContext (modals, dialogs)
```

---

### 2. 🎨 Current Features Analysis

#### **✅ Implemented Features:**

1. **Block System (23 block types)** ⭐⭐⭐⭐⭐
   ```typescript
   // Content Blocks: TEXT, IMAGE, HERO, BUTTON, CAROUSEL
   // Layout Blocks: CONTAINER, SECTION, GRID, FLEX_ROW, FLEX_COLUMN
   // Dynamic Blocks: DYNAMIC, PRODUCT_LIST, PRODUCT_DETAIL
   ```
   - Excellent variety
   - Nested blocks support
   - Drag & drop functionality

2. **Template System** ⭐⭐⭐⭐
   ```typescript
   // ✅ Template Library with 11+ default templates
   // ✅ Custom template creation & saving
   // ✅ Template preview & apply
   // ✅ Import/Export functionality
   ```
   - Good foundation
   - Missing: Cloud storage, versioning

3. **Dynamic Template System** ⭐⭐⭐⭐⭐
   ```typescript
   // ✅ Handlebars-like syntax
   // ✅ Variable substitution
   // ✅ GraphQL data binding
   // ✅ Product/Task/Category templates
   ```
   - Excellent implementation
   - Well documented

4. **Database Integration** ⭐⭐⭐⭐⭐
   ```prisma
   model Page {
     id          String     @id @default(uuid())
     title       String
     slug        String     @unique
     content     Json?
     status      PageStatus @default(DRAFT)
     blocks      PageBlock[]
     // ... SEO, metadata fields
   }
   ```
   - Complete schema
   - Good relationships

#### **❌ Missing Features:**

1. **Version Control** - No page history/rollback
2. **Multi-user Collaboration** - No real-time editing
3. **A/B Testing** - No variant support
4. **Analytics** - No tracking/heatmaps
5. **AI Assistance** - No smart suggestions
6. **Mobile Editor** - Desktop only
7. **Component Marketplace** - No sharing ecosystem

---

### 3. 💻 Code Quality Analysis

#### **Strengths:**
```typescript
// ✅ Good: Proper error handling
try {
  await createPageBlock({ ... });
  toast.success('Block added');
} catch (error) {
  toast.error('Failed to add block');
  pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_CREATE, 'Failed', { error });
}

// ✅ Good: Logging system
pageBuilderLogger.debug(LOG_OPERATIONS.BLOCK_UPDATE, 'Block updated', { blockId });

// ✅ Good: Type safety
export interface PageBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  style?: BlockStyle;
  children?: PageBlock[];
}
```

#### **Issues Found:**
```typescript
// ⚠️ Issue 1: Large component (928 lines)
// PageBuilderProvider.tsx needs refactoring

// ⚠️ Issue 2: Missing memoization
// Expensive calculations run every render
const filteredTemplates = allTemplates.filter(...); // Should use useMemo

// ⚠️ Issue 3: Inline functions
<Button onClick={() => handleClick(item.id)}>Click</Button>
// Should use useCallback

// ⚠️ Issue 4: Missing loading states
// Some operations don't show loading indicators

// ⚠️ Issue 5: Limited error recovery
// No retry mechanisms for failed operations
```

---

### 4. 🚀 Performance Analysis

#### **Current Performance:**
- ⚠️ No code splitting for blocks
- ⚠️ No lazy loading for templates
- ⚠️ No image optimization
- ⚠️ No caching strategy
- ⚠️ Large bundle size (needs analysis)

#### **Optimization Opportunities:**
```typescript
// ❌ Current: Load all blocks at once
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
// ... 23 imports

// ✅ Better: Lazy load blocks
const BlockComponents = {
  [BlockType.TEXT]: lazy(() => import('./blocks/TextBlock')),
  [BlockType.IMAGE]: lazy(() => import('./blocks/ImageBlock')),
  // ...
};

// ❌ Current: No caching
const { data } = usePage(pageId);

// ✅ Better: Add caching
const { data } = usePage(pageId, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

---

### 5. 🧪 Testing Status

**Current State:** ⚠️ **Inadequate**

```bash
# Found test files:
tests/27-template-runtime-test.sh
tests/38-test-template-functionality.sh
diagnose-template-library.sh
verify-pagebuilder.sh

# Missing:
- ❌ Unit tests for components
- ❌ Integration tests for GraphQL
- ❌ E2E tests for user flows
- ❌ Performance benchmarks
- ❌ Accessibility tests
```

**Required Test Coverage:**
```typescript
// Unit Tests (Target: 80%+)
describe('PageBuilderProvider', () => {
  it('should create page successfully');
  it('should handle block operations');
  it('should apply templates correctly');
});

// Integration Tests
describe('Page Builder Flow', () => {
  it('should create and publish page');
  it('should handle nested blocks');
});

// E2E Tests
describe('Page Builder E2E', () => {
  it('should complete full page creation workflow');
});
```

---

## 🎯 MVP DEVELOPMENT PLAN

### **MVP Philosophy:** 
Xây dựng theo **Progressive Enhancement** - mỗi MVP độc lập, có thể deploy riêng, và build trên foundation của MVP trước.

---

## 📋 MVP 1: Foundation & Performance (2-3 weeks) 🟢 EASY

**Goal:** Optimize hiện tại, fix bugs, improve performance

### **Tasks:**

#### 1.1 Code Refactoring (1 week)
```typescript
// Split PageBuilderProvider into multiple contexts
// Before: 928 lines
// After: 4 contexts × ~200 lines

// File structure:
contexts/
  ├── PageStateContext.tsx      // Page & blocks state
  ├── PageActionsContext.tsx    // CRUD operations  
  ├── TemplateContext.tsx       // Template management
  └── UIStateContext.tsx        // Modals, dialogs
```

**Implementation:**
```typescript
// 1. PageStateContext.tsx
export const PageStateProvider = ({ children, pageId }) => {
  const { data: page, loading } = usePage(pageId);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  
  const value = {
    page,
    blocks,
    loading,
    setBlocks,
  };
  
  return (
    <PageStateContext.Provider value={value}>
      {children}
    </PageStateContext.Provider>
  );
};

// 2. Compose all contexts
export const PageBuilderProvider = ({ children, pageId }) => {
  return (
    <PageStateProvider pageId={pageId}>
      <PageActionsProvider>
        <TemplateProvider>
          <UIStateProvider>
            {children}
          </UIStateProvider>
        </TemplateProvider>
      </PageActionsProvider>
    </PageStateProvider>
  );
};
```

#### 1.2 Performance Optimization (1 week)
```typescript
// A. Implement lazy loading for blocks
const BlockRenderer = ({ type, ...props }) => {
  const BlockComponent = useMemo(() => {
    return lazy(() => import(`./blocks/${type}Block`));
  }, [type]);
  
  return (
    <Suspense fallback={<BlockSkeleton />}>
      <BlockComponent {...props} />
    </Suspense>
  );
};

// B. Add memoization
const filteredTemplates = useMemo(() => {
  return allTemplates.filter(t => 
    t.category === selectedCategory &&
    t.name.includes(searchQuery)
  );
}, [allTemplates, selectedCategory, searchQuery]);

// C. Implement React Query caching
const { data, isLoading } = useQuery({
  queryKey: ['page', pageId],
  queryFn: () => fetchPage(pageId),
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});
```

#### 1.3 Bug Fixes & Polish (3-5 days)
- Fix any TODO/FIXME items
- Improve error messages
- Add loading states
- Fix edge cases in nested blocks

### **Deliverables:**
- ✅ Refactored codebase (< 300 lines per file)
- ✅ 30%+ faster initial load
- ✅ Smooth 60fps interactions
- ✅ All critical bugs fixed

---

## 📋 MVP 2: Testing & Quality Assurance (2 weeks) 🟢 EASY-MEDIUM

**Goal:** Achieve 80%+ test coverage, ensure stability

### **Tasks:**

#### 2.1 Unit Testing (1 week)
```typescript
// tests/unit/PageBuilderProvider.test.tsx
describe('PageBuilderProvider', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => usePageBuilderContext(), {
      wrapper: PageBuilderProvider,
    });
    
    expect(result.current.blocks).toEqual([]);
  });
  
  it('should add block successfully', async () => {
    const { result } = renderHook(() => usePageBuilderContext());
    
    await act(async () => {
      await result.current.handleAddBlock(BlockType.TEXT);
    });
    
    expect(result.current.blocks).toHaveLength(1);
  });
});

// tests/unit/blocks/TextBlock.test.tsx
describe('TextBlock', () => {
  it('should render text content', () => {
    const { getByText } = render(
      <TextBlock content={{ content: 'Hello World' }} />
    );
    
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
```

#### 2.2 Integration Testing (3-4 days)
```typescript
// tests/integration/pageBuilder.test.tsx
describe('Page Builder Integration', () => {
  it('should create page with blocks', async () => {
    const { getByText, getByRole } = render(<PageBuilder />);
    
    // Add text block
    fireEvent.click(getByText('Add Block'));
    fireEvent.click(getByText('Text Block'));
    
    // Edit content
    const editor = getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'Test' } });
    
    // Save page
    fireEvent.click(getByText('Save'));
    
    await waitFor(() => {
      expect(getByText('Page saved')).toBeInTheDocument();
    });
  });
});
```

#### 2.3 E2E Testing (3-4 days)
```typescript
// e2e/pageBuilder.spec.ts
import { test, expect } from '@playwright/test';

test('complete page creation flow', async ({ page }) => {
  await page.goto('/admin/pagebuilder');
  
  // Create new page
  await page.click('[data-testid="new-page"]');
  await page.fill('input[name="title"]', 'Test Page');
  
  // Add blocks
  await page.click('[data-testid="add-block-text"]');
  await page.fill('[data-testid="block-editor"]', 'Hello World');
  
  // Apply template
  await page.click('[data-testid="templates-tab"]');
  await page.click('[data-testid="template-hero"]');
  
  // Publish
  await page.click('[data-testid="publish"]');
  
  await expect(page.locator('.toast')).toContainText('Published');
});
```

### **Deliverables:**
- ✅ 80%+ unit test coverage
- ✅ Key integration tests
- ✅ Critical E2E flows covered
- ✅ CI/CD pipeline with tests

---

## 📋 MVP 3: Version Control & History (2-3 weeks) 🟡 MEDIUM

**Goal:** Cho phép users rollback changes, xem history

### **Schema Extension:**
```prisma
// backend/prisma/schema.prisma

model PageVersion {
  id          String   @id @default(uuid())
  pageId      String
  version     Int
  title       String
  content     Json
  blocks      Json
  metadata    Json?
  
  // Version info
  changeType  String   // 'create', 'update', 'restore'
  changeNotes String?
  
  // Who made the change
  createdBy   String
  createdAt   DateTime @default(now())
  
  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  creator     User     @relation(fields: [createdBy], references: [id])
  
  @@unique([pageId, version])
  @@index([pageId, createdAt])
  @@map("page_versions")
}

model Page {
  // ... existing fields
  currentVersion Int      @default(1)
  versions       PageVersion[]
}
```

### **Implementation:**
```typescript
// hooks/usePageVersions.ts
export const usePageVersions = (pageId: string) => {
  const { data, loading } = useQuery(GET_PAGE_VERSIONS, {
    variables: { pageId },
  });
  
  const restoreVersion = useMutation(RESTORE_PAGE_VERSION);
  const compareVersions = useMutation(COMPARE_PAGE_VERSIONS);
  
  return {
    versions: data?.pageVersions || [],
    loading,
    restoreVersion,
    compareVersions,
  };
};

// components/page-builder/panels/HistoryPanel.tsx
export const HistoryPanel = () => {
  const { pageId } = usePageBuilderContext();
  const { versions, restoreVersion } = usePageVersions(pageId);
  
  const handleRestore = async (versionId: string) => {
    await restoreVersion({ variables: { versionId } });
    toast.success('Version restored');
  };
  
  return (
    <div className="space-y-4">
      <h3>Page History</h3>
      {versions.map(v => (
        <VersionItem 
          key={v.id}
          version={v}
          onRestore={() => handleRestore(v.id)}
        />
      ))}
    </div>
  );
};
```

### **Features:**
- ✅ Auto-save versions on every change
- ✅ Visual diff between versions
- ✅ One-click restore
- ✅ Version notes/comments
- ✅ Auto-cleanup old versions (keep last 50)

### **Deliverables:**
- ✅ Version control system
- ✅ History panel UI
- ✅ Restore functionality
- ✅ Version comparison tool

---

## 📋 MVP 4: Multi-user Collaboration (3-4 weeks) 🟡 MEDIUM-HARD

**Goal:** Real-time collaboration như Google Docs

### **Tech Stack:**
- **WebSocket**: Socket.io / Pusher / Ably
- **CRDT**: Yjs / Automerge (for conflict resolution)
- **Presence**: Show who's editing what

### **Schema Extension:**
```prisma
model PageCollaborator {
  id          String   @id @default(uuid())
  pageId      String
  userId      String
  role        String   // 'owner', 'editor', 'viewer'
  
  // Presence
  isOnline    Boolean  @default(false)
  lastSeen    DateTime @default(now())
  cursor      Json?    // Current cursor position
  
  joinedAt    DateTime @default(now())
  
  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([pageId, userId])
  @@index([pageId, isOnline])
  @@map("page_collaborators")
}

model PageLock {
  id          String   @id @default(uuid())
  pageId      String
  blockId     String?  // Null = entire page locked
  userId      String
  
  lockedAt    DateTime @default(now())
  expiresAt   DateTime
  
  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id])
  
  @@unique([pageId, blockId])
  @@index([expiresAt])
  @@map("page_locks")
}
```

### **Implementation:**
```typescript
// lib/collaboration/usePageCollaboration.ts
export const usePageCollaboration = (pageId: string) => {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [locks, setLocks] = useState<Lock[]>([]);
  
  useEffect(() => {
    const socket = io('/pagebuilder');
    
    // Join room
    socket.emit('join:page', { pageId, userId: user.id });
    
    // Listen for collaborator updates
    socket.on('collaborators:update', setCollaborators);
    socket.on('locks:update', setLocks);
    
    // Broadcast cursor position
    socket.on('cursor:move', (data) => {
      updateCursor(data.userId, data.position);
    });
    
    return () => socket.disconnect();
  }, [pageId]);
  
  const lockBlock = useCallback(async (blockId: string) => {
    const lock = await acquireLock(pageId, blockId, user.id);
    return lock;
  }, [pageId, user.id]);
  
  return { collaborators, locks, lockBlock };
};

// components/page-builder/Presence.tsx
export const PresenceIndicators = () => {
  const { collaborators } = usePageCollaboration(pageId);
  
  return (
    <div className="flex -space-x-2">
      {collaborators.map(c => (
        <Avatar
          key={c.id}
          src={c.avatar}
          name={c.name}
          className={c.isOnline ? 'ring-2 ring-green-500' : 'opacity-50'}
        />
      ))}
    </div>
  );
};
```

### **Features:**
- ✅ Real-time presence (who's online)
- ✅ Cursor tracking (see where others are editing)
- ✅ Block-level locking (prevent conflicts)
- ✅ Live updates (see changes in real-time)
- ✅ Conflict resolution (CRDT-based)
- ✅ Comment system (leave notes on blocks)

### **Deliverables:**
- ✅ WebSocket server
- ✅ Collaboration hooks
- ✅ Presence UI
- ✅ Lock management
- ✅ Real-time sync

---

## 📋 MVP 5: AI-Powered Features (3-4 weeks) 🔴 HARD

**Goal:** AI assistance cho content generation và design

### **AI Features:**

#### 5.1 AI Content Generation
```typescript
// lib/ai/contentGenerator.ts
export class AIContentGenerator {
  async generateText(prompt: string, context?: string): Promise<string> {
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt: `Generate website content for: ${prompt}\nContext: ${context}`,
      max_tokens: 500,
    });
    
    return response.data.choices[0].text;
  }
  
  async improveContent(content: string): Promise<string> {
    // Improve grammar, tone, readability
  }
  
  async generateAltText(imageUrl: string): Promise<string> {
    // Use GPT-4 Vision to generate alt text
  }
}

// components/page-builder/blocks/TextBlock.tsx
export const TextBlock = ({ content, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const aiGenerator = useAIContentGenerator();
  
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    const prompt = `Create engaging content for: ${content.placeholder}`;
    const generated = await aiGenerator.generateText(prompt);
    onUpdate({ ...content, content: generated });
    setIsGenerating(false);
  };
  
  return (
    <div>
      <textarea value={content.content} onChange={...} />
      <Button 
        onClick={handleAIGenerate}
        disabled={isGenerating}
      >
        ✨ Generate with AI
      </Button>
    </div>
  );
};
```

#### 5.2 AI Design Suggestions
```typescript
// lib/ai/designSuggestions.ts
export class AIDesignAnalyzer {
  async analyzeLayout(blocks: PageBlock[]): Promise<Suggestion[]> {
    // Analyze current layout
    const issues = this.detectIssues(blocks);
    
    // Get AI suggestions
    const suggestions = await openai.createCompletion({
      model: 'gpt-4',
      prompt: `Analyze this page layout and suggest improvements:\n${JSON.stringify(blocks)}`,
    });
    
    return this.parseSuggestions(suggestions);
  }
  
  detectIssues(blocks: PageBlock[]): Issue[] {
    const issues = [];
    
    // Check hierarchy
    if (!blocks.some(b => b.type === BlockType.HERO)) {
      issues.push({
        type: 'missing_hero',
        severity: 'medium',
        message: 'Consider adding a hero section',
      });
    }
    
    // Check contrast
    // Check spacing
    // Check mobile responsiveness
    
    return issues;
  }
}

// components/page-builder/panels/DesignAssistant.tsx
export const DesignAssistant = () => {
  const { blocks } = usePageBuilderContext();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const analyzePage = async () => {
    const analyzer = new AIDesignAnalyzer();
    const results = await analyzer.analyzeLayout(blocks);
    setSuggestions(results);
  };
  
  return (
    <Panel title="Design Assistant">
      <Button onClick={analyzePage}>Analyze Page</Button>
      
      <div className="space-y-2 mt-4">
        {suggestions.map(s => (
          <SuggestionCard 
            suggestion={s}
            onApply={() => applySuggestion(s)}
          />
        ))}
      </div>
    </Panel>
  );
};
```

#### 5.3 Smart Image Optimization
```typescript
// lib/ai/imageOptimizer.ts
export class AIImageOptimizer {
  async optimizeImage(url: string): Promise<OptimizedImage> {
    // 1. Compress image
    const compressed = await sharp(url)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    
    // 2. Generate responsive sizes
    const sizes = await this.generateResponsiveSizes(compressed);
    
    // 3. Generate alt text with AI
    const altText = await this.generateAltText(url);
    
    // 4. Upload to CDN
    const cdnUrls = await this.uploadToCDN(sizes);
    
    return {
      originalUrl: url,
      optimizedUrl: cdnUrls.main,
      responsiveUrls: cdnUrls.sizes,
      altText,
      savings: this.calculateSavings(url, compressed),
    };
  }
  
  async generateAltText(imageUrl: string): Promise<string> {
    const response = await openai.createChatCompletion({
      model: 'gpt-4-vision-preview',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image for accessibility (alt text):' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      }],
    });
    
    return response.data.choices[0].message.content;
  }
}
```

### **Features:**
- ✅ AI text generation
- ✅ Content improvement suggestions
- ✅ Auto alt-text generation
- ✅ Design layout analysis
- ✅ Color scheme suggestions
- ✅ Accessibility checks
- ✅ SEO optimization tips

### **Deliverables:**
- ✅ OpenAI integration
- ✅ AI content generator
- ✅ Design assistant panel
- ✅ Smart image optimizer
- ✅ Auto-improvement tools

---

## 📋 MVP 6: Analytics & A/B Testing (3-4 weeks) 🔴 HARD

**Goal:** Data-driven optimization với analytics và A/B testing

### **Schema Extension:**
```prisma
model PageVariant {
  id          String   @id @default(uuid())
  pageId      String
  name        String
  description String?
  
  // Variant configuration
  blocks      Json
  isControl   Boolean  @default(false)
  traffic     Int      @default(50) // % of traffic
  
  // Status
  isActive    Boolean  @default(true)
  startDate   DateTime @default(now())
  endDate     DateTime?
  
  // Relations
  page        Page           @relation(fields: [pageId], references: [id], onDelete: Cascade)
  analytics   PageAnalytics[]
  
  @@index([pageId, isActive])
  @@map("page_variants")
}

model PageAnalytics {
  id          String   @id @default(uuid())
  pageId      String
  variantId   String?
  
  // Session info
  sessionId   String
  userId      String?
  
  // Events
  event       String   // 'view', 'click', 'scroll', 'convert'
  blockId     String?
  elementType String?
  
  // Context
  device      String?  // 'mobile', 'tablet', 'desktop'
  browser     String?
  country     String?
  
  // Metrics
  timeOnPage  Int?     // seconds
  scrollDepth Int?     // percentage
  
  createdAt   DateTime @default(now())
  
  page        Page          @relation(fields: [pageId], references: [id], onDelete: Cascade)
  variant     PageVariant?  @relation(fields: [variantId], references: [id])
  
  @@index([pageId, event, createdAt])
  @@index([variantId, event])
  @@index([sessionId])
  @@map("page_analytics")
}
```

### **Implementation:**

#### 6.1 Analytics Tracking
```typescript
// lib/analytics/pageAnalytics.ts
export class PageAnalyticsTracker {
  private pageId: string;
  private sessionId: string;
  private startTime: number;
  
  constructor(pageId: string) {
    this.pageId = pageId;
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    this.setupTracking();
  }
  
  setupTracking() {
    // Track page view
    this.trackEvent('view');
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track clicks
    this.trackClicks();
    
    // Track time on page
    this.trackTimeOnPage();
  }
  
  async trackEvent(event: string, data?: any) {
    await fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        pageId: this.pageId,
        sessionId: this.sessionId,
        event,
        ...data,
        timestamp: new Date(),
      }),
    });
  }
  
  trackScrollDepth() {
    let maxScroll = 0;
    
    const onScroll = () => {
      const scrolled = (window.scrollY / document.body.scrollHeight) * 100;
      if (scrolled > maxScroll) {
        maxScroll = scrolled;
        this.trackEvent('scroll', { scrollDepth: Math.floor(scrolled) });
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  
  trackClicks() {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const blockId = target.closest('[data-block-id]')?.getAttribute('data-block-id');
      
      if (blockId) {
        this.trackEvent('click', {
          blockId,
          elementType: target.tagName,
          text: target.textContent?.slice(0, 50),
        });
      }
    });
  }
}

// Heatmap integration
export const useHeatmap = (pageId: string) => {
  useEffect(() => {
    // Load heatmap library (e.g., Hotjar, Crazy Egg)
    const script = document.createElement('script');
    script.src = 'https://heatmap-cdn.com/tracker.js';
    script.dataset.pageId = pageId;
    document.body.appendChild(script);
  }, [pageId]);
};
```

#### 6.2 A/B Testing Engine
```typescript
// lib/abTesting/variantSelector.ts
export class ABTestingEngine {
  async selectVariant(pageId: string, sessionId: string): Promise<PageVariant> {
    // Get active variants
    const variants = await this.getActiveVariants(pageId);
    
    if (variants.length === 0) {
      return this.getOriginalPage(pageId);
    }
    
    // Sticky sessions - same user gets same variant
    const cached = this.getCachedVariant(sessionId);
    if (cached) return cached;
    
    // Select variant based on traffic allocation
    const selected = this.selectByTraffic(variants);
    
    // Cache selection
    this.cacheVariant(sessionId, selected);
    
    // Track assignment
    await this.trackAssignment(sessionId, selected.id);
    
    return selected;
  }
  
  selectByTraffic(variants: PageVariant[]): PageVariant {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const variant of variants) {
      cumulative += variant.traffic;
      if (random <= cumulative) {
        return variant;
      }
    }
    
    return variants[0]; // Fallback to first variant
  }
  
  async calculateResults(pageId: string): Promise<ABTestResults> {
    const variants = await this.getVariants(pageId);
    const analytics = await this.getAnalytics(pageId);
    
    const results = variants.map(variant => {
      const variantAnalytics = analytics.filter(a => a.variantId === variant.id);
      
      return {
        variantId: variant.id,
        variantName: variant.name,
        
        // Traffic
        views: variantAnalytics.filter(a => a.event === 'view').length,
        uniqueVisitors: new Set(variantAnalytics.map(a => a.sessionId)).size,
        
        // Engagement
        avgTimeOnPage: this.calculateAverage(variantAnalytics, 'timeOnPage'),
        avgScrollDepth: this.calculateAverage(variantAnalytics, 'scrollDepth'),
        
        // Conversions
        conversions: variantAnalytics.filter(a => a.event === 'convert').length,
        conversionRate: this.calculateConversionRate(variantAnalytics),
        
        // Statistical significance
        isSignificant: this.calculateSignificance(variant, variants[0]),
        confidence: this.calculateConfidence(variant, variants[0]),
      };
    });
    
    return {
      pageId,
      variants: results,
      winner: this.determineWinner(results),
      recommendation: this.generateRecommendation(results),
    };
  }
}
```

#### 6.3 Analytics Dashboard
```typescript
// components/page-builder/analytics/AnalyticsDashboard.tsx
export const AnalyticsDashboard = ({ pageId }: { pageId: string }) => {
  const { data, loading } = usePageAnalytics(pageId);
  
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value={data.totalViews}
          change={data.viewsChange}
        />
        <MetricCard
          title="Unique Visitors"
          value={data.uniqueVisitors}
          change={data.visitorsChange}
        />
        <MetricCard
          title="Avg. Time on Page"
          value={`${data.avgTimeOnPage}s`}
          change={data.timeChange}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.conversionRate}%`}
          change={data.conversionChange}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3>Views Over Time</h3>
          <LineChart data={data.viewsOverTime} />
        </Card>
        
        <Card>
          <h3>Device Distribution</h3>
          <PieChart data={data.deviceDistribution} />
        </Card>
      </div>
      
      {/* Heatmap */}
      <Card>
        <h3>Click Heatmap</h3>
        <HeatmapViewer pageId={pageId} />
      </Card>
      
      {/* A/B Testing Results */}
      {data.abTests && (
        <Card>
          <h3>A/B Testing Results</h3>
          <ABTestResultsTable results={data.abTests} />
        </Card>
      )}
    </div>
  );
};
```

### **Features:**
- ✅ Real-time analytics tracking
- ✅ Click heatmaps
- ✅ Scroll tracking
- ✅ Conversion tracking
- ✅ A/B test creation
- ✅ Traffic allocation
- ✅ Statistical analysis
- ✅ Winner determination
- ✅ Device/browser analytics
- ✅ Geographic analytics

### **Deliverables:**
- ✅ Analytics tracking system
- ✅ A/B testing engine
- ✅ Analytics dashboard
- ✅ Heatmap integration
- ✅ Results calculator

---

## 📋 MVP 7: Component Marketplace (4-5 weeks) 🔴 VERY HARD

**Goal:** Ecosystem cho sharing và monetization

### **Features:**
- Component library
- Template marketplace
- Community contributions
- Ratings & reviews
- Monetization (paid templates)
- Version management
- License management

*(This is a separate product feature - detailed plan available on request)*

---

## 🎯 RECOMMENDED PRIORITIZATION

### **Phase 1: Quick Wins (1 month)**
✅ MVP 1: Foundation & Performance  
✅ MVP 2: Testing & QA

**Why:** Low effort, high impact. Makes current system solid.

### **Phase 2: Core Features (2 months)**
✅ MVP 3: Version Control  
✅ MVP 4: Collaboration

**Why:** Essential for team workflows. Competitive features.

### **Phase 3: Advanced Features (3 months)**
✅ MVP 5: AI Features  
✅ MVP 6: Analytics & A/B Testing

**Why:** Differentiation. Premium features.

### **Phase 4: Ecosystem (Optional)**
⏸️ MVP 7: Marketplace

**Why:** Long-term play. Requires critical mass.

---

## 📊 EFFORT & IMPACT MATRIX

```
High Impact │ ┌──────────┐  ┌──────────┐
            │ │  MVP 1   │  │  MVP 5   │
            │ │  (Easy)  │  │  (Hard)  │
            │ └──────────┘  └──────────┘
            │ ┌──────────┐  ┌──────────┐
            │ │  MVP 3   │  │  MVP 4   │
Medium      │ │(Medium)  │  │  (Hard)  │
Impact      │ └──────────┘  └──────────┘
            │ ┌──────────┐  ┌──────────┐
Low Impact  │ │  MVP 2   │  │  MVP 7   │
            │ │  (Easy)  │  │(V.Hard)  │
            └─┴──────────┴──┴──────────┴─→
              Low        Medium      High
                     Effort
```

---

## 🎓 TECHNICAL RECOMMENDATIONS

### **1. State Management**
```typescript
// Current: Context API (good for small-medium apps)
// Recommended: Add Zustand for complex state

// stores/pageBuilderStore.ts
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface PageBuilderState {
  page: Page | null;
  blocks: PageBlock[];
  selectedBlockId: string | null;
  
  // Actions
  setPage: (page: Page) => void;
  addBlock: (block: PageBlock) => void;
  updateBlock: (id: string, updates: Partial<PageBlock>) => void;
  deleteBlock: (id: string) => void;
}

export const usePageBuilderStore = create<PageBuilderState>()(
  devtools(
    persist(
      (set) => ({
        page: null,
        blocks: [],
        selectedBlockId: null,
        
        setPage: (page) => set({ page }),
        addBlock: (block) => set((state) => ({
          blocks: [...state.blocks, block],
        })),
        updateBlock: (id, updates) => set((state) => ({
          blocks: state.blocks.map(b => 
            b.id === id ? { ...b, ...updates } : b
          ),
        })),
        deleteBlock: (id) => set((state) => ({
          blocks: state.blocks.filter(b => b.id !== id),
        })),
      }),
      { name: 'pagebuilder-storage' }
    )
  )
);
```

### **2. Performance Monitoring**
```typescript
// Add performance monitoring
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Measure render times
import { Profiler } from 'react';

<Profiler id="PageBuilder" onRender={onRenderCallback}>
  <PageBuilder />
</Profiler>

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  // Send to analytics
  analytics.track('component_render', {
    id,
    phase,
    duration: actualDuration,
  });
}
```

### **3. Error Boundaries**
```typescript
// components/ErrorBoundary.tsx
export class PageBuilderErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    Sentry.captureException(error, { extra: errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

---

## 📈 SUCCESS METRICS

### **Technical Metrics:**
- Bundle size < 500KB (gzipped)
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Lighthouse Score > 90
- Test Coverage > 80%
- Zero critical bugs in production

### **Business Metrics:**
- User adoption rate
- Pages created per user
- Template usage rate
- Collaboration sessions
- A/B test conversion lift
- AI feature usage

---

## 🚀 GETTING STARTED

### **Week 1: Setup & Planning**
```bash
# 1. Create feature branch
git checkout -b feature/pagebuilder-mvp1

# 2. Setup testing infrastructure
bun add -D @testing-library/react @testing-library/jest-dom
bun add -D @playwright/test

# 3. Setup monitoring
bun add @vercel/analytics @vercel/speed-insights
bun add @sentry/nextjs

# 4. Setup state management
bun add zustand immer

# 5. Create MVP tracking doc
touch docs/MVP-PROGRESS.md
```

### **Week 2-3: MVP 1 Implementation**
- Day 1-5: Refactor PageBuilderProvider
- Day 6-10: Implement performance optimizations
- Day 11-15: Bug fixes and polish

---

## 💡 FINAL THOUGHTS

Page Builder của bạn đã có **foundation rất tốt**. Kiến trúc clean, code quality ổn, features complete cho basic use cases.

**Recommendations từ Senior perspective:**

1. **Focus on Stability First** (MVP 1-2)
   - Solid foundation > Shiny features
   - Tests = confidence to move fast later

2. **Progressive Enhancement** (MVP 3-4)
   - Each MVP adds clear value
   - Can deploy independently

3. **Competitive Differentiation** (MVP 5-6)
   - AI features = wow factor
   - Analytics = data-driven decisions

4. **Think Ecosystem** (MVP 7)
   - Long-term competitive moat
   - Community = network effects

**Remember:** "Make it work, make it right, make it fast" - Kent Beck

You're at "make it right" stage. Follow this plan to reach "make it fast" and beyond! 🚀

---

**Questions? Let's discuss the implementation!** 🤝
