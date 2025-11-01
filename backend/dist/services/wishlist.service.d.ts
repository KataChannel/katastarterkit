import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<any>;
    addToWishlist(userId: string, productId: string): Promise<any>;
    removeFromWishlist(userId: string, productId: string): Promise<any>;
    clearWishlist(userId: string): Promise<any>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
}
