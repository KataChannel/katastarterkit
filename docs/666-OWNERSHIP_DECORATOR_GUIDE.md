# Ownership Validation Decorator - Usage Guide

## Overview
The `@RequireOwnership` decorator automatically validates that the authenticated user owns the resource before allowing access. This works in combination with `@RequirePermissions` to provide complete access control.

## How It Works

1. **Permission Check** (via `@RequirePermissions` + `RBACGuard`)
   - Check if user has the required permission
   - Apply scope hierarchy (all > organization > team > own)

2. **Ownership Check** (via `@RequireOwnership` + `OwnershipGuard`)
   - Fetch the resource from database
   - Check if user owns the resource
   - Allow ADMIN bypass
   - Allow users with 'all' scope to bypass (configurable)

## Basic Usage

### Single Ownership Field

```typescript
import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { RBACGuard } from '../common/guards/rbac.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { RequirePermissions } from '../common/decorators/rbac.decorator';
import { RequireOwnership } from '../common/decorators/ownership.decorator';

@Controller('blogs')
@UseGuards(RBACGuard, OwnershipGuard) // Apply guards
export class BlogController {
  
  @Put(':id')
  @RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
  @RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
  async updateBlog(@Param('id') id: string, @Body() data: UpdateBlogDto) {
    // At this point:
    // 1. User has blog:update:own permission
    // 2. User owns the blog (blog.authorId === user.id)
    return this.blogService.update(id, data);
  }
}
```

### Multiple Ownership Fields

Check multiple fields - user can own via any of the fields:

```typescript
@Delete(':id')
@RequirePermissions({ resource: 'post', action: 'delete', scope: 'own' })
@RequireOwnership({ 
  resource: 'post', 
  ownershipField: ['authorId', 'createdBy'] // Check both fields
})
async deletePost(@Param('id') id: string) {
  // User can delete if:
  // - post.authorId === user.id OR
  // - post.createdBy === user.id
  return this.postService.delete(id);
}
```

### Custom Parameter Name

By default, decorator looks for `:id` in route params. Use `paramName` for custom params:

```typescript
@Get(':postId/comments/:commentId')
@RequirePermissions({ resource: 'comment', action: 'update', scope: 'own' })
@RequireOwnership({ 
  resource: 'comment', 
  ownershipField: 'userId',
  paramName: 'commentId' // Look for :commentId instead of :id
})
async updateComment(
  @Param('postId') postId: string,
  @Param('commentId') commentId: string,
  @Body() data: UpdateCommentDto
) {
  return this.commentService.update(commentId, data);
}
```

### Nested Property Access

Support dot notation for nested properties:

```typescript
@Put(':id')
@RequirePermissions({ resource: 'task', action: 'update', scope: 'own' })
@RequireOwnership({ 
  resource: 'task', 
  ownershipField: 'assignee.id' // Access nested property
})
async updateTask(@Param('id') id: string, @Body() data: UpdateTaskDto) {
  // Checks if task.assignee.id === user.id
  return this.taskService.update(id, data);
}
```

## Advanced Options

### Disable 'all' Scope Bypass

By default, users with 'all' scope can bypass ownership check. Disable this:

```typescript
@Delete(':id')
@RequirePermissions({ resource: 'sensitive_data', action: 'delete', scope: 'own' })
@RequireOwnership({ 
  resource: 'sensitive_data', 
  ownershipField: 'ownerId',
  allowWithAllScope: false // Even 'all' scope users must own the resource
})
async deleteSensitiveData(@Param('id') id: string) {
  // STRICT ownership check - even admins need to own
  // (ADMIN roleType still bypasses)
  return this.service.delete(id);
}
```

## Supported Resource Types

The guard automatically maps resource types to Prisma models:

| Resource Type | Prisma Model | Ownership Field Example |
|---------------|--------------|-------------------------|
| `blog` | `Post` | `authorId` |
| `post` | `Post` | `authorId` |
| `product` | `Product` | `createdBy` |
| `page` | `Page` | `createdBy` |
| `template` | `CustomTemplate` | `userId` |
| `order` | `Order` | `userId` |
| `task` | `Task` | `assigneeId` |
| `comment` | `Comment` | `userId` |

