'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFindUnique, useUpdateOne, useFindMany } from '@/hooks/useDynamicGraphQL';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft,
  Save,
  AlertCircle,
  Plus,
  X,
  Upload,
  BookOpen,
  Search,
  File,
  Video,
  FileText,
  Music,
  Link as LinkIcon,
  Image as ImageIcon,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  GET_SOURCE_DOCUMENTS,
  GET_COURSE_DOCUMENTS,
  LINK_DOCUMENT_TO_COURSE,
  UNLINK_DOCUMENT_FROM_COURSE,
  UPDATE_COURSE_DOCUMENT_LINK,
} from '@/graphql/lms/source-documents';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const courseId = (params?.id as string) || '';

  const { data: course, loading, error } = useFindUnique(
    'Course',
    { id: courseId },
    {
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    { skip: !courseId || courseId === '' }
  );

  const { data: categories } = useFindMany('CourseCategory', {
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  const { data: instructors } = useFindMany('User', {
    where: {
      userRoles: {
        some: {
          role: {
            name: 'giangvien'
          }
        }
      }
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
    },
  });

  const [updateCourse, { loading: updateLoading }] = useUpdateOne('Course');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    trailer: '',
    price: '0',
    level: 'BEGINNER',
    status: 'DRAFT',
    duration: '0',
    language: 'vi',
    metaTitle: '',
    metaDescription: '',
    categoryId: '',
    instructorId: '',
  });

  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [newItem, setNewItem] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newTag, setNewTag] = useState('');

  // Source Documents state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [documentSearch, setDocumentSearch] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Source Documents queries
  const { data: availableDocsData } = useQuery(GET_SOURCE_DOCUMENTS, {
    variables: {
      filter: { title: documentSearch || undefined },
      page: 1,
      limit: 20,
    },
    skip: !linkDialogOpen,
  });

  const { data: linkedDocsData, refetch: refetchLinkedDocs } = useQuery(GET_COURSE_DOCUMENTS, {
    variables: { courseId },
    skip: !courseId,
  });

  const [linkDocument] = useMutation(LINK_DOCUMENT_TO_COURSE, {
    onCompleted: () => {
      toast({ type: 'success', title: 'Thành công', description: 'Đã liên kết tài liệu' });
      refetchLinkedDocs();
      setLinkDialogOpen(false);
      setSelectedDocuments([]);
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Lỗi', description: error.message });
    },
  });

  const [unlinkDocument] = useMutation(UNLINK_DOCUMENT_FROM_COURSE, {
    onCompleted: () => {
      toast({ type: 'success', title: 'Thành công', description: 'Đã gỡ liên kết tài liệu' });
      refetchLinkedDocs();
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Lỗi', description: error.message });
    },
  });

  const [updateDocumentLink] = useMutation(UPDATE_COURSE_DOCUMENT_LINK, {
    onCompleted: () => {
      toast({ type: 'success', title: 'Thành công', description: 'Đã cập nhật tài liệu' });
      refetchLinkedDocs();
    },
    onError: (error) => {
      toast({ type: 'error', title: 'Lỗi', description: error.message });
    },
  });

  const availableDocuments = availableDocsData?.sourceDocuments?.data || [];
  const linkedDocuments = linkedDocsData?.courseDocuments || [];

  const TYPE_ICONS: Record<string, any> = {
    FILE: File,
    VIDEO: Video,
    TEXT: FileText,
    AUDIO: Music,
    LINK: LinkIcon,
    IMAGE: ImageIcon,
  };

  const handleLinkDocuments = () => {
    if (selectedDocuments.length === 0) {
      toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng chọn ít nhất 1 tài liệu' });
      return;
    }

    selectedDocuments.forEach((documentId) => {
      linkDocument({
        variables: {
          userId: course?.instructor?.id || '',
          input: {
            courseId,
            documentId,
            isRequired: false,
            order: linkedDocuments.length,
          },
        },
      });
    });
  };

  const handleUnlinkDocument = (documentId: string) => {
    unlinkDocument({
      variables: {
        courseId,
        documentId,
      },
    });
  };

  const handleToggleRequired = (linkId: string, isRequired: boolean) => {
    updateDocumentLink({
      variables: {
        id: linkId,
        input: { isRequired },
      },
    });
  };

  // Load course data
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        description: course.description || '',
        thumbnail: course.thumbnail || '',
        trailer: course.trailer || '',
        price: course.price?.toString() || '0',
        level: course.level || 'BEGINNER',
        status: course.status || 'DRAFT',
        duration: course.duration?.toString() || '0',
        language: course.language || 'vi',
        metaTitle: course.metaTitle || '',
        metaDescription: course.metaDescription || '',
        categoryId: course.category?.id || '',
        instructorId: course.instructor?.id || '',
      });
      setWhatYouWillLearn(course.whatYouWillLearn || []);
      setRequirements(course.requirements || []);
      setTargetAudience(course.targetAudience || []);
      setTags(course.tags || []);
    }
  }, [course]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    handleChange('title', value);
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      handleChange('slug', generateSlug(value));
    }
  };

  const handleAddItem = (type: 'learn' | 'requirement' | 'audience' | 'tag') => {
    if (type === 'learn' && newItem.trim()) {
      setWhatYouWillLearn([...whatYouWillLearn, newItem.trim()]);
      setNewItem('');
    } else if (type === 'requirement' && newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    } else if (type === 'audience' && newAudience.trim()) {
      setTargetAudience([...targetAudience, newAudience.trim()]);
      setNewAudience('');
    } else if (type === 'tag' && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveItem = (type: 'learn' | 'requirement' | 'audience' | 'tag', index: number) => {
    if (type === 'learn') {
      setWhatYouWillLearn(whatYouWillLearn.filter((_, i) => i !== index));
    } else if (type === 'requirement') {
      setRequirements(requirements.filter((_, i) => i !== index));
    } else if (type === 'audience') {
      setTargetAudience(targetAudience.filter((_, i) => i !== index));
    } else if (type === 'tag') {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateCourse({
        where: { id: courseId },
        data: {
          title: formData.title,
          slug: formData.slug,
          description: formData.description || null,
          thumbnail: formData.thumbnail || null,
          trailer: formData.trailer || null,
          price: parseFloat(formData.price) || 0,
          level: formData.level,
          status: formData.status,
          duration: parseInt(formData.duration) || 0,
          language: formData.language,
          metaTitle: formData.metaTitle || null,
          metaDescription: formData.metaDescription || null,
          whatYouWillLearn: whatYouWillLearn,
          requirements: requirements,
          targetAudience: targetAudience,
          tags: tags,
          categoryId: formData.categoryId || null,
          instructorId: formData.instructorId,
        },
      });

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật khóa học',
        type: 'success',
      });

      router.push(`/lms/admin/courses/${courseId}`);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật khóa học',
        type: 'error',
      });
    }
  };

  const handleBack = () => {
    router.push(`/lms/admin/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error?.message || 'Không tìm thấy khóa học'}</p>
            <Button onClick={() => router.push('/lms/admin/courses')} className="mt-4">
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chỉnh sửa khóa học</h1>
          <p className="text-sm text-gray-600 mt-1">{course.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Cập nhật thông tin khóa học</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL Thumbnail</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => handleChange('thumbnail', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailer">URL Video giới thiệu</Label>
                <Input
                  id="trailer"
                  value={formData.trailer}
                  onChange={(e) => handleChange('trailer', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Thời lượng (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Cấp độ</Label>
                <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Cơ bản</SelectItem>
                    <SelectItem value="INTERMEDIATE">Trung cấp</SelectItem>
                    <SelectItem value="ADVANCED">Nâng cao</SelectItem>
                    <SelectItem value="EXPERT">Chuyên gia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Nháp</SelectItem>
                    <SelectItem value="PUBLISHED">Xuất bản</SelectItem>
                    <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Ngôn ngữ</Label>
                <Select value={formData.language} onValueChange={(value) => handleChange('language', value)}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Danh mục</Label>
                <Select value={formData.categoryId || undefined} onValueChange={(value) => handleChange('categoryId', value)}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>Nội dung học tập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What You Will Learn */}
            <div className="space-y-3">
              <Label>Bạn sẽ học được gì</Label>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Nhập mục tiêu học tập..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('learn'))}
                />
                <Button type="button" onClick={() => handleAddItem('learn')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {whatYouWillLearn.length > 0 && (
                <ul className="space-y-2">
                  {whatYouWillLearn.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem('learn', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-3">
              <Label>Yêu cầu</Label>
              <div className="flex gap-2">
                <Input
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Nhập yêu cầu..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('requirement'))}
                />
                <Button type="button" onClick={() => handleAddItem('requirement')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {requirements.length > 0 && (
                <ul className="space-y-2">
                  {requirements.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem('requirement', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Separator />

            {/* Target Audience */}
            <div className="space-y-3">
              <Label>Đối tượng học viên</Label>
              <div className="flex gap-2">
                <Input
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  placeholder="Nhập đối tượng học viên..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('audience'))}
                />
                <Button type="button" onClick={() => handleAddItem('audience')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {targetAudience.length > 0 && (
                <ul className="space-y-2">
                  {targetAudience.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem('audience', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Marketing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-gray-500">{formData.metaTitle.length}/60 ký tự</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                maxLength={160}
                rows={3}
              />
              <p className="text-xs text-gray-500">{formData.metaDescription.length}/160 ký tự</p>
            </div>

            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nhập tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('tag'))}
                />
                <Button type="button" onClick={() => handleAddItem('tag')} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('tag', index)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Source Documents Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <CardTitle>Tài liệu nguồn</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  Quản lý tài liệu nguồn cho khóa học
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLinkDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài liệu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {linkedDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Chưa có tài liệu nào</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLinkDialogOpen(true)}
                  className="mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm tài liệu đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedDocuments.map((link: any) => {
                  const TypeIcon = TYPE_ICONS[link.document.type] || File;
                  return (
                    <div
                      key={link.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
                        <TypeIcon className="w-5 h-5 text-blue-600" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">
                          {link.document.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {link.document.type}
                          </Badge>
                          {link.isRequired && (
                            <Badge className="text-xs bg-orange-100 text-orange-700">
                              Bắt buộc
                            </Badge>
                          )}
                          {link.document.category && (
                            <span className="text-xs text-gray-500">
                              {link.document.category.icon} {link.document.category.name}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                            {link.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={link.isRequired}
                          onCheckedChange={(checked) =>
                            handleToggleRequired(link.id, checked as boolean)
                          }
                          title="Bắt buộc"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlinkDocument(link.document.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button type="submit" disabled={updateLoading} className="gap-2">
            <Save className="w-4 h-4" />
            {updateLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>

      {/* Link Documents Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm tài liệu nguồn</DialogTitle>
            <DialogDescription>
              Chọn tài liệu để thêm vào khóa học
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={documentSearch}
                onChange={(e) => setDocumentSearch(e.target.value)}
                placeholder="Tìm kiếm tài liệu..."
                className="pl-10"
              />
            </div>

            {/* Documents List */}
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              {availableDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Không tìm thấy tài liệu</p>
                </div>
              ) : (
                <div className="divide-y">
                  {availableDocuments.map((doc: any) => {
                    const TypeIcon = TYPE_ICONS[doc.type] || File;
                    const isLinked = linkedDocuments.some(
                      (link: any) => link.document.id === doc.id
                    );
                    const isSelected = selectedDocuments.includes(doc.id);

                    return (
                      <div
                        key={doc.id}
                        className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : ''
                        } ${isLinked ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (isLinked) return;
                          setSelectedDocuments((prev) =>
                            prev.includes(doc.id)
                              ? prev.filter((id) => id !== doc.id)
                              : [...prev, doc.id]
                          );
                        }}
                      >
                        {/* Checkbox */}
                        <Checkbox
                          checked={isSelected}
                          disabled={isLinked}
                          onCheckedChange={() => {
                            // Handled by parent div onClick
                          }}
                        />

                        {/* Icon */}
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
                          <TypeIcon className="w-5 h-5 text-blue-600" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                            {isLinked && (
                              <Badge className="text-xs bg-green-100 text-green-700">
                                Đã thêm
                              </Badge>
                            )}
                            {doc.category && (
                              <span className="text-xs text-gray-500">
                                {doc.category.icon} {doc.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedDocuments.length > 0 && (
              <p className="text-sm text-gray-600">
                Đã chọn {selectedDocuments.length} tài liệu
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLinkDialogOpen(false);
                setSelectedDocuments([]);
                setDocumentSearch('');
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleLinkDocuments} disabled={selectedDocuments.length === 0}>
              Thêm ({selectedDocuments.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
