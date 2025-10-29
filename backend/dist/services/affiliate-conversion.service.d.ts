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
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        approvalRate: string;
        totalRevenue: number;
        totalCommission: number;
    }>;
    getRecentConversions(limit?: number): Promise<({
        link: {
            campaign: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: import("@prisma/client").$Enums.AffCampaignStatus;
                productImage: string | null;
                totalClicks: number;
                totalConversions: number;
                productName: string;
                productUrl: string;
                commissionRate: import("@prisma/client/runtime/library").Decimal;
                commissionType: string;
                fixedAmount: import("@prisma/client/runtime/library").Decimal | null;
                startDate: Date | null;
                endDate: Date | null;
                maxAffiliates: number | null;
                requireApproval: boolean;
                totalRevenue: import("@prisma/client/runtime/library").Decimal;
                totalCommission: import("@prisma/client/runtime/library").Decimal;
                creatorId: string;
            };
            affiliate: {
                user: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                userId: string;
                createdAt: Date;
                isActive: boolean;
                updatedAt: Date;
                description: string | null;
                role: import("@prisma/client").$Enums.AffUserRole;
                companyName: string | null;
                businessType: string | null;
                website: string | null;
                paymentMethod: import("@prisma/client").$Enums.AffPaymentMethod | null;
                bankAccount: string | null;
                paypalEmail: string | null;
                taxId: string | null;
                joinedAt: Date;
                lastActiveAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            isActive: boolean;
            updatedAt: Date;
            description: string | null;
            title: string | null;
            expiresAt: Date | null;
            campaignId: string;
            affiliateId: string;
            trackingCode: string;
            originalUrl: string;
            shortUrl: string | null;
            customAlias: string | null;
            utmSource: string | null;
            utmMedium: string | null;
            utmCampaign: string | null;
            utmContent: string | null;
            totalClicks: number;
            totalConversions: number;
            totalEarnings: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AffConversionStatus;
        saleAmount: import("@prisma/client/runtime/library").Decimal;
        commission: import("@prisma/client/runtime/library").Decimal;
        linkId: string;
        campaignId: string;
        affiliateId: string;
        orderId: string | null;
        customerEmail: string | null;
        clickId: string | null;
        conversionType: string;
        currency: string;
        convertedAt: Date;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        paidAt: Date | null;
        notes: string | null;
        validatedBy: string | null;
    })[]>;
}
