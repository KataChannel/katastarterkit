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
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            order: number;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
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
                    description: string | null;
                    tags: string[];
                    id: string;
                    level: import("@prisma/client").$Enums.CourseLevel;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    slug: string;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    publishedAt: Date | null;
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
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                title: string;
                isPublished: boolean;
                courseId: string;
            };
        } & {
            description: string | null;
            id: string;
            type: import("@prisma/client").$Enums.LessonType;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            title: string;
            content: string | null;
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
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            order: number;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
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
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            order: number;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
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
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            type: import("@prisma/client").$Enums.QuestionType;
            createdAt: Date;
            updatedAt: Date;
            question: string;
            order: number;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
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
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                createdAt: Date;
                updatedAt: Date;
                question: string;
                order: number;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                createdAt: Date;
                updatedAt: Date;
                question: string;
                order: number;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
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
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                type: import("@prisma/client").$Enums.QuestionType;
                createdAt: Date;
                updatedAt: Date;
                question: string;
                order: number;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
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
