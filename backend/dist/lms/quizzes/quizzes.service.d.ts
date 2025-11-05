import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizInput, UpdateQuizInput, SubmitQuizInput } from './dto/quiz.input';
export declare class QuizzesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createQuiz(userId: string, createQuizInput: CreateQuizInput): Promise<{
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            quizId: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
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
                    level: import("@prisma/client").$Enums.CourseLevel;
                    id: string;
                    slug: string;
                    title: string;
                    description: string | null;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    publishedAt: Date | null;
                    thumbnail: string | null;
                    trailer: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    duration: number | null;
                    language: string | null;
                    whatYouWillLearn: string[];
                    requirements: string[];
                    targetAudience: string[];
                    categoryId: string | null;
                    instructorId: string;
                    avgRating: number;
                    reviewCount: number;
                    enrollmentCount: number;
                    viewCount: number;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string[];
                };
            } & {
                id: string;
                title: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                isPublished: boolean;
                courseId: string;
            };
        } & {
            id: string;
            title: string;
            description: string | null;
            content: string | null;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.LessonType;
            order: number;
            duration: number | null;
            moduleId: string;
            isPreview: boolean;
            isFree: boolean;
            attachments: import("@prisma/client/runtime/library").JsonValue | null;
        };
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            quizId: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
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
                createdAt: Date;
                updatedAt: Date;
                order: number;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            quizId: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
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
                createdAt: Date;
                updatedAt: Date;
                order: number;
                questionId: string;
                text: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            quizId: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
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
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    questionId: string;
                    text: string;
                    isCorrect: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                order: number;
                question: string;
                quizId: string;
                points: number;
                explanation: string | null;
                mediaUrl: string | null;
            })[];
        } & {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        quizId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        startedAt: Date;
        enrollmentId: string;
        passed: boolean;
        timeSpent: number | null;
        attemptNumber: number;
    }>;
    private updateEnrollmentProgress;
    getQuizAttempts(userId: string, quizId: string): Promise<({
        quiz: {
            questions: ({
                answers: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    questionId: string;
                    text: string;
                    isCorrect: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                order: number;
                question: string;
                quizId: string;
                points: number;
                explanation: string | null;
                mediaUrl: string | null;
            })[];
        } & {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        quizId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        startedAt: Date;
        enrollmentId: string;
        passed: boolean;
        timeSpent: number | null;
        attemptNumber: number;
    })[]>;
    getQuizAttempt(userId: string, attemptId: string): Promise<{
        quiz: {
            questions: ({
                answers: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    questionId: string;
                    text: string;
                    isCorrect: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                order: number;
                question: string;
                quizId: string;
                points: number;
                explanation: string | null;
                mediaUrl: string | null;
            })[];
        } & {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
        quizId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        completedAt: Date | null;
        score: number | null;
        startedAt: Date;
        enrollmentId: string;
        passed: boolean;
        timeSpent: number | null;
        attemptNumber: number;
    }>;
}
