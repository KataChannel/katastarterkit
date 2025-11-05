import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                name: string;
                color: string | null;
            }[];
            category: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                order: number;
                parentId: string | null;
                thumbnail: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
                isActive: boolean;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            images: string[];
            id: string;
            slug: string;
            title: string;
            content: string;
            status: import("@prisma/client").$Enums.PostStatus;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            categoryId: string | null;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            password: string | null;
            excerpt: string | null;
            featuredImage: string | null;
            authorId: string;
            displayOrder: number;
            isFeatured: boolean;
            metaKeywords: string[];
            visibility: import("@prisma/client").$Enums.PostVisibility;
            canonicalUrl: string | null;
            isPinned: boolean;
            readingTime: number | null;
            commentsEnabled: boolean;
            scheduledAt: Date | null;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlogById(id: string): Promise<{
        tags: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            name: string;
            color: string | null;
        }[];
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            name: string;
            color: string | null;
        }[];
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        tags: ({
            tag: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                name: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(id: string, input: any): Promise<{
        tags: ({
            tag: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                name: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        order: number;
        parentId: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        isActive: boolean;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        order: number;
        parentId: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        isActive: boolean;
    }>;
    createCategory(input: any): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        order: number;
        parentId: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        isActive: boolean;
    }>;
    updateCategory(id: string, input: any): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        order: number;
        parentId: string | null;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        isActive: boolean;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        name: string;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        name: string;
        color: string | null;
    }>;
    createTag(input: any): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        name: string;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        name: string;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    getBlogsByCategory(categoryId: string, input?: any): Promise<{
        items: {
            tags: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                name: string;
                color: string | null;
            }[];
            category: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                order: number;
                parentId: string | null;
                thumbnail: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
                isActive: boolean;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            images: string[];
            id: string;
            slug: string;
            title: string;
            content: string;
            status: import("@prisma/client").$Enums.PostStatus;
            createdAt: Date;
            updatedAt: Date;
            publishedAt: Date | null;
            categoryId: string | null;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            password: string | null;
            excerpt: string | null;
            featuredImage: string | null;
            authorId: string;
            displayOrder: number;
            isFeatured: boolean;
            metaKeywords: string[];
            visibility: import("@prisma/client").$Enums.PostVisibility;
            canonicalUrl: string | null;
            isPinned: boolean;
            readingTime: number | null;
            commentsEnabled: boolean;
            scheduledAt: Date | null;
        }[];
        total: number;
        page: any;
        pageSize: any;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(blogId: string, limit?: number): Promise<({
        tags: ({
            tag: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                name: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            order: number;
            parentId: string | null;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            isActive: boolean;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        images: string[];
        id: string;
        slug: string;
        title: string;
        content: string;
        status: import("@prisma/client").$Enums.PostStatus;
        createdAt: Date;
        updatedAt: Date;
        publishedAt: Date | null;
        categoryId: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        password: string | null;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
}
