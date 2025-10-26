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
            type: import(".prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        passingScore: number;
        timeLimit: number | null;
    }>;
    getQuiz(quizId: string, userId: string): Promise<{
        lesson: {
            courseModule: {
                course: {
                    id: string;
                    description: string | null;
                    title: string;
                    status: import(".prisma/client").$Enums.CourseStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    level: import(".prisma/client").$Enums.CourseLevel;
                    slug: string;
                    thumbnail: string | null;
                    duration: number | null;
                    price: number;
                    categoryId: string | null;
                    instructorId: string;
                    whatYouWillLearn: string[];
                    requirements: string[];
                    rating: number;
                    reviewCount: number;
                    enrollmentCount: number;
                    avgRating: number;
                };
            } & {
                id: string;
                description: string | null;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                courseId: string;
            };
        } & {
            id: string;
            description: string | null;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string | null;
            type: import(".prisma/client").$Enums.LessonType;
            order: number;
            duration: number | null;
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
            type: import(".prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
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
            type: import(".prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
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
            type: import(".prisma/client").$Enums.QuestionType;
            order: number;
            question: string;
            points: number;
            explanation: string | null;
            quizId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
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
                type: import(".prisma/client").$Enums.QuestionType;
                order: number;
                question: string;
                points: number;
                explanation: string | null;
                quizId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
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
                type: import(".prisma/client").$Enums.QuestionType;
                order: number;
                question: string;
                points: number;
                explanation: string | null;
                quizId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
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
                type: import(".prisma/client").$Enums.QuestionType;
                order: number;
                question: string;
                points: number;
                explanation: string | null;
                quizId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            passingScore: number;
            timeLimit: number | null;
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
    }>;
}