### Adding Custom Resource Types

Edit `OwnershipGuard.fetchResource()`:

```typescript
private async fetchResource(resourceType: string, resourceId: string): Promise<any> {
  const modelMap: Record<string, any> = {
    // ... existing mappings
    'custom_resource': this.prisma.customModel,
  };
  // ...
}
```

## Real-World Examples

### Blog Management

```typescript
@Controller('blogs')
@UseGuards(RBACGuard, OwnershipGuard)
export class BlogController {
  
  // Anyone can read published blogs
  @Get()
  @Public()
  async findAll() {
    return this.blogService.findPublished();
  }
  
  // Create blog - no ownership check needed (new resource)
  @Post()
  @RequirePermissions({ resource: 'blog', action: 'create', scope: 'own' })
  async create(@Body() data: CreateBlogDto, @CurrentUser() user: any) {
    return this.blogService.create(data, user.id);
  }
  
  // Update blog - ownership check required
  @Put(':id')
  @RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
  @RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
  async update(@Param('id') id: string, @Body() data: UpdateBlogDto) {
    return this.blogService.update(id, data);
  }
  
  // Delete blog - ownership check required
  @Delete(':id')
  @RequirePermissions({ resource: 'blog', action: 'delete', scope: 'own' })
  @RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
  
  // Publish blog - manager can publish anyone's blog
  @Post(':id/publish')
  @RequirePermissions({ resource: 'blog', action: 'publish', scope: 'all' })
  async publish(@Param('id') id: string) {
    // No ownership check - permission is 'all' scope
    return this.blogService.publish(id);
  }
}
```

### E-commerce Orders

```typescript
@Controller('orders')
@UseGuards(RBACGuard, OwnershipGuard)
export class OrderController {
  
  // View own orders
  @Get(':id')
  @RequirePermissions({ resource: 'order', action: 'read', scope: 'own' })
  @RequireOwnership({ resource: 'order', ownershipField: 'userId' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
  
  // Cancel own orders
  @Post(':id/cancel')
  @RequirePermissions({ resource: 'order', action: 'cancel', scope: 'own' })
  @RequireOwnership({ resource: 'order', ownershipField: 'userId' })
  async cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }
  
  // Order manager can view all orders (no ownership decorator)
  @Get()
  @RequirePermissions({ resource: 'order', action: 'read', scope: 'all' })
  async findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(query);
  }
}
```

## Bypass Rules

### Who Can Bypass Ownership Check?

1. **ADMIN Role Type**
   - User with `user.roleType === 'ADMIN'`
   - Always bypasses ownership check
   - Cannot be disabled

2. **'all' Scope Permission**
   - User with permission scope 'all' (e.g., `blog:update:all`)
   - Can bypass ownership check
   - Can be disabled with `allowWithAllScope: false`

3. **No Ownership Check**
   - Don't use `@RequireOwnership` decorator
   - Only permission check will apply

### Example Flow

```typescript
// User: blog_editor (has blog:update:own)
// Blog: { id: '123', authorId: 'other-user-id' }

@Put(':id')
@RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
@RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
async updateBlog(@Param('id') id: string, @Body() data: UpdateBlogDto) {
  return this.blogService.update(id, data);
}

// Result: 403 Forbidden - User doesn't own the blog
```

```typescript
// User: blog_manager (has blog:update:all)
// Blog: { id: '123', authorId: 'other-user-id' }

@Put(':id')
@RequirePermissions({ resource: 'blog', action: 'update', scope: 'all' })
@RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
async updateBlog(@Param('id') id: string, @Body() data: UpdateBlogDto) {
  return this.blogService.update(id, data);
}

// Result: 200 OK - User has 'all' scope, bypasses ownership check
```

## Error Handling

### Common Errors

1. **403 Forbidden - Ownership Required**
   ```
   "You can only access your own resources"
   ```
   - User doesn't own the resource
   - Solution: Check ownership field value

