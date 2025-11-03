import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    slug: string;
                    updatedBy: string | null;
                    icon: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
                thumbnail: string | null;
                price: number;
                viewCount: number;
                metaTitle: string | null;
                metaDescription: string | null;
                categoryId: string;
                displayOrder: number;
                isFeatured: boolean;
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
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    slug: string;
                    updatedBy: string | null;
                    icon: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
                thumbnail: string | null;
                price: number;
                viewCount: number;
                metaTitle: string | null;
                metaDescription: string | null;
                categoryId: string;
                displayOrder: number;
                isFeatured: boolean;
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
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    slug: string;
                    updatedBy: string | null;
                    icon: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
                thumbnail: string | null;
                price: number;
                viewCount: number;
                metaTitle: string | null;
                metaDescription: string | null;
                categoryId: string;
                displayOrder: number;
                isFeatured: boolean;
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
                    name: string;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    parentId: string | null;
                    createdBy: string | null;
                    slug: string;
                    updatedBy: string | null;
                    icon: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    image: string | null;
                    displayOrder: number;
                    isFeatured: boolean;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
                thumbnail: string | null;
                price: number;
                viewCount: number;
                metaTitle: string | null;
                metaDescription: string | null;
                categoryId: string;
                displayOrder: number;
                isFeatured: boolean;
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
