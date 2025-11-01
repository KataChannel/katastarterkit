export declare class CreateBlogInput {
    title: string;
    slug: string;
    content: string;
    shortDescription?: string;
    excerpt?: string;
    author: string;
    thumbnailUrl?: string;
    bannerUrl?: string;
    categoryId?: string;
    tagIds?: string[];
    isFeatured?: boolean;
    isPublished?: boolean;
    publishedAt?: Date;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export declare class UpdateBlogInput {
    id: string;
    title?: string;
    slug?: string;
    content?: string;
    shortDescription?: string;
    excerpt?: string;
    author?: string;
    thumbnailUrl?: string;
    bannerUrl?: string;
    categoryId?: string;
    tagIds?: string[];
    isFeatured?: boolean;
    isPublished?: boolean;
    publishedAt?: Date;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}
export declare class GetBlogsInput {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sort?: string;
}
export declare class CreateBlogCategoryInput {
    name: string;
    slug: string;
    description?: string;
    thumbnail?: string;
}
export declare class UpdateBlogCategoryInput {
    id: string;
    name?: string;
    slug?: string;
    description?: string;
    thumbnail?: string;
}
export declare class CreateBlogTagInput {
    name: string;
    slug: string;
}
export declare class UpdateBlogTagInput {
    id: string;
    name?: string;
    slug?: string;
}
