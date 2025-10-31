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
                    createdBy: string | null;
                    updatedBy: string | null;
                    isActive: boolean;
                    name: string;
                    description: string | null;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    isFeatured: boolean;
                    displayOrder: number;
                    parentId: string | null;
                    icon: string | null;
                    image: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    productId: string;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                name: string;
                description: string | null;
                sku: string | null;
                thumbnail: string | null;
                price: number;
                slug: string;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                isFeatured: boolean;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                displayOrder: number;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addToWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    isActive: boolean;
                    name: string;
                    description: string | null;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    isFeatured: boolean;
                    displayOrder: number;
                    parentId: string | null;
                    icon: string | null;
                    image: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    productId: string;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                name: string;
                description: string | null;
                sku: string | null;
                thumbnail: string | null;
                price: number;
                slug: string;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                isFeatured: boolean;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                displayOrder: number;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    isActive: boolean;
                    name: string;
                    description: string | null;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    isFeatured: boolean;
                    displayOrder: number;
                    parentId: string | null;
                    icon: string | null;
                    image: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    productId: string;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                name: string;
                description: string | null;
                sku: string | null;
                thumbnail: string | null;
                price: number;
                slug: string;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                isFeatured: boolean;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                displayOrder: number;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    clearWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    isActive: boolean;
                    name: string;
                    description: string | null;
                    slug: string;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    metaKeywords: string | null;
                    isFeatured: boolean;
                    displayOrder: number;
                    parentId: string | null;
                    icon: string | null;
                    image: string | null;
                };
                images: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    order: number;
                    productId: string;
                    title: string | null;
                    url: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                status: import("@prisma/client").$Enums.ProductStatus;
                name: string;
                description: string | null;
                sku: string | null;
                thumbnail: string | null;
                price: number;
                slug: string;
                shortDesc: string | null;
                originalPrice: number | null;
                costPrice: number | null;
                barcode: string | null;
                stock: number;
                minStock: number;
                maxStock: number | null;
                unit: import("@prisma/client").$Enums.ProductUnit;
                weight: number | null;
                origin: string | null;
                categoryId: string;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                metaTitle: string | null;
                metaDescription: string | null;
                metaKeywords: string | null;
                isFeatured: boolean;
                isNewArrival: boolean;
                isBestSeller: boolean;
                isOnSale: boolean;
                displayOrder: number;
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
