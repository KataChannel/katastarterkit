import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        items: ({
            product: {
                category: {
                    name: string;
                    isActive: boolean;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    slug: string;
                    parentId: string | null;
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
                    order: number;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
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
                unit: import("@prisma/client").$Enums.ProductUnit;
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
                    name: string;
                    isActive: boolean;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    slug: string;
                    parentId: string | null;
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
                    order: number;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
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
                unit: import("@prisma/client").$Enums.ProductUnit;
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
                    name: string;
                    isActive: boolean;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    slug: string;
                    parentId: string | null;
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
                    order: number;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
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
                unit: import("@prisma/client").$Enums.ProductUnit;
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
                    name: string;
                    isActive: boolean;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    slug: string;
                    parentId: string | null;
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
                    order: number;
                    title: string | null;
                    url: string;
                    productId: string;
                    alt: string | null;
                    isPrimary: boolean;
                }[];
            } & {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                slug: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                publishedAt: Date | null;
                updatedBy: string | null;
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
                unit: import("@prisma/client").$Enums.ProductUnit;
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
