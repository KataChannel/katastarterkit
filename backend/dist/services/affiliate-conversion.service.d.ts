import { PrismaService } from '../prisma/prisma.service';
export interface ConversionTrackingData {
    affiliateRef: string;
    orderId: string;
    saleAmount: number;
    customerEmail?: string;
    conversionType?: string;
    currency?: string;
    metadata?: Record<string, any>;
}
export interface ConversionResult {
    success: boolean;
    conversion?: any;
    commission?: number;
    message: string;
    linkId?: string;
    campaignId?: string;
    affiliateId?: string;
}
export declare class AffiliateConversionService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    trackConversion(data: ConversionTrackingData): Promise<ConversionResult>;
    trackConversionFromRequest(orderId: string, saleAmount: number, request: any, options?: {
        customerEmail?: string;
        conversionType?: string;
        currency?: string;
        metadata?: Record<string, any>;
    }): Promise<ConversionResult>;
    private calculateCommission;
    approveConversion(conversionId: string, approvedBy: string): Promise<any>;
    rejectConversion(conversionId: string, rejectedBy: string, reason?: string): Promise<any>;
    getConversionStats(campaignId: string): Promise<{
        total: any;
        pending: any;
        approved: any;
        rejected: any;
        approvalRate: string;
        totalRevenue: number;
        totalCommission: number;
    }>;
    getRecentConversions(limit?: number): Promise<any>;
}
