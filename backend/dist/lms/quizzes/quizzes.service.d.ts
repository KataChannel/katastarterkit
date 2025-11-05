import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizInput, UpdateQuizInput, SubmitQuizInput } from './dto/quiz.input';
export declare class QuizzesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createQuiz(userId: string, createQuizInput: CreateQuizInput): Promise<any>;
    getQuiz(quizId: string, userId: string): Promise<any>;
    getQuizzesByLesson(lessonId: string): Promise<any>;
    updateQuiz(userId: string, quizId: string, updateQuizInput: UpdateQuizInput): Promise<any>;
    deleteQuiz(userId: string, quizId: string): Promise<boolean>;
    submitQuiz(userId: string, submitQuizInput: SubmitQuizInput): Promise<any>;
    private updateEnrollmentProgress;
    getQuizAttempts(userId: string, quizId: string): Promise<any>;
    getQuizAttempt(userId: string, attemptId: string): Promise<any>;
}
