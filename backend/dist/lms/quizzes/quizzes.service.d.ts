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
                text: string;
                questionId: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            question: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        isRequired: boolean;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
    }>;
    getQuiz(quizId: string, userId: string): Promise<{
        lesson: {
            courseModule: {
                course: {
                    id: string;
                    slug: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    thumbnail: string | null;
                    title: string;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    viewCount: number;
                    publishedAt: Date | null;
                    tags: string[];
                    metaTitle: string | null;
                    metaDescription: string | null;
                    categoryId: string | null;
                    level: import("@prisma/client").$Enums.CourseLevel;
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
                    approvalRequested: boolean;
                    approvalRequestedAt: Date | null;
                    approvedBy: string | null;
                    approvedAt: Date | null;
                    rejectionReason: string | null;
                    instructorId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                title: string;
                isPublished: boolean;
                courseId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            content: string | null;
            type: import("@prisma/client").$Enums.LessonType;
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
                text: string;
                questionId: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            question: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        isRequired: boolean;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
    }>;
    getQuizzesByLesson(lessonId: string): Promise<({
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                text: string;
                questionId: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            question: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        isRequired: boolean;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
    })[]>;
    updateQuiz(userId: string, quizId: string, updateQuizInput: UpdateQuizInput): Promise<{
        questions: ({
            answers: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                text: string;
                questionId: string;
                isCorrect: boolean;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            question: string;
            points: number;
            explanation: string | null;
            mediaUrl: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        isRequired: boolean;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
        maxAttempts: number | null;
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
                    text: string;
                    questionId: string;
                    isCorrect: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                type: import("@prisma/client").$Enums.QuestionType;
                question: string;
                points: number;
                explanation: string | null;
                mediaUrl: string | null;
                quizId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            isRequired: boolean;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        enrollmentId: string;
        timeSpent: number | null;
        score: number | null;
        startedAt: Date;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        passed: boolean;
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
                    text: string;
                    questionId: string;
                    isCorrect: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                type: import("@prisma/client").$Enums.QuestionType;
                question: string;
                points: number;
                explanation: string | null;
                mediaUrl: string | null;
                quizId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            isRequired: boolean;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        enrollmentId: string;
        timeSpent: number | null;
        score: number | null;
        startedAt: Date;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        passed: boolean;
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
                    text: string;
                    questionId: string;
                    isCorrect: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                type: import("@prisma/client").$Enums.QuestionType;
                question: string;
                points: number;
                explanation: string | null;
                mediaUrl: string | null;
                quizId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            isRequired: boolean;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        enrollmentId: string;
        timeSpent: number | null;
        score: number | null;
        startedAt: Date;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        passed: boolean;
        attemptNumber: number;
    }>;
}
