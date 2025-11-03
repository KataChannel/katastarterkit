import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
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
    getBlog(id: string): Promise<{
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
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
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
    getCategory(id: string): Promise<{
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
    createBlog(input: CreateBlogInput, context: any): Promise<{
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
    updateBlog(input: UpdateBlogInput): Promise<{
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
    createCategory(input: CreateBlogCategoryInput): Promise<{
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
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
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
    createTag(input: CreateBlogTagInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string | null;
        slug: string;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
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
}
