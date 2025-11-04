import { PrismaService } from '../../prisma/prisma.service';
interface GenerateCourseFromPromptInput {
    prompt: string;
    categoryId?: string;
    instructorId: string;
}
export declare class AICourseGeneratorService {
    private prisma;
    private genAI;
    private model;
    constructor(prisma: PrismaService);
    generateCourseFromPrompt(input: GenerateCourseFromPromptInput): Promise<{
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            icon: string | null;
            parentId: string | null;
        };
        instructor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isActive: boolean;
            isVerified: boolean;
            isTwoFactorEnabled: boolean;
            failedLoginAttempts: number;
            lockedUntil: Date | null;
            lastLoginAt: Date | null;
            departmentId: string | null;
        };
        modules: ({
            lessons: ({
                quizzes: ({
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
                        order: number;
                        type: import("@prisma/client").$Enums.QuestionType;
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
                })[];
            } & {
                id: string;
                title: string;
                description: string | null;
                duration: number | null;
                createdAt: Date;
                updatedAt: Date;
                order: number;
                type: import("@prisma/client").$Enums.LessonType;
                content: string | null;
                moduleId: string;
                isPreview: boolean;
                isFree: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
        } & {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            order: number;
            isPublished: boolean;
            courseId: string;
        })[];
    } & {
        level: import("@prisma/client").$Enums.CourseLevel;
        id: string;
        slug: string;
        title: string;
        description: string | null;
        thumbnail: string | null;
        trailer: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        status: import("@prisma/client").$Enums.CourseStatus;
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
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
    }>;
    private generateCourseStructure;
    private createCourseFromStructure;
    getSamplePrompts(): string[];
    getPromptTemplates(): {
        title: string;
        category: string;
        prompt: string;
        tags: string[];
    }[];
    private generateSlug;
}
export {};
