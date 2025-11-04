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
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            icon: string | null;
        };
        instructor: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            isVerified: boolean;
            email: string | null;
            username: string;
            password: string | null;
            phone: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            roleType: import(".prisma/client").$Enums.UserRoleType;
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
                            order: number;
                            createdAt: Date;
                            updatedAt: Date;
                            text: string;
                            questionId: string;
                            isCorrect: boolean;
                        }[];
                    } & {
                        id: string;
                        type: import(".prisma/client").$Enums.QuestionType;
                        order: number;
                        createdAt: Date;
                        updatedAt: Date;
                        question: string;
                        points: number;
                        explanation: string | null;
                        mediaUrl: string | null;
                        quizId: string;
                    })[];
                } & {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    lessonId: string;
                    passingScore: number;
                    timeLimit: number | null;
                    maxAttempts: number | null;
                    isRequired: boolean;
                })[];
            } & {
                id: string;
                type: import(".prisma/client").$Enums.LessonType;
                description: string | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                content: string | null;
                duration: number | null;
                moduleId: string;
                isPreview: boolean;
                isFree: boolean;
                attachments: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
        } & {
            id: string;
            description: string | null;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isPublished: boolean;
            courseId: string;
        })[];
    } & {
        level: import(".prisma/client").$Enums.CourseLevel;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        title: string;
        slug: string;
        status: import(".prisma/client").$Enums.CourseStatus;
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
