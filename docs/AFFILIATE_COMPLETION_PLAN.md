# 🚀 PLAN HOÀN THIỆN AFFILIATE SYSTEM

**Dự án**: KataCore Fullstack  
**Thời gian**: 12 tuần (3 tháng)  
**Team**: 1 Backend Dev + 1 Frontend Dev (+ 0.5 DevOps part-time)  
**Mục tiêu**: Từ MVP (7.1/10) → Production-Ready (9/10)

---

## 📊 Current Status

**Overall Score**: 🟡 **7.1/10**

| Component | Score | Status | Priority |
|-----------|-------|--------|----------|
| Database Schema | 9/10 | 🟢 Good | Low |
| Backend Services | 8/10 | 🟢 Good | Medium |
| GraphQL API | 7.5/10 | 🟡 Needs Work | High |
| Frontend | 7.5/10 | 🟡 Needs Work | High |
| Integration | 5/10 | 🔴 Critical | **URGENT** |
| Testing | 4/10 | 🔴 Critical | **URGENT** |
| Scalability | 6/10 | 🟡 Needs Work | Medium |

**Feature Completeness**: 40% (4/10 working, 5/10 blocked)

---

## 🎯 PHASE 1: FIX CRITICAL BLOCKERS (Week 1-2)

**Goal**: Unblock affiliate workflow end-to-end  
**Team**: 1 Backend + 1 Frontend  
**Success Metric**: First conversion tracked and paid

### Week 1: Backend Integrations

#### Day 1-2: Click Tracking Endpoint 🔴

**Task 1.1**: Create Tracking Controller
```bash
File: backend/src/controllers/tracking.controller.ts
LOC: ~150 lines
```

**Implementation**:
```typescript
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AffiliateTrackingService } from '../services/affiliate-tracking.service';

@Controller('track')
export class TrackingController {
  constructor(
    private readonly trackingService: AffiliateTrackingService
  ) {}

  @Get('click/:trackingCode')
  async trackClick(
    @Param('trackingCode') trackingCode: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      // 1. Find link by tracking code
      const link = await this.trackingService.findLinkByCode(trackingCode);
      
      if (!link || !link.isActive) {
        return res.status(404).send('Link not found or inactive');
      }

      // 2. Check if campaign is active
      if (link.campaign.status !== 'ACTIVE') {
        return res.status(410).send('Campaign is not active');
      }

      // 3. Check link expiry
      if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        return res.status(410).send('Link has expired');
      }

      // 4. Record click with geo/device data
      await this.trackingService.trackClick({
        linkId: link.id,
        ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'],
        // Parse user agent for device/browser
        device: this.parseDevice(req.headers['user-agent']),
        browser: this.parseBrowser(req.headers['user-agent']),
      });

      // 5. Set affiliate cookie (30 days default, or campaign cookieDuration)
      const cookieDuration = link.campaign.cookieDuration || 30;
      res.cookie('aff_ref', trackingCode, {
        maxAge: cookieDuration * 24 * 60 * 60 * 1000, // days to ms
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      // 6. Redirect to original URL
      return res.redirect(302, link.originalUrl);
      
    } catch (error) {
      console.error('Click tracking error:', error);
      return res.status(500).send('Internal server error');
    }
  }

  private parseDevice(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private parseBrowser(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    if (/chrome/i.test(userAgent)) return 'chrome';
    if (/firefox/i.test(userAgent)) return 'firefox';
    if (/safari/i.test(userAgent)) return 'safari';
    if (/edge/i.test(userAgent)) return 'edge';
    return 'other';
  }
}
```

**Task 1.2**: Update AffiliateTrackingService
```typescript
// Add method to find link by tracking code
async findLinkByCode(trackingCode: string) {
  return this.prisma.affLink.findUnique({
    where: { trackingCode },
    include: {
      campaign: true,
      affiliate: true
    }
  });
}
```

**Task 1.3**: Register Controller
```typescript
// backend/src/graphql/graphql.module.ts
import { TrackingController } from '../controllers/tracking.controller';

@Module({
  controllers: [TrackingController], // Add this
  // ...
})
```

**Testing**:
```bash
# Test click tracking
curl -I http://localhost:14000/track/click/ABC123

# Should return:
# - 302 redirect
# - Set-Cookie: aff_ref=ABC123
# - Location: https://product-url.com
```

