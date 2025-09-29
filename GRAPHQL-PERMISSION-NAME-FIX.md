# Test GraphQL Permission.name Fix

## Issue Fixed
Fixed the GraphQL execution error: "Cannot return null for non-nullable field Permission.name" in SearchRoles query.

## Root Cause
The issue was caused by a data structure mismatch between the database query results and GraphQL schema expectations:

1. **Database Structure**: Roles are connected to Permissions through a junction table `RolePermission`
2. **Service Layer**: Was returning `RolePermission` objects with nested `permission` objects
3. **GraphQL Schema**: Expected direct `Permission[]` array on Role objects
4. **Result**: GraphQL tried to access `name` field on `RolePermission` objects instead of `Permission` objects

## Solution Implemented

### 1. Fixed `searchRoles` Method
```typescript
// Before: Returned RolePermission objects with nested permission
permissions: {
  include: {
    permission: true,
  },
}

// After: Transform to direct Permission objects
const roles = rolesData.map(role => ({
  ...role,
  permissions: role.permissions.map(rp => rp.permission).filter(p => p !== null)
}));
```

### 2. Fixed `getRoleById` Method  
```typescript
return {
  ...roleData,
  permissions: roleData.permissions.map(rp => rp.permission).filter(p => p !== null)
};
```

### 3. Fixed `createRole` and `updateRole` Methods
Applied same transformation pattern to ensure consistency across all Role-returning operations.

### 4. Fixed `getUserEffectivePermissions` Method
```typescript
// Transform role assignments to match GraphQL schema
const roleAssignments = roleAssignmentsData.map(assignment => ({
  ...assignment,
  role: {
    ...assignment.role,
    permissions: assignment.role.permissions.map(rp => rp.permission).filter(p => p !== null)
  }
}));

// Added missing userId and summary fields
return {
  userId,
  roleAssignments,
  directPermissions,
  effectivePermissions: uniquePermissions,
  summary: {
    totalDirectPermissions: directPermissions.length,
    totalRoleAssignments: roleAssignments.length,
    totalEffectivePermissions: uniquePermissions.length,
    lastUpdated: new Date(),
  },
};
```

## Test Queries

You can test these queries in GraphQL Playground at http://localhost:14000/graphql:

### Test SearchRoles Query
```graphql
query TestSearchRoles {
  searchRoles(input: { 
    page: 0, 
    size: 10,
    isActive: true 
  }) {
    roles {
      id
      name
      displayName
      permissions {
        id
        name
        displayName
        resource
        action
        scope
      }
    }
    total
  }
}
```

### Test GetRoleById Query
```graphql
query TestGetRoleById($roleId: ID!) {
  getRoleById(id: $roleId) {
    id
    name
    displayName
    permissions {
      id
      name
      displayName
      resource
      action
    }
  }
}
```

### Test GetUserRolePermissions Query
```graphql
query TestGetUserRolePermissions($userId: String!) {
  getUserRolePermissions(userId: $userId) {
    userId
    roleAssignments {
      id
      role {
        name
        permissions {
          id
          name
          displayName
        }
      }
    }
    effectivePermissions {
      id
      name
      displayName
      resource
      action
    }
    summary {
      totalDirectPermissions
      totalRoleAssignments
      totalEffectivePermissions
      lastUpdated
    }
  }
}
```

## Variables for Testing
```json
{
  "roleId": "role-id-from-database",
  "userId": "user-id-from-database"
}
```

## Expected Results
- ✅ No more "Cannot return null for non-nullable field Permission.name" errors
- ✅ All Role objects return proper permissions array with valid Permission objects
- ✅ All Permission objects have proper name, displayName, resource, action fields
- ✅ UserRolePermissionSummary includes userId and summary fields

## Verification Steps
1. Open GraphQL Playground: http://localhost:14000/graphql
2. Run the test queries above
3. Verify all Permission.name fields are populated
4. Check that the data structure matches GraphQL schema expectations

The fix ensures proper data transformation between the Prisma ORM junction table structure and the GraphQL schema expectations, resolving the null field errors.