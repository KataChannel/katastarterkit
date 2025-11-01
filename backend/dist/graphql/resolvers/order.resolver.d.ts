import { OrderService } from '../../services/order.service';
import { CreateOrderInput, UpdateOrderStatusInput, CancelOrderInput, OrderFilterInput, CreateOrderResponse, UpdateOrderResponse, CancelOrderResponse, OrderListResponse, OrderStatisticsResponse } from '../schemas/ecommerce/order.schema';
export declare class OrderResolver {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(input: CreateOrderInput, context?: any): Promise<CreateOrderResponse>;
    getOrder(orderId: string, context?: any): Promise<any>;
    getOrderByNumber(orderNumber: string, email?: string): Promise<any>;
    listOrders(filter?: OrderFilterInput, context?: any): Promise<OrderListResponse>;
    getMyOrders(skip: number, take: number, context?: any): Promise<OrderListResponse>;
    updateOrderStatus(input: UpdateOrderStatusInput, context?: any): Promise<UpdateOrderResponse>;
    cancelOrder(input: CancelOrderInput, context?: any): Promise<CancelOrderResponse>;
    addTrackingEvent(orderId: string, description: string, location: string, status?: string): Promise<any>;
    getOrderStatistics(startDate?: Date, endDate?: Date): Promise<OrderStatisticsResponse>;
}
