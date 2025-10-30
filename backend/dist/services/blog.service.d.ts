import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
                color: string | null;
            }[];
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                slug: string;
                description: string | null;
                thumbnail: string | null;
                order: number;
                parentId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PostStatus;
            password: string | null;
            title: string;
            slug: string;
            categoryId: string | null;
            content: string;
            isPinned: boolean;
            excerpt: string | null;
            featuredImage: string | null;
            publishedAt: Date | null;
            authorId: string;
            images: string[];
            displayOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            viewCount: number;
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
            name: string;
            slug: string;
            description: string | null;
            color: string | null;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
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
            name: string;
            slug: string;
            description: string | null;
            color: string | null;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(id: string, input: any): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        slug: string;
        description: string | null;
        thumbnail: string | null;
        order: number;
        parentId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        slug: string;
        description: string | null;
        thumbnail: string | null;
        order: number;
        parentId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    createCategory(input: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        slug: string;
        description: string | null;
        thumbnail: string | null;
        order: number;
        parentId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    updateCategory(id: string, input: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isActive: boolean;
        slug: string;
        description: string | null;
        thumbnail: string | null;
        order: number;
        parentId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
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
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
    }>;
    createTag(input: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
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
                name: string;
                slug: string;
                description: string | null;
                color: string | null;
            }[];
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                isActive: boolean;
                slug: string;
                description: string | null;
                thumbnail: string | null;
                order: number;
                parentId: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PostStatus;
            password: string | null;
            title: string;
            slug: string;
            categoryId: string | null;
            content: string;
            isPinned: boolean;
            excerpt: string | null;
            featuredImage: string | null;
            publishedAt: Date | null;
            authorId: string;
            images: string[];
            displayOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            viewCount: number;
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
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            slug: string;
            description: string | null;
            thumbnail: string | null;
            order: number;
            parentId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PostStatus;
        password: string | null;
        title: string;
        slug: string;
        categoryId: string | null;
        content: string;
        isPinned: boolean;
        excerpt: string | null;
        featuredImage: string | null;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        viewCount: number;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
}
