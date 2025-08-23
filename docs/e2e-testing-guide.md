# KataCore E2E Testing Guide

This guide covers comprehensive E2E testing for the KataCore application using Cypress with Bun.js runtime.

## Overview

KataCore implements a comprehensive testing strategy including:
- **Unit Tests**: Component and utility function testing
- **E2E Tests**: Full user flow testing with Cypress  
- **Real-time Testing**: WebSocket subscription testing
- **API Testing**: GraphQL mutation and query testing

## Test Architecture

### Test Files Structure
```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── auth.cy.ts          # Authentication flow tests
│   │   ├── posts.cy.ts         # Post management tests  
│   │   └── subscriptions.cy.ts # Real-time feature tests
│   ├── support/
│   │   ├── commands.ts         # Custom Cypress commands
│   │   └── e2e.ts             # Global test configuration
│   └── fixtures/              # Test data files
└── cypress.config.js          # Cypress configuration
```

## Test Scenarios Covered

### 1. Authentication Flow (`auth.cy.ts`)
- **Login page display and validation**
- **Form validation errors**  
- **Successful login with valid credentials**
- **Error handling for invalid credentials**
- **Password visibility toggle**
- **Logout functionality**
- **Protected route redirection**

### 2. Post Management (`posts.cy.ts`)
- **Posts list display and pagination**
- **New post creation workflow**
- **Form validation for post creation**
- **Loading states during operations**
- **Post interactions (like, share, comment)**
- **AI summary display and generation**
- **File upload functionality**

### 3. Real-time Features (`subscriptions.cy.ts`) 
- **WebSocket connection establishment**
- **New post notifications via subscription**
- **Comment notifications for specific posts**
- **Connection error handling and recovery**
- **Multiple subscription management**
- **Subscription cleanup on unmount**

## Custom Commands

### Authentication Commands
```typescript
cy.login(email, password)           // Login user with session management
cy.setupTestUser()                  // Create test user via API
```

### Post Management Commands  
```typescript
cy.createPost(title, content)       // Create new post
cy.waitForGraphQL(operationName)    // Wait for specific GraphQL operation
```

## Test Configuration

### Cypress Configuration (`cypress.config.js`)
```javascript
{
  baseUrl: "http://localhost:13000",
  env: {
    BACKEND_URL: "http://localhost:14000/graphql",
    TEST_USER_EMAIL: "test@example.com", 
    TEST_USER_PASSWORD: "password123"
  }
}
```

### Test Data Management
- Uses environment variables for test user credentials
- Implements session management for authentication tests
- Includes proper cleanup between tests
- Handles async operations with proper waits

## Test Execution Commands

### Development Testing
```bash
# Open Cypress UI for interactive testing
bun run test:e2e

# Run tests in headless mode  
bun run test:e2e:headless

# Run with development server
bun run test:e2e:dev
```

### CI/CD Pipeline
```bash
# Complete test suite for CI
bun run test:e2e:ci

# All tests including type checking and linting
bun run test:all
```

## Test Data IDs

### Authentication Elements
- `data-testid="login-form"` - Main login form
- `data-testid="email-input"` - Email input field
- `data-testid="password-input"` - Password input field  
- `data-testid="password-toggle"` - Password visibility toggle
- `data-testid="login-button"` - Submit button

### Post Management Elements
- `data-testid="posts-list"` - Posts container
- `data-testid="post-item"` - Individual post card
- `data-testid="create-post-button"` - Create new post button
- `data-testid="post-title-input"` - Post title input
- `data-testid="post-content-input"` - Post content textarea
- `data-testid="submit-post-button"` - Submit post button
- `data-testid="like-button"` - Like post button
- `data-testid="share-button"` - Share post button
- `data-testid="comment-count"` - Comment count display
- `data-testid="ai-summary"` - AI summary section

### Navigation and State Elements
- `data-testid="pagination"` - Pagination controls
- `data-testid="load-more-button"` - Load more posts button
- `data-testid="posts-loading"` - Loading state indicator
- `data-testid="no-posts"` - Empty state message

## Real-time Testing Strategy

### WebSocket Connection Testing
```typescript
// Test WebSocket connection establishment
cy.visit('/dashboard');
cy.wait(2000); // Allow WebSocket to connect

// Verify subscription functionality
cy.window().its('__APOLLO_CLIENT__').should('exist');
```

### Subscription Data Simulation
```typescript
// Simulate new comment via subscription
const newCommentData = {
  newComment: {
    id: 'new-comment-id',
    content: 'Test comment via subscription',
    author: { username: 'testuser' }
  }
};
```

## Error Handling and Resilience

### Network Error Simulation
```typescript
// Test offline/online scenarios
cy.intercept('ws://localhost:14000/graphql', { forceNetworkError: true });

// Test GraphQL error responses
cy.intercept('POST', '**/graphql', {
  statusCode: 200,
  body: { errors: [{ message: 'Test error' }] }
});
```

### Timeout and Retry Logic
- **Default command timeout**: 10 seconds
- **Request timeout**: 10 seconds  
- **Automatic retries**: 3 attempts for flaky operations
- **Custom wait conditions**: For GraphQL operations and real-time updates

## Performance Testing

### Load Testing Considerations
- Tests include pagination with large datasets
- Validates loading states and performance indicators
- Monitors memory usage during subscription testing
- Tests rapid interaction scenarios (spam clicking, rapid form submissions)

## Continuous Integration

### GitHub Actions Integration
```yaml
- name: Run E2E Tests
  run: |
    bun install
    bun run build
    bun run start &
    bun run test:e2e:headless
```

### Test Reporting
- **Video recording**: Enabled for all test runs
- **Screenshot on failure**: Automatic capture
- **Test coverage**: Integrated with @cypress/code-coverage
- **Test artifacts**: Stored for debugging failed runs

## Best Practices

### Test Organization
1. **Arrange-Act-Assert**: Clear test structure
2. **Independent tests**: No dependencies between test cases
3. **Descriptive names**: Clear test intentions
4. **Proper cleanup**: Reset state between tests

### Data Management
1. **Test isolation**: Each test creates its own data
2. **Realistic scenarios**: Use production-like data
3. **Edge cases**: Test boundary conditions
4. **Error scenarios**: Validate error handling

### Maintenance
1. **Regular updates**: Keep Cypress version current
2. **Test reviews**: Code review for test changes
3. **Flaky test monitoring**: Track and fix unstable tests
4. **Documentation**: Keep test documentation updated

## Troubleshooting

### Common Issues
1. **WebSocket connection failures**: Check backend GraphQL subscriptions
2. **Authentication timeouts**: Verify JWT token handling
3. **Element not found**: Ensure proper test ID implementation
4. **Race conditions**: Add appropriate waits for async operations

### Debug Commands
```bash
# Run specific test file
bun run cypress run --spec "cypress/e2e/auth.cy.ts"

# Run with debug output
DEBUG=cypress:* bun run test:e2e:headless

# Open test runner for debugging
bun run test:e2e
```

This comprehensive E2E testing strategy ensures robust validation of the KataCore application's critical user flows, real-time features, and error handling scenarios.
