import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string | null;
            }[];
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            category: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                slug: string;
                order: number;
                thumbnail: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
            id: string;
            password: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            featuredImage: string | null;
            status: import("@prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            authorId: string;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            categoryId: string | null;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            images: string[];
            displayOrder: number;
            isFeatured: boolean;
            metaKeywords: string[];
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
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string | null;
        }[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            name: string;
            id: string;
            createdAt: Date;
            description: string | null;
            slug: string;
            color: string | null;
        }[];
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    } & {
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    } & {
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        tags: ({
            tag: {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    } & {
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(id: string, input: any): Promise<{
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        tags: ({
            tag: {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    } & {
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
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
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        order: number;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        order: number;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    createCategory(input: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        order: number;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    updateCategory(id: string, input: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        parentId: string | null;
        slug: string;
        order: number;
        thumbnail: string | null;
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
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    createTag(input: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
    getBlogsByCategory(categoryId: string, input?: any): Promise<{
        items: {
            tags: {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string | null;
            }[];
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            category: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                parentId: string | null;
                slug: string;
                order: number;
                thumbnail: string | null;
                metaTitle: string | null;
                metaDescription: string | null;
            };
            id: string;
            password: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            featuredImage: string | null;
            status: import("@prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            authorId: string;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            categoryId: string | null;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            images: string[];
            displayOrder: number;
            isFeatured: boolean;
            metaKeywords: string[];
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
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        tags: ({
            tag: {
                name: string;
                id: string;
                createdAt: Date;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            parentId: string | null;
            slug: string;
            order: number;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    } & {
        id: string;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        categoryId: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaKeywords: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
}
