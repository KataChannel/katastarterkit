import { useState, useCallback } from 'react';
import { TaskMedia, MediaType } from '@/types/todo';
import toast from 'react-hot-toast';

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: MediaType;
  size: number;
  mimeType: string;
  preview?: string;
}

interface UseMediaUploadOptions {
  maxFiles?: number;
  maxFileSize?: number; // in MB
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (media: TaskMedia[]) => void;
  onUploadError?: (error: string) => void;
}

export const useMediaUpload = (options: UseMediaUploadOptions = {}) => {
  const {
    maxFiles = 10,
    maxFileSize = 50,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
  } = options;

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addMediaFiles = useCallback((newFiles: MediaFile[]) => {
    setMediaFiles(prev => {
      const combined = [...prev, ...newFiles];
      if (combined.length > maxFiles) {
        toast.error(`Chỉ có thể upload tối đa ${maxFiles} file`);
        return prev.slice(0, maxFiles);
      }
      return combined;
    });
  }, [maxFiles]);

  const removeMediaFile = useCallback((fileId: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        // Cleanup object URL to prevent memory leaks
        URL.revokeObjectURL(file.url);
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const clearMediaFiles = useCallback(() => {
    // Cleanup all object URLs
    mediaFiles.forEach(file => {
      URL.revokeObjectURL(file.url);
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setMediaFiles([]);
  }, [mediaFiles]);

  const uploadMedia = useCallback(async (taskId: string): Promise<TaskMedia[]> => {
    if (mediaFiles.length === 0) {
      return [];
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedMedia: TaskMedia[] = [];
      const totalFiles = mediaFiles.length;

      for (let i = 0; i < mediaFiles.length; i++) {
        const mediaFile = mediaFiles[i];
        const formData = new FormData();
        formData.append('file', mediaFile.file);
        formData.append('taskId', taskId);
        formData.append('type', mediaFile.type);

        try {
          // Simulate upload progress
          const progressStep = (i + 1) / totalFiles * 100;
          setUploadProgress(progressStep);
          onUploadProgress?.(progressStep);

          // Here you would make the actual API call to upload the file
          // For now, we'll simulate the response
          const response = await simulateUpload(mediaFile, taskId);
          uploadedMedia.push(response);

        } catch (error) {
          const errorMessage = `Lỗi upload file ${mediaFile.file.name}: ${error}`;
          toast.error(errorMessage);
          onUploadError?.(errorMessage);
        }
      }

      // Cleanup after successful upload
      clearMediaFiles();
      onUploadComplete?.(uploadedMedia);
      toast.success(`Đã upload thành công ${uploadedMedia.length} file`);

      return uploadedMedia;

    } catch (error) {
      const errorMessage = `Lỗi upload media: ${error}`;
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [mediaFiles, onUploadProgress, onUploadComplete, onUploadError, clearMediaFiles]);

  return {
    mediaFiles,
    uploading,
    uploadProgress,
    addMediaFiles,
    removeMediaFile,
    clearMediaFiles,
    uploadMedia,
  };
};

// Simulate upload function - replace with actual API call
const simulateUpload = async (mediaFile: MediaFile, taskId: string): Promise<TaskMedia> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Simulate upload response
  return {
    id: `media-${Date.now()}-${Math.random()}`,
    filename: mediaFile.file.name,
    url: mediaFile.url, // In real implementation, this would be the server URL
    type: mediaFile.type,
    size: mediaFile.size,
    mimeType: mediaFile.mimeType,
    caption: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    taskId,
    uploadedBy: 'current-user-id', // Replace with actual user ID
    uploader: {
      id: 'current-user-id',
      username: 'current-user',
      firstName: 'Current',
      lastName: 'User',
    },
  };
};

// Hook for managing media in existing tasks
export const useTaskMedia = (initialMedia: TaskMedia[] = []) => {
  const [media, setMedia] = useState<TaskMedia[]>(initialMedia);
  const [loading, setLoading] = useState(false);

  const addMedia = useCallback((newMedia: TaskMedia | TaskMedia[]) => {
    const mediaArray = Array.isArray(newMedia) ? newMedia : [newMedia];
    setMedia(prev => [...prev, ...mediaArray]);
  }, []);

  const removeMedia = useCallback(async (mediaId: string) => {
    setLoading(true);
    try {
      // Here you would make API call to delete media
      await simulateDeleteMedia(mediaId);
      
      setMedia(prev => prev.filter(m => m.id !== mediaId));
      toast.success('Đã xóa file thành công');
    } catch (error) {
      toast.error('Lỗi khi xóa file');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMediaCaption = useCallback(async (mediaId: string, caption: string) => {
    setLoading(true);
    try {
      // Here you would make API call to update media
      await simulateUpdateMedia(mediaId, { caption });
      
      setMedia(prev => prev.map(m => 
        m.id === mediaId ? { ...m, caption } : m
      ));
      toast.success('Đã cập nhật caption');
    } catch (error) {
      toast.error('Lỗi khi cập nhật caption');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    media,
    loading,
    addMedia,
    removeMedia,
    updateMediaCaption,
    setMedia,
  };
};

// Simulate API calls - replace with actual implementations
const simulateDeleteMedia = async (mediaId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate success
};

const simulateUpdateMedia = async (mediaId: string, updates: Partial<TaskMedia>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate success
};
