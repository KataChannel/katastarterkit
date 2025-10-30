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
                description: string | null;
                status: import("@prisma/client").$Enums.AffCampaignStatus;
                name: string;
                productName: string;
                productUrl: string;
                productImage: string | null;
                commissionRate: import("@prisma/client/runtime/library").Decimal;
                commissionType: string;
                fixedAmount: import("@prisma/client/runtime/library").Decimal | null;
                startDate: Date | null;
                endDate: Date | null;
                maxAffiliates: number | null;
                requireApproval: boolean;
                totalClicks: number;
                totalConversions: number;
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
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isActive: boolean;
                userId: string;
                paymentMethod: import("@prisma/client").$Enums.AffPaymentMethod | null;
                role: import("@prisma/client").$Enums.AffUserRole;
                companyName: string | null;
                businessType: string | null;
                website: string | null;
                bankAccount: string | null;
                paypalEmail: string | null;
                taxId: string | null;
                joinedAt: Date;
                lastActiveAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string | null;
            description: string | null;
            isActive: boolean;
            expiresAt: Date | null;
            totalClicks: number;
            totalConversions: number;
            totalEarnings: import("@prisma/client/runtime/library").Decimal;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AffConversionStatus;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        campaignId: string;
        affiliateId: string;
        orderId: string | null;
        customerEmail: string | null;
        saleAmount: import("@prisma/client/runtime/library").Decimal;
        conversionType: string;
        notes: string | null;
        linkId: string;
        commission: import("@prisma/client/runtime/library").Decimal;
        clickId: string | null;
        currency: string;
        convertedAt: Date;
        paidAt: Date | null;
        validatedBy: string | null;
    })[]>;
}
