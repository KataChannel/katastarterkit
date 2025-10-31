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
                    level: import("@prisma/client").$Enums.CourseLevel;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    tags: string[];
                    description: string | null;
                    thumbnail: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    slug: string;
                    categoryId: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    viewCount: number;
                    publishedAt: Date | null;
                    title: string;
                    duration: number | null;
                    trailer: string | null;
                    language: string | null;
                    whatYouWillLearn: string[];
                    requirements: string[];
                    targetAudience: string[];
                    instructorId: string;
                    avgRating: number;
                    reviewCount: number;
                    enrollmentCount: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                order: number;
                title: string;
                courseId: string;
                isPublished: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            attachments: import("@prisma/client/runtime/library").JsonValue | null;
            content: string | null;
            description: string | null;
            order: number;
            title: string;
            type: import("@prisma/client").$Enums.LessonType;
            duration: number | null;
            moduleId: string;
            isPreview: boolean;
            isFree: boolean;
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
        startedAt: Date;
        enrollmentId: string;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        score: number | null;
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
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
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
        startedAt: Date;
        enrollmentId: string;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        score: number | null;
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
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
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
        startedAt: Date;
        enrollmentId: string;
        completedAt: Date | null;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        score: number | null;
        passed: boolean;
        timeSpent: number | null;
        attemptNumber: number;
    }>;
}