**Deliverables**:
- [ ] TrackingController created
- [ ] Cookie setting logic
- [ ] Device/browser parsing
- [ ] Redirect working
- [ ] Tested with Postman

---

#### Day 3-4: Conversion Integration 🔴

**Task 2.1**: Add Conversion Hook in Order Service

**Option A**: Webhook Approach (Recommended)
```typescript
// backend/src/services/order.service.ts

async completeOrder(orderId: string, req?: Request) {
  const order = await this.prisma.order.update({
    where: { id: orderId },
    data: { status: 'COMPLETED' }
  });

  // Trigger affiliate conversion tracking
  await this.trackAffiliateConversion(order, req);
  
  return order;
}

private async trackAffiliateConversion(order: any, req?: Request) {
  try {
    // 1. Check for affiliate cookie
    const affRef = req?.cookies?.['aff_ref'];
    if (!affRef) return;

    // 2. Find link by tracking code
    const link = await this.prisma.affLink.findUnique({
      where: { trackingCode: affRef },
      include: { campaign: true, affiliate: true }
    });

    if (!link || link.campaign.status !== 'ACTIVE') return;

    // 3. Calculate commission
    const commission = this.calculateCommission(
      link.campaign,
      order.total
    );

    // 4. Record conversion
    await this.prisma.affConversion.create({
      data: {
        linkId: link.id,
        campaignId: link.campaignId,
        affiliateId: link.affiliateId,
        orderId: order.id,
        customerEmail: order.customerEmail,
        saleAmount: order.total,
        commission,
        status: 'PENDING', // Needs merchant approval
        conversionType: 'sale',
        currency: 'VND'
      }
    });

    // 5. Update link stats
    await this.prisma.affLink.update({
      where: { id: link.id },
      data: {
        totalConversions: { increment: 1 },
        totalEarnings: { increment: commission }
      }
    });

    // 6. Update campaign stats
    await this.prisma.affCampaign.update({
      where: { id: link.campaignId },
      data: {
        totalConversions: { increment: 1 },
        totalRevenue: { increment: order.total },
        totalCommission: { increment: commission }
      }
    });

    // 7. Update affiliate join stats
    await this.prisma.affCampaignAffiliate.updateMany({
      where: {
        campaignId: link.campaignId,
        affiliateId: link.affiliateId
      },
      data: {
        totalConversions: { increment: 1 },
        totalEarnings: { increment: commission }
      }
    });

    // 8. Clear affiliate cookie (conversion tracked)
    if (req) {
      req.res?.clearCookie('aff_ref');
    }

  } catch (error) {
    console.error('Affiliate conversion tracking failed:', error);
    // Don't throw - order should complete even if tracking fails
  }
}

private calculateCommission(campaign: any, saleAmount: number): number {
  if (campaign.commissionType === 'percentage') {
    return Number((saleAmount * (Number(campaign.commissionRate) / 100)).toFixed(2));
  } else {
    return Number(campaign.fixedAmount || 0);
  }
}
```

**Task 2.2**: Add Conversion Approval Mutation
```graphql
type Mutation {
  approveConversion(id: String!): AffConversion!
  rejectConversion(id: String!, reason: String!): AffConversion!
}
```

**Task 2.3**: Test Conversion Flow
```bash
# 1. Click affiliate link
curl -c cookies.txt http://localhost:14000/track/click/ABC123

# 2. Make purchase (with cookie)
curl -b cookies.txt -X POST http://localhost:14000/api/orders/complete \
  -H "Content-Type: application/json" \
  -d '{"orderId":"ORDER123"}'

# 3. Check conversion recorded
query {
  affiliateConversions(search: { linkId: "..." }) {
    id
    saleAmount
    commission
    status
  }
}
```

**Deliverables**:
- [ ] Conversion tracking in order service
- [ ] Commission calculation
- [ ] Stats updates (link, campaign, affiliate)
- [ ] Approve/reject mutations
- [ ] End-to-end test passing

---

#### Day 5: Join Campaign Flow 🔴

**Task 3.1**: Expose Missing Mutations

