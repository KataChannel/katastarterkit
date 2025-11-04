import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    description: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    name: string;
                    parentId: string | null;
                    slug: string;
                    icon: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                name: string;
                slug: string;
                status: import(".prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                thumbnail: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                price: number;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import(".prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                viewCount: number;
                soldCount: number;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addToWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    description: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    name: string;
                    parentId: string | null;
                    slug: string;
                    icon: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                name: string;
                slug: string;
                status: import(".prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                thumbnail: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                price: number;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import(".prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                viewCount: number;
                soldCount: number;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    description: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    name: string;
                    parentId: string | null;
                    slug: string;
                    icon: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                name: string;
                slug: string;
                status: import(".prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                thumbnail: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                price: number;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import(".prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                viewCount: number;
                soldCount: number;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    clearWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    description: string | null;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    name: string;
                    parentId: string | null;
                    slug: string;
                    icon: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                name: string;
                slug: string;
                status: import(".prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                thumbnail: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                price: number;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import(".prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                viewCount: number;
                soldCount: number;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
