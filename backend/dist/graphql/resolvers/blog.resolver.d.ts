import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: ({
            tags: {
                createdAt: Date;
                name: string;
                id: string;
                updatedAt: Date;
                slug: string;
            }[];
            category: {
                createdAt: Date;
                name: string;
                id: string;
                updatedAt: Date;
                slug: string;
                description: string | null;
                thumbnail: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            publishedAt: Date | null;
            author: string;
            categoryId: string | null;
            thumbnailUrl: string | null;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            isFeatured: boolean;
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
        tags: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        categoryId: string | null;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    getBlogBySlug(slug: string): Promise<{
        tags: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        categoryId: string | null;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        tags: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        categoryId: string | null;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: ({
            tags: {
                createdAt: Date;
                name: string;
                id: string;
                updatedAt: Date;
                slug: string;
            }[];
            category: {
                createdAt: Date;
                name: string;
                id: string;
                updatedAt: Date;
                slug: string;
                description: string | null;
                thumbnail: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            title: string;
            content: string;
            excerpt: string | null;
            slug: string;
            publishedAt: Date | null;
            author: string;
            categoryId: string | null;
            thumbnailUrl: string | null;
            viewCount: number;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            isFeatured: boolean;
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
        tags: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        categoryId: string | null;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    })[]>;
    getCategories(): Promise<{
        postCount: number;
        _count: {
            blogs: number;
        };
        createdAt: Date;
        name: string;
        id: string;
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
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }>;
    getTags(): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
    }[]>;
    createBlog(input: CreateBlogInput): Promise<{
        tags: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        categoryId: string | null;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        tags: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            createdAt: Date;
            name: string;
            id: string;
            updatedAt: Date;
            slug: string;
            description: string | null;
            thumbnail: string | null;
        };
    } & {
        createdAt: Date;
        id: string;
        updatedAt: Date;
        title: string;
        content: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        author: string;
        categoryId: string | null;
        thumbnailUrl: string | null;
        viewCount: number;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        isFeatured: boolean;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    deleteBlog(id: string): Promise<boolean>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
        description: string | null;
        thumbnail: string | null;
    }>;
    deleteCategory(id: string): Promise<boolean>;
    createTag(input: CreateBlogTagInput): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        createdAt: Date;
        name: string;
        id: string;
        updatedAt: Date;
        slug: string;
    }>;
    deleteTag(id: string): Promise<boolean>;
}
