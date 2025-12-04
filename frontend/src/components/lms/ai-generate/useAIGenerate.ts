'use client';

import { useCallback } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useToast } from '@/hooks/use-toast';
import {
  AIGenerateConfig,
  AIGenerateState,
  GenerationStep,
  GeneratedCourse,
  generationStepsTemplate,
} from './types';
import {
  ANALYZE_DOCUMENTS_FOR_COURSE,
  GENERATE_COURSE_FROM_DOCUMENTS,
} from '@/graphql/lms/courses.graphql';

interface UseAIGenerateReturn {
  generateCourse: (
    documentIds: string[],
    config: AIGenerateConfig,
    onStepUpdate: (steps: GenerationStep[]) => void,
    onComplete: (course: GeneratedCourse) => void,
    onError: (error: string) => void
  ) => Promise<void>;
  isGenerating: boolean;
}

export function useAIGenerate(): UseAIGenerateReturn {
  const { toast } = useToast();

  const [analyzeDocuments, { loading: analyzing }] = useLazyQuery(ANALYZE_DOCUMENTS_FOR_COURSE);
  const [generateFromDocs, { loading: generating }] = useMutation(GENERATE_COURSE_FROM_DOCUMENTS);

  const updateStep = (
    steps: GenerationStep[],
    stepId: string,
    update: Partial<GenerationStep>
  ): GenerationStep[] => {
    return steps.map(step =>
      step.id === stepId ? { ...step, ...update } : step
    );
  };

  const generateCourse = useCallback(async (
    documentIds: string[],
    config: AIGenerateConfig,
    onStepUpdate: (steps: GenerationStep[]) => void,
    onComplete: (course: GeneratedCourse) => void,
    onError: (error: string) => void
  ) => {
    let steps = [...generationStepsTemplate];
    
    try {
      // Step 1: Analyze documents
      steps = updateStep(steps, 'analyze', { status: 'in-progress', message: 'Đang phân tích tài liệu...' });
      onStepUpdate(steps);

      const analysisResult = await analyzeDocuments({
        variables: {
          input: {
            documentIds,
            additionalContext: config.additionalContext || undefined,
          },
        },
      });

      if (analysisResult.error) {
        throw new Error(analysisResult.error.message);
      }

      const analysis = analysisResult.data?.analyzeDocumentsForCourse;
      steps = updateStep(steps, 'analyze', { 
        status: 'completed', 
        message: `Đã phân tích ${documentIds.length} tài liệu` 
      });
      onStepUpdate(steps);

      // Step 2: Structure
      steps = updateStep(steps, 'structure', { status: 'in-progress', message: 'Đang tạo cấu trúc...' });
      onStepUpdate(steps);

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      steps = updateStep(steps, 'structure', { 
        status: 'completed', 
        message: `${config.moduleCount} modules, ${config.lessonsPerModule} bài/module` 
      });
      onStepUpdate(steps);

      // Step 3-5: Generate course (combined in one API call)
      steps = updateStep(steps, 'modules', { status: 'in-progress', message: 'Đang tạo nội dung modules...' });
      onStepUpdate(steps);

      const generateResult = await generateFromDocs({
        variables: {
          input: {
            documentIds,
            title: config.title || analysis?.suggestedTitle || undefined,
            description: config.description || analysis?.suggestedDescription || undefined,
            level: config.level || analysis?.recommendedLevel || 'BEGINNER',
            learningObjectives: config.learningObjectives.length > 0 
              ? config.learningObjectives 
              : analysis?.learningObjectives || undefined,
            whatYouWillLearn: analysis?.whatYouWillLearn || undefined,
            requirements: analysis?.requirements || undefined,
            targetAudience: config.targetAudience.length > 0 
              ? config.targetAudience 
              : analysis?.targetAudience || undefined,
            additionalContext: buildAdditionalContext(config),
          },
        },
      });

      if (generateResult.errors) {
        throw new Error(generateResult.errors[0]?.message || 'Lỗi tạo khóa học');
      }

      steps = updateStep(steps, 'modules', { status: 'completed', message: 'Hoàn thành' });
      steps = updateStep(steps, 'lessons', { status: 'completed', message: 'Hoàn thành' });
      steps = updateStep(steps, 'quizzes', { status: 'completed', message: 'Hoàn thành' });
      steps = updateStep(steps, 'finalize', { status: 'completed', message: 'Hoàn thành' });
      onStepUpdate(steps);

      const course = generateResult.data?.generateCourseFromDocuments;
      
      if (course) {
        // Transform to GeneratedCourse format
        const generatedCourse: GeneratedCourse = {
          title: course.title,
          slug: course.slug,
          description: course.description || '',
          level: course.level || 'BEGINNER',
          duration: course.duration || 0,
          price: course.price || 0,
          whatYouWillLearn: course.whatYouWillLearn || [],
          requirements: course.requirements || [],
          targetAudience: course.targetAudience || [],
          tags: course.tags || [],
          metaTitle: course.metaTitle || course.title,
          metaDescription: course.metaDescription || '',
          modules: course.modules?.map((m: any) => ({
            title: m.title,
            description: m.description || '',
            order: m.order,
            lessons: m.lessons?.map((l: any) => ({
              title: l.title,
              description: l.description || '',
              type: l.type || 'TEXT',
              content: l.content || '',
              duration: l.duration || 15,
              order: l.order,
              isPreview: l.isPreview || false,
              isFree: l.isFree || false,
            })) || [],
            quiz: m.lessons?.[m.lessons.length - 1]?.quizzes?.[0] ? {
              title: m.lessons[m.lessons.length - 1].quizzes[0].title,
              description: m.lessons[m.lessons.length - 1].quizzes[0].description || '',
              passingScore: 70,
              timeLimit: 20,
              questions: m.lessons[m.lessons.length - 1].quizzes[0].questions?.map((q: any) => ({
                type: q.type || 'MULTIPLE_CHOICE',
                question: q.question,
                points: q.points || 25,
                order: q.order,
                explanation: q.explanation || '',
                answers: q.answers?.map((a: any) => ({
                  text: a.text,
                  isCorrect: a.isCorrect || false,
                  order: a.order,
                })) || [],
              })) || [],
            } : undefined,
          })) || [],
        };

        toast({
          type: 'success',
          title: 'Thành công! 🎉',
          description: `Đã tạo khóa học "${course.title}"`,
        });

        onComplete(generatedCourse);
      }
    } catch (error: any) {
      console.error('AI Generate Error:', error);
      
      // Update failed step
      const currentStepIndex = steps.findIndex(s => s.status === 'in-progress');
      if (currentStepIndex !== -1) {
        steps[currentStepIndex].status = 'error';
        steps[currentStepIndex].message = error.message || 'Có lỗi xảy ra';
      }
      onStepUpdate(steps);
      
      toast({
        type: 'error',
        title: 'Lỗi tạo khóa học',
        description: error.message || 'Không thể tạo khóa học với AI',
      });
      
      onError(error.message || 'Có lỗi xảy ra');
    }
  }, [analyzeDocuments, generateFromDocs, toast]);

  return {
    generateCourse,
    isGenerating: analyzing || generating,
  };
}

