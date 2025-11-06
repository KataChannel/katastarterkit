/**
 * DEPRECATED: GraphQL has been removed from this project
 * This file provides backward compatibility stubs
 * 
 * Migration Guide:
 * - Create Server Actions in @/actions/files.ts
 * - Or create REST API: /api/files
 */

// Type definitions
export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileFolder {
  id: string;
  name: string;
  parentId?: string;
  files?: File[];
  createdAt: string;
  updatedAt: string;
}

export interface StorageStats {
  totalSize: number;
  fileCount: number;
  folderCount: number;
}

// GraphQL query stubs
export const GET_FILES = `query GetFiles { files { id } }`;
export const GET_FILE = `query GetFile($id: ID!) { file(id: $id) { id } }`;
export const GET_FOLDERS = `query GetFolders { folders { id } }`;
export const GET_FOLDER = `query GetFolder($id: ID!) { folder(id: $id) { id } }`;
export const GET_STORAGE_STATS = `query GetStorageStats { storageStats { totalSize } }`;

// GraphQL mutation stubs
export const UPDATE_FILE = `mutation UpdateFile($id: ID!, $input: FileInput!) { updateFile(id: $id, input: $input) { id } }`;
export const DELETE_FILE = `mutation DeleteFile($id: ID!) { deleteFile(id: $id) }`;
export const MOVE_FILES = `mutation MoveFiles($fileIds: [ID!]!, $folderId: ID) { moveFiles(fileIds: $fileIds, folderId: $folderId) }`;
export const BULK_DELETE_FILES = `mutation BulkDeleteFiles($fileIds: [ID!]!) { bulkDeleteFiles(fileIds: $fileIds) }`;
export const BULK_UPDATE_FILES = `mutation BulkUpdateFiles($updates: [FileUpdateInput!]!) { bulkUpdateFiles(updates: $updates) }`;
export const CREATE_FOLDER = `mutation CreateFolder($input: FolderInput!) { createFolder(input: $input) { id } }`;
export const UPDATE_FOLDER = `mutation UpdateFolder($id: ID!, $input: FolderInput!) { updateFolder(id: $id, input: $input) { id } }`;
export const DELETE_FOLDER = `mutation DeleteFolder($id: ID!) { deleteFolder(id: $id) }`;
export const CREATE_FILE_SHARE = `mutation CreateFileShare($fileId: ID!) { createFileShare(fileId: $fileId) { id } }`;

console.warn('⚠️ @/graphql/queries/files is deprecated. Create @/actions/files.ts with Server Actions.');