```typescript
// backend/src/graphql/resolvers/affiliate.resolver.ts

@Mutation(() => AffCampaignAffiliate, { name: 'joinCampaign' })
@UseGuards(JwtAuthGuard)
async joinCampaign(
  @Args('input') input: JoinCampaignInput,
  @Context() context: any
): Promise<AffCampaignAffiliate> {
  const userId = context.req.user.id;
  const result = await this.campaignService.joinCampaign(userId, input);
  return mapDecimalFields(result);
}

@Mutation(() => AffCampaignAffiliate, { name: 'reviewCampaignApplication' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MERCHANT')
async reviewApplication(
  @Args('input') input: ReviewCampaignApplicationInput,
  @Context() context: any
): Promise<AffCampaignAffiliate> {
  const result = await this.campaignService.reviewApplication(input);
  return mapDecimalFields(result);
}

@Mutation(() => AffCampaign, { name: 'updateAffiliateCampaign' })
@UseGuards(JwtAuthGuard)
async updateCampaign(
  @Args('id') id: string,
  @Args('input') input: UpdateCampaignInput,
  @Context() context: any
): Promise<AffCampaign> {
  const userId = context.req.user.id;
  const result = await this.campaignService.updateCampaign(id, userId, input);
  return mapDecimalFields(result);
}

@Mutation(() => Boolean, { name: 'deleteAffiliateCampaign' })
@UseGuards(JwtAuthGuard)
async deleteCampaign(
  @Args('id') id: string,
  @Context() context: any
): Promise<boolean> {
  const userId = context.req.user.id;
  await this.campaignService.deleteCampaign(id, userId);
  return true;
}
```

**Task 3.2**: Update Schema
```bash
# Regenerate schema
cd backend
bun run build:schema
```

**Deliverables**:
- [ ] joinCampaign mutation
- [ ] reviewCampaignApplication mutation
- [ ] updateAffiliateCampaign mutation
- [ ] deleteCampaign mutation
- [ ] Schema regenerated

---

### Week 2: Frontend Integration

#### Day 6-7: Join Campaign UI

**Task 4.1**: Create JoinCampaignModal Component
```bash
File: frontend/src/components/affiliate/campaigns/JoinCampaignModal.tsx
LOC: ~200 lines
```

**Implementation**:
```tsx
'use client'

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const JOIN_CAMPAIGN = gql`
  mutation JoinCampaign($input: JoinCampaignInput!) {
    joinCampaign(input: $input) {
      id
      status
      appliedAt
    }
  }
`;

interface JoinCampaignModalProps {
  campaign: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinCampaignModal({ 
  campaign, 
  isOpen, 
  onClose 
}: JoinCampaignModalProps) {
  const [message, setMessage] = useState('');
  const [joinCampaign, { loading }] = useMutation(JOIN_CAMPAIGN);

  const handleJoin = async () => {
    try {
      await joinCampaign({
        variables: {
          input: {
            campaignId: campaign.id,
            message
          }
        }
      });

      toast.success('Application submitted! Waiting for merchant approval.');
      onClose();
    } catch (error) {
      toast.error('Failed to join campaign');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Join Campaign</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Campaign: {campaign.name}</p>
          <p className="text-sm text-gray-600">
            Commission: {campaign.commissionRate}%
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Message to merchant (optional)
          </label>
          <textarea
            className="w-full border rounded p-2"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why do you want to join this campaign?"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Task 4.2**: Add Join Button to CampaignManagement
```tsx
// In CampaignManagement.tsx
const [showJoinModal, setShowJoinModal] = useState(false);
const [selectedCampaign, setSelectedCampaign] = useState(null);

// Add button in campaign card
<Button 
  onClick={() => {
    setSelectedCampaign(campaign);
    setShowJoinModal(true);
  }}
>
  Join Campaign
</Button>

<JoinCampaignModal
  campaign={selectedCampaign}
  isOpen={showJoinModal}
  onClose={() => setShowJoinModal(false)}
