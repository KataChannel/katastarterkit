'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Edit,
  Save,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Download,
  Eye,
  BookOpen,
  Sparkles,
  File,
  Video,
  FileText,
  Music,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Archive,
  Calendar,
  User,
  Tag,
  FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import {
  GET_SOURCE_DOCUMENT,
  GET_SOURCE_DOCUMENT_CATEGORIES,
  UPDATE_SOURCE_DOCUMENT,
  DELETE_SOURCE_DOCUMENT,
  INCREMENT_DOCUMENT_DOWNLOAD,
} from '@/graphql/lms/source-documents';

const DOCUMENT_TYPES = [
  { value: 'FILE', label: '📄 File (PDF, DOC, XLS...)' },
  { value: 'VIDEO', label: '🎥 Video (MP4, YouTube...)' },
  { value: 'TEXT', label: '📝 Text (Markdown, HTML)' },
  { value: 'AUDIO', label: '🎵 Audio (MP3, Podcast)' },
  { value: 'LINK', label: '🔗 Link (External URL)' },
  { value: 'IMAGE', label: '🖼️ Image (PNG, JPG)' },
];

const DOCUMENT_STATUSES = [
  { value: 'DRAFT', label: 'Nháp' },
  { value: 'PUBLISHED', label: 'Xuất bản' },
  { value: 'ARCHIVED', label: 'Lưu trữ' },
];

const TYPE_ICONS: Record<string, any> = {
  FILE: File,
  VIDEO: Video,
  TEXT: FileText,
  AUDIO: Music,
  LINK: LinkIcon,
  IMAGE: ImageIcon,
};

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  DRAFT: { label: 'Nháp', variant: 'secondary' },
  PROCESSING: { label: 'Đang xử lý', variant: 'default' },
  PUBLISHED: { label: 'Đã xuất bản', variant: 'default' },
  ARCHIVED: { label: 'Lưu trữ', variant: 'outline' },
};

// Utility to format file size
const formatFileSize = (bytes?: number | null): string => {
  if (!bytes) return 'N/A';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Format duration
const formatDuration = (seconds?: number | null): string => {
  if (!seconds) return 'N/A';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Check if URL is YouTube
const isYouTubeUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com');
};

// Extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

// Get YouTube embed URL
const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return null;
};

// Get file icon based on mime type
const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return <File className="w-8 h-8 text-blue-500" />;
  if (mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-green-500" />;
  if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
  if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8 text-orange-500" />;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
    return <Archive className="w-8 h-8 text-yellow-500" />;
  }
  return <File className="w-8 h-8 text-blue-500" />;
};

// Check if file can be previewed
const canPreviewFile = (mimeType?: string, url?: string): boolean => {
  if (!mimeType && !url) return false;
  
  // PDF
  if (mimeType === 'application/pdf' || url?.toLowerCase().endsWith('.pdf')) return true;
  
  // Office documents (via Google Docs Viewer or Office Online)
  const officeTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
  if (mimeType && officeTypes.includes(mimeType)) return true;
  
  // Check by extension
  const previewExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  if (url) {
    const lowerUrl = url.toLowerCase();
    return previewExtensions.some(ext => lowerUrl.endsWith(ext));
  }
  
  return false;
};

// Get preview URL for office documents (using Google Docs Viewer)
const getOfficePreviewUrl = (url: string): string => {
  // Use Google Docs Viewer for office files
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
};

// Get file type for display
const getFileTypeLabel = (mimeType?: string, url?: string): string => {
  if (mimeType?.includes('pdf') || url?.toLowerCase().endsWith('.pdf')) return 'PDF';
  if (mimeType?.includes('word') || url?.toLowerCase().match(/\.docx?$/)) return 'Word';
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet') || url?.toLowerCase().match(/\.xlsx?$/)) return 'Excel';
  if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation') || url?.toLowerCase().match(/\.pptx?$/)) return 'PowerPoint';
  return 'File';
};

