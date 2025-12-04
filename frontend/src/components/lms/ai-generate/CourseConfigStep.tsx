'use client';

import * as React from 'react';
import { Settings, Users, Target, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AIGenerateConfig } from './types';

interface CourseConfigStepProps {
  config: AIGenerateConfig;
  onConfigChange: (config: AIGenerateConfig) => void;
}

const levelOptions = [
  { value: 'BEGINNER', label: 'Cơ bản (Beginner)' },
  { value: 'INTERMEDIATE', label: 'Trung cấp (Intermediate)' },
  { value: 'ADVANCED', label: 'Nâng cao (Advanced)' },
];

const durationOptions = [
  { value: 'SHORT', label: 'Ngắn (5-10 phút/bài)' },
  { value: 'MEDIUM', label: 'Trung bình (10-20 phút/bài)' },
  { value: 'LONG', label: 'Dài (20-30 phút/bài)' },
];

const styleOptions = [
  { value: 'ACADEMIC', label: 'Học thuật' },
  { value: 'PRACTICAL', label: 'Thực hành' },
  { value: 'CONVERSATIONAL', label: 'Đối thoại' },
];

const languageOptions = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

export function CourseConfigStep({
  config,
  onConfigChange,
}: CourseConfigStepProps) {
  const updateConfig = (key: keyof AIGenerateConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const handleTargetAudienceChange = (text: string) => {
    const items = text.split('\n').filter(Boolean);
    updateConfig('targetAudience', items);
  };

  const handleLearningObjectivesChange = (text: string) => {
    const items = text.split('\n').filter(Boolean);
    updateConfig('learningObjectives', items);
  };

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="w-5 h-5" />
            Thông tin cơ bản
          </CardTitle>
          <CardDescription>
            Tiêu đề và mô tả sẽ được AI tự động đề xuất nếu để trống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề khóa học (Tùy chọn)</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => updateConfig('title', e.target.value)}
              placeholder="Để trống để AI tự đề xuất"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả ngắn (Tùy chọn)</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => updateConfig('description', e.target.value)}
              placeholder="Để trống để AI tự đề xuất"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cấp độ</Label>
              <Combobox
                options={levelOptions}
                value={config.level}
                onChange={(value) => updateConfig('level', value as any)}
                placeholder="Chọn cấp độ"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ngôn ngữ nội dung</Label>
              <Combobox
                options={languageOptions}
                value={config.language}
                onChange={(value) => updateConfig('language', value as any)}
                placeholder="Chọn ngôn ngữ"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-5 h-5" />
            Đối tượng học viên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Đối tượng (Tùy chọn)</Label>
            <Textarea
              id="targetAudience"
              value={config.targetAudience.join('\n')}
              onChange={(e) => handleTargetAudienceChange(e.target.value)}
              placeholder="Mỗi dòng một đối tượng, VD:&#10;Người mới bắt đầu&#10;Sinh viên&#10;Chuyên gia muốn cập nhật"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Mỗi dòng một đối tượng. Để trống để AI tự đề xuất.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningObjectives">Mục tiêu học tập (Tùy chọn)</Label>
            <Textarea
              id="learningObjectives"
              value={config.learningObjectives.join('\n')}
              onChange={(e) => handleLearningObjectivesChange(e.target.value)}
              placeholder="Mỗi dòng một mục tiêu, VD:&#10;Hiểu được khái niệm cơ bản&#10;Áp dụng được vào thực tế"
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Structure Config */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-5 h-5" />
            Cấu trúc khóa học
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Số modules</Label>
              <Badge variant="secondary">{config.moduleCount} modules</Badge>
            </div>
            <Slider
              value={[config.moduleCount]}
              onValueChange={([value]) => updateConfig('moduleCount', value)}
              min={2}
              max={10}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Khuyến nghị: 4-6 modules cho khóa học vừa phải
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Số bài học / module</Label>
              <Badge variant="secondary">{config.lessonsPerModule} bài</Badge>
            </div>
            <Slider
              value={[config.lessonsPerModule]}
              onValueChange={([value]) => updateConfig('lessonsPerModule', value)}
              min={2}
              max={8}
              step={1}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Độ dài bài học</Label>
              <Combobox
                options={durationOptions}
                value={config.lessonDuration}
                onChange={(value) => updateConfig('lessonDuration', value as any)}
                placeholder="Chọn độ dài"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Phong cách nội dung</Label>
              <Combobox
                options={styleOptions}
                value={config.contentStyle}
                onChange={(value) => updateConfig('contentStyle', value as any)}
                placeholder="Chọn phong cách"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5" />
            Tùy chọn nội dung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thêm ví dụ minh họa</Label>
              <p className="text-xs text-muted-foreground">
                AI sẽ thêm ví dụ thực tế vào nội dung
              </p>
            </div>
            <Switch
              checked={config.includeExamples}
              onCheckedChange={(checked) => updateConfig('includeExamples', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thêm bài tập thực hành</Label>
              <p className="text-xs text-muted-foreground">
                Bài tập để học viên áp dụng kiến thức
              </p>
            </div>
            <Switch
              checked={config.includeExercises}
              onCheckedChange={(checked) => updateConfig('includeExercises', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tạo quiz đánh giá</Label>
              <p className="text-xs text-muted-foreground">
                Quiz tự động cho mỗi module
              </p>
            </div>
            <Switch
              checked={config.includeQuizzes}
              onCheckedChange={(checked) => updateConfig('includeQuizzes', checked)}
            />
          </div>

          <div className="pt-2 space-y-2">
            <Label htmlFor="additionalContext">Yêu cầu bổ sung (Tùy chọn)</Label>
            <Textarea
              id="additionalContext"
              value={config.additionalContext}
              onChange={(e) => updateConfig('additionalContext', e.target.value)}
              placeholder="VD: Tập trung vào ứng dụng thực tế, Thêm case study..."
              rows={2}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
