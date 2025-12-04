'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AIGenerateWizardHeader,
  DocumentSelectionStep,
  CourseConfigStep,
  GenerationProgressStep,
  CoursePreviewStep,
  useAIGenerate,
  AIGenerateConfig,
  GenerationStep,
  GeneratedCourse,
  defaultConfig,
  generationStepsTemplate,
} from '@/components/lms/ai-generate';

export default function CreateAIGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial documents from URL
  const documentsParam = searchParams.get('documents');
  const initialDocumentIds = React.useMemo(
    () => documentsParam ? documentsParam.split(',').filter(Boolean) : [],
    [documentsParam]
  );

  // State
  const [currentStep, setCurrentStep] = React.useState(initialDocumentIds.length > 0 ? 2 : 1);
  const [documentIds, setDocumentIds] = React.useState<string[]>(initialDocumentIds);
  const [config, setConfig] = React.useState<AIGenerateConfig>(defaultConfig);
  const [generationSteps, setGenerationSteps] = React.useState<GenerationStep[]>(generationStepsTemplate);
  const [generatedCourse, setGeneratedCourse] = React.useState<GeneratedCourse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Hook
  const { generateCourse, isGenerating } = useAIGenerate();

  // Navigation
  const canGoBack = currentStep > 1 && !isGenerating;
  const canGoNext = React.useMemo(() => {
    if (isGenerating) return false;
    if (currentStep === 1) return documentIds.length > 0;
    if (currentStep === 2) return documentIds.length > 0;
    return false;
  }, [currentStep, documentIds.length, isGenerating]);

  const handleBack = () => {
    if (currentStep === 1) {
      router.back();
    } else if (!isGenerating) {
      setCurrentStep(prev => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleNext = () => {
    if (canGoNext && currentStep < 2) {
      setCurrentStep(prev => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleGenerate = async () => {
    if (documentIds.length === 0) return;
    
    setCurrentStep(3);
    setError(null);
    setGenerationSteps([...generationStepsTemplate]);

    await generateCourse(
      documentIds,
      config,
      (steps) => setGenerationSteps(steps),
      (course) => {
        setGeneratedCourse(course);
        setCurrentStep(4);
      },
      (err) => setError(err)
    );
  };

  const handleSave = () => {
    // Navigate to course edit page - Instructor path
    if (generatedCourse) {
      router.push(`/lms/instructor/courses/${generatedCourse.slug}/edit`);
    }
  };

  const handleEditCourse = () => {
    // Go back to config step
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AIGenerateWizardHeader
        currentStep={currentStep}
        totalSteps={4}
        isGenerating={isGenerating}
        canGoNext={canGoNext}
        canGoBack={canGoBack}
        onBack={handleBack}
        onNext={handleNext}
        onGenerate={handleGenerate}
        onSave={handleSave}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Step 1: Document Selection */}
        {currentStep === 1 && (
          <DocumentSelectionStep
            documentIds={documentIds}
            onDocumentsChange={setDocumentIds}
          />
        )}

        {/* Step 2: Course Config */}
        {currentStep === 2 && (
          <CourseConfigStep
            config={config}
            onConfigChange={setConfig}
          />
        )}

        {/* Step 3: Generation Progress */}
        {currentStep === 3 && (
          <GenerationProgressStep
            steps={generationSteps}
            isGenerating={isGenerating}
            error={error}
          />
        )}

        {/* Step 4: Preview */}
        {currentStep === 4 && generatedCourse && (
          <CoursePreviewStep
            course={generatedCourse}
            onEdit={handleEditCourse}
          />
        )}
      </div>
    </div>
  );
}
