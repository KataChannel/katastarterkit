import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogCategoryInput, CreateBlogTagInput } from '../graphql/inputs/blog.input';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input?: any): Promise<{
        items: {
            tags: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            }[];
            author: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                email: string;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                thumbnail: string | null;
                order: number;
                isActive: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
            };
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            featuredImage: string | null;
            images: string[];
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            viewCount: number;
            publishedAt: Date | null;
            isFeatured: boolean;
            isPinned: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            commentsEnabled: boolean;
            readingTime: number | null;
            categoryId: string | null;
            authorId: string;
            password: string | null;
            displayOrder: number;
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
            name: string;
            slug: string;
            createdAt: Date;
            description: string | null;
            color: string | null;
        }[];
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            description: string | null;
            color: string | null;
        }[];
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    })[]>;
    getRecentBlogs(limit?: number): Promise<({
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    })[]>;
    createBlog(input: any, userId: string): Promise<{
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    }>;
    updateBlog(id: string, input: any): Promise<{
        author: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
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
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }[]>;
    getCategoryById(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    updateCategory(id: string, input: any): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        thumbnail: string | null;
        order: number;
        isActive: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
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
        name: string;
        slug: string;
        createdAt: Date;
        description: string | null;
        color: string | null;
    })[]>;
    getTagById(id: string): Promise<{
        _count: {
            posts: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        description: string | null;
        color: string | null;
    }>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        description: string | null;
        color: string | null;
    }>;
    updateTag(id: string, input: any): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
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
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            }[];
            author: {
                id: string;
                username: string;
                firstName: string;
                lastName: string;
                email: string;
            };
            category: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                thumbnail: string | null;
                order: number;
                isActive: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
            };
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            featuredImage: string | null;
            images: string[];
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            viewCount: number;
            publishedAt: Date | null;
            isFeatured: boolean;
            isPinned: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            commentsEnabled: boolean;
            readingTime: number | null;
            categoryId: string | null;
            authorId: string;
            password: string | null;
            displayOrder: number;
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
            username: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            thumbnail: string | null;
            order: number;
            isActive: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
        };
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        featuredImage: string | null;
        images: string[];
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        publishedAt: Date | null;
        isFeatured: boolean;
        isPinned: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        commentsEnabled: boolean;
        readingTime: number | null;
        categoryId: string | null;
        authorId: string;
        password: string | null;
        displayOrder: number;
        scheduledAt: Date | null;
    })[]>;
}
