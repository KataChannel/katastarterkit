import { gql } from '@apollo/client';

// Source Document Fragments
export const SOURCE_DOCUMENT_BASIC_FRAGMENT = gql`
  fragment SourceDocumentBasic on SourceDocument {
    id
    title
    type
    description
    url
    fileName
    fileSize
    mimeType
    duration
    status
    categoryId
    thumbnailUrl
    createdAt
    updatedAt
  }
`;

export const SOURCE_DOCUMENT_WITH_AI_FRAGMENT = gql`
  fragment SourceDocumentWithAI on SourceDocument {
    ...SourceDocumentBasic
    aiSummary
    aiKeywords
    aiTopics
    isAiAnalyzed
    aiAnalyzedAt
    category {
      id
      name
      description
      slug
      icon
      color
    }
  }
  ${SOURCE_DOCUMENT_BASIC_FRAGMENT}
`;

// Queries
export const GET_SOURCE_DOCUMENTS = gql`
  query GetSourceDocuments($filter: SourceDocumentFilterInput, $page: Int, $limit: Int) {
    sourceDocuments(filter: $filter, page: $page, limit: $limit) {
      ...SourceDocumentWithAI
    }
  }
  ${SOURCE_DOCUMENT_WITH_AI_FRAGMENT}
`;

export const GET_SOURCE_DOCUMENT_BY_ID = gql`
  query GetSourceDocumentById($id: ID!) {
    sourceDocument(id: $id) {
      ...SourceDocumentWithAI
    }
  }
  ${SOURCE_DOCUMENT_WITH_AI_FRAGMENT}
`;

export const GET_SOURCE_DOCUMENT_CATEGORIES = gql`
  query GetSourceDocumentCategories {
    sourceDocumentCategories {
      id
      name
      description
      slug
      icon
      color
      createdAt
    }
  }
`;

// Mutations
export const CREATE_SOURCE_DOCUMENT = gql`
  mutation CreateSourceDocument($input: CreateSourceDocumentInput!) {
    createSourceDocument(input: $input) {
      ...SourceDocumentWithAI
    }
  }
  ${SOURCE_DOCUMENT_WITH_AI_FRAGMENT}
`;

export const UPDATE_SOURCE_DOCUMENT = gql`
  mutation UpdateSourceDocument($id: ID!, $input: UpdateSourceDocumentInput!) {
    updateSourceDocument(id: $id, input: $input) {
      ...SourceDocumentWithAI
    }
  }
  ${SOURCE_DOCUMENT_WITH_AI_FRAGMENT}
`;

export const DELETE_SOURCE_DOCUMENT = gql`
  mutation DeleteSourceDocument($id: ID!) {
    deleteSourceDocument(id: $id) {
      id
    }
  }
`;

export const UPLOAD_SOURCE_DOCUMENT_FILE = gql`
  mutation UploadSourceDocumentFile($file: Upload!, $categoryId: ID) {
    uploadSourceDocumentFile(file: $file, categoryId: $categoryId) {
      ...SourceDocumentWithAI
    }
  }
  ${SOURCE_DOCUMENT_WITH_AI_FRAGMENT}
`;

// Types
export interface SourceDocument {
  id: string;
  title: string;
  type: 'FILE' | 'VIDEO' | 'TEXT' | 'AUDIO' | 'LINK' | 'IMAGE';
  description?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  category?: SourceDocumentCategory;
  thumbnailUrl?: string;
  aiSummary?: string;
  aiKeywords?: string[];
  aiTopics?: string[];
  isAiAnalyzed: boolean;
  aiAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SourceDocumentCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface SourceDocumentFilterInput {
  types?: ('FILE' | 'VIDEO' | 'TEXT' | 'AUDIO' | 'LINK' | 'IMAGE')[];
  statuses?: ('DRAFT' | 'PUBLISHED' | 'ARCHIVED')[];
  categoryId?: string;
  userId?: string;
  search?: string;
  tags?: string[];
  isAiAnalyzed?: boolean;
}

export interface CreateSourceDocumentInput {
  title: string;
  type: 'FILE' | 'VIDEO' | 'TEXT' | 'AUDIO' | 'LINK' | 'IMAGE';
  description?: string;
  content?: string;
  url?: string;
  categoryId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface UpdateSourceDocumentInput {
  title?: string;
  description?: string;
  content?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
  thumbnailUrl?: string;
  tags?: string[];
}
