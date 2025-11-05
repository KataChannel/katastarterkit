import { PrismaService } from '../prisma/prisma.service';
import { CartService } from './cart.service';
import { CreateOrderInput, UpdateOrderStatusInput, CancelOrderInput, OrderFilterInput } from '../graphql/schemas/ecommerce/order.schema';
export declare class OrderService {
    private readonly prisma;
    private readonly cartService;
    constructor(prisma: PrismaService, cartService: CartService);
    createFromCart(input: CreateOrderInput, userId?: string): Promise<any>;
    getOrder(orderId: string, userId?: string): Promise<any>;
    getOrderByNumber(orderNumber: string, email?: string): Promise<any>;
    listOrders(filter?: OrderFilterInput, userId?: string): Promise<{
        orders: any;
        total: any;
        hasMore: boolean;
    }>;
    updateStatus(input: UpdateOrderStatusInput, adminUserId: string): Promise<any>;
    cancelOrder(input: CancelOrderInput, userId?: string): Promise<any>;
    addTrackingEvent(orderId: string, description: string, location: string, status?: string): Promise<any>;
    private generateOrderNumber;
    private calculateShippingFee;
    private validateStatusTransition;
    private getStatusDescription;
    getStatistics(startDate?: Date, endDate?: Date): Promise<{
        totalOrders: any;
        totalRevenue: any;
        byStatus: any;
        byPaymentStatus: any;
    }>;
    private mapOrderStatusToShippingStatus;
}