/>
```

**Deliverables**:
- [ ] JoinCampaignModal component
- [ ] Integration in CampaignManagement
- [ ] GraphQL mutation working
- [ ] Success/error handling

---

#### Day 8-9: Application Review UI

**Task 5.1**: Create ApplicationReviewPanel
```bash
File: frontend/src/components/affiliate/campaigns/ApplicationReviewPanel.tsx
```

**Features**:
- List pending applications
- Approve/reject buttons
- Reason input for rejection
- Real-time updates

**Deliverables**:
- [ ] Review panel component
- [ ] Approve/reject mutations
- [ ] Filters (pending/approved/rejected)
- [ ] Merchant dashboard integration

---

#### Day 10: End-to-End Testing

**Task 6.1**: E2E Test Suite
```bash
# Test complete affiliate flow
1. Merchant creates campaign ✅
2. Affiliate joins campaign ✅
3. Merchant approves affiliate ✅
4. Affiliate generates link ✅
5. Visitor clicks link ✅
6. Cookie is set ✅
7. Visitor makes purchase ✅
8. Conversion is tracked ✅
9. Commission is calculated ✅
10. Affiliate requests payment ✅
```

**Task 6.2**: Create Test Script
```bash
File: test-affiliate-complete-flow.sh
```

**Deliverables**:
- [ ] E2E test script
- [ ] All steps pass
- [ ] Documentation updated

---

## 🧪 PHASE 2: QUALITY & TESTING (Week 3-6)

**Goal**: 60%+ test coverage + production-grade quality  
**Team**: 1 Backend + 0.5 Frontend  
**Success Metric**: CI/CD passing, deployable

### Week 3: Backend Testing

#### Unit Tests (Target: 60% coverage)

**Task 7.1**: Service Layer Tests
```bash
# Create test files
backend/src/services/__tests__/
├── affiliate.service.spec.ts
├── affiliate-tracking.service.spec.ts
└── affiliate-payment.service.spec.ts
```

**Example Test**:
```typescript
// affiliate.service.spec.ts
describe('AffiliateUserService', () => {
  let service: AffiliateUserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AffiliateUserService, PrismaService],
    }).compile();

    service = module.get<AffiliateUserService>(AffiliateUserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createAffiliateUser', () => {
    it('should create affiliate profile', async () => {
      // Arrange
      const userId = 'user-123';
      const input = { role: 'AFFILIATE' };
      
      jest.spyOn(prisma.affUser, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.affUser, 'create').mockResolvedValue({
        id: 'aff-123',
        userId,
        role: 'AFFILIATE',
        ...
      });

      // Act
      const result = await service.createAffiliateUser(userId, input);

      // Assert
      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
    });

    it('should throw error if profile exists', async () => {
      // Test duplicate profile
    });
  });

  describe('calculateCommission', () => {
    it('should calculate percentage commission', () => {
      // Test commission calculation
    });

    it('should calculate fixed commission', () => {
      // Test fixed commission
    });
  });
});
```

**Coverage Goals**:
- AffiliateUserService: 80%
- AffiliateCampaignService: 70%
- AffiliateTrackingService: 60%
- AffiliatePaymentService: 60%

**Deliverables**:
- [ ] 15+ unit test files
- [ ] 100+ test cases
- [ ] 60%+ coverage
- [ ] CI pipeline integration

---

#### Day 11-12: Integration Tests

**Task 7.2**: GraphQL Resolver Tests
```typescript
// Test mutations and queries
describe('Affiliate Resolvers', () => {
  it('should join campaign with valid input', async () => {
    // Test joinCampaign mutation
  });

  it('should track click and set cookie', async () => {
    // Test click tracking
  });

  it('should record conversion with affiliate cookie', async () => {
    // Test conversion tracking
  });
});
```

**Deliverables**:
- [ ] Resolver integration tests
- [ ] Database seeding for tests
- [ ] Cleanup after tests

---

### Week 4: Validation & Error Handling

#### Day 13-14: Input Validation

**Task 8.1**: Add Validation Decorators
```typescript
// backend/src/graphql/inputs/affiliate.input.ts
import { IsEmail, IsNumber, Min, Max, IsUrl } from 'class-validator';

@InputType()
export class CreateCampaignInput {
  @Field()
  @Length(3, 100)
  name: string;

  @Field()
  @IsUrl()
  productUrl: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fixedAmount?: number;
}
```

**Task 8.2**: Add Business Rule Validation
```typescript
// In service layer
async createCampaign(userId: string, input: CreateCampaignInput) {
  // Validate commission settings
  if (input.commissionType === 'percentage' && !input.commissionRate) {
    throw new BadRequestException('Commission rate is required for percentage type');
  }

  if (input.commissionType === 'fixed' && !input.fixedAmount) {
    throw new BadRequestException('Fixed amount is required for fixed type');
  }

  // Validate date range
  if (input.endDate && input.startDate && input.endDate < input.startDate) {
    throw new BadRequestException('End date must be after start date');
  }

  // Validate max affiliates
  if (input.maxAffiliates && input.maxAffiliates < 1) {
    throw new BadRequestException('Max affiliates must be at least 1');
  }

  // Create campaign
  return this.prisma.affCampaign.create({ data: { ...input, creatorId: userId } });
}
```

**Deliverables**:
- [ ] Validation decorators added
- [ ] Business rules enforced
- [ ] Error messages clear
- [ ] Tests for validation

---

#### Day 15-16: Logging & Monitoring

**Task 9.1**: Add Winston Logger
```typescript
// backend/src/services/affiliate-tracking.service.ts
import { Logger } from '@nestjs/common';

