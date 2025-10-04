import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import { $Enums } from '@prisma/client';

// Register enums for GraphQL
registerEnumType($Enums.AffUserRole, {
  name: 'AffUserRole',
  description: 'Affiliate user roles',
});

registerEnumType($Enums.AffCampaignStatus, {
  name: 'AffCampaignStatus',
  description: 'Affiliate campaign status',
});

registerEnumType($Enums.AffConversionStatus, {
  name: 'AffConversionStatus',
  description: 'Affiliate conversion status',
});

registerEnumType($Enums.AffPaymentStatus, {
  name: 'AffPaymentStatus',
  description: 'Affiliate payment status',
});

registerEnumType($Enums.AffPaymentMethod, {
  name: 'AffPaymentMethod',
  description: 'Affiliate payment methods',
});

@ObjectType()
export class AffUser {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => $Enums.AffUserRole)
  role: $Enums.AffUserRole;

  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  businessType?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => $Enums.AffPaymentMethod, { nullable: true })
  paymentMethod?: $Enums.AffPaymentMethod;

  @Field({ nullable: true })
  bankAccount?: string;

  @Field({ nullable: true })
  paypalEmail?: string;

  @Field({ nullable: true })
  taxId?: string;

  @Field()
  isActive: boolean;

  @Field()
  joinedAt: Date;

  @Field({ nullable: true })
  lastActiveAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations (populated when needed)
  @Field(() => [AffCampaign], { nullable: true })
  campaignsCreated?: AffCampaign[];

  @Field(() => [AffCampaignAffiliate], { nullable: true })
  campaignJoins?: AffCampaignAffiliate[];

  @Field(() => [AffLink], { nullable: true })
  links?: AffLink[];

  @Field(() => [AffConversion], { nullable: true })
  conversions?: AffConversion[];

  @Field(() => [AffPaymentRequest], { nullable: true })
  paymentRequests?: AffPaymentRequest[];
}

@ObjectType()
export class AffCampaign {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  productName: string;

  @Field()
  productUrl: string;

  @Field({ nullable: true })
  productImage?: string;

  @Field(() => Float)
  commissionRate: number;

  @Field()
  commissionType: string;

  @Field(() => Float, { nullable: true })
  fixedAmount?: number;

  @Field(() => $Enums.AffCampaignStatus)
  status: $Enums.AffCampaignStatus;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  maxAffiliates?: number;

  @Field()
  requireApproval: boolean;

  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  totalConversions: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  totalCommission: number;

  @Field()
  creatorId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => AffUser, { nullable: true })
  creator?: AffUser;

  @Field(() => [AffCampaignAffiliate], { nullable: true })
  affiliates?: AffCampaignAffiliate[];

  @Field(() => [AffLink], { nullable: true })
  links?: AffLink[];

  @Field(() => [AffConversion], { nullable: true })
  conversions?: AffConversion[];
}

@ObjectType()
export class AffCampaignAffiliate {
  @Field(() => ID)
  id: string;

  @Field()
  campaignId: string;

  @Field()
  affiliateId: string;

  @Field()
  status: string;

  @Field()
  appliedAt: Date;

  @Field({ nullable: true })
  approvedAt?: Date;

  @Field({ nullable: true })
  rejectedAt?: Date;

  @Field({ nullable: true })
  reason?: string;

  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  totalConversions: number;

  @Field(() => Float)
  totalEarnings: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => AffCampaign, { nullable: true })
  campaign?: AffCampaign;

  @Field(() => AffUser, { nullable: true })
  affiliate?: AffUser;
}

@ObjectType()
export class AffLink {
  @Field(() => ID)
  id: string;

  @Field()
  campaignId: string;

  @Field()
  affiliateId: string;

  @Field()
  trackingCode: string;

  @Field()
  originalUrl: string;

  @Field({ nullable: true })
  shortUrl?: string;

  @Field({ nullable: true })
  utmSource?: string;

  @Field({ nullable: true })
  utmMedium?: string;

  @Field({ nullable: true })
  utmCampaign?: string;

  @Field({ nullable: true })
  utmContent?: string;

  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  totalConversions: number;

  @Field(() => Float)
  totalEarnings: number;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => AffCampaign, { nullable: true })
  campaign?: AffCampaign;

  @Field(() => AffUser, { nullable: true })
  affiliate?: AffUser;

  @Field(() => [AffClick], { nullable: true })
  clicks?: AffClick[];

  @Field(() => [AffConversion], { nullable: true })
  conversions?: AffConversion[];
}

