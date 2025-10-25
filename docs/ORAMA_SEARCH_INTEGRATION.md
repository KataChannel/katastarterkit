# Orama Self-Hosted Search Integration

## Overview

This document describes the Orama self-hosted search engine integration in the rausachcore application. Orama provides fast, full-text search capabilities across all major entities without requiring external services like Elasticsearch.

## Features

✅ **Self-hosted** - All search indexes stored locally in file system  
✅ **Fast full-text search** - Sub-millisecond search performance  
✅ **Multi-entity search** - Search across Tasks, Users, Affiliate Campaigns, and Affiliate Links  
✅ **Universal search UI** - Single search bar with instant results  
✅ **Keyboard navigation** - Arrow keys and Enter support  
✅ **Relevance scoring** - Results ranked by relevance score  
✅ **GraphQL API** - Full GraphQL integration for all search operations  
✅ **Auto-persistence** - Indexes automatically saved to disk  

## Architecture

### Backend Components

1. **OramaService** (`backend/src/search/orama.service.ts`)
   - Manages search indexes for all entity types
   - Handles index persistence to file system
   - Provides CRUD operations for indexed documents
   - Supports bulk indexing and reindexing

2. **OramaSearchResolver** (`backend/src/graphql/resolvers/orama-search.resolver.ts`)
   - GraphQL API for search operations
   - Query endpoints for each entity type
   - Universal search endpoint
   - Reindex mutation for admin operations

3. **GraphQL Models** (`backend/src/graphql/models/orama-search.model.ts`)
   - Type definitions for search results
   - Input types for search queries
   - Health check and status types

### Frontend Components

1. **UniversalSearch** (`frontend/src/components/search/universal-search.tsx`)
   - React component for search UI
   - Real-time search with debouncing (300ms)
   - Keyboard navigation support
   - Result categorization and scoring display

### Data Storage

Search indexes are persisted to the file system at:
```
backend/data/orama/
├── tasks.json
├── users.json
├── affiliate_campaigns.json
└── affiliate_links.json
```

Location can be configured via environment variable:
```env
ORAMA_PERSIST_PATH=./data/orama
```

## Search Schemas

### Tasks Schema
```typescript
{
  id: string
  title: string
  description: string
  status: string
  priority: string
  tags: string[]
  authorId: string
  assigneeId: string
  projectId: string
  teamId: string
  createdAt: number (timestamp)
  updatedAt: number (timestamp)
  dueDate: number (timestamp)
}
```

### Users Schema
```typescript
{
  id: string
  email: string
  name: string
  role: string
  department: string
  skills: string[]
  createdAt: number (timestamp)
}
```

### Affiliate Campaigns Schema
```typescript
{
  id: string
  name: string
  description: string
  status: string
  commissionType: string
  commissionValue: number
  startDate: number (timestamp)
  endDate: number (timestamp)
  createdAt: number (timestamp)
}
```

### Affiliate Links Schema
```typescript
{
  id: string
  campaignId: string
  userId: string
  code: string
  url: string
  clicks: number
  conversions: number
  createdAt: number (timestamp)
}
```

## GraphQL API

### Queries

#### Search Tasks
```graphql
query SearchTasks($input: OramaSearchInput!) {
  searchTasks(input: $input) {
    hits {
      id
      score
      document
    }
    count
    elapsed {
      formatted
    }
  }
}
```

#### Search Users
```graphql
query SearchUsers($input: OramaSearchInput!) {
  searchUsers(input: $input) {
    hits {
      id
      score
      document
    }
    count
    elapsed {
      formatted
    }
  }
}
```

#### Universal Search (All Entity Types)
```graphql
query UniversalSearch($input: OramaSearchInput!) {
  universalSearch(input: $input) {
    tasks {
      hits {
        id
        score
        document
      }
      count
    }
    users {
      hits {
        id
        score
        document
      }
      count
    }
    affiliateCampaigns {
      hits {
        id
        score
        document
      }
      count
    }
    affiliateLinks {
      hits {
        id
        score
        document
      }
      count
    }
  }
}
```

#### Health Check
```graphql
query OramaHealthCheck {
  oramaHealthCheck {
    status
    indexes
  }
}
```

### Mutations

#### Reindex All Data
```graphql
mutation ReindexAllData {
  reindexAllData {
    success
    message
    totalIndexed
  }
}
```

### Input Types

```graphql
input OramaSearchInput {
  term: String              # Search query text
  where: JSON               # Filter conditions
  facets: JSON              # Faceted search configuration
  sortBy: OramaSortInput    # Sort configuration
  limit: Int                # Results limit (default: 20)
  offset: Int               # Results offset (default: 0)
}

input OramaSortInput {
  property: String!
  order: SortOrder!         # ASC or DESC
}
```

## Usage Examples

### Backend - Indexing New Documents

```typescript
import { OramaService } from './search/orama.service';

// Index a task when created
await oramaService.indexTask({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  userId: task.userId,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

// Index an affiliate campaign
await oramaService.indexAffiliateCampaign({
  id: campaign.id,
  name: campaign.name,
  description: campaign.description,
  status: campaign.status,
  commissionType: campaign.commissionType,
  commissionRate: campaign.commissionRate,
  startDate: campaign.startDate,
  endDate: campaign.endDate,
});
```

