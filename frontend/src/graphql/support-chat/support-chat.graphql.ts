/**
 * DEPRECATED: GraphQL has been removed from this project
 * This file provides backward compatibility stubs
 * 
 * Migration Guide:
 * - Create Server Actions in @/actions/support-chat.ts
 * - Or create REST API: /api/support-chat
 */

// Type definitions
export interface SupportConversation {
  id: string;
  userId: string;
  subject?: string;
  status: 'open' | 'closed' | 'pending';
  messages?: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  userId: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
}

// GraphQL mutation stubs
export const CREATE_SUPPORT_CONVERSATION = `
  # DEPRECATED: Create Server Action createSupportConversation(data)
  mutation CreateSupportConversation($input: SupportConversationInput!) {
    createSupportConversation(input: $input) {
      id
      subject
      status
    }
  }
`;

export const SEND_SUPPORT_MESSAGE = `
  # DEPRECATED: Create Server Action sendSupportMessage(conversationId, message)
  mutation SendSupportMessage($conversationId: ID!, $message: String!) {
    sendSupportMessage(conversationId: $conversationId, message: $message) {
      id
      message
      createdAt
    }
  }
`;

export const CLOSE_SUPPORT_CONVERSATION = `
  # DEPRECATED: Create Server Action closeSupportConversation(id)
  mutation CloseSupportConversation($id: ID!) {
    closeSupportConversation(id: $id) {
      id
      status
    }
  }
`;

// GraphQL query stubs
export const GET_SUPPORT_CONVERSATIONS = `
  # DEPRECATED: Create Server Action getSupportConversations()
  query GetSupportConversations {
    supportConversations {
      id
      subject
      status
      updatedAt
    }
  }
`;

export const GET_SUPPORT_CONVERSATION = `
  # DEPRECATED: Create Server Action getSupportConversation(id)
  query GetSupportConversation($id: ID!) {
    supportConversation(id: $id) {
      id
      subject
      status
      messages {
        id
        message
        isStaff
        createdAt
      }
    }
  }
`;

console.warn('⚠️ @/graphql/support-chat/support-chat.graphql is deprecated. Create @/actions/support-chat.ts with Server Actions.');