2. **404 Not Found - Resource Not Found**
   ```
   "blog with ID xxx not found"
   ```
   - Resource doesn't exist
   - Solution: Verify resource ID

3. **404 Not Found - Param Not Found**
   ```
   "Resource ID not found in params.id"
   ```
   - Route param name mismatch
   - Solution: Use `paramName` option

4. **500 Error - Unknown Resource Type**
   ```
   "Unknown resource type: xxx"
   ```
   - Resource type not in modelMap
   - Solution: Add to modelMap in guard

## Best Practices

### ✅ DO's

1. **Combine with Permission Check**
   ```typescript
   @RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
   @RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
   ```

2. **Use Specific Ownership Fields**
   ```typescript
   @RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
   // Better than generic 'userId' if multiple user fields exist
   ```

3. **Use 'all' Scope for Manager Actions**
   ```typescript
   // Manager can update any blog - no ownership decorator
   @RequirePermissions({ resource: 'blog', action: 'update', scope: 'all' })
   async updateAnyBlog(@Param('id') id: string) { }
   ```

### ❌ DON'Ts

1. **Don't Use on Create Actions**
   ```typescript
   @Post()
   @RequireOwnership({ ... }) // ❌ Wrong - no resource ID yet
   ```

2. **Don't Use Without Permission Check**
   ```typescript
   @Put(':id')
   @RequireOwnership({ ... }) // ❌ Missing @RequirePermissions
   ```

3. **Don't Hardcode Ownership in Service**
   ```typescript
   // ❌ Bad
   async update(id: string, data: any, userId: string) {
     const blog = await this.findOne(id);
     if (blog.authorId !== userId) throw new ForbiddenException();
     // ...
   }
   
   // ✅ Good - use decorator
   @RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
   async update(@Param('id') id: string, @Body() data: any) {
     return this.blogService.update(id, data);
   }
   ```

## Testing

```typescript
describe('BlogController', () => {
  describe('updateBlog with OwnershipGuard', () => {
    it('should allow owner to update their blog', async () => {
      const user = { id: 'user-1' };
      const blog = { id: 'blog-1', authorId: 'user-1' };
      // Test passes
    });

    it('should deny non-owner from updating blog', async () => {
      const user = { id: 'user-1' };
      const blog = { id: 'blog-1', authorId: 'user-2' };
      // Expect 403 Forbidden
    });

    it('should allow manager with "all" scope to update any blog', async () => {
      const manager = { id: 'manager-1' }; // has blog:update:all
      const blog = { id: 'blog-1', authorId: 'other-user' };
      // Test passes
    });

    it('should allow ADMIN to update any blog', async () => {
      const admin = { id: 'admin-1', roleType: 'ADMIN' };
      const blog = { id: 'blog-1', authorId: 'other-user' };
      // Test passes
    });
  });
});
```

## Performance Considerations

- **Database Query**: One additional query per request to fetch resource
- **Caching**: Resource is not cached (fresh data for ownership check)
- **Optimization**: Consider caching in high-traffic scenarios

## Migration Guide

### Before (Manual Ownership Check)

```typescript
@Put(':id')
@RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
async update(@Param('id') id: string, @Body() data: any, @CurrentUser() user: any) {
  const blog = await this.blogService.findOne(id);
  
  if (blog.authorId !== user.id) {
    throw new ForbiddenException('You can only update your own blogs');
  }
  
  return this.blogService.update(id, data);
}
```

### After (Ownership Decorator)

```typescript
@Put(':id')
@RequirePermissions({ resource: 'blog', action: 'update', scope: 'own' })
@RequireOwnership({ resource: 'blog', ownershipField: 'authorId' })
async update(@Param('id') id: string, @Body() data: any) {
  // Ownership already checked - just update
  return this.blogService.update(id, data);
}
```

---

**Benefits:**
- ✅ Less boilerplate code
- ✅ Consistent ownership validation
- ✅ Automatic 'all' scope bypass
- ✅ ADMIN bypass built-in
- ✅ Better error messages
- ✅ Easier testing
