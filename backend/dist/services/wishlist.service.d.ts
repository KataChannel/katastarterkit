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
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    slug: string;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    image: string | null;
                    icon: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                description: string | null;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                publishedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
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
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    slug: string;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    image: string | null;
                    icon: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                description: string | null;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                publishedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
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
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    slug: string;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    image: string | null;
                    icon: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                description: string | null;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                publishedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
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
                    updatedAt: Date;
                    name: string;
                    isActive: boolean;
                    slug: string;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    updatedBy: string | null;
                    image: string | null;
                    icon: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string | null;
                    order: number;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                slug: string;
                description: string | null;
                thumbnail: string | null;
                price: number;
                categoryId: string;
                publishedAt: Date | null;
                createdBy: string | null;
                updatedBy: string | null;
                displayOrder: number;
                isFeatured: boolean;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                sku: string | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                maxStock: number | null;
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
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
