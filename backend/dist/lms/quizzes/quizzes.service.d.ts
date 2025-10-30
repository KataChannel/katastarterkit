import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizInput, UpdateQuizInput, SubmitQuizInput } from './dto/quiz.input';
export declare class QuizzesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createQuiz(userId: string, createQuizInput: CreateQuizInput): Promise<{
        questions: ({
            answers: {
                id: string;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
        isRequired: boolean;
    }>;
    getQuiz(quizId: string, userId: string): Promise<{
        lesson: {
            courseModule: {
                course: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    slug: string;
                    description: string | null;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    publishedAt: Date | null;
                    level: import("@prisma/client").$Enums.CourseLevel;
                    thumbnail: string | null;
                    trailer: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    duration: number | null;
                    language: string | null;
                    whatYouWillLearn: string[];
                    requirements: string[];
                    targetAudience: string[];
                    avgRating: number;
                    reviewCount: number;
                    enrollmentCount: number;
                    viewCount: number;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string[];
                    categoryId: string | null;
                    instructorId: string;
                };
            } & {
                id: string;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                courseId: string;
                isPublished: boolean;
            };
        } & {
            id: string;
            type: import("@prisma/client").$Enums.LessonType;
            content: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            duration: number | null;
            moduleId: string;
            isPreview: boolean;
            isFree: boolean;
            attachments: import("@prisma/client/runtime/library").JsonValue | null;
        };
        questions: ({
            answers: {
                id: string;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
        isRequired: boolean;
    }>;
    getQuizzesByLesson(lessonId: string): Promise<({
        questions: ({
            answers: {
                id: string;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
        isRequired: boolean;
    })[]>;
    updateQuiz(userId: string, quizId: string, updateQuizInput: UpdateQuizInput): Promise<{
        questions: ({
            answers: {
                id: string;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
        isRequired: boolean;
    }>;
    deleteQuiz(userId: string, quizId: string): Promise<boolean>;
    submitQuiz(userId: string, submitQuizInput: SubmitQuizInput): Promise<{
        quiz: {
            questions: ({
                answers: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                question: string;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
            isRequired: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        score: number | null;
        passed: boolean;
        attemptNumber: number;
        startedAt: Date;
    }>;
    private updateEnrollmentProgress;
    getQuizAttempts(userId: string, quizId: string): Promise<({
        quiz: {
            questions: ({
                answers: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                question: string;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
            isRequired: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        score: number | null;
        passed: boolean;
        attemptNumber: number;
        startedAt: Date;
    })[]>;
    getQuizAttempt(userId: string, attemptId: string): Promise<{
        quiz: {
            questions: ({
                answers: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                question: string;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
            isRequired: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        score: number | null;
        passed: boolean;
        attemptNumber: number;
        startedAt: Date;
    }>;
}
