'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, FileText, Settings, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIGenerateWizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  isGenerating: boolean;
  canGoNext: boolean;
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
  onSave: () => void;
}

const steps = [
  { id: 1, label: 'Chọn tài liệu', icon: FileText },
  { id: 2, label: 'Cấu hình', icon: Settings },
  { id: 3, label: 'Tạo khóa học', icon: Sparkles },
  { id: 4, label: 'Xem trước', icon: Eye },
];

export function AIGenerateWizardHeader({
  currentStep,
  totalSteps,
  isGenerating,
  canGoNext,
  canGoBack,
  onBack,
  onNext,
  onGenerate,
  onSave,
}: AIGenerateWizardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* Header Title */}
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={!canGoBack || isGenerating}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay lại</span>
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Tạo hoàn toàn bằng AI
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Bước {currentStep} / {totalSteps}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {currentStep === 2 && (
              <Button
                onClick={onGenerate}
                disabled={isGenerating || !canGoNext}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Tạo khóa học
                  </>
                )}
              </Button>
            )}
            
            {currentStep === 4 && (
              <Button
                onClick={onSave}
                className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Lưu khóa học
              </Button>
            )}
            
            {currentStep < 2 && (
              <Button
                onClick={onNext}
                disabled={!canGoNext || isGenerating}
                className="gap-2"
              >
                Tiếp theo
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <React.Fragment key={step.id}>
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors',
                  isActive && 'bg-emerald-100 text-emerald-700',
                  isCompleted && 'bg-green-100 text-green-700',
                  !isActive && !isCompleted && 'bg-gray-100 text-gray-500'
                )}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 max-w-[40px]',
                    isCompleted ? 'bg-green-400' : 'bg-gray-200'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="flex sm:hidden items-center justify-end gap-2 mt-4">
          {currentStep === 2 && (
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !canGoNext}
              size="sm"
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tạo
                </>
              )}
            </Button>
          )}
          
          {currentStep === 4 && (
            <Button
              onClick={onSave}
              size="sm"
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              Lưu
            </Button>
          )}
          
          {currentStep < 2 && (
            <Button
              onClick={onNext}
              disabled={!canGoNext || isGenerating}
              size="sm"
              className="gap-2"
            >
              Tiếp
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
