import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                id: string;
                createdAt: Date;
                slug: string;
                description: string | null;
                name: string;
                color: string | null;
            }[];
            category: {
                id: string;
                order: number;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                name: string;
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
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            status: import("@prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            images: string[];
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            categoryId: string | null;
            password: string | null;
            isPinned: boolean;
            excerpt: string | null;
            featuredImage: string | null;
            authorId: string;
            displayOrder: number;
            isFeatured: boolean;
            metaKeywords: string[];
            visibility: import("@prisma/client").$Enums.PostVisibility;
            canonicalUrl: string | null;
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
            createdAt: Date;
            slug: string;
            description: string | null;
            name: string;
            color: string | null;
        }[];
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            slug: string;
            description: string | null;
            name: string;
            color: string | null;
        }[];
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                slug: string;
                description: string | null;
                name: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(id: string, input: any): Promise<{
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                slug: string;
                description: string | null;
                name: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
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
        order: number;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
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
        order: number;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        isActive: boolean;
    }>;
    createCategory(input: any): Promise<{
        id: string;
        order: number;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        isActive: boolean;
    }>;
    updateCategory(id: string, input: any): Promise<{
        id: string;
        order: number;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        name: string;
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
        createdAt: Date;
        slug: string;
        description: string | null;
        name: string;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        name: string;
        color: string | null;
    }>;
    createTag(input: any): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        name: string;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        description: string | null;
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
                createdAt: Date;
                slug: string;
                description: string | null;
                name: string;
                color: string | null;
            }[];
            category: {
                id: string;
                order: number;
                parentId: string | null;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                name: string;
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
            id: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            status: import("@prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            images: string[];
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            categoryId: string | null;
            password: string | null;
            isPinned: boolean;
            excerpt: string | null;
            featuredImage: string | null;
            authorId: string;
            displayOrder: number;
            isFeatured: boolean;
            metaKeywords: string[];
            visibility: import("@prisma/client").$Enums.PostVisibility;
            canonicalUrl: string | null;
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
                createdAt: Date;
                slug: string;
                description: string | null;
                name: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            order: number;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
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
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        images: string[];
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        password: string | null;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        authorId: string;
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
}
