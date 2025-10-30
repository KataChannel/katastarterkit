import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: {
            tags: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
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
                id: string;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                parentId: string | null;
                thumbnail: string | null;
                order: number;
            };
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            content: string;
            authorId: string;
            categoryId: string | null;
            featuredImage: string | null;
            images: string[];
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            password: string | null;
            isFeatured: boolean;
            isPinned: boolean;
            displayOrder: number;
            viewCount: number;
            readingTime: number | null;
            commentsEnabled: boolean;
            publishedAt: Date | null;
            scheduledAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
            slug: string;
            createdAt: Date;
            name: string;
            description: string | null;
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
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            slug: string;
            createdAt: Date;
            name: string;
            description: string | null;
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
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: {
            tags: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
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
                id: string;
                slug: string;
                metaTitle: string | null;
                metaDescription: string | null;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                name: string;
                description: string | null;
                parentId: string | null;
                thumbnail: string | null;
                order: number;
            };
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            content: string;
            authorId: string;
            categoryId: string | null;
            featuredImage: string | null;
            images: string[];
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            canonicalUrl: string | null;
            status: import("@prisma/client").$Enums.PostStatus;
            visibility: import("@prisma/client").$Enums.PostVisibility;
            password: string | null;
            isFeatured: boolean;
            isPinned: boolean;
            displayOrder: number;
            viewCount: number;
            readingTime: number | null;
            commentsEnabled: boolean;
            publishedAt: Date | null;
            scheduledAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        tags: ({
            tag: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
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
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        tags: ({
            tag: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        author: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
        category: {
            id: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            description: string | null;
            parentId: string | null;
            thumbnail: string | null;
            order: number;
        };
        tags: ({
            tag: {
                id: string;
                slug: string;
                createdAt: Date;
                name: string;
                description: string | null;
                color: string | null;
            };
        } & {
            postId: string;
            tagId: string;
        })[];
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        content: string;
        authorId: string;
        categoryId: string | null;
        featuredImage: string | null;
        images: string[];
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        canonicalUrl: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        visibility: import("@prisma/client").$Enums.PostVisibility;
        password: string | null;
        isFeatured: boolean;
        isPinned: boolean;
        displayOrder: number;
        viewCount: number;
        readingTime: number | null;
        commentsEnabled: boolean;
        publishedAt: Date | null;
        scheduledAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteBlog(id: string): Promise<{
        success: boolean;
    }>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        id: string;
        slug: string;
        metaTitle: string | null;
        metaDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        description: string | null;
        parentId: string | null;
        thumbnail: string | null;
        order: number;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        description: string | null;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
}
