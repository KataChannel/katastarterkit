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
    }>;
    getQuiz(quizId: string, userId: string): Promise<{
        lesson: {
            courseModule: {
                course: {
                    level: import("@prisma/client").$Enums.CourseLevel;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    status: import("@prisma/client").$Enums.CourseStatus;
                    title: string;
                    slug: string;
                    thumbnail: string | null;
                    price: number;
                    duration: number | null;
                    whatYouWillLearn: string[];
                    requirements: string[];
                    categoryId: string | null;
                    instructorId: string;
                    rating: number;
                    reviewCount: number;
                    enrollmentCount: number;
                    avgRating: number;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                courseId: string;
                title: string;
                order: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            duration: number | null;
            order: number;
            type: import("@prisma/client").$Enums.LessonType;
            content: string | null;
            moduleId: string;
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
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        score: number | null;
        passed: boolean;
        timeSpent: number | null;
        startedAt: Date;
    }>;
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
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        score: number | null;
        passed: boolean;
        timeSpent: number | null;
        startedAt: Date;
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
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
        enrollmentId: string;
        answers: import("@prisma/client/runtime/library").JsonValue | null;
        quizId: string;
        score: number | null;
        passed: boolean;
        timeSpent: number | null;
        startedAt: Date;
    }>;
}
