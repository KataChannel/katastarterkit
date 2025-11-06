import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { 
  AddToCartInput, 
  UpdateCartItemInput, 
  RemoveFromCartInput,
  ApplyCouponInput,
  MergeCartsInput 
} from '../graphql/schemas/ecommerce/cart.schema';

@Injectable()
export class CartService {
  private readonly CART_TTL = 86400 * 7; // 7 days in seconds
  private readonly CACHE_TTL = 3600; // 1 hour in seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Get or create cart for user/session
   */
  async getOrCreateCart(userId?: string, sessionId?: string) {
    // Normalize empty strings to undefined
    const normalizedUserId = userId && userId.trim() !== '' ? userId : undefined;
    const normalizedSessionId = sessionId && sessionId.trim() !== '' ? sessionId : undefined;

    if (!normalizedUserId && !normalizedSessionId) {
      throw new BadRequestException('Either userId or sessionId is required');
    }

    // Try cache first
    const cacheKey = this.getCartCacheKey(normalizedUserId, normalizedSessionId);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Find existing cart
    let cart = await this.prisma.cart.findFirst({
      where: normalizedUserId ? { userId: normalizedUserId } : { sessionId: normalizedSessionId },
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

    // Create new cart if not found
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId: normalizedUserId,
          sessionId: normalizedSessionId,
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

    // Calculate totals
    const cartWithTotals = await this.calculateTotals(cart);

    // Cache for 1 hour
    await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(cartWithTotals));

    return cartWithTotals;
  }

  /**
   * Add item to cart
   */
  async addItem(input: AddToCartInput, userId?: string) {
    const { productId, variantId, quantity, sessionId, metadata } = input;

    // Validate input
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    if (!quantity || quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    // Validate product and variant
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: variantId ? { where: { id: variantId } } : undefined,
      }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== 'ACTIVE') {
      throw new BadRequestException('Product is not available');
    }

    // Check stock
    const variant = variantId ? product.variants?.[0] : null;
    const availableStock = variant ? variant.stock : product.stock;
    
    if (availableStock < quantity) {
      throw new BadRequestException(`Only ${availableStock} items available in stock`);
    }

    // Get or create cart
    const cart = await this.getOrCreateCart(userId, sessionId);

    // Check if item already exists
    const existingItem = cart.items.find(
      item => item.productId === productId && item.variantId === variantId
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > availableStock) {
        throw new BadRequestException(`Cannot add ${quantity} more items. Only ${availableStock - existingItem.quantity} available`);
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: newQuantity,
          updatedAt: new Date(),
        }
      });
    } else {
      // Create new cart item with price snapshot
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

    // Invalidate cache
    await this.invalidateCartCache(userId, sessionId);

    // Return updated cart
    return this.getOrCreateCart(userId, sessionId);
  }

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: string, quantity: number, userId?: string, sessionId?: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
        variant: true,
      }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify cart ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new BadRequestException('Cart item does not belong to user');
    }
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new BadRequestException('Cart item does not belong to session');
    }

    // Check stock
    const availableStock = cartItem.variant?.stock ?? cartItem.product.stock;
    if (quantity > availableStock) {
      throw new BadRequestException(`Only ${availableStock} items available in stock`);
    }

    // Update quantity
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { 
        quantity,
        updatedAt: new Date(),
      }
    });

    // Invalidate cache
    await this.invalidateCartCache(userId, sessionId);

    return this.getOrCreateCart(userId, sessionId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true }
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify cart ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new BadRequestException('Cart item does not belong to user');
    }
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new BadRequestException('Cart item does not belong to session');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId }
    });

    // Invalidate cache
    await this.invalidateCartCache(userId, sessionId);

    return this.getOrCreateCart(userId, sessionId);
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    // Invalidate cache
    await this.invalidateCartCache(userId, sessionId);

    return this.getOrCreateCart(userId, sessionId);
  }

  /**
   * Apply coupon to cart
   */
  async applyCoupon(input: ApplyCouponInput, userId?: string) {
    const { couponCode, sessionId } = input;

    // Validate coupon (implement based on your coupon system)
    // This is a placeholder - implement actual coupon validation
    const coupon = await this.validateCoupon(couponCode);

    const cart = await this.getOrCreateCart(userId, sessionId);

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: {
        // Store discount details in metadata
        metadata: {
          ...(cart.metadata as object || {}),
          coupon: {
            code: couponCode,
            discount: coupon.discount,
            type: coupon.type,
          }
        }
      }
    });

    // Invalidate cache
    await this.invalidateCartCache(userId, sessionId);

    return this.getOrCreateCart(userId, sessionId);
  }

  /**
   * Merge session cart into user cart after login
   */
  async mergeCarts(input: MergeCartsInput) {
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
      // Move session cart to user
      await this.prisma.cart.update({
        where: { id: sessionCart.id },
        data: { 
          userId,
          sessionId: null,
        }
      });
    } else {
      // Merge items from session cart into user cart
      for (const sessionItem of sessionCart.items) {
        const existingItem = userCart.items.find(
          item => item.productId === sessionItem.productId && 
                  item.variantId === sessionItem.variantId
        );

        if (existingItem) {
          // Update quantity
          await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { 
              quantity: existingItem.quantity + sessionItem.quantity 
            }
          });
        } else {
          // Move item to user cart
          await this.prisma.cartItem.update({
            where: { id: sessionItem.id },
            data: { cartId: userCart.id }
          });
        }
      }

      // Delete empty session cart
      await this.prisma.cart.delete({
        where: { id: sessionCart.id }
      });
    }

    // Invalidate both caches
    await this.invalidateCartCache(userId, sessionId);

    return this.getOrCreateCart(userId);
  }

  /**
   * Validate cart before checkout
   */
  async validateCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    const errors: string[] = [];

    for (const item of cart.items) {
      // Check product availability
      if (item.product.status !== 'published') {
        errors.push(`Product "${item.product.name}" is no longer available`);
        continue;
      }

      // Check stock
      const availableStock = item.variant?.stock ?? item.product.stock;
      if (availableStock < item.quantity) {
        errors.push(`Product "${item.product.name}" only has ${availableStock} items in stock (you have ${item.quantity} in cart)`);
      }

      // Check price changes
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

  /**
   * Calculate cart totals
   */
  private async calculateTotals(cart: any) {
    let subtotal = 0;
    let itemCount = 0;

    for (const item of cart.items) {
      const price = item.salePrice ?? item.price;
      subtotal += price * item.quantity;
      itemCount += item.quantity;
    }

    // Apply coupon discount if exists
    let discount = 0;
    if (cart.metadata?.coupon) {
      const coupon = cart.metadata.coupon;
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.discount) / 100;
      } else {
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

  /**
   * Validate coupon code (placeholder)
   */
  private async validateCoupon(code: string) {
    // TODO: Implement actual coupon validation
    // Check if coupon exists, is valid, not expired, etc.
    // This is a placeholder implementation
    return {
      code,
      discount: 10,
      type: 'percentage',
    };
  }

  /**
   * Get cache key for cart
   */
  private getCartCacheKey(userId?: string, sessionId?: string): string {
    if (userId) return `cart:user:${userId}`;
    if (sessionId) return `cart:session:${sessionId}`;
    throw new BadRequestException('Either userId or sessionId is required');
  }

  /**
   * Invalidate cart cache
   */
  private async invalidateCartCache(userId?: string, sessionId?: string) {
    const cacheKey = this.getCartCacheKey(userId, sessionId);
    await this.redis.del(cacheKey);
  }

  /**
   * Clean up expired carts (should be run as cron job)
   */
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
}
