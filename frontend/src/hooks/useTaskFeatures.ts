'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  GET_TASK_COMMENTS,
  CREATE_TASK_COMMENT,
  UPDATE_TASK_COMMENT,
  DELETE_TASK_COMMENT,
  GET_TASK_MEDIA,
  UPLOAD_TASK_MEDIA,
  DELETE_TASK_MEDIA,
  GET_TASK_WITH_DETAILS,
} from '../graphql/taskQueries';
import { TaskComment, TaskMedia, Task } from '../types/todo';

// Comment hooks
export const useTaskComments = (taskId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
    skip: !taskId,
  });

  return {
    comments: (data?.getTaskComments || []) as TaskComment[],
    loading,
    error,
    refetch,
  };
};

export const useCreateComment = () => {
  const [createComment, { loading, error }] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: [GET_TASK_COMMENTS, GET_TASK_WITH_DETAILS],
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
    refetchQueries: [GET_TASK_COMMENTS, GET_TASK_WITH_DETAILS],
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
    refetchQueries: [GET_TASK_COMMENTS, GET_TASK_WITH_DETAILS],
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

// Media hooks
export const useTaskMedia = (taskId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_TASK_MEDIA, {
    variables: { taskId },
    skip: !taskId,
  });

  return {
    media: (data?.getTaskMedia || []) as TaskMedia[],
    loading,
    error,
    refetch,
  };
};

export const useUploadMedia = () => {
  const [uploadMedia, { loading, error }] = useMutation(UPLOAD_TASK_MEDIA, {
    refetchQueries: [GET_TASK_MEDIA, GET_TASK_WITH_DETAILS],
  });

  const handleUploadMedia = async (taskId: string, files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('taskId', taskId);

        // In a real implementation, you might need to upload to a file service first
        // and get the URL, then use that URL in the GraphQL mutation
        // For now, we'll assume the backend handles file upload directly
        
        const result = await uploadMedia({
          variables: {
            input: {
              taskId,
              filename: file.name,
              fileSize: file.size,
              mimeType: file.type,
              // fileUrl would be set by the backend after upload
            },
          },
        });
        return result.data?.uploadTaskMedia;
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (err) {
      throw err;
    }
  };

  return {
    uploadMedia: handleUploadMedia,
    loading,
    error,
  };
};

export const useDeleteMedia = () => {
  const [deleteMedia, { loading, error }] = useMutation(DELETE_TASK_MEDIA, {
    refetchQueries: [GET_TASK_MEDIA, GET_TASK_WITH_DETAILS],
  });

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      const result = await deleteMedia({
        variables: {
          id: mediaId,
        },
      });
      return result.data?.deleteTaskMedia;
    } catch (err) {
      throw err;
    }
  };

  return {
    deleteMedia: handleDeleteMedia,
    loading,
    error,
  };
};

// Combined hook for task with details
export const useTaskWithDetails = (taskId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_TASK_WITH_DETAILS, {
    variables: { id: taskId },
    skip: !taskId,
  });

  return {
    task: data?.getTask as Task,
    loading,
    error,
    refetch,
  };
};
