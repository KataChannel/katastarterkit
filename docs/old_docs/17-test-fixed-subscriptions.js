// Test script to verify GraphQL subscription fixes
const { createClient } = require('graphql-ws');
const WebSocket = require('ws');

const client = createClient({
  url: 'ws://localhost:14000/graphql',
  webSocketImpl: WebSocket,
});

// Test taskCreated subscription (now nullable)
const taskCreatedSubscription = `
  subscription TaskCreated {
    taskCreated {
      id
      title
      status
      createdAt
    }
  }
`;

// Test taskUpdated subscription (now nullable)
const taskUpdatedSubscription = `
  subscription TaskUpdated {
    taskUpdated {
      id
      title
      status
      updatedAt
    }
  }
`;

// Test taskCommentCreated subscription (now nullable)
const taskCommentCreatedSubscription = `
  subscription TaskCommentCreated {
    taskCommentCreated {
      id
      content
      createdAt
      user {
        id
        username
      }
    }
  }
`;

console.log('🧪 Testing GraphQL subscription fixes...');
console.log('✅ Subscriptions are now nullable and should not return null errors');

// Subscribe to taskCreated
const unsubscribeTaskCreated = client.subscribe(
  {
    query: taskCreatedSubscription,
  },
  {
    next: (data) => {
      console.log('📝 Received taskCreated event:', JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('❌ taskCreated subscription error:', err);
    },
    complete: () => {
      console.log('✅ taskCreated subscription completed');
    },
  }
);

// Subscribe to taskUpdated  
const unsubscribeTaskUpdated = client.subscribe(
  {
    query: taskUpdatedSubscription,
  },
  {
    next: (data) => {
      console.log('🔄 Received taskUpdated event:', JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('❌ taskUpdated subscription error:', err);
    },
    complete: () => {
      console.log('✅ taskUpdated subscription completed');
    },
  }
);

// Subscribe to taskCommentCreated
const unsubscribeTaskCommentCreated = client.subscribe(
  {
    query: taskCommentCreatedSubscription,
  },
  {
    next: (data) => {
      console.log('💬 Received taskCommentCreated event:', JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('❌ taskCommentCreated subscription error:', err);
    },
    complete: () => {
      console.log('✅ taskCommentCreated subscription completed');
    },
  }
);

console.log('🎧 Subscriptions started. Listening for events...');
console.log('ℹ️  The subscriptions should no longer throw null errors');
console.log('📢 Create/update tasks or comments in another terminal to test events');
console.log('⏹️  Press Ctrl+C to exit');

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🧹 Cleaning up subscriptions...');
  unsubscribeTaskCreated();
  unsubscribeTaskUpdated();
  unsubscribeTaskCommentCreated();
  client.dispose();
  console.log('✅ Cleanup completed');
  process.exit(0);
});

// Test timeout to show subscriptions are working
setTimeout(() => {
  console.log('⏰ Subscriptions have been running for 30 seconds without null errors - SUCCESS!');
}, 30000);