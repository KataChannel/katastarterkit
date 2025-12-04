'use client';

import * as React from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Target,
  Users,
  ChevronDown,
  ChevronRight,
  FileText,
  CheckCircle2,
  Edit,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedCourse, GeneratedModule } from './types';
import { cn } from '@/lib/utils';

interface CoursePreviewStepProps {
  course: GeneratedCourse;
  onEdit?: () => void;
}

export function CoursePreviewStep({
  course,
  onEdit,
}: CoursePreviewStepProps) {
  const [expandedModules, setExpandedModules] = React.useState<string[]>([]);
  
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length, 
    0
  );
  const totalQuizzes = course.modules.filter(m => m.quiz).length;

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleTitle)
        ? prev.filter(t => t !== moduleTitle)
        : [...prev, moduleTitle]
    );
  };

  const expandAll = () => {
    setExpandedModules(course.modules.map(m => m.title));
  };

  const collapseAll = () => {
    setExpandedModules([]);
  };

  return (
    <div className="space-y-4">
      {/* Course Overview */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg text-green-900">
                {course.title}
              </CardTitle>
              <CardDescription className="text-green-700">
                {course.description}
              </CardDescription>
            </div>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="gap-1">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Cấp độ:</span>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{course.modules.length} modules</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>{totalLessons} bài học</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>{course.duration} phút</span>
            </div>
          </div>

          {/* What you'll learn */}
          {course.whatYouWillLearn.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Bạn sẽ học được
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.whatYouWillLearn.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience */}
          {course.targetAudience.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="font-medium text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Đối tượng
              </p>
              <div className="flex flex-wrap gap-2">
                {course.targetAudience.map((item, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t">
              {course.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modules Structure */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Cấu trúc khóa học</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                Mở tất cả
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                Thu gọn
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-auto max-h-[400px]">
            <div className="space-y-2">
              {course.modules.map((module, moduleIdx) => (
                <ModuleItem
                  key={module.title}
                  module={module}
                  index={moduleIdx}
                  isExpanded={expandedModules.includes(module.title)}
                  onToggle={() => toggleModule(module.title)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Module Item Component
interface ModuleItemProps {
  module: GeneratedModule;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ModuleItem({ module, index, isExpanded, onToggle }: ModuleItemProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className={cn(
          'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
          'hover:bg-muted/50',
          isExpanded ? 'bg-muted/50' : 'bg-background border'
        )}>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                Module {index + 1}: {module.title}
              </span>
              <Badge variant="secondary" className="text-xs">
                {module.lessons.length} bài
              </Badge>
              {module.quiz && (
                <Badge variant="outline" className="text-xs">
                  Quiz
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {module.description}
            </p>
          </div>
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="ml-7 mt-2 space-y-1.5 pb-2">
          {module.lessons.map((lesson, lessonIdx) => (
            <div
              key={lesson.title}
              className="flex items-center gap-2 p-2 bg-background rounded border text-sm"
            >
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 truncate">
                {lessonIdx + 1}. {lesson.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {lesson.duration} phút
              </span>
              {lesson.isFree && (
                <Badge variant="secondary" className="text-xs">
                  Miễn phí
                </Badge>
              )}
            </div>
          ))}
          
          {module.quiz && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border border-purple-200 text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="flex-1 text-purple-900">
                Quiz: {module.quiz.title}
              </span>
              <span className="text-xs text-purple-700">
                {module.quiz.questions.length} câu hỏi
              </span>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
