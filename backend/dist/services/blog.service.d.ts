import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogInput, UpdateBlogInput, GetBlogsInput, CreateBlogCategoryInput, UpdateBlogCategoryInput, CreateBlogTagInput, UpdateBlogTagInput } from '../graphql/inputs/blog.input';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getBlogs(input: GetBlogsInput): Promise<{
        items: ({
            tags: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            }[];
            category: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                thumbnail: string | null;
            };
        } & {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            slug: string;
            publishedAt: Date | null;
            excerpt: string | null;
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
    getBlogById(id: string): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        publishedAt: Date | null;
        excerpt: string | null;
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
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        publishedAt: Date | null;
        excerpt: string | null;
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
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        publishedAt: Date | null;
        excerpt: string | null;
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
            tags: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            }[];
            category: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                thumbnail: string | null;
            };
        } & {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            slug: string;
            publishedAt: Date | null;
            excerpt: string | null;
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
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        publishedAt: Date | null;
        excerpt: string | null;
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
    createBlog(input: CreateBlogInput): Promise<{
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        publishedAt: Date | null;
        excerpt: string | null;
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
        tags: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        slug: string;
        publishedAt: Date | null;
        excerpt: string | null;
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
    getCategoryById(id: string): Promise<{
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
    getTags(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }[]>;
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
