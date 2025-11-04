// Simple test script to test GraphQL subscriptions
const { createClient } = require('graphql-ws');
const WebSocket = require('ws');

const client = createClient({
  url: 'ws://localhost:14000/graphql',
  webSocketImpl: WebSocket,
});

// Test taskUpdated subscription
const taskUpdatedSubscription = `
  subscription TaskUpdated {
    taskUpdated {
      id
      title
      status
      createdAt
      updatedAt
    }
  }
`;

// Test taskCommentCreated subscription
const taskCommentCreatedSubscription = `
  subscription TaskCommentCreated {
    taskCommentCreated {
      id
      content
      createdAt
      task {
        id
        title
      }
      author {
        id
        email
      }
    }
  }
`;

console.log('Starting subscription tests...');

// Subscribe to taskUpdated
const unsubscribeTaskUpdated = client.subscribe(
  {
    query: taskUpdatedSubscription,
  },
  {
    next: (data) => {
      console.log('Received taskUpdated event:', JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('taskUpdated subscription error:', err);
    },
    complete: () => {
      console.log('taskUpdated subscription completed');
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
      console.log('Received taskCommentCreated event:', JSON.stringify(data, null, 2));
    },
    error: (err) => {
      console.error('taskCommentCreated subscription error:', err);
    },
    complete: () => {
      console.log('taskCommentCreated subscription completed');
    },
  }
);

console.log('Subscriptions started. Listening for events...');
console.log('Press Ctrl+C to exit');

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\nCleaning up subscriptions...');
  unsubscribeTaskUpdated();
  unsubscribeTaskCommentCreated();
  client.dispose();
  process.exit(0);
});