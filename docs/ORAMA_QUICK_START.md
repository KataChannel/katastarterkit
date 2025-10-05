# Orama Search - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### 1. Index Your Data

First time setup - index existing data from database:

```bash
cd backend
bun run orama:reindex
```

**Expected Output:**
```
🔍 Orama Search Index Population
================================

✓ Ensured persist directory: ./data/orama

📝 Indexing tasks...
✓ Indexed X tasks

👥 Indexing users...
✓ Indexed X users

🎯 Indexing affiliate campaigns...
✓ Indexed X affiliate campaigns

🔗 Indexing affiliate links...
✓ Indexed X affiliate links

✅ Reindexing completed successfully!
   Total documents indexed: X
   Duration: X.XXs
```

### 2. Start Your Application

```bash
# Backend
cd backend
bun run dev

# Frontend (in another terminal)
cd frontend
bun run dev
```

### 3. Try the Search

1. **Navigate to admin panel**: http://localhost:3000/admin/dashboard
2. **Login** with your credentials
3. **Look for the search bar** in the top navigation
4. **Type to search** - results appear instantly!

### 4. Test in GraphQL Playground

Open: http://localhost:14000/graphql

**Try this query:**

```graphql
query TestSearch {
  universalSearch(input: { term: "test", limit: 5 }) {
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
  }
}
```

**Check health:**

```graphql
query Health {
  oramaHealthCheck {
    status
    indexes
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "oramaHealthCheck": {
      "status": "healthy",
      "indexes": [
        "tasks",
        "users",
        "affiliate_campaigns",
        "affiliate_links"
      ]
    }
  }
}
```

---

## 💡 Common Use Cases

### Search for Tasks

```graphql
query SearchTasks {
  searchTasks(input: { 
    term: "bug fix",
    limit: 10,
    sortBy: { property: "createdAt", order: DESC }
  }) {
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

### Search for Users

```graphql
query SearchUsers {
  searchUsers(input: { 
    term: "john",
    limit: 5
  }) {
    hits {
      id
      document
    }
    count
  }
}
```

### Search Everything

```graphql
query SearchAll {
  universalSearch(input: { term: "affiliate" }) {
    tasks { count }
    users { count }
    affiliateCampaigns {
      hits {
        id
        score
        document
      }
      count
    }
    affiliateLinks { count }
  }
}
```

---

## 🔄 Keeping Indexes Updated

### Option 1: Manual Reindex

Run anytime to refresh all indexes:

```bash
bun run orama:reindex
```

### Option 2: GraphQL Mutation (Admin Only)

```graphql
mutation Reindex {
  reindexAllData {
    success
    message
  }
}
```

### Option 3: Automatic (Recommended for Production)

Add to your service methods:

```typescript
// In your TaskService
import { OramaService } from '../search/orama.service';

constructor(
  private prisma: PrismaService,
  private oramaService: OramaService, // Add this
) {}

async createTask(data: CreateTaskInput) {
  const task = await this.prisma.task.create({ data });
  
  // Auto-index
  await this.oramaService.indexTask(task);
  
  return task;
}

async updateTask(id: string, data: UpdateTaskInput) {
  const task = await this.prisma.task.update({ where: { id }, data });
  
  // Update index
  await this.oramaService.updateTask(id, task);
  
  return task;
}

async deleteTask(id: string) {
  await this.prisma.task.delete({ where: { id } });
  
  // Remove from index
  await this.oramaService.removeTask(id);
}
```

---

## 🎹 Keyboard Shortcuts (in Search UI)

- **Start typing** - Instant search
- **↓ Arrow Down** - Next result
- **↑ Arrow Up** - Previous result  
- **Enter** - Open selected result
- **Escape** - Close search results

---

## 🐛 Troubleshooting

### No Results Found

**Check 1: Are indexes populated?**
```bash
ls -lh backend/data/orama/
```

Should show 4 files with size > 0 KB.

**Check 2: Run health check**
```graphql
query { oramaHealthCheck { status indexes } }
```

**Solution: Reindex**
```bash
bun run orama:reindex
```

### Search Returns Old Data

**Problem:** Database updated but search not reflecting changes

**Solution:** Reindex or implement auto-indexing (see above)

### Search is Slow

**Check:** How many documents are indexed?

```bash
# Check file sizes
ls -lh backend/data/orama/
```

**If files > 50MB each:**
- Consider pagination (use `limit` and `offset`)
- Use specific entity searches instead of universal search
- Add filters via `where` clause

---

## 📚 Learn More

- **Full Documentation**: `docs/ORAMA_SEARCH_INTEGRATION.md`
- **Implementation Summary**: `docs/ORAMA_IMPLEMENTATION_SUMMARY.md`
- **Orama Docs**: https://docs.oramasearch.com/

---

## ✅ Quick Checklist

- [ ] Indexed data: `bun run orama:reindex`
- [ ] Backend running: `bun run dev`
- [ ] Frontend running: `bun run dev`
- [ ] Tested search in UI
- [ ] Tested GraphQL queries
- [ ] Health check passing
- [ ] Search results displaying correctly

**You're ready to search! 🎉**
