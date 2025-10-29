import { BlogService } from '../../services/blog.service';
import { CreateBlogInput, UpdateBlogInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../inputs/blog.input';
export declare class BlogResolver {
    private blogService;
    constructor(blogService: BlogService);
    getBlogs(page?: number, limit?: number, search?: string, categoryId?: string, sort?: string): Promise<{
        items: ({
            category: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                thumbnail: string | null;
            };
            tags: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            }[];
        } & {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            author: string;
            excerpt: string | null;
            slug: string;
            publishedAt: Date | null;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            categoryId: string | null;
            viewCount: number;
            thumbnailUrl: string | null;
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
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        author: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        categoryId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    getBlogBySlug(slug: string): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        author: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        categoryId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    getFeaturedBlogs(limit?: number): Promise<({
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        author: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        categoryId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    })[]>;
    getBlogsByCategory(categoryId: string, page?: number, limit?: number): Promise<{
        items: ({
            category: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                thumbnail: string | null;
            };
            tags: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            }[];
        } & {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            author: string;
            excerpt: string | null;
            slug: string;
            publishedAt: Date | null;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            categoryId: string | null;
            viewCount: number;
            thumbnailUrl: string | null;
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
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        author: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        categoryId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
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
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        thumbnail: string | null;
    }[]>;
    getCategory(id: string): Promise<{
        postCount: number;
        _count: {
            blogs: number;
        };
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        thumbnail: string | null;
    }>;
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }[]>;
    createBlog(input: CreateBlogInput): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        author: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        categoryId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    updateBlog(input: UpdateBlogInput): Promise<{
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        author: string;
        excerpt: string | null;
        slug: string;
        publishedAt: Date | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        categoryId: string | null;
        viewCount: number;
        thumbnailUrl: string | null;
        shortDescription: string | null;
        bannerUrl: string | null;
        isPublished: boolean;
    }>;
    deleteBlog(id: string): Promise<boolean>;
    createCategory(input: CreateBlogCategoryInput): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        thumbnail: string | null;
    }>;
    updateCategory(input: UpdateBlogCategoryInput): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        thumbnail: string | null;
    }>;
    deleteCategory(id: string): Promise<boolean>;
    createTag(input: CreateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    updateTag(input: UpdateBlogTagInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    deleteTag(id: string): Promise<boolean>;
}
