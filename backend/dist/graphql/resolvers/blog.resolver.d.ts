import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: {
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            }[];
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                order: number;
                thumbnail: string | null;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
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
            content: string;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            isFeatured: boolean;
            displayOrder: number;
            viewCount: number;
            publishedAt: Date | null;
            images: string[];
            title: string;
            isPinned: boolean;
            excerpt: string | null;
            authorId: string;
            featuredImage: string | null;
            canonicalUrl: string | null;
            visibility: import("@prisma/client").$Enums.PostVisibility;
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
    getBlog(id: string): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            slug: string;
            color: string | null;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
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
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            slug: string;
            color: string | null;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
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
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
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
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: {
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            }[];
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                order: number;
                thumbnail: string | null;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                parentId: string | null;
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
            content: string;
            slug: string;
            categoryId: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            isFeatured: boolean;
            displayOrder: number;
            viewCount: number;
            publishedAt: Date | null;
            images: string[];
            title: string;
            isPinned: boolean;
            excerpt: string | null;
            authorId: string;
            featuredImage: string | null;
            canonicalUrl: string | null;
            visibility: import("@prisma/client").$Enums.PostVisibility;
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
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
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
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    })[]>;
    createBlog(input: CreateBlogInput, context: any): Promise<{
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
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
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
                slug: string;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            order: number;
            thumbnail: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            parentId: string | null;
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
        content: string;
        slug: string;
        categoryId: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        isFeatured: boolean;
        displayOrder: number;
        viewCount: number;
        publishedAt: Date | null;
        images: string[];
        title: string;
        isPinned: boolean;
        excerpt: string | null;
        authorId: string;
        featuredImage: string | null;
        canonicalUrl: string | null;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        order: number;
        thumbnail: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
}
