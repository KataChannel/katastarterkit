"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let CartService = class CartService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
        this.CART_TTL = 86400 * 7;
        this.CACHE_TTL = 3600;
    }
    async getOrCreateCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either userId or sessionId is required');
        }
        const cacheKey = this.getCartCacheKey(userId, sessionId);
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        let cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                price: true,
                                originalPrice: true,
                                images: true,
                                stock: true,
                                status: true,
                            }
                        },
                        variant: {
                            select: {
                                id: true,
                                sku: true,
                                price: true,
                                stock: true,
                                attributes: true,
                            }
                        }
                    }
                }
            }
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                    sessionId,
                    expiresAt: new Date(Date.now() + this.CART_TTL * 1000),
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    price: true,
                                    originalPrice: true,
                                    images: true,
                                    stock: true,
                                    status: true,
                                }
                            },
                            variant: {
                                select: {
                                    id: true,
                                    sku: true,
                                    price: true,
                                    stock: true,
                                    attributes: true,
                                }
                            }
                        }
                    }
                }
            });
        }
        const cartWithTotals = await this.calculateTotals(cart);
        await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(cartWithTotals));
        return cartWithTotals;
    }
    async addItem(input, userId) {
        const { productId, variantId, quantity, sessionId, metadata } = input;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                variants: variantId ? { where: { id: variantId } } : undefined,
            }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Product is not available');
        }
        const variant = variantId ? product.variants?.[0] : null;
        const availableStock = variant ? variant.stock : product.stock;
        if (availableStock < quantity) {
            throw new common_1.BadRequestException(`Only ${availableStock} items available in stock`);
        }
        const cart = await this.getOrCreateCart(userId, sessionId);
        const existingItem = cart.items.find(item => item.productId === productId && item.variantId === variantId);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > availableStock) {
                throw new common_1.BadRequestException(`Cannot add ${quantity} more items. Only ${availableStock - existingItem.quantity} available`);
            }
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: newQuantity,
                    updatedAt: new Date(),
                }
            });
        }
        else {
            const price = variant?.price ?? product.price;
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    variantId,
                    quantity,
                    price,
                    metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
                }
            });
        }
        await this.invalidateCartCache(userId, sessionId);
        return this.getOrCreateCart(userId, sessionId);
    }
    async updateItem(itemId, quantity, userId, sessionId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: true,
                variant: true,
            }
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Cart item does not belong to user');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('Cart item does not belong to session');
        }
        const availableStock = cartItem.variant?.stock ?? cartItem.product.stock;
        if (quantity > availableStock) {
            throw new common_1.BadRequestException(`Only ${availableStock} items available in stock`);
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: {
                quantity,
                updatedAt: new Date(),
            }
        });
        await this.invalidateCartCache(userId, sessionId);
        return this.getOrCreateCart(userId, sessionId);
    }
    async removeItem(itemId, userId, sessionId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Cart item does not belong to user');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('Cart item does not belong to session');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId }
        });
        await this.invalidateCartCache(userId, sessionId);
        return this.getOrCreateCart(userId, sessionId);
    }
    async clearCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        await this.invalidateCartCache(userId, sessionId);
        return this.getOrCreateCart(userId, sessionId);
    }
    async applyCoupon(input, userId) {
        const { couponCode, sessionId } = input;
        const coupon = await this.validateCoupon(couponCode);
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.prisma.cart.update({
            where: { id: cart.id },
            data: {
                metadata: {
                    ...(cart.metadata || {}),
                    coupon: {
                        code: couponCode,
                        discount: coupon.discount,
                        type: coupon.type,
                    }
                }
            }
        });
        await this.invalidateCartCache(userId, sessionId);
        return this.getOrCreateCart(userId, sessionId);
    }
    async mergeCarts(input) {
        const { userId, sessionId } = input;
        const [userCart, sessionCart] = await Promise.all([
            this.prisma.cart.findFirst({
                where: { userId },
                include: { items: true }
            }),
            this.prisma.cart.findFirst({
                where: { sessionId },
                include: { items: true }
            })
        ]);
        if (!sessionCart || sessionCart.items.length === 0) {
            return this.getOrCreateCart(userId);
        }
        if (!userCart) {
            await this.prisma.cart.update({
                where: { id: sessionCart.id },
                data: {
                    userId,
                    sessionId: null,
                }
            });
        }
        else {
            for (const sessionItem of sessionCart.items) {
                const existingItem = userCart.items.find(item => item.productId === sessionItem.productId &&
                    item.variantId === sessionItem.variantId);
                if (existingItem) {
                    await this.prisma.cartItem.update({
                        where: { id: existingItem.id },
                        data: {
                            quantity: existingItem.quantity + sessionItem.quantity
                        }
                    });
                }
                else {
                    await this.prisma.cartItem.update({
                        where: { id: sessionItem.id },
                        data: { cartId: userCart.id }
                    });
                }
            }
            await this.prisma.cart.delete({
                where: { id: sessionCart.id }
            });
        }
        await this.invalidateCartCache(userId, sessionId);
        return this.getOrCreateCart(userId);
    }
    async validateCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const errors = [];
        for (const item of cart.items) {
            if (item.product.status !== 'published') {
                errors.push(`Product "${item.product.name}" is no longer available`);
                continue;
            }
            const availableStock = item.variant?.stock ?? item.product.stock;
            if (availableStock < item.quantity) {
                errors.push(`Product "${item.product.name}" only has ${availableStock} items in stock (you have ${item.quantity} in cart)`);
            }
            const currentPrice = item.variant?.salePrice ?? item.variant?.price ?? item.product.salePrice ?? item.product.price;
            const cartPrice = item.salePrice ?? item.price;
            if (currentPrice !== cartPrice) {
                errors.push(`Price of "${item.product.name}" has changed from ${cartPrice} to ${currentPrice}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            cart,
        };
    }
    async calculateTotals(cart) {
        let subtotal = 0;
        let itemCount = 0;
        for (const item of cart.items) {
            const price = item.salePrice ?? item.price;
            subtotal += price * item.quantity;
            itemCount += item.quantity;
        }
        let discount = 0;
        if (cart.metadata?.coupon) {
            const coupon = cart.metadata.coupon;
            if (coupon.type === 'percentage') {
                discount = (subtotal * coupon.discount) / 100;
            }
            else {
                discount = coupon.discount;
            }
        }
        const total = subtotal - discount;
        return {
            ...cart,
            itemCount,
            subtotal,
            discount,
            total,
        };
    }
    async validateCoupon(code) {
        return {
            code,
            discount: 10,
            type: 'percentage',
        };
    }
    getCartCacheKey(userId, sessionId) {
        if (userId)
            return `cart:user:${userId}`;
        if (sessionId)
            return `cart:session:${sessionId}`;
        throw new common_1.BadRequestException('Either userId or sessionId is required');
    }
    async invalidateCartCache(userId, sessionId) {
        const cacheKey = this.getCartCacheKey(userId, sessionId);
        await this.redis.del(cacheKey);
    }
    async cleanupExpiredCarts() {
        const deleted = await this.prisma.cart.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
        return { deletedCount: deleted.count };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], CartService);
//# sourceMappingURL=cart.service.js.map