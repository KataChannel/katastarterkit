import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { CreateAffUserInput, UpdateAffUserInput, CreateCampaignInput, UpdateCampaignInput, CampaignSearchInput, JoinCampaignInput, ReviewCampaignApplicationInput } from '../graphql/inputs/affiliate.input';
export declare class AffiliateUserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createAffiliateUser(userId: string, input: CreateAffUserInput): Promise<any>;
    getAffiliateUser(userId: string): Promise<any | null>;
    updateAffiliateUser(userId: string, input: UpdateAffUserInput): Promise<any>;
    getAllAffiliates(filters?: {
        role?: $Enums.AffUserRole;
        isActive?: boolean;
    }): Promise<any>;
    getAffiliateStats(userId: string): Promise<{
        totalClicks: any;
        totalConversions: any;
        totalEarnings: any;
        pendingEarnings: any;
        paidEarnings: any;
        conversionRate: number;
        activeCampaigns: any;
        activeLinks: any;
    }>;
}
export declare class AffiliateCampaignService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createCampaign(creatorUserId: string, input: CreateCampaignInput): Promise<any>;
    updateCampaign(campaignId: string, creatorUserId: string, input: UpdateCampaignInput): Promise<any>;
    deleteCampaign(campaignId: string, creatorUserId: string): Promise<any>;
    getCampaign(campaignId: string): Promise<any>;
    searchCampaigns(input: CampaignSearchInput): Promise<{
        campaigns: any;
        total: any;
        page: number;
        size: number;
        totalPages: number;
    }>;
    joinCampaign(affiliateUserId: string, input: JoinCampaignInput): Promise<any>;
    reviewCampaignApplication(merchantUserId: string, input: ReviewCampaignApplicationInput): Promise<any>;
    getMerchantStats(merchantUserId: string): Promise<{
        totalCampaigns: any;
        activeCampaigns: any;
        totalAffiliates: any;
        totalRevenue: any;
        totalCommissionPaid: any;
        pendingCommission: any;
        totalClicks: any;
        totalConversions: any;
        averageConversionRate: number;
    }>;
}