### Frontend - Using Universal Search

The universal search component is integrated into the admin layout navigation bar:

```tsx
import { UniversalSearch } from '@/components/search/universal-search';

// Component is already integrated in AdminSidebarLayout
// Located in the header navigation
```

### GraphQL Client - Searching

```typescript
import { gql, useQuery } from '@apollo/client';

const SEARCH_TASKS = gql`
  query SearchTasks($input: OramaSearchInput!) {
    searchTasks(input: $input) {
      hits {
        id
        score
        document
      }
      count
    }
  }
`;

const { data } = useQuery(SEARCH_TASKS, {
  variables: {
    input: {
      term: 'urgent bug fix',
      limit: 10,
      sortBy: {
        property: 'createdAt',
        order: 'DESC'
      }
    }
  }
});
```

## Reindexing

### Manual Reindex via Script

To manually reindex all data from the database:

```bash
cd backend
bun run orama:reindex
```

This will:
1. Create fresh indexes for all entity types
2. Fetch all data from the database
3. Index documents into Orama
4. Save indexes to file system

### Automatic Reindex via GraphQL

```graphql
mutation {
  reindexAllData {
    success
    message
  }
}
```

**Note:** Reindex mutations should be restricted to admin users in production.

## Integration Points

### Task Service Integration

To automatically index tasks on CRUD operations:

```typescript
// In TaskService
async createTask(data: CreateTaskInput) {
  const task = await this.prisma.task.create({ data });
  
  // Index in Orama
  await this.oramaService.indexTask(task);
  
  return task;
}

async updateTask(id: string, data: UpdateTaskInput) {
  const task = await this.prisma.task.update({ where: { id }, data });
  
  // Update in Orama
  await this.oramaService.updateTask(id, task);
  
  return task;
}

async deleteTask(id: string) {
  await this.prisma.task.delete({ where: { id } });
  
  // Remove from Orama
  await this.oramaService.removeTask(id);
}
```

### Affiliate Service Integration

Similar pattern for affiliate entities:

```typescript
// In AffiliateCampaignService
async createCampaign(data: CreateCampaignInput) {
  const campaign = await this.prisma.affCampaign.create({ data });
  await this.oramaService.indexAffiliateCampaign(campaign);
  return campaign;
}

// In AffiliateLinkService
async createLink(data: CreateLinkInput) {
  const link = await this.prisma.affLink.create({ data });
  await this.oramaService.indexAffiliateLink(link);
  return link;
}
```

## Performance

- **Index Size**: ~1-10 MB per 10,000 documents (depends on content)
- **Search Speed**: < 10ms for most queries
- **Initialization**: Indexes loaded on app startup from persisted files
- **Memory**: In-memory indexes for fast access
- **Persistence**: Auto-saved after each write operation

## Configuration

### Environment Variables

```env
# Orama search configuration
ORAMA_PERSIST_PATH=./data/orama
```

### Module Setup

The `OramaService` is automatically initialized on module init:

```typescript
@Injectable()
export class OramaService implements OnModuleInit {
  async onModuleInit() {
    await this.initializeIndexes(); // Load persisted indexes
  }
}
```

## Monitoring

### Health Check

Check search engine status:

```graphql
query {
  oramaHealthCheck {
    status
    indexes
  }
}
```

Expected response:
```json
{
  "status": "healthy",
  "indexes": [
    "tasks",
    "users",
    "affiliate_campaigns",
    "affiliate_links"
  ]
}
```

### Search Analytics

Search results include timing information:

```json
{
  "elapsed": {
    "formatted": "2ms"
  }
}
```

## Security

- All search endpoints require JWT authentication (`@UseGuards(JwtAuthGuard)`)
- User context available via `@Context() context: any`
- Reindex mutation should be restricted to admin roles in production
- No sensitive data should be indexed (passwords, tokens, etc.)

## Troubleshooting

### Indexes Not Loading

If indexes fail to load on startup:

1. Check `ORAMA_PERSIST_PATH` directory exists
2. Verify file permissions
3. Run reindex script: `bun run orama:reindex`

### Search Returns No Results

1. Verify data has been indexed: Check `data/orama/*.json` files
2. Run health check query
3. Reindex data: `bun run orama:reindex`
4. Check search term formatting

### Slow Search Performance

1. Check index size: Large indexes may need optimization
2. Reduce result limit
3. Use more specific search terms
4. Consider adding filters via `where` clause

## Future Enhancements

- [ ] Faceted search with aggregations
- [ ] Search suggestions and autocomplete
- [ ] Advanced filtering UI
- [ ] Search history per user
- [ ] Scheduled automatic reindexing
- [ ] Search result highlighting
- [ ] Synonym support
- [ ] Multi-language support
- [ ] Search analytics dashboard
- [ ] Index optimization and compression

## References

- [Orama Documentation](https://docs.oramasearch.com/)
- [GraphQL Schema](../backend/src/graphql/models/orama-search.model.ts)
- [Service Implementation](../backend/src/search/orama.service.ts)
- [Frontend Component](../frontend/src/components/search/universal-search.tsx)
