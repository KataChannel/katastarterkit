import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    slug: string;
                    icon: string | null;
                    parentId: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    createdBy: string | null;
                    updatedBy: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    productId: string;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                displayOrder: number;
                isFeatured: boolean;
                createdBy: string | null;
                updatedBy: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                viewCount: number;
                soldCount: number;
                publishedAt: Date | null;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addToWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    slug: string;
                    icon: string | null;
                    parentId: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    createdBy: string | null;
                    updatedBy: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    productId: string;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                displayOrder: number;
                isFeatured: boolean;
                createdBy: string | null;
                updatedBy: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                viewCount: number;
                soldCount: number;
                publishedAt: Date | null;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    slug: string;
                    icon: string | null;
                    parentId: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    createdBy: string | null;
                    updatedBy: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    productId: string;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                displayOrder: number;
                isFeatured: boolean;
                createdBy: string | null;
                updatedBy: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                viewCount: number;
                soldCount: number;
                publishedAt: Date | null;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    clearWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    slug: string;
                    icon: string | null;
                    parentId: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    createdBy: string | null;
                    updatedBy: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    productId: string;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                displayOrder: number;
                isFeatured: boolean;
                createdBy: string | null;
                updatedBy: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                viewCount: number;
                soldCount: number;
                publishedAt: Date | null;
            };
        } & {
            id: string;
            productId: string;
            addedAt: Date;
            wishlistId: string;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
