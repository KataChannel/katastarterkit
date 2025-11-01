import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: {
            tags: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                color: string | null;
                slug: string;
            }[];
            category: {
                name: string;
                order: number;
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                isActive: boolean;
                parentId: string | null;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                thumbnail: string | null;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            password: string | null;
            title: string;
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            viewCount: number;
            categoryId: string | null;
            slug: string;
            excerpt: string | null;
            isFeatured: boolean;
            publishedAt: Date | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            displayOrder: number;
            featuredImage: string | null;
            authorId: string;
            images: string[];
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
    getBlog(id: string): Promise<{
        tags: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            color: string | null;
            slug: string;
        }[];
        category: {
            name: string;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            isActive: boolean;
            parentId: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        password: string | null;
        title: string;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        categoryId: string | null;
        slug: string;
        excerpt: string | null;
        isFeatured: boolean;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        displayOrder: number;
        featuredImage: string | null;
        authorId: string;
        images: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            color: string | null;
            slug: string;
        }[];
        category: {
            name: string;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            isActive: boolean;
            parentId: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
        };
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        id: string;
        updatedAt: Date;
        content: string;
        createdAt: Date;
        password: string | null;
        title: string;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        categoryId: string | null;
        slug: string;
        excerpt: string | null;
        isFeatured: boolean;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        displayOrder: number;
        featuredImage: string | null;
        authorId: string;
        images: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            name: string;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            isActive: boolean;
            parentId: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
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
        updatedAt: Date;
        content: string;
        createdAt: Date;
        password: string | null;
        title: string;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        categoryId: string | null;
        slug: string;
        excerpt: string | null;
        isFeatured: boolean;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        displayOrder: number;
        featuredImage: string | null;
        authorId: string;
        images: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: {
            tags: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                color: string | null;
                slug: string;
            }[];
            category: {
                name: string;
                order: number;
                description: string | null;
                id: string;
                updatedAt: Date;
                createdAt: Date;
                isActive: boolean;
                parentId: string | null;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                thumbnail: string | null;
            };
            author: {
                id: string;
                email: string;
                username: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            updatedAt: Date;
            content: string;
            createdAt: Date;
            password: string | null;
            title: string;
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            viewCount: number;
            categoryId: string | null;
            slug: string;
            excerpt: string | null;
            isFeatured: boolean;
            publishedAt: Date | null;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            displayOrder: number;
            featuredImage: string | null;
            authorId: string;
            images: string[];
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
        category: {
            name: string;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            isActive: boolean;
            parentId: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
        };
        tags: ({
            tag: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                color: string | null;
                slug: string;
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
        updatedAt: Date;
        content: string;
        createdAt: Date;
        password: string | null;
        title: string;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        categoryId: string | null;
        slug: string;
        excerpt: string | null;
        isFeatured: boolean;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        displayOrder: number;
        featuredImage: string | null;
        authorId: string;
        images: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        order: number;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        parentId: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        thumbnail: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        name: string;
        order: number;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        parentId: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        thumbnail: string | null;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        color: string | null;
        slug: string;
    })[]>;
    createBlog(input: CreateBlogInput, context: any): Promise<{
        category: {
            name: string;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            isActive: boolean;
            parentId: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
        };
        tags: ({
            tag: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                color: string | null;
                slug: string;
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
        updatedAt: Date;
        content: string;
        createdAt: Date;
        password: string | null;
        title: string;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        categoryId: string | null;
        slug: string;
        excerpt: string | null;
        isFeatured: boolean;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        displayOrder: number;
        featuredImage: string | null;
        authorId: string;
        images: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        category: {
            name: string;
            order: number;
            description: string | null;
            id: string;
            updatedAt: Date;
            createdAt: Date;
            isActive: boolean;
            parentId: string | null;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            thumbnail: string | null;
        };
        tags: ({
            tag: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                color: string | null;
                slug: string;
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
        updatedAt: Date;
        content: string;
        createdAt: Date;
        password: string | null;
        title: string;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        viewCount: number;
        categoryId: string | null;
        slug: string;
        excerpt: string | null;
        isFeatured: boolean;
        publishedAt: Date | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        displayOrder: number;
        featuredImage: string | null;
        authorId: string;
        images: string[];
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        name: string;
        order: number;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        parentId: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        thumbnail: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        name: string;
        order: number;
        description: string | null;
        id: string;
        updatedAt: Date;
        createdAt: Date;
        isActive: boolean;
        parentId: string | null;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        thumbnail: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(input: CreateBlogTagInput): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        color: string | null;
        slug: string;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        color: string | null;
        slug: string;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
}
