import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: ({
            category: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                description: string | null;
                thumbnail: string | null;
            };
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            publishedAt: Date | null;
            author: string;
            thumbnailUrl: string | null;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            isFeatured: boolean;
            categoryId: string | null;
            shortDescription: string | null;
            bannerUrl: string | null;
            isPublished: boolean;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getBlog(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    getBlogBySlug(slug: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: ({
            category: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
                description: string | null;
                thumbnail: string | null;
            };
            tags: {
                id: string;
                createdAt: Date;
                name: string;
                updatedAt: Date;
                slug: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            publishedAt: Date | null;
            author: string;
            thumbnailUrl: string | null;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            isFeatured: boolean;
            categoryId: string | null;
            shortDescription: string | null;
            bannerUrl: string | null;
            isPublished: boolean;
        })[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getRelatedBlogs(categoryId: string, excludeBlogId: string, limit?: number): Promise<({
        category: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    })[]>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            blogs: number;
        };
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            blogs: number;
        };
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }>;
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }[]>;
    createBlog(input: CreateBlogInput): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        category: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            slug: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    deleteBlog(id: string): Promise<boolean>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }>;
    deleteCategory(id: string): Promise<boolean>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        slug: string;
    }>;
    deleteTag(id: string): Promise<boolean>;
}
