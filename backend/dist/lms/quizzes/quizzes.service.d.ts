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
                updatedAt: Date;
                createdAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
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
                    level: import("@prisma/client").$Enums.CourseLevel;
                    description: string | null;
                    id: string;
                    updatedAt: Date;
                    createdAt: Date;
                    title: string;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    tags: string[];
                    duration: number | null;
                    viewCount: number;
                    categoryId: string | null;
                    slug: string;
                    publishedAt: Date | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    thumbnail: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
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
                order: number;
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                title: string;
                isPublished: boolean;
                courseId: string;
            };
        } & {
            order: number;
            description: string | null;
            type: import("@prisma/client").$Enums.LessonType;
            id: string;
            updatedAt: Date;
            content: string | null;
            createdAt: Date;
            title: string;
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
                updatedAt: Date;
                createdAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
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
                order: number;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
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
                order: number;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            question: string;
            order: number;
            type: import("@prisma/client").$Enums.QuestionType;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            points: number;
            explanation: string | null;
            quizId: string;
            mediaUrl: string | null;
        })[];
    } & {
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
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
                    order: number;
                    id: string;
                    updatedAt: Date;
                    createdAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                question: string;
                order: number;
                type: import("@prisma/client").$Enums.QuestionType;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            title: string;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
            isRequired: boolean;
        };
    } & {
        id: string;
        updatedAt: Date;
        createdAt: Date;
        userId: string;
        completedAt: Date | null;
        startedAt: Date;
        score: number | null;
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
                    updatedAt: Date;
                    createdAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                question: string;
                order: number;
                type: import("@prisma/client").$Enums.QuestionType;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            title: string;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
            isRequired: boolean;
        };
    } & {
        id: string;
        updatedAt: Date;
        createdAt: Date;
        userId: string;
        completedAt: Date | null;
        startedAt: Date;
        score: number | null;
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
                    updatedAt: Date;
                    createdAt: Date;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                question: string;
                order: number;
                type: import("@prisma/client").$Enums.QuestionType;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                points: number;
                explanation: string | null;
                quizId: string;
                mediaUrl: string | null;
            })[];
        } & {
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            title: string;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
            maxAttempts: number | null;
            isRequired: boolean;
        };
    } & {
        id: string;
        updatedAt: Date;
        createdAt: Date;
        userId: string;
        completedAt: Date | null;
        startedAt: Date;
        score: number | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        timeSpent: number | null;
        passed: boolean;
        attemptNumber: number;
    }>;
}
