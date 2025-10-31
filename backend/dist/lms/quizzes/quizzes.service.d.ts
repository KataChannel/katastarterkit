import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizInput, UpdateQuizInput, SubmitQuizInput } from './dto/quiz.input';
export declare class QuizzesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createQuiz(userId: string, createQuizInput: CreateQuizInput): Promise<{
        questions: ({
            answers: {
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            updatedAt: Date;
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
                    level: import("@prisma/client").$Enums.CourseLevel;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    tags: string[];
                    title: string;
                    slug: string;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    publishedAt: Date | null;
                    description: string | null;
                    thumbnail: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    categoryId: string | null;
                    viewCount: number;
                    duration: number | null;
                    trailer: string | null;
                    whatYouWillLearn: string[];
                    requirements: string[];
                    targetAudience: string[];
                    instructorId: string;
                    language: string | null;
                    avgRating: number;
                    reviewCount: number;
                    enrollmentCount: number;
                };
            } & {
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                isPublished: boolean;
                courseId: string;
            };
        } & {
            order: number;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.LessonType;
            updatedAt: Date;
            title: string;
            content: string | null;
            description: string | null;
            duration: number | null;
            moduleId: string;
            isPreview: boolean;
            isFree: boolean;
            attachments: import("@prisma/client/runtime/library").JsonValue | null;
        };
        questions: ({
            answers: {
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            updatedAt: Date;
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
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            updatedAt: Date;
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
                order: number;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.QuestionType;
            updatedAt: Date;
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
                    order: number;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                question: string;
                order: number;
                id: string;
                createdAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                updatedAt: Date;
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
        userId: string;
        updatedAt: Date;
        completedAt: Date | null;
        score: number | null;
        startedAt: Date;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        passed: boolean;
        attemptNumber: number;
    }>;
    private updateEnrollmentProgress;
    getQuizAttempts(userId: string, quizId: string): Promise<({
        quiz: {
            questions: ({
                answers: {
                    order: number;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                question: string;
                order: number;
                id: string;
                createdAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                updatedAt: Date;
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
        userId: string;
        updatedAt: Date;
        completedAt: Date | null;
        score: number | null;
        startedAt: Date;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        passed: boolean;
        attemptNumber: number;
    })[]>;
    getQuizAttempt(userId: string, attemptId: string): Promise<{
        quiz: {
            questions: ({
                answers: {
                    order: number;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                question: string;
                order: number;
                id: string;
                createdAt: Date;
                type: import("@prisma/client").$Enums.QuestionType;
                updatedAt: Date;
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
        userId: string;
        updatedAt: Date;
        completedAt: Date | null;
        score: number | null;
        startedAt: Date;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        passed: boolean;
        attemptNumber: number;
    }>;
}