interface UploadedFileInfo {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newUploadedFile, setNewUploadedFile] = useState<UploadedFileInfo | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    status: '',
    url: '',
    content: '',
    fileName: '',
    thumbnailUrl: '',
    categoryId: '',
    tags: '',
    fileSize: 0,
    mimeType: '',
  });

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_SOURCE_DOCUMENT, {
    variables: { id: params.id },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data.sourceDocument) {
        const doc = data.sourceDocument;
        setFormData({
          title: doc.title || '',
          description: doc.description || '',
          type: doc.type || '',
          status: doc.status || '',
          url: doc.url || '',
          content: doc.content || '',
          fileName: doc.fileName || '',
          thumbnailUrl: doc.thumbnailUrl || '',
          categoryId: doc.category?.id || '',
          tags: doc.tags?.join(', ') || '',
          fileSize: doc.fileSize || 0,
          mimeType: doc.mimeType || '',
        });
      }
    },
  });

  const { data: categoriesData } = useQuery(GET_SOURCE_DOCUMENT_CATEGORIES);

  // Mutations
  const [updateDocument, { loading: updating }] = useMutation(UPDATE_SOURCE_DOCUMENT, {
    onCompleted: () => {
      toast.success('Đã cập nhật tài liệu thành công');
      setIsEditing(false);
      setNewUploadedFile(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteDocument, { loading: deleting }] = useMutation(DELETE_SOURCE_DOCUMENT, {
    onCompleted: () => {
      toast.success('Đã xóa tài liệu thành công');
      router.push('/lms/admin/source-documents');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [incrementDownload] = useMutation(INCREMENT_DOCUMENT_DOWNLOAD);

  const document = data?.sourceDocument;
  const categories = categoriesData?.sourceDocumentCategories || [];

  // Category options for combobox
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: `${cat.icon || ''} ${cat.name}`.trim(),
  }));

  // Upload file to MinIO
  const uploadFileToMinio = async (file: File): Promise<UploadedFileInfo> => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    const token = localStorage.getItem('accessToken');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:12001';
    
    const response = await fetch(`${backendUrl}/api/lms/source-documents/${params.id}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formDataUpload,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload thất bại');
    }

    return response.json();
  };

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadFileToMinio(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setNewUploadedFile(result);
      
      // Auto-fill form fields from upload result
      setFormData(prev => ({
        ...prev,
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
      }));

      // Auto-detect type based on mime
      if (result.mimeType.startsWith('image/')) {
        setFormData(prev => ({ ...prev, type: 'IMAGE' }));
      } else if (result.mimeType.startsWith('video/')) {
        setFormData(prev => ({ ...prev, type: 'VIDEO' }));
      } else if (result.mimeType.startsWith('audio/')) {
        setFormData(prev => ({ ...prev, type: 'AUDIO' }));
      }

      toast.success('Upload thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Upload thất bại');
    } finally {
      setIsUploading(false);
    }
  }, [params.id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'video/*': ['.mp4', '.avi', '.mov', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/zip': ['.zip'],
      'text/*': ['.txt', '.md', '.html'],
    },
    maxSize: 100 * 1024 * 1024,
    disabled: isUploading || !isEditing,
  });

  const handleUpdate = () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const input: any = {
      title: formData.title,
      type: formData.type,
      status: formData.status,
    };

    if (formData.description?.trim()) input.description = formData.description;
    if (formData.url?.trim()) input.url = formData.url;
    if (formData.content?.trim()) input.content = formData.content;
    if (formData.fileName?.trim()) input.fileName = formData.fileName;
    if (formData.thumbnailUrl?.trim()) input.thumbnailUrl = formData.thumbnailUrl;
    if (formData.categoryId) input.categoryId = formData.categoryId;
    if (tags.length > 0) input.tags = tags;
    if (newUploadedFile) {
      input.fileSize = newUploadedFile.fileSize;
      input.mimeType = newUploadedFile.mimeType;
    }

    updateDocument({
      variables: { id: params.id, input },
    });
  };

  const handleDelete = () => {
    deleteDocument({ variables: { id: params.id } });
  };

  const handleDownload = () => {
    if (document?.url) {
      incrementDownload({ variables: { id: params.id } });
      window.open(document.url, '_blank');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUploadedFile(null);
    // Reset form data to original
    if (document) {
      setFormData({
        title: document.title || '',
        description: document.description || '',
        type: document.type || '',
        status: document.status || '',
        url: document.url || '',
        content: document.content || '',
        fileName: document.fileName || '',
        thumbnailUrl: document.thumbnailUrl || '',
        categoryId: document.category?.id || '',
        tags: document.tags?.join(', ') || '',
        fileSize: document.fileSize || 0,
        mimeType: document.mimeType || '',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">Không tìm thấy tài liệu</p>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const TypeIcon = TYPE_ICONS[document.type] || File;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {document.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={STATUS_CONFIG[document.status]?.variant || 'default'}>
                {STATUS_CONFIG[document.status]?.label || document.status}
              </Badge>
              {document.isAiAnalyzed && (
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI đã phân tích
                </Badge>
              )}
              <Badge variant="outline" className="gap-1">
                <TypeIcon className="w-3 h-3" />
                {document.type}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button size="sm" onClick={handleUpdate} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm">
                      Tiêu đề <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Loại tài liệu</Label>
                      <Combobox
                        options={DOCUMENT_TYPES}
                        value={formData.type}
                        onChange={(value) => setFormData({ ...formData, type: value })}
                        placeholder="Chọn loại..."
                        searchPlaceholder="Tìm kiếm..."
                        emptyMessage="Không tìm thấy"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Trạng thái</Label>
                      <Combobox
                        options={DOCUMENT_STATUSES}
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value })}
                        placeholder="Chọn trạng thái..."
                        searchPlaceholder="Tìm kiếm..."
                        emptyMessage="Không tìm thấy"
                      />
                    </div>
                  </div>

                  {categoryOptions.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm">Danh mục</Label>
                      <Combobox
                        options={categoryOptions}
                        value={formData.categoryId}
                        onChange={(value) => setFormData({ ...formData, categoryId: value })}
                        placeholder="Chọn danh mục..."
                        searchPlaceholder="Tìm danh mục..."
                        emptyMessage="Không có danh mục"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm">Tags (phân cách bởi dấu phẩy)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tag1, tag2, tag3"
                      className="h-10"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Mô tả</p>
                    <p className="text-foreground mt-1">{document.description || 'Không có mô tả'}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Loại</p>
                      <div className="flex items-center gap-2 mt-1">
                        <TypeIcon className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{document.type}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Danh mục</p>
                      <p className="mt-1 text-sm">
                        {document.category ? (
                          <span>{document.category.icon} {document.category.name}</span>
                        ) : (
                          <span className="text-muted-foreground">Chưa phân loại</span>
                        )}
                      </p>
                    </div>

                    {document.fileName && (
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-sm text-muted-foreground">Tên file</p>
                        <p className="font-mono text-xs sm:text-sm mt-1 truncate">{document.fileName}</p>
                      </div>
                    )}
                  </div>

                  {document.tags && document.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Content Section */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Nội dung</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {isEditing ? 'Chỉnh sửa URL hoặc nội dung tài liệu' : 'URL và nội dung tài liệu'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  {formData.type === 'TEXT' ? (
                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-sm">Nội dung (Markdown/HTML)</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={10}
                        className="font-mono text-sm resize-none"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="url" className="text-sm">
                          <LinkIcon className="w-4 h-4 inline mr-1" />
                          URL
                        </Label>
                        <Input
                          id="url"
                          type="url"
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          placeholder="https://..."
                          className="h-10"
                          readOnly={!!newUploadedFile}
                        />
                        {newUploadedFile && (
                          <p className="text-xs text-muted-foreground">
                            URL được tự động điền từ file đã upload
                          </p>
                        )}
                      </div>

                      {['FILE', 'AUDIO', 'IMAGE'].includes(formData.type) && (
                        <div className="space-y-2">
                          <Label htmlFor="fileName" className="text-sm">Tên file</Label>
                          <Input
                            id="fileName"
                            value={formData.fileName}
                            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                            className="h-10"
                            readOnly={!!newUploadedFile}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl" className="text-sm">Thumbnail URL (tùy chọn)</Label>
                    <Input
                      id="thumbnailUrl"
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://..."
                      className="h-10"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Video Player - Supports both uploaded videos and YouTube */}
                  {document.type === 'VIDEO' && document.url && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-500" />
                        Xem video
                      </p>
                      
                      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                        {isYouTubeUrl(document.url) ? (
                          // YouTube iframe embed
                          <iframe
                            src={getYouTubeEmbedUrl(document.url) || ''}
                            title={document.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          // Native video player for uploaded files
                          <video
                            controls
                            className="w-full h-full"
                            poster={document.thumbnailUrl || undefined}
                            preload="metadata"
                            playsInline
                            crossOrigin="anonymous"
                            onError={(e) => {
                              const video = e.target as HTMLVideoElement;
                              console.error('Video error:', video.error);
                              const errorCode = video.error?.code;
                              const errorMessages: Record<number, string> = {
                                1: 'Quá trình tải video bị hủy',
                                2: 'Lỗi mạng khi tải video',
                                3: 'Video bị lỗi decode - cần re-encode',
                                4: 'Định dạng video không được hỗ trợ',
                              };
                              const message = errorCode ? errorMessages[errorCode] || 'Lỗi không xác định' : 'Lỗi không xác định';
                              toast.error(`Lỗi phát video: ${message}`);
                            }}
                          >
                            <source src={document.url} type={document.mimeType || 'video/mp4'} />
                            Trình duyệt của bạn không hỗ trợ video.
                          </video>
                        )}
                      </div>
                      {isYouTubeUrl(document.url) && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Video từ YouTube
                        </p>
                      )}
                    </div>
                  )}

                  {/* Audio Player */}
                  {document.type === 'AUDIO' && document.url && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Music className="w-4 h-4 text-orange-500" />
                        Nghe audio
                      </p>
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            {document.thumbnailUrl ? (
                              <img
                                src={document.thumbnailUrl}
                                alt={document.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Music className="w-8 h-8 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{document.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {document.fileName || 'Audio file'}
                            </p>
                            {document.duration && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Thời lượng: {formatDuration(document.duration)}
                              </p>
                            )}
                          </div>
                        </div>
                        <audio
                          src={document.url}
                          controls
                          className="w-full mt-3"
                          preload="metadata"
                        >
                          <source src={document.url} type={document.mimeType || 'audio/mpeg'} />
                          Trình duyệt của bạn không hỗ trợ audio.
                        </audio>
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {document.type === 'IMAGE' && document.url && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-green-500" />
                        Xem hình ảnh
                      </p>
                      <div className="border rounded-lg overflow-hidden bg-muted/30">
                        <img
                          src={document.url}
                          alt={document.title}
                          className="w-full max-h-[600px] object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* File Preview - Documents, PDFs */}
                  {document.type === 'FILE' && document.url && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <File className="w-4 h-4 text-blue-500" />
                        Tài liệu
                      </p>
                      
                      {/* File Info Card */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getFileIcon(document.mimeType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{document.title}</p>
                            {document.fileName && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {document.fileName}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                              {document.fileSize && (
                                <span className="flex items-center gap-1">
                                  📦 {formatFileSize(document.fileSize)}
                                </span>
                              )}
                              {document.mimeType && (
                                <span className="flex items-center gap-1">
                                  📄 {document.mimeType.split('/')[1]?.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            onClick={handleDownload}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Tải về
                          </Button>
                        </div>
                      </div>

                      {/* Document Preview */}
                      {canPreviewFile(document.mimeType, document.url) ? (
                        <div className="border rounded-lg overflow-hidden bg-muted/30">
                          <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              Xem trước {getFileTypeLabel(document.mimeType, document.url)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => window.open(document.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Mở tab mới
                            </Button>
                          </div>
                          <div className="aspect-[3/4] max-h-[700px]">
                            {document.mimeType === 'application/pdf' || document.url?.toLowerCase().endsWith('.pdf') ? (
                              <iframe
                                src={`${document.url}#view=FitH`}
                                className="w-full h-full"
                                title={document.title}
                              />
                            ) : (
                              <iframe
                                src={getOfficePreviewUrl(document.url)}
                                className="w-full h-full"
                                title={document.title}
                                sandbox="allow-scripts allow-same-origin allow-popups"
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="border rounded-lg p-6 bg-muted/30 text-center">
                          <File className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Định dạng file này không hỗ trợ xem trước trực tuyến
                          </p>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={handleDownload}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Tải về để xem
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Link Preview */}
                  {document.type === 'LINK' && document.url && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-cyan-500" />
                        Liên kết
                      </p>
                      
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-4 rounded-lg border">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <LinkIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{document.title}</p>
                            {document.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {document.description}
                              </p>
                            )}
                            <a
                              href={document.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1 break-all"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              {document.url}
                            </a>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full sm:w-auto"
                            onClick={() => window.open(document.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Mở liên kết
                          </Button>
                        </div>
                      </div>

                      {/* Thumbnail if available */}
                      {document.thumbnailUrl && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={document.thumbnailUrl}
                            alt={document.title}
                            className="w-full max-h-[300px] object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Content with Better Formatting */}
                  {document.type === 'TEXT' && document.content && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        Nội dung văn bản
                      </p>
                      
                      <div className="border rounded-lg bg-muted/30 overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            {document.content.split('\n').length} dòng
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(document.content || '');
                              toast.success('Đã copy nội dung');
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                          <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                            {document.content}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* URL Section - Only show for types without preview */}
                  {document.url && !['VIDEO', 'AUDIO', 'IMAGE', 'FILE', 'LINK', 'TEXT'].includes(document.type) && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">URL</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all flex-1"
                        >
                          {document.url}
                        </a>
                        <Button size="sm" variant="outline" onClick={handleDownload}>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {document.thumbnailUrl && document.type !== 'IMAGE' && document.type !== 'VIDEO' && document.type !== 'AUDIO' && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Hình thu nhỏ</p>
                      <img
                        src={document.thumbnailUrl}
                        alt={document.title}
                        className="w-full max-w-md rounded-lg border"
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Upload Section - Only show when editing */}
          {isEditing && ['FILE', 'IMAGE', 'VIDEO', 'AUDIO'].includes(formData.type) && (
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Upload file mới</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Kéo thả file hoặc click để thay thế file hiện tại (tối đa 100MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!newUploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors",
                      isDragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-muted-foreground/25 hover:border-primary/50",
                      isUploading && "pointer-events-none opacity-50"
                    )}
                  >
                    <input {...getInputProps()} />
                    
                    {isUploading ? (
                      <div className="space-y-3">
                        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          Đang upload... {uploadProgress}%
                        </p>
                        <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm sm:text-base text-foreground mb-1">
                          {isDragActive ? 'Thả file vào đây...' : 'Kéo & thả file vào đây'}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                          hoặc click để chọn file
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Chọn file
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      {getFileIcon(newUploadedFile.mimeType)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {newUploadedFile.fileName}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatFileSize(newUploadedFile.fileSize)} • {newUploadedFile.mimeType}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          ✓ File mới đã upload thành công
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setNewUploadedFile(null);
                          // Reset to original URL
                          setFormData(prev => ({
                            ...prev,
                            url: document.url || '',
                            fileName: document.fileName || '',
                          }));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Current file info */}
                {document.url && !newUploadedFile && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">File hiện tại:</p>
                    <div className="flex items-center gap-2">
                      {getFileIcon(document.mimeType)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{document.fileName || 'Không có tên'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(document.fileSize)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          {document.isAiAnalyzed && (
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-base sm:text-lg">Phân tích AI</CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Phân tích lần cuối: {new Date(document.aiAnalyzedAt).toLocaleDateString('vi-VN')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {document.aiSummary && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Tóm tắt</p>
                    <p className="text-sm text-muted-foreground">{document.aiSummary}</p>
                  </div>
                )}

                {document.aiKeywords && document.aiKeywords.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Từ khóa</p>
                    <div className="flex flex-wrap gap-2">
                      {document.aiKeywords.map((keyword: string) => (
                        <Badge key={keyword} className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {document.aiTopics && document.aiTopics.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Chủ đề</p>
                    <div className="flex flex-wrap gap-2">
                      {document.aiTopics.map((topic: string) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {document.url && (
                <Button variant="outline" className="w-full justify-start" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Tải xuống / Xem
                </Button>
              )}

              <Link href="/lms/admin/source-documents" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Xem tất cả tài liệu
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Lượt xem</span>
                </div>
                <span className="font-semibold text-sm">{document.viewCount || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Tải xuống</span>
                </div>
                <span className="font-semibold text-sm">{document.downloadCount || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Đang sử dụng</span>
                </div>
                <span className="font-semibold text-sm">{document.usageCount || 0} khóa học</span>
              </div>

              {document.fileSize > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Kích thước</span>
                  <span className="font-mono text-xs">{formatFileSize(document.fileSize)}</span>
                </div>
              )}

              {document.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Thời lượng</span>
                  <span className="font-mono text-xs">{formatDuration(document.duration)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thông tin khác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Người tạo</p>
                  <p className="font-medium">{document.user?.username || document.user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Ngày tạo</p>
                  <p>{new Date(document.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">Cập nhật</p>
                  <p>{new Date(document.updatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {document.publishedAt && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground text-xs">Xuất bản</p>
                    <p>{new Date(document.publishedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa tài liệu &quot;{document.title}&quot;?
              <br />
              <span className="text-destructive font-medium">
                Hành động này không thể hoàn tác!
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