export class AffiliateTrackingService {
  private readonly logger = new Logger(AffiliateTrackingService.name);

  async trackClick(data: any) {
    this.logger.log(`Click tracked: ${data.linkId} from ${data.ipAddress}`);
    
    // Check for suspicious patterns
    const recentClicks = await this.getRecentClicks(data.ipAddress, 60); // 1 hour
    if (recentClicks.length > 10) {
      this.logger.warn(`Suspicious click pattern detected: ${data.ipAddress} - ${recentClicks.length} clicks in 1 hour`);
    }

    // Record click
    const click = await this.prisma.affClick.create({ data });
    
    this.logger.debug(`Click recorded: ${click.id}`);
    return click;
  }

  async recordConversion(data: any) {
    this.logger.log(`Conversion recorded: ${data.orderId} - Commission: ${data.commission}`);
    
    const conversion = await this.prisma.affConversion.create({ data });
    
    this.logger.log(`Conversion ID: ${conversion.id}`);
    return conversion;
  }
}
```

**Task 9.2**: Add Error Tracking (Sentry)
```bash
npm install @sentry/node @sentry/nestjs
```

```typescript
// backend/src/main.ts
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

**Deliverables**:
- [ ] Winston logger configured
- [ ] Log levels appropriate
- [ ] Sentry error tracking
- [ ] Alerts configured

---

### Week 5-6: Frontend Testing & Polish

#### Day 17-19: Component Tests

**Task 10.1**: Jest + React Testing Library
```typescript
// frontend/src/components/affiliate/__tests__/CampaignManagement.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import CampaignManagement from '../CampaignManagement';

describe('CampaignManagement', () => {
  it('should render campaigns list', async () => {
    const mocks = [
      {
        request: {
          query: GET_CAMPAIGNS,
        },
        result: {
          data: {
            affiliateCampaigns: [
              { id: '1', name: 'Test Campaign', commissionRate: 10 }
            ]
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={mocks}>
        <CampaignManagement />
      </MockedProvider>
    );

    expect(await screen.findByText('Test Campaign')).toBeInTheDocument();
  });

  it('should open join modal when clicking join button', () => {
    // Test modal interaction
  });
});
```

**Deliverables**:
- [ ] Component tests for all 4 main components
- [ ] Snapshot tests
- [ ] Interaction tests
- [ ] 50%+ coverage

---

#### Day 20-22: UI/UX Polish

**Task 11.1**: Loading States
```tsx
// Add skeleton loaders
{loading ? (
  <div className="space-y-4">
    {[1,2,3].map(i => (
      <Skeleton key={i} className="h-24 w-full" />
    ))}
  </div>
) : (
  <CampaignsList campaigns={data} />
)}
```

**Task 11.2**: Error States
```tsx
// Add error boundaries
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded">
    <p className="text-red-800">Failed to load campaigns</p>
    <button onClick={refetch}>Try Again</button>
  </div>
)}
```

**Task 11.3**: Empty States
```tsx
{campaigns.length === 0 && (
  <div className="text-center py-12">
    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
    <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
    <Button onClick={openCreateModal}>Create Campaign</Button>
  </div>
)}
```

**Deliverables**:
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Empty states
- [ ] Success animations

---

## 🚀 PHASE 3: PAYMENT & SCALE (Week 7-12)

**Goal**: Payment integration + scalability  
**Team**: 1 Backend + 0.5 DevOps  
**Success Metric**: 100+ affiliates, 1000+ clicks/day

### Week 7-8: Payment Gateway Integration

#### Day 23-26: Stripe Integration

**Task 12.1**: Setup Stripe
```bash
npm install stripe
```

