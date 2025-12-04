// Types for AI Course Generation

export interface AIGenerateConfig {
  // Course Basic Info
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  
  // Target Audience
  targetAudience: string[];
  learningObjectives: string[];
  
  // Structure Config
  moduleCount: number;
  lessonsPerModule: number;
  lessonDuration: 'SHORT' | 'MEDIUM' | 'LONG'; // 5-10, 10-20, 20-30 min
  
  // Content Preferences
  contentStyle: 'ACADEMIC' | 'PRACTICAL' | 'CONVERSATIONAL';
  includeExamples: boolean;
  includeExercises: boolean;
  includeQuizzes: boolean;
  
  // Language
  language: 'vi' | 'en';
  
  // Additional Context
  additionalContext: string;
}

export interface GenerationStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
  order: number;
  lessons: GeneratedLesson[];
  quiz?: GeneratedQuiz;
}

export interface GeneratedLesson {
  title: string;
  description: string;
  type: 'TEXT' | 'VIDEO';
  content: string;
  duration: number;
  order: number;
  isPreview: boolean;
  isFree: boolean;
}

export interface GeneratedQuiz {
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  questions: GeneratedQuestion[];
}

export interface GeneratedQuestion {
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  question: string;
  points: number;
  order: number;
  explanation: string;
  answers: GeneratedAnswer[];
}

export interface GeneratedAnswer {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface GeneratedCourse {
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: number;
  price: number;
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  modules: GeneratedModule[];
}

export interface AIGenerateState {
  step: number;
  config: AIGenerateConfig;
  documentIds: string[];
  isGenerating: boolean;
  generationSteps: GenerationStep[];
  generatedCourse: GeneratedCourse | null;
  error: string | null;
}

// Default Config
export const defaultConfig: AIGenerateConfig = {
  title: '',
  description: '',
  level: 'BEGINNER',
  targetAudience: [],
  learningObjectives: [],
  moduleCount: 4,
  lessonsPerModule: 4,
  lessonDuration: 'MEDIUM',
  contentStyle: 'PRACTICAL',
  includeExamples: true,
  includeExercises: true,
  includeQuizzes: true,
  language: 'vi',
  additionalContext: '',
};

// Generation Steps
export const generationStepsTemplate: GenerationStep[] = [
  { id: 'analyze', label: 'Phân tích tài liệu nguồn', status: 'pending' },
  { id: 'structure', label: 'Tạo cấu trúc khóa học', status: 'pending' },
  { id: 'modules', label: 'Tạo nội dung modules', status: 'pending' },
  { id: 'lessons', label: 'Tạo nội dung bài học', status: 'pending' },
  { id: 'quizzes', label: 'Tạo quiz đánh giá', status: 'pending' },
  { id: 'finalize', label: 'Hoàn thiện khóa học', status: 'pending' },
];
