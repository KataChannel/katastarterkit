import { PrismaService } from '../../prisma/prisma.service';
interface GenerateCourseFromPromptInput {
    prompt: string;
    categoryId?: string;
    instructorId: string;
}
interface GenerateCourseFromDocumentsInput {
    documentIds: string[];
    categoryId?: string;
    additionalPrompt?: string;
    instructorId: string;
    title?: string;
    description?: string;
    level?: string;
    learningObjectives?: string[];
    whatYouWillLearn?: string[];
    requirements?: string[];
    targetAudience?: string[];
    additionalContext?: string;
}
export declare class AICourseGeneratorService {
    private prisma;
    private genAI;
    private model;
    constructor(prisma: PrismaService);
    generateCourseFromPrompt(input: GenerateCourseFromPromptInput): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            icon: string | null;
        };
        instructor: {
            id: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            password: string | null;
            phone: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isVerified: boolean;
            address: string | null;
            city: string | null;
            district: string | null;
            ward: string | null;
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
                })[];
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
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            isPublished: boolean;
            courseId: string;
        })[];
    } & {
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
    }>;
    generateCourseFromDocuments(input: GenerateCourseFromDocumentsInput): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            icon: string | null;
        };
        instructor: {
            id: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            password: string | null;
            phone: string | null;
            avatar: string | null;
            roleType: import("@prisma/client").$Enums.UserRoleType;
            isVerified: boolean;
            address: string | null;
            city: string | null;
            district: string | null;
            ward: string | null;
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
                })[];
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
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            title: string;
            isPublished: boolean;
            courseId: string;
        })[];
    } & {
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
    }>;
    private aggregateDocumentAnalysis;
    private getFrequency;
    private buildPromptFromDocuments;
    analyzeDocumentsForCourse(input: {
        documentIds: string[];
        additionalContext?: string;
    }): Promise<{
        suggestedTitle: any;
        suggestedDescription: any;
        recommendedLevel: any;
        aggregatedKeywords: string[];
        mainTopics: string[];
        learningObjectives: any;
        whatYouWillLearn: any;
        requirements: any;
        targetAudience: any;
        suggestedStructure: any;
        estimatedDuration: any;
        sourceDocumentIds: string[];
        analysisSummary: any;
    }>;
    private buildAnalysisPrompt;
    private repairIncompleteJSON;
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