**Task 12.2**: Create PaymentService
```typescript
// backend/src/services/payment.service.ts
import Stripe from 'stripe';

export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  }

  async processPayoutToAffiliate(paymentRequest: any) {
    try {
      // Create Stripe Connect transfer
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(paymentRequest.amount * 100), // VND to cents
        currency: 'vnd',
        destination: paymentRequest.affiliate.stripeAccountId,
        description: `Affiliate payout for period ${paymentRequest.periodStart} - ${paymentRequest.periodEnd}`
      });

      // Update payment request
      await this.prisma.affPaymentRequest.update({
        where: { id: paymentRequest.id },
        data: {
          status: 'COMPLETED',
          transactionId: transfer.id,
          completedAt: new Date()
        }
      });

      return transfer;
    } catch (error) {
      // Mark as failed
      await this.prisma.affPaymentRequest.update({
        where: { id: paymentRequest.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          adminNotes: error.message
        }
      });

      throw error;
    }
  }

  async createConnectedAccount(affiliateUserId: string, email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: { requested: true }
      }
    });

    // Save to database
    await this.prisma.affUser.update({
      where: { id: affiliateUserId },
      data: { stripeAccountId: account.id }
    });

    return account;
  }
}
```

**Task 12.3**: Webhook Handler
```typescript
@Controller('webhooks/stripe')
export class StripeWebhookController {
  @Post()
  async handleWebhook(@Req() req: Request) {
    const sig = req.headers['stripe-signature'];
    const event = this.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'transfer.created':
        // Handle successful transfer
        break;
      case 'transfer.failed':
        // Handle failed transfer
        break;
    }

    return { received: true };
  }
}
```

**Deliverables**:
- [ ] Stripe integration
- [ ] Payout processing
- [ ] Webhook handling
- [ ] Error recovery
- [ ] Test mode working

---

#### Day 27-28: Payment UI

**Task 13.1**: Stripe Connect Onboarding
```tsx
// Components for connecting Stripe account
<Button onClick={connectStripe}>
  Connect Stripe Account
</Button>
```

**Task 13.2**: Payment Dashboard
- Balance display
- Payout history
- Transaction details
- Invoice download

**Deliverables**:
- [ ] Stripe Connect UI
- [ ] Balance display
- [ ] Payout history
- [ ] Invoice generation

---

### Week 9-10: Scalability & Performance

#### Day 29-32: Redis Caching

**Task 14.1**: Setup Redis
```bash
npm install @nestjs/cache-manager cache-manager-redis-yet
```

**Task 14.2**: Cache Dashboard Stats
```typescript
// backend/src/services/affiliate-stats.service.ts
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export class AffiliateStatsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService
  ) {}

  async getDashboardStats(affiliateId: string) {
    const cacheKey = `affiliate:stats:${affiliateId}`;
    
    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Calculate stats
    const stats = {
      totalClicks: await this.prisma.affClick.count({
        where: { link: { affiliateId } }
      }),
      totalConversions: await this.prisma.affConversion.count({
        where: { affiliateId, status: 'APPROVED' }
      }),
      totalEarnings: await this.prisma.affConversion.aggregate({
        where: { affiliateId, status: 'APPROVED' },
        _sum: { commission: true }
      }),
      // ... more stats
    };

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, stats, 300);
    
    return stats;
  }
}
```

**Deliverables**:
- [ ] Redis configured
- [ ] Dashboard stats cached
- [ ] Campaign list cached
- [ ] Cache invalidation logic

---

#### Day 33-36: Background Jobs

**Task 15.1**: Setup BullMQ
```bash
npm install @nestjs/bullmq bullmq
```

**Task 15.2**: Create Job Queues
```typescript
// backend/src/queues/affiliate.queue.ts
import { Queue } from 'bullmq';

export const affiliateQueue = new Queue('affiliate', {
  connection: {
    host: 'localhost',
    port: 6379
  }
});

// Add jobs
await affiliateQueue.add('process-conversions', {
  periodStart: startDate,
  periodEnd: endDate
});

await affiliateQueue.add('calculate-payouts', {
  affiliateId
});
```

**Task 15.3**: Create Workers
```typescript
// backend/src/workers/affiliate.worker.ts
import { Worker } from 'bullmq';

const worker = new Worker('affiliate', async (job) => {
  switch (job.name) {
    case 'process-conversions':
      // Batch process pending conversions
      break;
    case 'calculate-payouts':
      // Calculate affiliate payouts
      break;
  }
});
```

