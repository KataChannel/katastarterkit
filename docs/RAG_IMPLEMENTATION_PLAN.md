# 🚀 RAG Implementation Plan - Option C (Hybrid)

**Project:** tazagroupcore Support Chat with RAG  
**Approach:** Hybrid (Backend Direct + n8n Workflows)  
**Timeline:** 4 weeks  
**Status:** Planning Phase  
**Created:** October 31, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [MVP Scope](#mvp-scope)
4. [Implementation Phases](#implementation-phases)
5. [Technical Stack](#technical-stack)
6. [Database Schema](#database-schema)
7. [API Design](#api-design)
8. [Code Structure](#code-structure)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Plan](#deployment-plan)
11. [Cost Estimation](#cost-estimation)
12. [Success Metrics](#success-metrics)

---

## 🎯 Overview

### Objective
Build a production-ready RAG (Retrieval-Augmented Generation) system for support chat that:
- Provides accurate answers from internal knowledge base
- Reduces support agent workload by 60%
- Maintains <100ms search response time
- Handles 10,000+ documents with 99.9% uptime

### Current State
- ✅ AI Provider Management (ChatGPT, Grok, Gemini)
- ✅ Support Chat Settings & Widget
- ✅ NestJS backend with GraphQL
- ✅ Redis caching
- ✅ Multi-tenant architecture

### Target State
- ✅ Vector-based semantic search
- ✅ Automatic document ingestion pipeline
- ✅ Context-aware AI responses
- ✅ Knowledge base management UI
- ✅ Analytics & monitoring

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 16)                      │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐         ┌──────────────────┐              │
│  │  Chat Widget   │         │  Admin Dashboard │              │
│  │  (Customer)    │         │  (Knowledge Mgmt)│              │
│  └────────┬───────┘         └────────┬─────────┘              │
│           │                          │                         │
│           └──────────────┬───────────┘                         │
│                          │ GraphQL                             │
└──────────────────────────┼─────────────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                  BACKEND (NestJS 11)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Support Chat Module                         │  │
│  │  • Message handling                                      │  │
│  │  • Conversation management                               │  │
│  │  • AI response generation ────┐                          │  │
│  └────────────────────────────────┼──────────────────────────┘  │
│                                   │                             │
│  ┌────────────────────────────────▼──────────────────────────┐ │
│  │              RAG Module (NEW) ⭐                          │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  Services:                                               │ │
│  │  • VectorStoreService      → Qdrant/Pinecone           │ │
│  │  • EmbeddingService        → OpenAI/Gemini             │ │
│  │  • RAGSearchService        → Semantic search           │ │
│  │  • DocumentParserService   → PDF/DOCX/HTML            │ │
│  │  • ChunkingService         → Text splitting           │ │
│  │  • ContextBuilderService   → Prompt engineering       │ │
│  │                                                         │ │
│  │  Entities:                                              │ │
│  │  • RagDocument                                          │ │
│  │  • RagChunk                                             │ │
│  │  • RagSource                                            │ │
│  │                                                         │ │
│  │  Resolvers:                                             │ │
│  │  • RAGResolver (GraphQL)                               │ │
│  │  • WebhookController (REST)                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Existing Modules (Integration)                 │  │
│  │  • AIProviderModule      → Model selection              │  │
│  │  • RedisModule           → Embedding cache              │  │
│  │  • PrismaModule          → Metadata storage             │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ Webhook
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                    n8n WORKFLOWS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Workflow 1: Document Ingestion Pipeline                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Trigger → Extract Text → Chunk → Embed → Store → Notify │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Workflow 2: Scheduled Reindexing                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Cron → Fetch Updates → Process → Upsert → Report        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Workflow 3: Quality Monitoring                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Cron → Test Queries → Evaluate → Alert on Issues        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Workflow 4: URL Crawler                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Schedule → Crawl Docs → Extract → Send to Backend       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Workflow 5: Performance Analytics                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Collect Metrics → Aggregate → Dashboard → Weekly Report │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│                   DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │   Qdrant     │  │    Redis     │         │
│  │              │  │  (Vector DB) │  │   (Cache)    │         │
│  │ • Metadata   │  │ • Embeddings │  │ • Embeddings │         │
│  │ • Logs       │  │ • Similarity │  │ • Search     │         │
│  │ • Analytics  │  │   Search     │  │   Results    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 MVP Scope

### ✅ In Scope (MVP)

#### Phase 1: Core RAG Engine (Week 1-2)
1. **Vector Storage Setup**
   - Qdrant self-hosted (Docker)
   - Collection creation & management
   - Index optimization

2. **Embedding Generation**
   - OpenAI text-embedding-3-small integration
   - Caching layer with Redis (TTL: 30 days)
   - Batch processing support

3. **Semantic Search**
   - Vector similarity search
   - Top-k retrieval (k=3-5)
   - Score threshold filtering (>0.7)
   - Metadata filtering

4. **Basic Document Management**
   - Text file upload (.txt, .md)
   - Manual chunking (500 tokens, 50 overlap)
   - CRUD operations via GraphQL
   - PostgreSQL metadata storage

5. **RAG Response Generation**
   - Context injection into prompts
   - Integration with AIProviderService
   - Fallback to direct AI when no context
   - Response source attribution

#### Phase 2: Document Pipeline (Week 3)
6. **Advanced Document Support**
   - PDF parsing (pdf-parse)
   - DOCX parsing (mammoth)
   - HTML parsing (cheerio)
   - Auto-chunking with overlap

7. **n8n Workflows**
   - Workflow 1: Document ingestion
   - Workflow 2: Scheduled reindexing
   - Webhook endpoint setup
   - Error handling & retry logic

8. **Admin UI (Frontend)**
   - Document upload interface
   - Knowledge base browser
   - Search testing tool
   - Basic analytics dashboard

#### Phase 3: Integration & Polish (Week 4)
9. **Support Chat Integration**
   - Auto-detect knowledge queries
   - RAG-enhanced responses
   - Source citations in chat
   - Confidence scoring

10. **Monitoring & Analytics**
    - Search query logging
    - Response quality metrics
    - Usage statistics
    - Error tracking

11. **Testing & Documentation**
    - Unit tests (80% coverage)
    - Integration tests
    - API documentation
    - User guide

### ❌ Out of Scope (MVP)

**Deferred to Post-MVP:**
- Multi-language support
- Advanced chunking strategies (recursive, semantic)
- Fine-tuned embedding models
- A/B testing framework
- Advanced analytics (user satisfaction, CSAT)
- Image/video document support
- Real-time collaboration on knowledge base
- Auto-categorization with ML
- GraphRAG / knowledge graphs
- Multi-modal RAG (text + images)

---

## 📅 Implementation Phases

### **Phase 1: Core RAG Engine** (Week 1-2) 🔥

#### Week 1: Foundation

**Day 1-2: Vector Database Setup**
```bash
Tasks:
□ Install Qdrant via Docker Compose
□ Create collections schema
□ Configure HNSW index parameters
□ Test connection from NestJS
□ Setup health checks

Deliverables:
- docker-compose.yml updated
- Qdrant running on :6333
- Test collection created
```

**Day 3-4: Embedding Service**
```bash
Tasks:
□ Create EmbeddingService
□ Integrate OpenAI API
□ Implement Redis caching
□ Add batch processing
□ Error handling & retries

Deliverables:
- backend/src/rag/services/embedding.service.ts
- Unit tests
- Cache hit rate >90%
```

**Day 5-7: Vector Store Service**
```bash
Tasks:
□ Create VectorStoreService
□ Implement upsert operations
□ Implement search operations
□ Add metadata filtering
□ Performance optimization

Deliverables:
- backend/src/rag/services/vector-store.service.ts
- Search latency <50ms
- Unit tests
```

#### Week 2: Search & Integration

**Day 8-10: RAG Search Service**
```bash
Tasks:
□ Create RAGSearchService
□ Implement semantic search
□ Build context builder
□ Add prompt engineering
□ Integration with AIProviderService

Deliverables:
- backend/src/rag/services/rag-search.service.ts
- Context quality validation
- Integration tests
```

**Day 11-12: GraphQL API**
```bash
Tasks:
□ Create Prisma schema for RAG
□ Generate types & migrations
□ Create GraphQL resolvers
□ Create DTOs & validations
□ Test via GraphQL Playground

Deliverables:
- backend/prisma/schema.prisma (RagDocument, RagChunk)
- backend/src/rag/resolvers/rag.resolver.ts
- API documentation
```

**Day 13-14: Document Parser**
```bash
Tasks:
□ Create DocumentParserService
□ Add TXT/MD support
□ Implement chunking logic
□ Add metadata extraction
□ Error handling

Deliverables:
- backend/src/rag/services/document-parser.service.ts
- Support .txt, .md files
- Configurable chunk size
```

---

### **Phase 2: Document Pipeline** (Week 3) 🔧

**Day 15-16: Advanced Document Support**
```bash
Tasks:
□ Install pdf-parse, mammoth, cheerio
□ Add PDF parsing
□ Add DOCX parsing
□ Add HTML parsing
□ Optimize memory usage

Deliverables:
- Multi-format support
- Streaming for large files
- Memory usage <500MB per file
```

**Day 17-18: n8n Setup**
```bash
Tasks:
□ Install n8n (Docker)
□ Create workspace
□ Configure credentials
□ Test webhook connectivity
□ Setup environment variables

Deliverables:
- docker-compose.yml (n8n service)
- n8n running on :5678
- Test workflow created
```

**Day 19-20: n8n Workflows**
```bash
Tasks:
□ Workflow 1: Document Ingestion
□ Workflow 2: Scheduled Reindexing
□ Workflow 3: Quality Monitoring
□ Test error scenarios
□ Setup monitoring

Deliverables:
- 3 production workflows
- Error handling tested
- Logs & alerts configured
```

**Day 21: Webhook Integration**
```bash
Tasks:
□ Create webhook controller
□ Add authentication (API key)
□ Validate payloads
□ Queue processing (Bull)
□ Test end-to-end flow

Deliverables:
- backend/src/rag/controllers/webhook.controller.ts
- Authentication working
- Queue dashboard
```

---

### **Phase 3: Integration & Polish** (Week 4) ✨

**Day 22-23: Support Chat Integration**
```bash
Tasks:
□ Update SupportMessageService
□ Add knowledge query detection
□ Implement RAG response flow
□ Add source citations
□ Test conversation context

Deliverables:
- Enhanced support chat
- Source attribution UI
- Integration tests
```

**Day 24-25: Admin UI**
```bash
Tasks:
□ Create Knowledge Base page
□ Document upload component
□ Search testing tool
□ Document viewer
□ Analytics dashboard

Deliverables:
- frontend/src/app/admin/knowledge-base/
- Upload working
- Search UI functional
```

**Day 26-27: Testing & Documentation**
```bash
Tasks:
□ Write unit tests (80% coverage)
□ Write integration tests
□ Write E2E tests
□ Update API documentation
□ Write user guide

Deliverables:
- Test coverage report
- docs/RAG_API.md
- docs/RAG_USER_GUIDE.md
```

**Day 28: Deployment & Launch**
```bash
Tasks:
□ Production environment setup
□ Performance testing
□ Load testing (100 concurrent)
□ Security audit
□ Go live!

Deliverables:
- Production deployment
- Monitoring dashboards
- Launch announcement
```

---

## 🛠️ Technical Stack

### Backend Dependencies

```json
{
  "dependencies": {
    "@qdrant/js-client-rest": "^1.9.0",
    "openai": "^4.28.0",
    "@google/generative-ai": "^0.2.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "bull": "^4.12.0",
    "@nestjs/bull": "^10.0.1",
    "langchain": "^0.1.30",
    "tiktoken": "^1.0.10"
  },
  "devDependencies": {
    "@types/pdf-parse": "^1.1.4",
    "@types/bull": "^4.10.0"
  }
}
```

### Infrastructure

```yaml
# docker-compose.yml additions
services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - ./docker/qdrant/storage:/qdrant/storage
    environment:
      - QDRANT__SERVICE__GRPC_PORT=6334

  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    volumes:
      - ./docker/n8n/data:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - WEBHOOK_URL=http://backend:12001
```

---

## 🗄️ Database Schema

### Prisma Schema Extensions

```prisma
// backend/prisma/schema.prisma

// RAG Document Source
model RagSource {
  id          String   @id @default(uuid())
  name        String
  type        RagSourceType // FILE, URL, API, MANUAL
  description String?
  url         String?
  metadata    Json?
  isActive    Boolean  @default(true)
  
  documents   RagDocument[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  @@map("rag_sources")
}

// RAG Document (metadata only, vectors in Qdrant)
model RagDocument {
  id            String   @id @default(uuid())
  sourceId      String
  source        RagSource @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  
  title         String
  content       String   @db.Text
  contentHash   String   // For deduplication
  fileType      String?  // pdf, docx, txt, html, md
  fileSize      Int?     // bytes
  filePath      String?
  
  language      String   @default("vi")
  category      String?
  tags          String[]
  
  // Vector metadata
  vectorId      String   @unique // ID in Qdrant
  chunkCount    Int      @default(0)
  embeddingModel String  @default("text-embedding-3-small")
  
  // Status
  status        RagDocumentStatus @default(PROCESSING)
  errorMessage  String?
  
  // Analytics
  searchCount   Int      @default(0)
  lastSearched  DateTime?
  qualityScore  Float?   // 0-1, based on usage
  
  chunks        RagChunk[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  createdBy     String?
  updatedBy     String?
  
  @@index([sourceId])
  @@index([status])
  @@index([category])
  @@map("rag_documents")
}

// RAG Chunk (for granular tracking)
model RagChunk {
  id          String   @id @default(uuid())
  documentId  String
  document    RagDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  content     String   @db.Text
  chunkIndex  Int      // Order in document
  
  // Vector metadata
  vectorId    String   @unique // ID in Qdrant
  embedding   String?  // Optional: store embedding as JSON array
  
  // Position in original document
  startChar   Int?
  endChar     Int?
  
  metadata    Json?
  
  createdAt   DateTime @default(now())
  
  @@index([documentId])
  @@index([chunkIndex])
  @@map("rag_chunks")
}

// RAG Search Log (for analytics)
model RagSearchLog {
  id              String   @id @default(uuid())
  
  query           String
  queryEmbedding  String?  // Optional
  
  // Results
  resultsCount    Int
  topDocumentId   String?
  topScore        Float?
  
  // Context
  conversationId  String?
  userId          String?
  
  // Performance
  searchTimeMs    Int
  embeddingTimeMs Int?
  totalTimeMs     Int
  
  // Quality
  userFeedback    Int?     // 1-5 rating
  wasHelpful      Boolean?
  
  createdAt       DateTime @default(now())
  
  @@index([createdAt])
  @@index([conversationId])
  @@map("rag_search_logs")
}

enum RagSourceType {
  FILE
  URL
  API
  MANUAL
}

enum RagDocumentStatus {
  PROCESSING
  ACTIVE
  INACTIVE
  ERROR
}
```

---

## 📡 API Design

### GraphQL Schema

```graphql
# backend/src/schema.gql

# ============================================
# RAG Types
# ============================================

type RagDocument {
  id: ID!
  sourceId: String!
  source: RagSource!
  
  title: String!
  content: String!
  contentHash: String!
  fileType: String
  fileSize: Int
  filePath: String
  
  language: String!
  category: String
  tags: [String!]!
  
  vectorId: String!
  chunkCount: Int!
  embeddingModel: String!
  
  status: RagDocumentStatus!
  errorMessage: String
  
  searchCount: Int!
  lastSearched: DateTime
  qualityScore: Float
  
  chunks: [RagChunk!]!
  
  createdAt: DateTime!
  updatedAt: DateTime!
  createdBy: String
  updatedBy: String
}

type RagChunk {
  id: ID!
  documentId: String!
  document: RagDocument!
  
  content: String!
  chunkIndex: Int!
  vectorId: String!
  
  startChar: Int
  endChar: Int
  metadata: JSON
  
  createdAt: DateTime!
}

type RagSource {
  id: ID!
  name: String!
  type: RagSourceType!
  description: String
  url: String
  metadata: JSON
  isActive: Boolean!
  
  documents: [RagDocument!]!
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

type RagSearchResult {
  document: RagDocument!
  chunk: RagChunk
  score: Float!
  highlights: [String!]
}

type RagResponseWithSources {
  response: String!
  sources: [RagSearchResult!]!
  confidence: Float!
  responseTimeMs: Int!
}

enum RagSourceType {
  FILE
  URL
  API
  MANUAL
}

enum RagDocumentStatus {
  PROCESSING
  ACTIVE
  INACTIVE
  ERROR
}

# ============================================
# RAG Inputs
# ============================================

input CreateRagDocumentInput {
  sourceId: String!
  title: String!
  content: String!
  fileType: String
  category: String
  tags: [String!]
  language: String
}

input UpdateRagDocumentInput {
  title: String
  content: String
  category: String
  tags: [String!]
  status: RagDocumentStatus
}

input SearchRagInput {
  query: String!
  limit: Int = 5
  scoreThreshold: Float = 0.7
  category: String
  language: String
}

input CreateRagSourceInput {
  name: String!
  type: RagSourceType!
  description: String
  url: String
  metadata: JSON
}

# ============================================
# RAG Queries
# ============================================

extend type Query {
  # Search knowledge base
  searchKnowledgeBase(input: SearchRagInput!): [RagSearchResult!]!
  
  # Get RAG documents
  ragDocument(id: ID!): RagDocument
  ragDocuments(
    skip: Int = 0
    take: Int = 20
    status: RagDocumentStatus
    category: String
    sourceId: String
  ): [RagDocument!]!
  
  # Get RAG sources
  ragSource(id: ID!): RagSource
  ragSources(isActive: Boolean): [RagSource!]!
  
  # Analytics
  ragAnalytics(from: DateTime, to: DateTime): RagAnalytics!
}

# ============================================
# RAG Mutations
# ============================================

extend type Mutation {
  # Document management
  createRagDocument(input: CreateRagDocumentInput!): RagDocument!
  updateRagDocument(id: ID!, input: UpdateRagDocumentInput!): RagDocument!
  deleteRagDocument(id: ID!): Boolean!
  
  # Bulk operations
  bulkIndexDocuments(documentIds: [ID!]!): BulkIndexResult!
  reindexAllDocuments: BulkIndexResult!
  
  # Source management
  createRagSource(input: CreateRagSourceInput!): RagSource!
  updateRagSource(id: ID!, input: CreateRagSourceInput!): RagSource!
  deleteRagSource(id: ID!): Boolean!
  
  # Generate RAG response (integrated with support chat)
  generateRagResponse(
    conversationId: ID!
    query: String!
  ): RagResponseWithSources!
  
  # Feedback
  submitRagFeedback(
    searchLogId: ID!
    rating: Int!
    wasHelpful: Boolean!
  ): Boolean!
}

# ============================================
# Supporting Types
# ============================================

type BulkIndexResult {
  total: Int!
  success: Int!
  failed: Int!
  errors: [String!]!
}

type RagAnalytics {
  totalDocuments: Int!
  totalChunks: Int!
  totalSearches: Int!
  averageSearchTime: Float!
  averageConfidence: Float!
  topQueries: [TopQuery!]!
  topDocuments: [TopDocument!]!
}

type TopQuery {
  query: String!
  count: Int!
  avgScore: Float!
}

type TopDocument {
  document: RagDocument!
  searchCount: Int!
  avgScore: Float!
}
```

### REST Webhook Endpoints

```typescript
// backend/src/rag/controllers/webhook.controller.ts

// POST /api/rag/webhook/ingest
interface IngestWebhookPayload {
  documentId?: string;
  title: string;
  content: string;
  sourceId: string;
  metadata?: Record<string, any>;
}

// POST /api/rag/webhook/reindex
interface ReindexWebhookPayload {
  documentIds?: string[];
  sourceIds?: string[];
  all?: boolean;
}

// POST /api/rag/webhook/status
interface StatusWebhookPayload {
  documentId: string;
  status: 'PROCESSING' | 'ACTIVE' | 'ERROR';
  errorMessage?: string;
}
```

---

## 📂 Code Structure

```
backend/src/
├── rag/                                 # 🆕 RAG Module
│   ├── rag.module.ts                   # Module definition
│   │
│   ├── services/
│   │   ├── vector-store.service.ts     # Qdrant integration
│   │   ├── embedding.service.ts        # OpenAI embeddings
│   │   ├── rag-search.service.ts       # Semantic search
│   │   ├── document-parser.service.ts  # File parsing
│   │   ├── chunking.service.ts         # Text chunking
│   │   └── context-builder.service.ts  # Prompt engineering
│   │
│   ├── entities/
│   │   ├── rag-document.entity.ts
│   │   ├── rag-chunk.entity.ts
│   │   └── rag-source.entity.ts
│   │
│   ├── dto/
│   │   ├── create-rag-document.input.ts
│   │   ├── update-rag-document.input.ts
│   │   ├── search-rag.input.ts
│   │   └── create-rag-source.input.ts
│   │
│   ├── resolvers/
│   │   ├── rag.resolver.ts             # GraphQL queries/mutations
│   │   └── rag-analytics.resolver.ts
│   │
│   ├── controllers/
│   │   └── webhook.controller.ts       # n8n webhooks
│   │
│   ├── processors/
│   │   └── document.processor.ts       # Bull queue processor
│   │
│   ├── utils/
│   │   ├── text-splitter.ts
│   │   ├── similarity-calculator.ts
│   │   └── quality-scorer.ts
│   │
│   └── constants/
│       ├── rag.constants.ts
│       └── prompts.constants.ts
│
├── support-chat/
│   └── services/
│       └── support-message.service.ts  # 🔄 Updated with RAG
│
└── ai-provider/
    └── services/
        └── ai-response.service.ts      # 🔄 Enhanced for RAG

frontend/src/
├── app/
│   └── admin/
│       └── knowledge-base/             # 🆕 Knowledge Base UI
│           ├── page.tsx                # List documents
│           ├── upload/
│           │   └── page.tsx            # Upload UI
│           ├── [id]/
│           │   ├── page.tsx            # View document
│           │   └── edit/
│           │       └── page.tsx        # Edit document
│           └── search/
│               └── page.tsx            # Search testing
│
├── components/
│   └── rag/                            # 🆕 RAG Components
│       ├── DocumentUploader.tsx
│       ├── DocumentViewer.tsx
│       ├── SearchTester.tsx
│       ├── SourceCitation.tsx
│       └── AnalyticsDashboard.tsx
│
└── lib/
    └── graphql/
        └── rag.queries.ts              # 🆕 RAG GraphQL queries

n8n/
├── workflows/
│   ├── 01-document-ingestion.json      # 🆕 Workflow 1
│   ├── 02-scheduled-reindex.json       # 🆕 Workflow 2
│   ├── 03-quality-monitoring.json      # 🆕 Workflow 3
│   ├── 04-url-crawler.json             # 🆕 Workflow 4
│   └── 05-analytics.json               # 🆕 Workflow 5
│
└── credentials/
    ├── backend-api-key.json
    └── openai-api-key.json
```

---

## 🧪 Testing Strategy

### Unit Tests (Target: 80% coverage)

```typescript
// backend/src/rag/services/__tests__/embedding.service.spec.ts
describe('EmbeddingService', () => {
  it('should generate embeddings', async () => {
    const text = 'Hello world';
    const embedding = await embeddingService.generateEmbedding(text);
    expect(embedding).toHaveLength(1536); // text-embedding-3-small
  });

  it('should cache embeddings in Redis', async () => {
    const text = 'Cached text';
    await embeddingService.generateEmbedding(text);
    const cached = await redisService.get(`embedding:${hash(text)}`);
    expect(cached).toBeDefined();
  });

  it('should batch process embeddings', async () => {
    const texts = ['Text 1', 'Text 2', 'Text 3'];
    const embeddings = await embeddingService.batchGenerateEmbeddings(texts);
    expect(embeddings).toHaveLength(3);
  });
});

// backend/src/rag/services/__tests__/rag-search.service.spec.ts
describe('RAGSearchService', () => {
  it('should find similar documents', async () => {
    const query = 'How to reset password?';
    const results = await ragSearch.searchSimilarDocuments(query, 3);
    expect(results).toHaveLength(3);
    expect(results[0].score).toBeGreaterThan(0.7);
  });

  it('should build context from results', async () => {
    const query = 'Pricing information';
    const response = await ragSearch.generateRAGResponse('conv-123', query);
    expect(response).toContain('pricing');
  });
});
```

### Integration Tests

```typescript
// backend/src/rag/__tests__/rag-integration.spec.ts
describe('RAG Integration', () => {
  it('should ingest document end-to-end', async () => {
    const doc = await createDocument({
      title: 'Test Doc',
      content: 'Test content...',
    });
    
    // Wait for processing
    await waitForStatus(doc.id, 'ACTIVE');
    
    // Search should return the document
    const results = await searchKnowledgeBase('Test content');
    expect(results[0].document.id).toBe(doc.id);
  });

  it('should handle webhook from n8n', async () => {
    const response = await request(app)
      .post('/api/rag/webhook/ingest')
      .send({
        title: 'Webhook Doc',
        content: 'From n8n',
        sourceId: 'source-1',
      })
      .expect(201);
    
    expect(response.body.id).toBeDefined();
  });
});
```

### E2E Tests

```typescript
// frontend/tests/e2e/knowledge-base.spec.ts
import { test, expect } from '@playwright/test';

test('should upload and search document', async ({ page }) => {
  await page.goto('/admin/knowledge-base/upload');
  
  // Upload file
  await page.setInputFiles('input[type="file"]', 'test-doc.txt');
  await page.click('button:has-text("Upload")');
  
  // Wait for processing
  await expect(page.locator('text=ACTIVE')).toBeVisible({ timeout: 10000 });
  
  // Search
  await page.goto('/admin/knowledge-base/search');
  await page.fill('input[name="query"]', 'test content');
  await page.click('button:has-text("Search")');
  
  // Should find document
  await expect(page.locator('text=test-doc.txt')).toBeVisible();
});
```

### Performance Tests

```typescript
// backend/src/rag/__tests__/performance.spec.ts
describe('RAG Performance', () => {
  it('should search under 100ms', async () => {
    const start = Date.now();
    await ragSearch.searchSimilarDocuments('query', 5);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('should handle 100 concurrent searches', async () => {
    const promises = Array(100).fill(0).map(() =>
      ragSearch.searchSimilarDocuments('test', 5)
    );
    
    const start = Date.now();
    await Promise.all(promises);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(5000); // 5 seconds for 100 requests
  });
});
```

---

## 🚀 Deployment Plan

### Development Environment

```bash
# .env.development
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
OPENAI_API_KEY=sk-...
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=n8n-api-key-dev
REDIS_URL=redis://localhost:6379
```

### Staging Environment

```bash
# .env.staging
QDRANT_URL=http://qdrant-staging:6333
QDRANT_API_KEY=staging-key
OPENAI_API_KEY=sk-...
N8N_WEBHOOK_URL=https://n8n-staging.example.com/webhook
N8N_API_KEY=n8n-api-key-staging
REDIS_URL=redis://redis-staging:6379
```

### Production Environment

```bash
# .env.production
QDRANT_URL=http://qdrant-prod:6333
QDRANT_API_KEY=prod-secure-key
OPENAI_API_KEY=sk-prod-...
N8N_WEBHOOK_URL=https://n8n.tazagroupcore.com/webhook
N8N_API_KEY=n8n-api-key-prod-secure
REDIS_URL=redis://redis-prod:6379

# Performance tuning
QDRANT_GRPC_ENABLED=true
QDRANT_TIMEOUT=5000
REDIS_EMBEDDING_TTL=2592000  # 30 days
CHUNK_SIZE=500
CHUNK_OVERLAP=50
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:v1.7.4
    restart: always
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      - QDRANT__SERVICE__GRPC_PORT=6334
      - QDRANT__SERVICE__HTTP_PORT=6333
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: '2'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=${N8N_HOST}
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=${BACKEND_URL}
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1'

volumes:
  qdrant_storage:
  n8n_data:
```

### Deployment Steps

```bash
# 1. Build backend with RAG module
cd backend
npm run build

# 2. Run database migrations
npx prisma migrate deploy

# 3. Start infrastructure
docker-compose -f docker-compose.prod.yml up -d qdrant n8n

# 4. Wait for services to be healthy
docker-compose -f docker-compose.prod.yml ps

# 5. Import n8n workflows
curl -X POST http://n8n:5678/api/workflows \
  -H "Authorization: Bearer $N8N_API_KEY" \
  -d @n8n/workflows/01-document-ingestion.json

# 6. Create Qdrant collection
curl -X PUT http://qdrant:6333/collections/knowledge_base \
  -H 'Content-Type: application/json' \
  -d '{
    "vectors": {
      "size": 1536,
      "distance": "Cosine"
    },
    "hnsw_config": {
      "m": 16,
      "ef_construct": 100
    }
  }'

# 7. Start backend
pm2 start dist/main.js --name backend-rag

# 8. Verify health
curl http://localhost:12001/health
curl http://localhost:6333/health

# 9. Test RAG endpoint
curl -X POST http://localhost:12001/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query": "{ ragDocuments { id title } }"}'
```

---

## 💰 Cost Estimation

### Infrastructure Costs (Monthly)

```
Vector Database (Qdrant):
├── Option 1: Self-hosted (Docker)
│   ├── Server: 2 CPU, 4GB RAM             = $20
│   ├── Storage: 50GB SSD                  = $5
│   └── Total:                             = $25/month
│
├── Option 2: Qdrant Cloud (Recommended for scale)
│   ├── Free tier: 1GB RAM, 4GB storage    = $0
│   ├── Starter: 2GB RAM, 8GB storage      = $29/month
│   └── Pro: 4GB RAM, 50GB storage         = $99/month
│
└── MVP Choice: Self-hosted                = $25/month

n8n Automation:
├── Option 1: Self-hosted (Docker)
│   ├── Server: 1 CPU, 2GB RAM             = $10
│   └── Total:                             = $10/month
│
├── Option 2: n8n Cloud
│   ├── Starter: 2,500 workflows/month     = $20/month
│   └── Pro: 10,000 workflows/month        = $50/month
│
└── MVP Choice: Self-hosted                = $10/month

AI API Costs (OpenAI):
├── Embeddings (text-embedding-3-small)
│   ├── Price: $0.00002 per 1K tokens
│   ├── 10,000 docs × 500 tokens avg       = 5M tokens
│   ├── Initial indexing:                  = $0.10
│   ├── Monthly updates (10% reindex):     = $0.01/month
│   └── Search queries (5K/month):         = $0.10/month
│
├── AI Responses (GPT-4-turbo)
│   ├── Input: $0.01 per 1K tokens
│   ├── Output: $0.03 per 1K tokens
│   ├── 5,000 queries × 2K context         = 10M input tokens  = $100
│   ├── 5,000 queries × 500 response       = 2.5M output tokens = $75
│   └── Total AI responses:                = $175/month
│
└── Total AI costs:                        = $175.21/month

Redis (Existing):
└── Already included in infrastructure     = $0 additional

PostgreSQL (Existing):
└── Metadata storage (~500MB)              = $0 additional

───────────────────────────────────────────────────────────────
TOTAL MONTHLY COST (MVP):                  = $210/month

Breakdown:
- Infrastructure: $35/month (Qdrant + n8n)
- AI API: $175/month (embeddings + responses)
- Existing services: $0 (Redis, PostgreSQL)
```

### Cost Optimization Strategies

```
1. Embedding Cache (Redis):
   - Cache hit rate: 90%
   - Savings: $0.09/month → $0.01/month (90% reduction)

2. Batch Processing:
   - Batch embeddings: 50-100 docs at once
   - API efficiency: 30% reduction in costs

3. Free Tier Usage:
   - Qdrant Cloud free tier: 1GB (5K-10K docs)
   - OpenAI free credits: $5/month for new accounts

4. Alternative Models:
   - Use Gemini for responses: 50% cheaper
   - Self-host embeddings (sentence-transformers): 100% free
   
5. Smart Routing:
   - Only use RAG for knowledge queries (30% of all queries)
   - Direct AI for general chat (70% of queries)
   - Estimated savings: $50/month

───────────────────────────────────────────────────────────────
OPTIMIZED MONTHLY COST:                    = $120-150/month
```

### Scaling Projections

```
Scenario 1: Small Business (Current MVP)
├── Documents: 10,000
├── Users: 500
├── Queries: 5,000/month
└── Cost: $150/month

Scenario 2: Medium Business (6 months)
├── Documents: 50,000
├── Users: 2,000
├── Queries: 20,000/month
└── Cost: $400/month

Scenario 3: Large Enterprise (1 year)
├── Documents: 200,000
├── Users: 10,000
├── Queries: 100,000/month
├── Qdrant Cloud Pro: $99/month
├── n8n Cloud Pro: $50/month
├── AI API: $1,500/month
└── Cost: $1,650/month
```

---

## 📊 Success Metrics

### Phase 1 Success Criteria (Week 1-2)

```
Technical Metrics:
✓ Vector search latency < 50ms (p95)
✓ Embedding generation < 200ms per doc
✓ Cache hit rate > 90%
✓ Document ingestion < 5 seconds per doc
✓ 80% unit test coverage
✓ Zero critical bugs

Functional Metrics:
✓ Successfully index 100 test documents
✓ Search returns relevant results (manual validation)
✓ GraphQL API responds correctly
✓ Error handling works as expected
```

### Phase 2 Success Criteria (Week 3)

```
Technical Metrics:
✓ PDF parsing accuracy > 95%
✓ n8n workflows execute without errors
✓ Webhook latency < 500ms
✓ Queue processing < 1 minute per document

Functional Metrics:
✓ Upload PDF/DOCX/HTML successfully
✓ Auto-chunking produces logical segments
✓ Scheduled reindexing runs every 24 hours
✓ Monitoring detects and alerts on failures
```

### Phase 3 Success Criteria (Week 4)

```
Technical Metrics:
✓ End-to-end search latency < 100ms
✓ Support chat integration works seamlessly
✓ Admin UI loads < 2 seconds
✓ 100 concurrent users supported

Functional Metrics:
✓ Support agents can upload documents
✓ Customers receive RAG-enhanced answers
✓ Source citations are accurate
✓ Analytics dashboard shows real data

Business Metrics:
✓ 30% of support queries answered by RAG
✓ Customer satisfaction score > 4/5
✓ Average handling time reduced by 20%
```

### Long-term KPIs (Post-MVP)

```
Performance KPIs:
- Search relevance (MRR - Mean Reciprocal Rank) > 0.8
- Answer accuracy (human evaluation) > 85%
- System uptime > 99.9%
- Average response time < 2 seconds

Business KPIs:
- Support ticket reduction: 40-60%
- First response time: < 30 seconds
- Customer self-service rate: 50%+
- Agent productivity: +30%

Quality KPIs:
- User feedback rating: > 4.2/5
- Answer relevance score: > 0.75
- Document coverage: 90% of common questions
- Update frequency: Weekly
```

---

## 📚 Documentation Deliverables

### 1. Technical Documentation

```
docs/
├── RAG_API.md                    # GraphQL API reference
├── RAG_ARCHITECTURE.md           # System design & diagrams
├── RAG_DEPLOYMENT.md             # Deployment guide
└── RAG_TROUBLESHOOTING.md        # Common issues & solutions
```

### 2. User Documentation

```
docs/
├── RAG_USER_GUIDE.md             # Admin user manual
├── RAG_BEST_PRACTICES.md         # Content guidelines
└── RAG_FAQ.md                    # Frequently asked questions
```

### 3. Developer Documentation

```
docs/
├── RAG_DEVELOPMENT.md            # Development setup
├── RAG_TESTING.md                # Testing guide
└── RAG_CONTRIBUTING.md           # Contribution guidelines
```

### 4. n8n Workflows Documentation

```
n8n/docs/
├── WORKFLOW_01_INGESTION.md      # Document ingestion workflow
├── WORKFLOW_02_REINDEX.md        # Scheduled reindexing
├── WORKFLOW_03_MONITORING.md     # Quality monitoring
├── WORKFLOW_04_CRAWLER.md        # URL crawler
└── WORKFLOW_05_ANALYTICS.md      # Performance analytics
```

---

## 🎯 MVP Feature Checklist

### Must Have (P0) ✅

```
Backend:
□ Vector database setup (Qdrant)
□ Embedding generation (OpenAI)
□ Semantic search (cosine similarity)
□ Document CRUD (GraphQL)
□ Basic chunking (fixed size)
□ PostgreSQL metadata storage
□ Redis caching
□ Error handling & logging

Frontend:
□ Document upload UI
□ Knowledge base browser
□ Search testing tool
□ Basic analytics dashboard

Integration:
□ Support chat RAG integration
□ Source citations in responses
□ n8n document ingestion workflow
□ n8n scheduled reindexing

Testing:
□ Unit tests (80% coverage)
□ Integration tests
□ Manual QA
```

### Should Have (P1) 🔶

```
Backend:
□ Advanced document formats (PDF, DOCX, HTML)
□ Batch operations
□ Quality scoring
□ Search analytics logging

Frontend:
□ Document editing
□ Bulk upload
□ Advanced search filters
□ Real-time status updates

Integration:
□ n8n quality monitoring
□ n8n URL crawler
□ Webhook authentication
```

### Nice to Have (P2) 💡

```
Backend:
□ Multi-language support
□ Advanced chunking (semantic)
□ Auto-categorization
□ A/B testing framework

Frontend:
□ Document preview
□ Collaboration features
□ Advanced analytics
□ Export capabilities

Integration:
□ n8n performance analytics
□ Slack notifications
□ Email reports
```

---

## 🚨 Risk Management

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Vector DB performance degradation | High | Medium | Load testing, index optimization, caching |
| OpenAI API rate limits | High | Low | Request queuing, fallback to cached results |
| Large file processing failures | Medium | Medium | Streaming, chunking, timeout handling |
| n8n workflow errors | Medium | Medium | Error handling, retry logic, monitoring |
| Embedding quality issues | High | Low | Use proven models, validate with test queries |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low adoption by support agents | High | Medium | Training, UX improvements, feedback loop |
| Poor answer quality | High | Medium | Regular content updates, quality monitoring |
| High operational costs | Medium | Low | Cost optimization, usage monitoring |
| Data privacy concerns | High | Low | Encryption, access controls, compliance |

### Mitigation Strategies

```
1. Performance Monitoring:
   - Set up alerts for response time > 100ms
   - Monitor Qdrant resource usage
   - Track embedding API costs daily

2. Quality Assurance:
   - Weekly manual testing of top queries
   - Monthly content review
   - Quarterly user satisfaction surveys

3. Cost Control:
   - Daily cost tracking dashboard
   - Alerts for unusual spending
   - Monthly budget reviews

4. Disaster Recovery:
   - Daily Qdrant backups
   - Weekly PostgreSQL backups
   - Documented recovery procedures
```

---

## 📞 Support & Maintenance

### Post-Launch Support (Weeks 5-8)

```
Week 5: Monitoring & Optimization
- Monitor production metrics
- Fix critical bugs (P0)
- Performance tuning
- User feedback collection

Week 6: Content Building
- Upload initial knowledge base (500+ docs)
- Train support team
- Refine categorization
- Update documentation

Week 7: Enhancement
- Implement P1 features
- UI/UX improvements based on feedback
- Advanced analytics
- Integration improvements

Week 8: Stabilization
- Bug fixes (P1, P2)
- Performance optimization
- Documentation updates
- Prepare for scale
```

### Ongoing Maintenance (Monthly)

```
Technical Maintenance:
- Update dependencies
- Qdrant index optimization
- Redis cache cleanup
- Log rotation & cleanup
- Security patches

Content Maintenance:
- Review and update documents
- Remove outdated content
- Add new FAQs
- Improve low-performing answers

Performance Tuning:
- Analyze slow queries
- Optimize vector indexes
- Cache hit rate optimization
- Cost optimization review

Quality Assurance:
- Test critical user paths
- Review error logs
- User feedback analysis
- A/B test improvements
```

---

## 🎓 Training & Knowledge Transfer

### Developer Training (Week 1)

```
Topics:
1. RAG fundamentals (2 hours)
   - What is RAG?
   - Vector embeddings explained
   - Semantic search basics

2. Architecture walkthrough (2 hours)
   - System components
   - Data flow
   - API design

3. Hands-on coding (4 hours)
   - Set up local environment
   - Create a document
   - Run a search query
   - Debug common issues

Deliverables:
- Training slides
- Code examples
- Video recordings
```

### Support Team Training (Week 6)

```
Topics:
1. Knowledge base management (1 hour)
   - Upload documents
   - Organize content
   - Best practices

2. Search testing (30 minutes)
   - Test search queries
   - Interpret results
   - Provide feedback

3. Analytics dashboard (30 minutes)
   - Read metrics
   - Identify issues
   - Report problems

Deliverables:
- User manual
- Video tutorials
- Quick reference guide
```

---

## 🎉 Go-Live Checklist

### Pre-Launch (Day -7)

```
□ All P0 features tested and working
□ Production environment configured
□ Qdrant production instance ready
□ n8n workflows deployed
□ Database migrations run
□ Security audit completed
□ Performance testing passed (100 concurrent users)
□ Backup & recovery tested
□ Monitoring & alerts configured
□ Documentation finalized
```

### Launch Day (Day 0)

```
□ Deploy backend to production
□ Deploy frontend to production
□ Import initial knowledge base (500 docs)
□ Verify all services healthy
□ Test end-to-end user flow
□ Announce to support team
□ Monitor for 4 hours continuously
□ Be ready for rollback if needed
```

### Post-Launch (Day +1 to +7)

```
□ Monitor error rates (target: <1%)
□ Monitor response times (target: <100ms)
□ Collect user feedback
□ Daily check-in meetings
□ Document issues & resolutions
□ Plan Week 5 improvements
□ Celebrate success! 🎊
```

---

## 📝 Appendix

### A. Useful Resources

```
Documentation:
- Qdrant: https://qdrant.tech/documentation/
- LangChain: https://js.langchain.com/docs/
- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings
- n8n: https://docs.n8n.io/

Tutorials:
- RAG from Scratch: https://www.pinecone.io/learn/retrieval-augmented-generation/
- Vector Databases: https://www.deeplearning.ai/short-courses/vector-databases-embeddings/

Papers:
- RAG Paper (Lewis et al.): https://arxiv.org/abs/2005.11401
- Dense Passage Retrieval: https://arxiv.org/abs/2004.04906
```

### B. Sample Prompts

```typescript
// prompts.constants.ts

export const RAG_SYSTEM_PROMPT = `You are a helpful customer support assistant for tazagroupcore.

Use the following knowledge base context to answer the user's question accurately:

{context}

Guidelines:
1. Answer ONLY based on the provided context
2. If the answer is not in the context, say "I don't have that information"
3. Cite sources by mentioning document titles
4. Be concise and friendly
5. Use Vietnamese language

Context:
{context}

Question: {question}

Answer:`;

export const RAG_FALLBACK_PROMPT = `You are a helpful customer support assistant.
The knowledge base doesn't have information about this question, but try to help based on general knowledge about customer support.

Question: {question}

Answer:`;
```

### C. Configuration Examples

```typescript
// rag.constants.ts

export const RAG_CONFIG = {
  // Chunking
  CHUNK_SIZE: 500,              // tokens
  CHUNK_OVERLAP: 50,            // tokens
  
  // Embeddings
  EMBEDDING_MODEL: 'text-embedding-3-small',
  EMBEDDING_DIMENSIONS: 1536,
  
  // Search
  DEFAULT_TOP_K: 5,
  SCORE_THRESHOLD: 0.7,         // 0-1, cosine similarity
  
  // Vector Store
  VECTOR_COLLECTION: 'knowledge_base',
  HNSW_M: 16,                   // HNSW graph links
  HNSW_EF_CONSTRUCT: 100,       // Construction quality
  
  // Cache
  EMBEDDING_CACHE_TTL: 30 * 24 * 60 * 60, // 30 days
  SEARCH_CACHE_TTL: 5 * 60,     // 5 minutes
  
  // Processing
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  BATCH_SIZE: 100,               // documents per batch
  
  // Monitoring
  LOG_SEARCH_QUERIES: true,
  TRACK_PERFORMANCE: true,
};
```

---

## ✅ Next Steps

### Immediate Actions (This Week)

1. **Review this plan with team** (1 hour)
   - Discuss timeline
   - Confirm resource allocation
   - Adjust scope if needed

2. **Setup development environment** (2 hours)
   - Install Qdrant locally
   - Install n8n locally
   - Test connectivity

3. **Create project structure** (1 hour)
   - Create folders
   - Initialize modules
   - Setup Git branches

4. **Kickoff meeting** (1 hour)
   - Assign responsibilities
   - Set up daily standups
   - Create project board

### Week 1 Goals

- [ ] Qdrant running and tested
- [ ] Embedding service working
- [ ] First successful vector search
- [ ] GraphQL API skeleton

### Week 2 Goals

- [ ] Document CRUD complete
- [ ] RAG search integrated
- [ ] Basic testing suite
- [ ] Demo to stakeholders

---

**Document Version:** 1.0  
**Last Updated:** October 31, 2025  
**Owner:** Development Team  
**Status:** Ready for Implementation 🚀

---

**Ready to start? Begin with Phase 1, Day 1: Vector Database Setup!**

Good luck! 💪
