'use client';

import * as React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { GenerationStep } from './types';

interface GenerationProgressStepProps {
  steps: GenerationStep[];
  isGenerating: boolean;
  error: string | null;
}

export function GenerationProgressStep({
  steps,
  isGenerating,
  error,
}: GenerationProgressStepProps) {
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
              {isGenerating ? (
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              ) : error ? (
                <AlertCircle className="w-8 h-8 text-red-600" />
              ) : (
                <Sparkles className="w-8 h-8 text-purple-600" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-900">
                {isGenerating 
                  ? 'AI đang tạo khóa học...' 
                  : error 
                    ? 'Có lỗi xảy ra' 
                    : 'Hoàn thành!'}
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                {isGenerating 
                  ? 'Quá trình này có thể mất 30-60 giây' 
                  : error 
                    ? error 
                    : 'Khóa học đã được tạo thành công'}
              </p>
            </div>
            
            {/* Overall Progress */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm text-purple-700 mb-2">
                <span>Tiến độ tổng</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps Detail */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg transition-colors',
                  step.status === 'completed' && 'bg-green-50',
                  step.status === 'in-progress' && 'bg-blue-50',
                  step.status === 'error' && 'bg-red-50',
                  step.status === 'pending' && 'bg-gray-50'
                )}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {step.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {step.status === 'in-progress' && (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  {step.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'font-medium text-sm',
                    step.status === 'completed' && 'text-green-900',
                    step.status === 'in-progress' && 'text-blue-900',
                    step.status === 'error' && 'text-red-900',
                    step.status === 'pending' && 'text-gray-500'
                  )}>
                    {step.label}
                  </p>
                  {step.message && (
                    <p className={cn(
                      'text-xs mt-0.5',
                      step.status === 'completed' && 'text-green-700',
                      step.status === 'in-progress' && 'text-blue-700',
                      step.status === 'error' && 'text-red-700',
                      step.status === 'pending' && 'text-gray-400'
                    )}>
                      {step.message}
                    </p>
                  )}
                  
                  {/* Individual Progress */}
                  {step.status === 'in-progress' && step.progress !== undefined && (
                    <Progress value={step.progress} className="h-1 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips while generating */}
      {isGenerating && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4">
            <div className="text-sm space-y-2">
              <p className="font-medium text-amber-900">⏳ Trong khi chờ đợi:</p>
              <ul className="text-amber-800 space-y-1 list-disc list-inside ml-2">
                <li>AI đang phân tích nội dung tài liệu của bạn</li>
                <li>Cấu trúc khóa học được tạo dựa trên best practices</li>
                <li>Quiz tự động được tạo để đánh giá học viên</li>
                <li>Bạn có thể chỉnh sửa toàn bộ nội dung sau khi hoàn thành</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
