import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: {
            tags: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                slug: string;
                color: string | null;
            }[];
            category: {
                id: string;
                description: string | null;
                order: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
                slug: string;
                thumbnail: string | null;
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
            password: string | null;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            featuredImage: string | null;
            status: import(".prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            authorId: string;
            images: string[];
            displayOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            categoryId: string | null;
            viewCount: number;
            visibility: import(".prisma/client").$Enums.PostVisibility;
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
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            slug: string;
            color: string | null;
        }[];
        category: {
            id: string;
            description: string | null;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            thumbnail: string | null;
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
        password: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        categoryId: string | null;
        viewCount: number;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            slug: string;
            color: string | null;
        }[];
        category: {
            id: string;
            description: string | null;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            thumbnail: string | null;
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
        password: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        categoryId: string | null;
        viewCount: number;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            description: string | null;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            thumbnail: string | null;
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
        password: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        categoryId: string | null;
        viewCount: number;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: {
            tags: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                slug: string;
                color: string | null;
            }[];
            category: {
                id: string;
                description: string | null;
                order: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                parentId: string | null;
                slug: string;
                thumbnail: string | null;
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
            password: string | null;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            featuredImage: string | null;
            status: import(".prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            authorId: string;
            images: string[];
            displayOrder: number;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string[];
            categoryId: string | null;
            viewCount: number;
            visibility: import(".prisma/client").$Enums.PostVisibility;
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
            id: string;
            description: string | null;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        tags: ({
            tag: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                slug: string;
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
        password: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        categoryId: string | null;
        viewCount: number;
        visibility: import(".prisma/client").$Enums.PostVisibility;
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
        id: string;
        description: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            posts: number;
        };
        id: string;
        description: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    getTags(): Promise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        slug: string;
        color: string | null;
    })[]>;
    createBlog(input: CreateBlogInput, context: any): Promise<{
        category: {
            id: string;
            description: string | null;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        tags: ({
            tag: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                slug: string;
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
        password: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        categoryId: string | null;
        viewCount: number;
        visibility: import(".prisma/client").$Enums.PostVisibility;
        canonicalUrl: string | null;
        isPinned: boolean;
        readingTime: number | null;
        commentsEnabled: boolean;
        scheduledAt: Date | null;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        category: {
            id: string;
            description: string | null;
            order: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            parentId: string | null;
            slug: string;
            thumbnail: string | null;
            metaTitle: string | null;
            metaDescription: string | null;
        };
        tags: ({
            tag: {
                id: string;
                description: string | null;
                createdAt: Date;
                name: string;
                slug: string;
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
        password: string | null;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        featuredImage: string | null;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
        images: string[];
        displayOrder: number;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        categoryId: string | null;
        viewCount: number;
        visibility: import(".prisma/client").$Enums.PostVisibility;
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
        id: string;
        description: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        id: string;
        description: string | null;
        order: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        parentId: string | null;
        slug: string;
        thumbnail: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
    }>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        slug: string;
        color: string | null;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        slug: string;
        color: string | null;
    }>;
    deleteTag(id: string): Promise<{
        success: boolean;
    }>;
}
