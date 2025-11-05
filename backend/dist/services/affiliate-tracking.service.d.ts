import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';
import { CreateAffLinkInput, UpdateAffLinkInput, TrackConversionInput, ReviewConversionInput, AffLinkSearchInput, AffConversionSearchInput } from '../graphql/inputs/affiliate.input';
export declare class AffiliateTrackingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateTrackingCode;
    findLinkByCode(trackingCode: string): Promise<any>;
    createAffiliateLink(affiliateUserId: string, input: CreateAffLinkInput): Promise<any>;
    getAffiliateLinks(affiliateUserId: string, input?: AffLinkSearchInput): Promise<{
        links: any;
        total: any;
        page: number;
        size: number;
        totalPages: number;
    }>;
    updateAffiliateLink(linkId: string, affiliateUserId: string, input: UpdateAffLinkInput): Promise<any>;
    trackClick(clickData: {
        linkId: string;
        ipAddress: string;
        userAgent: string;
        referer?: string | null;
        device?: string;
        browser?: string;
        country?: string | null;
    }): Promise<any>;
    trackClickFromRequest(trackingCode: string, request: any): Promise<{
        clickId: any;
        redirectUrl: any;
        visitorId: any;
    }>;
    trackConversion(input: TrackConversionInput): Promise<any>;
    reviewConversion(reviewerUserId: string, input: ReviewConversionInput): Promise<any>;
    getConversions(input: AffConversionSearchInput, userRole?: $Enums.AffUserRole, userId?: string): Promise<{
        conversions: any;
        total: any;
        page: number;
        size: number;
        totalPages: number;
    }>;
    generateTrackingUrl(trackingCode: string, baseUrl?: string): string;
    generateQRCode(trackingUrl: string): Promise<string>;
}
