'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_TASK_COMMENT,
  UPDATE_TASK_COMMENT,
  DELETE_TASK_COMMENT,
  GET_TASK_WITH_DETAILS,
} from '../graphql/taskQueries';
import { TaskComment, TaskMedia, Task } from '../types/todo';

// Combined hook for task with details (includes comments and media)
export const useTaskWithDetails = (taskId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_TASK_WITH_DETAILS, {
    variables: { id: taskId },
    skip: !taskId,
  });

  return {
    task: data?.getTask as Task,
    comments: (data?.getTask?.comments || []) as TaskComment[],
    media: (data?.getTask?.media || []) as TaskMedia[],
    loading,
    error,
    refetch,
  };
};

// Comment hooks (using the main task query for data)
export const useTaskComments = (taskId: string) => {
  const { task, loading, error, refetch } = useTaskWithDetails(taskId);

  return {
    comments: (task?.comments || []) as TaskComment[],
    loading,
    error,
    refetch,
  };
};

export const useCreateComment = () => {
  const [createComment, { loading, error }] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: [GET_TASK_WITH_DETAILS],
  });

  const handleCreateComment = async (taskId: string, content: string, parentId?: string) => {
    try {
      const result = await createComment({
        variables: {
          input: {
            taskId,
            content,
            parentId,
          },
        },
      });
      return result.data?.createTaskComment;
    } catch (err) {
      throw err;
    }
  };

  return {
    createComment: handleCreateComment,
    loading,
    error,
  };
};

export const useUpdateComment = () => {
  const [updateComment, { loading, error }] = useMutation(UPDATE_TASK_COMMENT, {
    refetchQueries: [GET_TASK_WITH_DETAILS],
  });

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const result = await updateComment({
        variables: {
          id: commentId,
          input: {
            content,
          },
        },
      });
      return result.data?.updateTaskComment;
    } catch (err) {
      throw err;
    }
  };

  return {
    updateComment: handleUpdateComment,
    loading,
    error,
  };
};

export const useDeleteComment = () => {
  const [deleteComment, { loading, error }] = useMutation(DELETE_TASK_COMMENT, {
    refetchQueries: [GET_TASK_WITH_DETAILS],
  });

  const handleDeleteComment = async (commentId: string) => {
    try {
      const result = await deleteComment({
        variables: {
          id: commentId,
        },
      });
      return result.data?.deleteTaskComment;
    } catch (err) {
      throw err;
    }
  };

  return {
    deleteComment: handleDeleteComment,
    loading,
    error,
  };
};

// Media hooks (using the main task query for data)
export const useTaskMedia = (taskId: string) => {
  const { task, loading, error, refetch } = useTaskWithDetails(taskId);

  return {
    media: (task?.media || []) as TaskMedia[],
    loading,
    error,
    refetch,
  };
};

// Note: Media upload/delete mutations are not currently available in the backend
// These would need to be implemented in the backend first
export const useUploadMedia = () => {
  return {
    uploadMedia: () => Promise.reject(new Error('Media upload not implemented')),
    loading: false,
    error: new Error('Media upload functionality is not available'),
  };
};

export const useDeleteMedia = () => {
  return {
    deleteMedia: () => Promise.reject(new Error('Media delete not implemented')),
    loading: false,
    error: new Error('Media delete functionality is not available'),
  };
};