**Use Cases**:
- Batch process conversions (nightly)
- Calculate affiliate payouts (weekly)
- Send email notifications (async)
- Generate reports (on-demand)

**Deliverables**:
- [ ] BullMQ configured
- [ ] 4 job types implemented
- [ ] Workers running
- [ ] Job monitoring dashboard

---

### Week 11: Security & Fraud Detection

#### Day 37-39: Basic Fraud Detection

**Task 16.1**: Click Fraud Detection
```typescript
async trackClick(data: ClickData) {
  // 1. Check IP-based rate limiting
  const recentClicks = await this.prisma.affClick.count({
    where: {
      ipAddress: data.ipAddress,
      clickedAt: { gte: new Date(Date.now() - 3600000) } // 1 hour
    }
  });

  if (recentClicks > 20) {
    this.logger.warn(`Possible click fraud: ${data.ipAddress} - ${recentClicks} clicks/hour`);
    // Still record but flag for review
    data.fraudScore = 0.8;
  }

  // 2. Check user agent
  if (!data.userAgent || data.userAgent.includes('bot')) {
    data.fraudScore = 0.9;
  }

  // 3. Check referer
  if (!data.referer) {
    data.fraudScore = (data.fraudScore || 0) + 0.1;
  }

  // Record click
  return this.prisma.affClick.create({ data });
}
```

**Task 16.2**: Conversion Validation
```typescript
async validateConversion(conversion: any) {
  // Check conversion time (too fast = suspicious)
  const click = await this.prisma.affClick.findFirst({
    where: {
      linkId: conversion.linkId,
      clickedAt: { gte: new Date(Date.now() - 30 * 24 * 3600000) } // 30 days
    },
    orderBy: { clickedAt: 'desc' }
  });

  if (!click) {
    throw new Error('No matching click found for conversion');
  }

  const timeDiff = new Date(conversion.convertedAt).getTime() - new Date(click.clickedAt).getTime();
  if (timeDiff < 60000) { // < 1 minute
    conversion.fraudScore = 0.7;
    conversion.notes = 'Conversion too fast after click';
  }

  return conversion;
}
```

**Deliverables**:
- [ ] Click rate limiting
- [ ] Bot detection
- [ ] Conversion validation
- [ ] Fraud reporting

---

#### Day 40-42: Security Hardening

**Task 17.1**: Rate Limiting
```typescript
// Add rate limiting to tracking endpoint
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('track')
@UseGuards(ThrottlerGuard)
export class TrackingController {
  // Max 100 requests per minute per IP
}
```

**Task 17.2**: Input Sanitization
```typescript
import { sanitize } from 'class-sanitizer';

@InputType()
export class CreateCampaignInput {
  @Field()
  @Sanitize() // XSS protection
  name: string;
}
```

**Task 17.3**: HTTPS Enforcement
```typescript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

**Deliverables**:
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] HTTPS enforcement
- [ ] Security headers (Helmet)

---

### Week 12: Documentation & Launch

#### Day 43-45: Documentation

**Task 18.1**: API Documentation
```bash
# Generate Swagger/OpenAPI docs
npm install @nestjs/swagger
```

**Task 18.2**: User Guides
- Merchant guide (how to create campaigns)
- Affiliate guide (how to join and promote)
- Admin guide (how to manage system)

**Task 18.3**: Developer Docs
- Architecture overview
- Database schema
- API reference
- Deployment guide

**Deliverables**:
- [ ] Swagger API docs
- [ ] User guides (3 PDFs)
- [ ] Developer docs
- [ ] Video tutorials (optional)

---

#### Day 46-48: Performance Testing

**Task 19.1**: Load Testing
```bash
# Use k6 for load testing
npm install -g k6

