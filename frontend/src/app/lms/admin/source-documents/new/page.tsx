'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, Upload, Link as LinkIcon, FileText, X, File, Image, Video, Music, Archive, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import {
  CREATE_SOURCE_DOCUMENT,
  GET_SOURCE_DOCUMENT_CATEGORIES,
} from '@/graphql/lms/source-documents';
import { cn } from '@/lib/utils';

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

// Utility to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on mime type
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="w-8 h-8 text-green-500" />;
  if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />;
  if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8 text-orange-500" />;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
    return <Archive className="w-8 h-8 text-yellow-500" />;
  }
  return <File className="w-8 h-8 text-blue-500" />;
};

interface UploadedFileInfo {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tempId: string;
}

export default function NewSourceDocumentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FILE',
    status: 'DRAFT',
    url: '',
    content: '',
    fileName: '',
    thumbnailUrl: '',
    categoryId: '',
    tags: '',
  });

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Get categories
  const { data: categoriesData } = useQuery(GET_SOURCE_DOCUMENT_CATEGORIES);
  const categories = categoriesData?.sourceDocumentCategories || [];

  // Create mutation
  const [createDocument, { loading }] = useMutation(CREATE_SOURCE_DOCUMENT, {
    refetchQueries: ['GetSourceDocuments'],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      toast.success('Đã tạo tài liệu nguồn mới');
      router.push(`/lms/admin/source-documents/${data.createSourceDocument.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Upload file to MinIO
  const uploadFileToMinio = async (file: File): Promise<UploadedFileInfo> => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    const token = localStorage.getItem('accessToken');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:13001';
    
    const response = await fetch(`${backendUrl}/api/lms/source-documents/upload`, {
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
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (actual progress would need XHR/fetch progress API)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadFileToMinio(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedFile(result);
      
      // Auto-fill form fields from upload result
      handleChange('url', result.url);
      handleChange('fileName', result.fileName);
      
      // Auto-detect type based on mime
      if (result.mimeType.startsWith('image/')) {
        handleChange('type', 'IMAGE');
      } else if (result.mimeType.startsWith('video/')) {
        handleChange('type', 'VIDEO');
      } else if (result.mimeType.startsWith('audio/')) {
        handleChange('type', 'AUDIO');
      } else {
        handleChange('type', 'FILE');
      }

      // Auto-set title from filename if empty
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        handleChange('title', nameWithoutExt);
      }

      toast.success('Upload thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Upload thất bại');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [formData.title]);

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
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'video/*': ['.mp4', '.avi', '.mov', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/zip': ['.zip'],
      'text/*': ['.txt', '.md', '.html', '.css', '.js', '.json'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: isUploading,
  });

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setSelectedFile(null);
    handleChange('url', '');
    handleChange('fileName', '');
    setUploadStatus('idle');
  };

  // Upload from URL
  const handleUploadFromUrl = async () => {
    if (!fileUrl.trim()) {
      toast.error('Vui lòng nhập URL');
      return;
    }

    // Validate URL format
    try {
      new URL(fileUrl);
    } catch {
      toast.error('URL không hợp lệ');
      return;
    }

    try {
      setUploadStatus('uploading');
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Call backend to download and upload
      const token = localStorage.getItem('accessToken');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:13001';
      const response = await fetch(
        `${backendUrl}/api/lms/source-documents/upload-from-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ url: fileUrl }),
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();

      setUploadProgress(100);
      setUploadStatus('success');

      // Set uploaded file info
      setUploadedFile({
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize || 0,
        mimeType: result.mimeType || '',
        tempId: result.tempId || `temp_${Date.now()}`,
      });

      // Auto-fill form fields
      handleChange('url', result.url);
      handleChange('fileName', result.fileName);

      // Auto-detect type based on mime
      if (result.mimeType?.startsWith('image/')) {
        handleChange('type', 'IMAGE');
      } else if (result.mimeType?.startsWith('video/')) {
        handleChange('type', 'VIDEO');
      } else if (result.mimeType?.startsWith('audio/')) {
        handleChange('type', 'AUDIO');
      } else {
        handleChange('type', 'FILE');
      }

      // Auto-set title from filename if empty
      if (!formData.title && result.fileName) {
        const nameWithoutExt = result.fileName.replace(/\.[^/.]+$/, '');
        handleChange('title', nameWithoutExt);
      }

      toast.success(`File "${result.fileName}" đã được tải về và upload`);

      // Reset URL input after 2 seconds
      setTimeout(() => {
        setFileUrl('');
        setUploadStatus('idle');
      }, 2000);
    } catch (error: any) {
      setUploadStatus('error');

      const errorMessage = error?.message || 'Không thể tải file từ URL';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    // Prepare input - only include fields with values
    const input: any = {
      title: formData.title,
      type: formData.type,
      status: formData.status,
    };

    // Add optional fields only if they have values
    if (formData.description?.trim()) input.description = formData.description;
    if (formData.url?.trim()) input.url = formData.url;
    if (formData.content?.trim()) input.content = formData.content;
    if (formData.fileName?.trim()) input.fileName = formData.fileName;
    if (formData.thumbnailUrl?.trim()) input.thumbnailUrl = formData.thumbnailUrl;
    if (formData.categoryId) input.categoryId = formData.categoryId;
    if (formData.tags?.trim()) {
      input.tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Add file size if uploaded
    if (uploadedFile) {
      input.fileSize = uploadedFile.fileSize;
      input.mimeType = uploadedFile.mimeType;
    }

    createDocument({
      variables: {
        input,
      },
    });
  };

  // Category options for combobox
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: `${cat.icon || ''} ${cat.name}`.trim(),
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Tạo tài liệu nguồn mới
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">
            Thêm file, video, hoặc nội dung text để sử dụng trong khóa học
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Thông tin cơ bản</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Điền thông tin về tài liệu nguồn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Nhập tiêu đề tài liệu..."
                required
                className="h-10"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Mô tả chi tiết về tài liệu..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Type & Status - 2 columns on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label className="text-sm">
                  Loại tài liệu <span className="text-destructive">*</span>
                </Label>
                <Combobox
                  options={DOCUMENT_TYPES}
                  value={formData.type}
                  onChange={(value) => handleChange('type', value)}
                  placeholder="Chọn loại tài liệu..."
                  searchPlaceholder="Tìm kiếm..."
                  emptyMessage="Không tìm thấy"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm">Trạng thái</Label>
                <Combobox
                  options={DOCUMENT_STATUSES}
                  value={formData.status}
                  onChange={(value) => handleChange('status', value)}
                  placeholder="Chọn trạng thái..."
                  searchPlaceholder="Tìm kiếm..."
                  emptyMessage="Không tìm thấy"
                />
              </div>
            </div>

            {/* Category */}
            {categoryOptions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Danh mục</Label>
                <Combobox
                  options={categoryOptions}
                  value={formData.categoryId}
                  onChange={(value) => handleChange('categoryId', value)}
                  placeholder="Chọn danh mục..."
                  searchPlaceholder="Tìm danh mục..."
                  emptyMessage="Không có danh mục"
                />
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm">Tags (phân cách bởi dấu phẩy)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="react, javascript, tutorial"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                Ví dụ: react, javascript, tutorial
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Nội dung</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {formData.type === 'FILE' && 'URL file (tự động điền sau khi upload)'}
              {formData.type === 'VIDEO' && 'Nhập URL video (YouTube, Vimeo, MP4...)'}
              {formData.type === 'TEXT' && 'Nhập nội dung text/markdown'}
              {formData.type === 'AUDIO' && 'URL audio (tự động điền sau khi upload)'}
              {formData.type === 'LINK' && 'Nhập URL liên kết'}
              {formData.type === 'IMAGE' && 'URL ảnh (tự động điền sau khi upload)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL (for all types except TEXT) */}
            {formData.type !== 'TEXT' && (
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder={
                    formData.type === 'VIDEO'
                      ? 'https://youtube.com/watch?v=...'
                      : formData.type === 'LINK'
                      ? 'https://example.com'
                      : 'https://...'
                  }
                  className="h-10"
                  readOnly={['FILE', 'IMAGE', 'AUDIO'].includes(formData.type) && !!uploadedFile}
                />
                {uploadedFile && ['FILE', 'IMAGE', 'AUDIO'].includes(formData.type) && (
                  <p className="text-xs text-muted-foreground">
                    URL được tự động điền từ file đã upload
                  </p>
                )}
              </div>
            )}

            {/* File Name */}
            {['FILE', 'AUDIO', 'IMAGE'].includes(formData.type) && (
              <div className="space-y-2">
                <Label htmlFor="fileName" className="text-sm">Tên file</Label>
                <Input
                  id="fileName"
                  value={formData.fileName}
                  onChange={(e) => handleChange('fileName', e.target.value)}
                  placeholder="document.pdf"
                  className="h-10"
                  readOnly={!!uploadedFile}
                />
              </div>
            )}

            {/* Text Content */}
            {formData.type === 'TEXT' && (
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Nội dung (Markdown/HTML)
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="# Tiêu đề&#10;&#10;Nội dung..."
                  rows={10}
                  className="font-mono text-sm resize-none"
                />
              </div>
            )}

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl" className="text-sm">Thumbnail URL (tùy chọn)</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                placeholder="https://..."
                className="h-10"
              />
              {formData.thumbnailUrl && (
                <div className="mt-2">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Preview"
                    className="w-full max-w-xs h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Section - Show for FILE, IMAGE, VIDEO, AUDIO types */}
        {['FILE', 'IMAGE', 'VIDEO', 'AUDIO'].includes(formData.type) && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Upload tài liệu</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Kéo thả file, chọn từ máy tính hoặc tải từ URL (tối đa 100MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Upload Mode Tabs */}
              <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as 'file' | 'url')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="file">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Tải từ URL
                  </TabsTrigger>
                </TabsList>

                {/* File Upload Tab */}
                <TabsContent value="file" className="space-y-4 mt-0">
                  {!uploadedFile ? (
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
                      
                      {isUploading && uploadMode === 'file' ? (
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
                        {getFileIcon(uploadedFile.mimeType)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {uploadedFile.fileName}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatFileSize(uploadedFile.fileSize)} • {uploadedFile.mimeType}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Đã upload thành công
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={removeUploadedFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* URL Upload Tab */}
                <TabsContent value="url" className="space-y-4 mt-0">
                  {!uploadedFile ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="fileUrl">
                          <LinkIcon className="w-4 h-4 inline mr-1" />
                          URL của file (docs, xlsx, txt, md, pdf, images...)
                        </Label>
                        <Input
                          id="fileUrl"
                          type="url"
                          value={fileUrl}
                          onChange={(e) => setFileUrl(e.target.value)}
                          placeholder="https://example.com/document.pdf"
                          disabled={isUploading}
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, TXT, MD, PPT, Images, Videos, Audio... (Tối đa 100MB)
                        </p>
                      </div>

                      {/* Progress Bar */}
                      {uploadStatus === 'uploading' && (
                        <div className="space-y-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs sm:text-sm text-muted-foreground text-center">
                            Đang tải và upload... {uploadProgress}%
                          </p>
                        </div>
                      )}

                      {/* Success Status */}
                      {uploadStatus === 'success' && (
                        <div className="flex items-center justify-center gap-2 text-green-600 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Tải và upload thành công!</span>
                        </div>
                      )}

                      {/* Error Status */}
                      {uploadStatus === 'error' && (
                        <div className="flex items-center justify-center gap-2 text-red-600 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Tải file thất bại</span>
                        </div>
                      )}

                      {/* Upload Button */}
                      {uploadStatus !== 'uploading' && uploadStatus !== 'success' && (
                        <Button
                          type="button"
                          onClick={handleUploadFromUrl}
                          disabled={!fileUrl.trim() || isUploading}
                          className="w-full"
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Tải file từ URL
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-start gap-3">
                        {getFileIcon(uploadedFile.mimeType)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {uploadedFile.fileName}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatFileSize(uploadedFile.fileSize)} • {uploadedFile.mimeType}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Đã tải và upload thành công
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={removeUploadedFile}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Actions - Fixed footer on mobile */}
        <Card className="sticky bottom-0 sm:relative border-t sm:border">
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading || isUploading}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={loading || isUploading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo tài liệu'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