@ObjectType()
export class AffClick {
  @Field(() => ID)
  id: string;

  @Field()
  linkId: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field({ nullable: true })
  referer?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  device?: string;

  @Field({ nullable: true })
  browser?: string;

  @Field({ nullable: true })
  sessionId?: string;

  @Field({ nullable: true })
  visitorId?: string;

  @Field()
  clickedAt: Date;

  // Relations
  @Field(() => AffLink, { nullable: true })
  link?: AffLink;
}

@ObjectType()
export class AffConversion {
  @Field(() => ID)
  id: string;

  @Field()
  linkId: string;

  @Field()
  campaignId: string;

  @Field()
  affiliateId: string;

  @Field({ nullable: true })
  orderId?: string;

  @Field({ nullable: true })
  customerEmail?: string;

  @Field(() => Float)
  saleAmount: number;

  @Field(() => Float)
  commission: number;

  @Field({ nullable: true })
  clickId?: string;

  @Field()
  conversionType: string;

  @Field(() => $Enums.AffConversionStatus)
  status: $Enums.AffConversionStatus;

  @Field()
  currency: string;

  @Field()
  convertedAt: Date;

  @Field({ nullable: true })
  approvedAt?: Date;

  @Field({ nullable: true })
  rejectedAt?: Date;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  validatedBy?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => AffLink, { nullable: true })
  link?: AffLink;

  @Field(() => AffCampaign, { nullable: true })
  campaign?: AffCampaign;

  @Field(() => AffUser, { nullable: true })
  affiliate?: AffUser;
}

@ObjectType()
export class AffPaymentRequest {
  @Field(() => ID)
  id: string;

  @Field()
  affiliateId: string;

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;

  @Field(() => $Enums.AffPaymentStatus)
  status: $Enums.AffPaymentStatus;

  @Field(() => $Enums.AffPaymentMethod)
  paymentMethod: $Enums.AffPaymentMethod;

  @Field({ nullable: true })
  accountDetails?: string;

  @Field()
  requestedAt: Date;

  @Field({ nullable: true })
  processedAt?: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field({ nullable: true })
  failedAt?: Date;

  @Field({ nullable: true })
  transactionId?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  adminNotes?: string;

  @Field({ nullable: true })
  processedBy?: string;

  @Field()
  periodStart: Date;

  @Field()
  periodEnd: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => AffUser, { nullable: true })
  affiliate?: AffUser;
}

// Dashboard and Analytics Types
@ObjectType()
export class AffDashboardStats {
  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  totalConversions: number;

  @Field(() => Float)
  totalEarnings: number;

  @Field(() => Float)
  pendingEarnings: number;

  @Field(() => Float)
  paidEarnings: number;

  @Field(() => Float)
  conversionRate: number;

  @Field(() => Int)
  activeCampaigns: number;

  @Field(() => Int)
  activeLinks: number;
}

@ObjectType()
export class AffMerchantStats {
  @Field(() => Int)
  totalCampaigns: number;

  @Field(() => Int)
  activeCampaigns: number;

  @Field(() => Int)
  totalAffiliates: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  totalCommissionPaid: number;

  @Field(() => Float)
  pendingCommission: number;

  @Field(() => Int)
  totalClicks: number;

  @Field(() => Int)
  totalConversions: number;

  @Field(() => Float)
  averageConversionRate: number;
}

@ObjectType()
export class AffCampaignSearchResult {
  @Field(() => [AffCampaign])
  campaigns: AffCampaign[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  size: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class AffConversionsResponse {
  @Field(() => [AffConversion])
  conversions: AffConversion[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  size: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class AffEarningsReport {
  @Field(() => Float)
  totalEarnings: number;

  @Field(() => Int)
  totalConversions: number;

  @Field(() => Float)
  approvedEarnings: number;

  @Field(() => Int)
  approvedConversions: number;

  @Field(() => Float)
  paidEarnings: number;

  @Field(() => Int)
  paidConversions: number;

  @Field(() => Float)
  pendingEarnings: number;

  @Field(() => Int)
  pendingConversions: number;

  @Field(() => Float)
  availableForWithdrawal: number;
}

@ObjectType()
export class AffTrackingUrl {
  @Field()
  trackingUrl: string;

  @Field()
  shortUrl: string;

  @Field()
  qrCode: string; // Base64 QR code image
}