# Test click tracking
k6 run --vus 100 --duration 30s load-tests/click-tracking.js
```

**Task 19.2**: Database Optimization
- Analyze slow queries
- Add missing indexes
- Optimize N+1 queries

**Task 19.3**: Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

**Deliverables**:
- [ ] Load test results
- [ ] Performance report
- [ ] Optimization applied
- [ ] Benchmarks documented

---

#### Day 49-50: Staging Deployment

**Task 20.1**: Deploy to Staging
```bash
# Docker compose for staging
docker-compose -f docker-compose.staging.yml up -d
```

**Task 20.2**: End-to-End Testing on Staging
- Full workflow test
- Payment test (test mode)
- Load test
- Security scan

**Task 20.3**: Final Review
- Code review
- Security audit
- Performance check
- Documentation review

**Deliverables**:
- [ ] Staging environment
- [ ] E2E tests passing
- [ ] Load test passing
- [ ] Ready for production

---

#### Day 51-56: Production Launch

**Task 21.1**: Production Deployment
```bash
# Deploy to production
./deploy-production.sh
```

**Task 21.2**: Post-Launch Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic/DataDog)
- Business metrics (Mixpanel/Amplitude)
- Alerting (PagerDuty)

**Task 21.3**: Soft Launch
- Enable for 10% of users
- Monitor for issues
- Gradually increase to 100%

**Deliverables**:
- [ ] Production deployment
- [ ] Monitoring dashboards
- [ ] Alerts configured
- [ ] Launch completed

---

## 📊 Success Metrics

### Phase 1 Success (Week 2)
- ✅ Click tracking endpoint live
- ✅ First conversion recorded
- ✅ Affiliate joined campaign
- ✅ All 4 blockers resolved

### Phase 2 Success (Week 6)
- ✅ 60%+ test coverage
- ✅ All validation working
- ✅ Logging/monitoring active
- ✅ CI/CD pipeline green

### Phase 3 Success (Week 12)
- ✅ Payment integration live
- ✅ 100+ affiliates onboarded
- ✅ 1,000+ clicks tracked
- ✅ Production deployment stable

---

## 💰 Resource Requirements

### Team
- **Backend Developer**: 12 weeks full-time
- **Frontend Developer**: 8 weeks full-time
- **DevOps Engineer**: 4 weeks part-time
- **QA Engineer**: 2 weeks part-time

### Infrastructure
- Redis server (caching)
- BullMQ (job processing)
- Sentry (error tracking)
- Monitoring (New Relic/DataDog)

### Third-party
- Stripe account (payment processing)
- Email service (SendGrid)
- CDN (Cloudflare) - optional

---

## 🎯 Risk Mitigation

### Technical Risks
- **Database performance**: Add indexes, implement caching
- **Click fraud**: Implement basic detection, manual review
- **Payment failures**: Retry logic, manual fallback

### Business Risks
- **Low adoption**: Marketing campaigns, incentives
- **High fraud rate**: Stricter validation, manual review
- **Payment disputes**: Clear terms, dispute process

---

## ✅ Definition of Done

### Feature Complete
- [ ] All 10 core features working
- [ ] All blockers resolved
- [ ] No critical bugs

### Quality
- [ ] 60%+ test coverage
- [ ] All tests passing
- [ ] Security audit passed

### Production Ready
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Staging deployment successful
- [ ] Load test passed (1000 req/s)

### Launch
- [ ] Production deployment
- [ ] 10+ affiliates onboarded
- [ ] First payout completed
- [ ] Team trained

---

## 📅 Timeline Summary

```
Week 1-2:   Fix Critical Blockers ━━━━━━━━━━━━━━━━━━━━━━━━ 🔴 URGENT
Week 3-6:   Quality & Testing     ━━━━━━━━━━━━━━━━━━━━━━━━ 🟡 HIGH
Week 7-8:   Payment Integration   ━━━━━━━━━━━━━━━━━━━━━━━━ 🟡 HIGH
Week 9-10:  Scalability           ━━━━━━━━━━━━━━━━━━━━━━━━ 🟢 MEDIUM
Week 11:    Security              ━━━━━━━━━━━━━━━━━━━━━━━━ 🟡 HIGH
Week 12:    Documentation & Launch━━━━━━━━━━━━━━━━━━━━━━━━ 🟢 MEDIUM

Total: 12 weeks (3 months)
```

---

## 🚀 Quick Start (Week 1 Day 1)

```bash
# 1. Create tracking controller
cd backend/src/controllers
touch tracking.controller.ts

# 2. Implement click tracking
# (Copy implementation from Task 1.1 above)

# 3. Register controller
# Edit backend/src/graphql/graphql.module.ts

# 4. Test
curl http://localhost:14000/track/click/TEST123

# 5. Verify cookie set
# Check browser DevTools → Application → Cookies

# 6. Move to next task
```

---

**Plan Version**: 1.0  
**Created**: 2025-10-18  
**Status**: Ready to Execute  
**Next Review**: After Week 2 (Phase 1 Complete)
