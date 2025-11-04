'use client';

import { useRouter } from 'next/navigation';
import { useCreateOne, useFindMany } from '@/hooks/useDynamicGraphQL';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

export default function CreateCoursePage() {
  const router = useRouter();
  const { toast } = useToast();

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
      roleType: 'GIANGVIEN',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
    },
  });

  const [createCourse, { loading: createLoading }] = useCreateOne('Course');

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

    if (!formData.instructorId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn giảng viên',
        type: 'error',
      });
      return;
    }

    try {
      const result = await createCourse({
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
        description: 'Đã tạo khóa học mới',
        type: 'success',
      });

      router.push('/lms/admin/courses');
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo khóa học',
        type: 'error',
      });
    }
  };

  const handleBack = () => {
    router.push('/lms/admin/courses');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tạo khóa học mới</h1>
          <p className="text-sm text-gray-600 mt-1">Nhập thông tin khóa học</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/lms/admin/courses/create-with-ai')}
          className="gap-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-purple-200"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="hidden sm:inline">Tạo Với AI</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Nhập thông tin cơ bản của khóa học</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề khóa học"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="khoa-hoc-slug"
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
                placeholder="Mô tả về khóa học..."
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
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trailer">URL Video giới thiệu</Label>
                <Input
                  id="trailer"
                  value={formData.trailer}
                  onChange={(e) => handleChange('trailer', e.target.value)}
                  placeholder="https://youtube.com/..."
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
                  placeholder="0"
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
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Cấp độ *</Label>
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
                <Label htmlFor="status">Trạng thái *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="instructorId">Giảng viên *</Label>
                <Select value={formData.instructorId} onValueChange={(value) => handleChange('instructorId', value)}>
                  <SelectTrigger id="instructorId">
                    <SelectValue placeholder="Chọn giảng viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors?.map((instructor: any) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.firstName && instructor.lastName
                          ? `${instructor.firstName} ${instructor.lastName}`
                          : instructor.username}
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
            <CardDescription>Mục tiêu và yêu cầu của khóa học</CardDescription>
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
            <CardDescription>Tối ưu hóa công cụ tìm kiếm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                maxLength={60}
                placeholder="Tiêu đề SEO (tối đa 60 ký tự)"
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
                placeholder="Mô tả SEO (tối đa 160 ký tự)"
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

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={handleBack}>
            Hủy
          </Button>
          <Button type="submit" disabled={createLoading} className="gap-2">
            <Save className="w-4 h-4" />
            {createLoading ? 'Đang tạo...' : 'Tạo khóa học'}
          </Button>
        </div>
      </form>
    </div>
  );
}
