import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { CreatePaymentRequestInput, ProcessPaymentRequestInput, AffPaymentRequestSearchInput, AffDateRangeInput } from '../graphql/inputs/affiliate.input';
export declare class AffiliatePaymentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPaymentRequest(affiliateUserId: string, input: CreatePaymentRequestInput): Promise<any>;
    getPaymentRequests(input: AffPaymentRequestSearchInput, userRole?: $Enums.AffUserRole, userId?: string): Promise<{
        requests: any;
        total: any;
        page: any;
        size: any;
        totalPages: number;
    }>;
    processPaymentRequest(adminUserId: string, input: ProcessPaymentRequestInput): Promise<any>;
    getAffiliateEarnings(affiliateUserId: string, dateRange?: AffDateRangeInput): Promise<{
        totalEarnings: number;
        totalConversions: any;
        approvedEarnings: number;
        approvedConversions: any;
        paidEarnings: number;
        paidConversions: any;
        pendingEarnings: number;
        pendingConversions: any;
        availableForWithdrawal: number;
    }>;
    getPaymentHistory(affiliateUserId: string, pagination?: {
        page: number;
        size: number;
    }): Promise<{
        payments: any;
        total: any;
        page: number;
        size: number;
        totalPages: number;
    }>;
    getMonthlyCommissionReport(merchantUserId: string, year: number, month: number): Promise<{
        period: {
            year: number;
            month: number;
            startDate: Date;
            endDate: Date;
        };
        commissions: any;
        summary: any[];
        totals: {
            totalCommission: any;
            totalSales: any;
            totalConversions: any;
            uniqueAffiliates: number;
        };
    }>;
}
