'use client';

import { gql } from '@apollo/client';

// Comment queries and mutations
export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: String!) {
    getTaskComments(taskId: $taskId) {
      id
      content
      taskId
      authorId
      parentId
      author {
        id
        username
        firstName
        lastName
        avatar
      }
      replies {
        id
        content
        taskId
        authorId
        parentId
        author {
          id
          username
          firstName
          lastName
          avatar
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK_COMMENT = gql`
  mutation CreateTaskComment($input: CreateTaskCommentInput!) {
    createTaskComment(input: $input) {
      id
      content
      taskId
      authorId
      parentId
      author {
        id
        username
        firstName
        lastName
        avatar
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK_COMMENT = gql`
  mutation UpdateTaskComment($id: String!, $input: UpdateTaskCommentInput!) {
    updateTaskComment(id: $id, input: $input) {
      id
      content
      taskId
      authorId
      parentId
      author {
        id
        username
        firstName
        lastName
        avatar
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TASK_COMMENT = gql`
  mutation DeleteTaskComment($id: String!) {
    deleteTaskComment(id: $id) {
      id
    }
  }
`;

// Media queries and mutations
export const GET_TASK_MEDIA = gql`
  query GetTaskMedia($taskId: String!) {
    getTaskMedia(taskId: $taskId) {
      id
      filename
      fileUrl
      fileSize
      mimeType
      taskId
      uploadedById
      uploadedBy {
        id
        username
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

export const UPLOAD_TASK_MEDIA = gql`
  mutation UploadTaskMedia($input: UploadTaskMediaInput!) {
    uploadTaskMedia(input: $input) {
      id
      filename
      fileUrl
      fileSize
      mimeType
      taskId
      uploadedById
      uploadedBy {
        id
        username
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

export const DELETE_TASK_MEDIA = gql`
  mutation DeleteTaskMedia($id: String!) {
    deleteTaskMedia(id: $id) {
      id
    }
  }
`;

// Combined query for task with comments and media
export const GET_TASK_WITH_DETAILS = gql`
  query GetTaskWithDetails($id: String!) {
    getTask(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      category
      authorId
      author {
        id
        username
        firstName
        lastName
        avatar
      }
      comments {
        id
        content
        taskId
        authorId
        parentId
        author {
          id
          username
          firstName
          lastName
          avatar
        }
        replies {
          id
          content
          taskId
          authorId
          parentId
          author {
            id
            username
            firstName
            lastName
            avatar
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      media {
        id
        filename
        fileUrl
        fileSize
        mimeType
        taskId
        uploadedById
        uploadedBy {
          id
          username
          firstName
          lastName
          avatar
        }
        createdAt
      }
      shares {
        id
        taskId
        userId
        user {
          id
          username
          firstName
          lastName
          avatar
        }
        permission
        sharedById
        sharedBy {
          id
          username
          firstName
          lastName
          avatar
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;