// Helper to build additional context from config
function buildAdditionalContext(config: AIGenerateConfig): string {
  const parts: string[] = [];

  // Module/Lesson structure
  parts.push(`Cấu trúc: ${config.moduleCount} modules, ${config.lessonsPerModule} bài/module`);

  // Duration
  const durationMap = {
    SHORT: '5-10 phút',
    MEDIUM: '10-20 phút',
    LONG: '20-30 phút',
  };
  parts.push(`Độ dài bài học: ${durationMap[config.lessonDuration]}`);

  // Style
  const styleMap = {
    ACADEMIC: 'học thuật, chuyên sâu',
    PRACTICAL: 'thực hành, ứng dụng',
    CONVERSATIONAL: 'đối thoại, dễ hiểu',
  };
  parts.push(`Phong cách: ${styleMap[config.contentStyle]}`);

  // Content options
  if (config.includeExamples) parts.push('Thêm ví dụ minh họa');
  if (config.includeExercises) parts.push('Thêm bài tập thực hành');
  if (config.includeQuizzes) parts.push('Tạo quiz đánh giá cho mỗi module');

  // Language
  parts.push(`Ngôn ngữ: ${config.language === 'vi' ? 'Tiếng Việt' : 'English'}`);

  // Additional context
  if (config.additionalContext) {
    parts.push(`Yêu cầu thêm: ${config.additionalContext}`);
  }

  return parts.join('. ');
}
