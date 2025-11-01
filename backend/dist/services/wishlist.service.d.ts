import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    description: string | null;
                    id: string;
                    updatedBy: string | null;
                    updatedAt: Date;
                    createdAt: Date;
                    isActive: boolean;
                    parentId: string | null;
                    createdBy: string | null;
                    icon: string | null;
                    slug: string;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    image: string | null;
                };
                images: {
                    order: number;
                    id: string;
                    updatedAt: Date;
                    createdAt: Date;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    productId: string;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                updatedBy: string | null;
                updatedAt: Date;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdBy: string | null;
                viewCount: number;
                categoryId: string;
                slug: string;
                isFeatured: boolean;
                publishedAt: Date | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                thumbnail: string | null;
                displayOrder: number;
                shortDesc: string | null;
                price: number;
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
        updatedAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    addToWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    description: string | null;
                    id: string;
                    updatedBy: string | null;
                    updatedAt: Date;
                    createdAt: Date;
                    isActive: boolean;
                    parentId: string | null;
                    createdBy: string | null;
                    icon: string | null;
                    slug: string;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    image: string | null;
                };
                images: {
                    order: number;
                    id: string;
                    updatedAt: Date;
                    createdAt: Date;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    productId: string;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                updatedBy: string | null;
                updatedAt: Date;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdBy: string | null;
                viewCount: number;
                categoryId: string;
                slug: string;
                isFeatured: boolean;
                publishedAt: Date | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                thumbnail: string | null;
                displayOrder: number;
                shortDesc: string | null;
                price: number;
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
        updatedAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    description: string | null;
                    id: string;
                    updatedBy: string | null;
                    updatedAt: Date;
                    createdAt: Date;
                    isActive: boolean;
                    parentId: string | null;
                    createdBy: string | null;
                    icon: string | null;
                    slug: string;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    image: string | null;
                };
                images: {
                    order: number;
                    id: string;
                    updatedAt: Date;
                    createdAt: Date;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    productId: string;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                updatedBy: string | null;
                updatedAt: Date;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdBy: string | null;
                viewCount: number;
                categoryId: string;
                slug: string;
                isFeatured: boolean;
                publishedAt: Date | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                thumbnail: string | null;
                displayOrder: number;
                shortDesc: string | null;
                price: number;
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
        updatedAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    clearWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    description: string | null;
                    id: string;
                    updatedBy: string | null;
                    updatedAt: Date;
                    createdAt: Date;
                    isActive: boolean;
                    parentId: string | null;
                    createdBy: string | null;
                    icon: string | null;
                    slug: string;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    displayOrder: number;
                    image: string | null;
                };
                images: {
                    order: number;
                    id: string;
                    updatedAt: Date;
                    createdAt: Date;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    productId: string;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                updatedBy: string | null;
                updatedAt: Date;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdBy: string | null;
                viewCount: number;
                categoryId: string;
                slug: string;
                isFeatured: boolean;
                publishedAt: Date | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                thumbnail: string | null;
                displayOrder: number;
                shortDesc: string | null;
                price: number;
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
        updatedAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
