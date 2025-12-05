/**
 * RAG Chatbot GraphQL Hooks
 */

import { useMutation, useQuery, gql } from '@apollo/client';

// GraphQL Definitions
export const RAG_CHAT_QUERY = gql`
  query RagChat($input: RAGQueryInput!) {
    ragChat(input: $input) {
      answer
      sources {
        type
        entity
        relevance
      }
      contextUsed
      confidence
      suggestedQueries
    }
  }
`;

export const RAG_SEARCH_PRODUCTS_QUERY = gql`
  query RagSearchProducts($input: SearchProductsInput!) {
    ragSearchProducts(input: $input) {
      answer
      sources {
        type
        entity
        relevance
      }
      contextUsed
      confidence
      suggestedQueries
    }
  }
`;

export const RAG_QUICK_STATS_QUERY = gql`
  query RagQuickStats {
    ragQuickStats {
      answer
      sources {
        type
        entity
        relevance
      }
      contextUsed
      confidence
      suggestedQueries
    }
  }
`;

export const RAG_METRICS_QUERY = gql`
  query RagMetrics {
    ragMetrics {
      totalQueries
      avgResponseTime
      successRate
      topIntents {
        intent
        count
      }
      topContextTypes {
        type
        count
      }
    }
  }
`;

export const RAG_STATUS_QUERY = gql`
  query RagStatus {
    ragStatus {
      isReady
      message
      model
    }
  }
`;

export const RAG_CONVERSATION_HISTORY_QUERY = gql`
  query RagConversationHistory($limit: Int) {
    ragConversationHistory(limit: $limit) {
      id
      role
      content
      timestamp
    }
  }
`;

export const RAG_CLEAR_HISTORY_MUTATION = gql`
  mutation RagClearHistory {
    ragClearHistory {
      success
      message
    }
  }
`;

export const RAG_CLEAR_CACHE_MUTATION = gql`
  mutation RagClearCache {
    ragClearCache {
      success
      message
    }
  }
`;

// Types
export interface RAGSource {
  type: string;
  entity: string;
  relevance: number;
}

export interface RAGResponse {
  answer: string;
  sources: RAGSource[];
  contextUsed: string[];
  confidence: number;
  suggestedQueries?: string[];
}

export interface RAGMetrics {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  topIntents: { intent: string; count: number }[];
  topContextTypes: { type: string; count: number }[];
}

export interface RAGStatus {
  isReady: boolean;
  message: string;
  model?: string;
}

export interface ConversationMessage {
  id: string;
  role: string;
  content: string;
  timestamp: Date;
}

// Custom Hooks
export function useRagChat() {
  return useQuery(RAG_CHAT_QUERY, {
    skip: true, // Don't auto-fetch, use refetch manually
  });
}

export function useRagSearchProducts() {
  return useQuery(RAG_SEARCH_PRODUCTS_QUERY, {
    skip: true,
  });
}

export function useRagQuickStats() {
  return useQuery(RAG_QUICK_STATS_QUERY);
}

export function useRagMetrics() {
  return useQuery(RAG_METRICS_QUERY);
}

export function useRagStatus() {
  return useQuery(RAG_STATUS_QUERY);
}

export function useRagConversationHistory(limit?: number) {
  return useQuery(RAG_CONVERSATION_HISTORY_QUERY, {
    variables: { limit },
  });
}

export function useRagClearHistory() {
  return useMutation(RAG_CLEAR_HISTORY_MUTATION, {
    refetchQueries: [{ query: RAG_CONVERSATION_HISTORY_QUERY }],
  });
}

export function useRagClearCache() {
  return useMutation(RAG_CLEAR_CACHE_MUTATION);
}
