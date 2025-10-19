# 🎨 Affiliate System - Architecture Diagrams

## 1. Current System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │  Campaigns   │  │    Links     │     │
│  │  Component   │  │  Management  │  │  Management  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                          │
│  │  Payments    │                                          │
│  │  Management  │  Total: 2,155 lines                      │
│  └──────────────┘                                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ GraphQL (Apollo Client)
               │ 7 Queries + 4 Mutations
               ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (NestJS + GraphQL)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              GraphQL Layer (1,263 lines)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │  Types   │  │  Inputs  │  │Resolvers │          │  │
│  │  │(Models)  │  │          │  │          │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └─────────────┬────────────────────────────────────────┘  │
│                ↓                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Service Layer (1,436 lines)                │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ Affiliate    │  │ Affiliate    │                 │  │
│  │  │ User Service │  │ Campaign Svc │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ Tracking Svc │  │ Payment Svc  │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └─────────────┬────────────────────────────────────────┘  │
│                ↓                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Prisma ORM                           │  │
│  └─────────────┬────────────────────────────────────────┘  │
└────────────────┼────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
├─────────────────────────────────────────────────────────────┤
│  aff_users (18 fields)                                      │
│  aff_campaigns (24 fields)                                  │
│  aff_campaign_affiliates (12 fields)                        │
│  aff_links (19 fields)                                      │
│  aff_clicks (11 fields)                                     │
│  aff_conversions (19 fields)                                │
│  aff_payment_requests (17 fields)                           │
│                                                             │
│  Total: 7 tables, 120+ fields                               │
└─────────────────────────────────────────────────────────────┘
```

## 2. Data Flow - Current Implementation

### 2.1. Campaign Creation (✅ Working)

```
┌────────┐                ┌────────┐                ┌────────┐
│Merchant│                │ Backend│                │Database│
└───┬────┘                └────┬───┘                └────┬───┘
    │                          │                         │
    │ 1. Fill campaign form    │                         │
    ├─────────────────────────>│                         │
    │   createAffiliateCampaign│                         │
    │                          │                         │
    │                          │ 2. Validate input       │
    │                          │                         │
    │                          │ 3. INSERT INTO          │
    │                          │    aff_campaigns        │
    │                          ├────────────────────────>│
    │                          │                         │
    │                          │ 4. Return campaign      │
    │                          │<────────────────────────┤
    │                          │                         │
    │ 5. Campaign created      │                         │
    │<─────────────────────────┤                         │
    │   with ID                │                         │
    │                          │                         │
```

### 2.2. Join Campaign (🔴 Broken - Missing Integration)

```
┌─────────┐              ┌────────┐              ┌────────┐
│Affiliate│              │ Backend│              │Database│
└────┬────┘              └────┬───┘              └────┬───┘
     │                        │                       │
     │ 1. Browse campaigns    │                       │
     │   (✅ Works)           │                       │
     ├───────────────────────>│                       │
     │                        │                       │
     │ 2. Click "Join"        │                       │
     │   (❌ Not Implemented) │                       │
     │   X──────────────────> │                       │
     │                        │                       │
     │                    ❌ Missing:                 │
     │                    - GraphQL mutation          │
     │                    - Frontend component        │
     │                    - Approval workflow         │
     │                        │                       │
```

**Fix Required**:
```typescript
// 1. Add mutation in resolver
@Mutation(() => AffCampaignAffiliate)
async joinCampaign(@Args('input') input: JoinCampaignInput) {
  return this.campaignService.joinCampaign(input);
}

// 2. Add frontend button
<Button onClick={() => joinCampaign(campaignId)}>
  Join Campaign
</Button>
```

### 2.3. Click Tracking (🔴 Completely Missing)

```
┌────────┐              ┌────────┐              ┌────────┐
│ Visitor│              │ Backend│              │Database│
└────┬───┘              └────┬───┘              └────┬───┘
     │                       │                       │
     │ 1. Click affiliate    │                       │
     │    link               │                       │
     │   ❌ No endpoint      │                       │
     │   X──────────────────>│                       │
     │                       │                       │
     │              Should be:                       │
     │   GET /track/click/ABC123                     │
     │                       │                       │
     │                       │ 2. Find link          │
     │                       │    by tracking code   │
     │                       ├──────────────────────>│
     │                       │                       │
     │                       │ 3. INSERT click       │
     │                       ├──────────────────────>│
     │                       │                       │
     │                       │ 4. Set cookie         │
     │                       │    aff_ref=ABC123     │
     │                       │                       │
     │ 5. 302 Redirect       │                       │
     │    to product URL     │                       │
     │<──────────────────────┤                       │
     │                       │                       │
```

**Fix Required**:
```typescript
// backend/src/controllers/tracking.controller.ts
@Controller('track')
export class TrackingController {
  
  @Get('click/:trackingCode')
  async trackClick(
    @Param('trackingCode') code: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    // 1. Find link
    const link = await this.trackingService.findLink(code);
    
    // 2. Record click
    await this.trackingService.trackClick({
      linkId: link.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer']
    });
    
    // 3. Set cookie (30 days)
    res.cookie('aff_ref', code, { 
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true 
    });
    
    // 4. Redirect
    return res.redirect(302, link.originalUrl);
  }
}
```

### 2.4. Conversion Tracking (🔴 Missing Integration)

```
┌─────────┐            ┌─────────┐            ┌─────────┐
│  Order  │            │ Backend │            │Database │
│ Service │            │         │            │         │
└────┬────┘            └────┬────┘            └────┬────┘
     │                      │                      │
     │ 1. Order completed   │                      │
     │                      │                      │
     │ 2. Check aff cookie  │                      │
     │    (❌ Not doing)    │                      │
     │                      │                      │
     │              Should add:                    │
     │   const affRef = req.cookies['aff_ref'];    │
     │   if (affRef) {                             │
     │     recordConversion(...)                   │
     │   }                                         │
     │                      │                      │
     │                      │ 3. Find link         │
     │                      ├─────────────────────>│
     │                      │                      │
     │                      │ 4. Calculate         │
     │                      │    commission        │
     │                      │                      │
     │                      │ 5. INSERT            │
     │                      │    aff_conversions   │
     │                      ├─────────────────────>│
     │                      │                      │
     │                      │ 6. Update totals     │
     │                      ├─────────────────────>│
     │                      │                      │
```

**Fix Required**:
```typescript
// In order.service.ts or similar
async completeOrder(orderId: string, req: Request) {
  // ...existing order logic...
  
  // NEW: Check affiliate tracking
  const affRef = req.cookies?.['aff_ref'];
  if (affRef) {
    const link = await this.prisma.affLink.findUnique({
      where: { trackingCode: affRef },
      include: { campaign: true, affiliate: true }
    });
    
    if (link && link.campaign.status === 'ACTIVE') {
      // Calculate commission
      const commission = this.calculateCommission(
        link.campaign, 
        order.total
      );
      
      // Record conversion
      await this.prisma.affConversion.create({
        data: {
          linkId: link.id,
          campaignId: link.campaignId,
          affiliateId: link.affiliateId,
          orderId: order.id,
          saleAmount: order.total,
          commission,
          status: 'PENDING'
        }
      });
      
      // Update link stats
      await this.prisma.affLink.update({
        where: { id: link.id },
        data: {
          totalConversions: { increment: 1 },
          totalEarnings: { increment: commission }
        }
      });
    }
  }
}
```

## 3. Complete Workflow (Target State)

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLETE AFFILIATE FLOW                  │
└─────────────────────────────────────────────────────────────┘

Step 1: Merchant Creates Campaign
┌──────────┐
│ Merchant │──> Create Campaign ──> ✅ WORKING
└──────────┘

Step 2: Affiliate Joins
┌──────────┐
│Affiliate │──> Browse & Join ──> 🔴 MISSING MUTATION
└──────────┘

Step 3: Merchant Approves
┌──────────┐
│ Merchant │──> Review & Approve ──> 🔴 MISSING UI
└──────────┘

Step 4: Affiliate Gets Link
┌──────────┐
│Affiliate │──> Generate Link ──> ✅ WORKING
└──────────┘

Step 5: Share & Track
┌──────────┐
│Affiliate │──> Share Link ──┐
└──────────┘                 │
                             ↓
                   ┌──────────────────┐
                   │  Visitor Clicks  │──> 🔴 NO ENDPOINT
                   └──────────────────┘

Step 6: Conversion
┌──────────┐
│ Visitor  │──> Makes Purchase ──> 🔴 NO INTEGRATION
└──────────┘

Step 7: Commission
┌──────────┐
│ System   │──> Calculate ──> ⚠️ PARTIAL (no approve)
└──────────┘

Step 8: Payment
┌──────────┐
│Affiliate │──> Request Payment ──> ✅ WORKING
└──────────┘
             
┌──────────┐
│ Admin    │──> Process Payment ──> 🔴 NO GATEWAY
└──────────┘
```

## 4. Database Schema Diagram

```
┌───────────────────────┐
│       AffUser         │
│  (Affiliate Profile)  │
├───────────────────────┤
│ id (PK)               │
│ userId (FK -> User)   │
│ role (enum)           │◄────┐
│ companyName           │     │
│ paymentMethod         │     │
│ ...                   │     │
└───────────────────────┘     │
         │                    │
         │ creates            │ belongs to
         │                    │
         ↓                    │
┌───────────────────────┐     │
│     AffCampaign       │     │
│   (Campaign Info)     │     │
├───────────────────────┤     │
│ id (PK)               │     │
│ name                  │     │
│ commissionRate        │     │
│ status (enum)         │     │
│ creatorId (FK)        │─────┘
│ ...                   │
└───────────────────────┘
         │
         │ has many
         │
         ↓
┌───────────────────────┐
│ AffCampaignAffiliate  │
│   (Join Table)        │
├───────────────────────┤
│ id (PK)               │
│ campaignId (FK)       │
│ affiliateId (FK)      │
│ status (pending/      │
│        approved)      │
│ totalEarnings         │
└───────────────────────┘
         │
         │ affiliate creates
         │
         ↓
┌───────────────────────┐
│       AffLink         │
│   (Tracking Link)     │
├───────────────────────┤
│ id (PK)               │
│ trackingCode (UQ)     │◄────┐
│ originalUrl           │     │
│ campaignId (FK)       │     │
│ affiliateId (FK)      │     │ references
│ totalClicks           │     │
└───────────────────────┘     │
         │                    │
         │ generates          │
         │                    │
         ↓                    │
┌───────────────────────┐     │
│       AffClick        │     │
│    (Click Event)      │     │
├───────────────────────┤     │
│ id (PK)               │     │
│ linkId (FK)           │─────┘
│ ipAddress             │
│ userAgent             │
│ country, city         │
│ clickedAt             │
└───────────────────────┘

┌───────────────────────┐
│    AffConversion      │
│ (Sale/Commission)     │
├───────────────────────┤
│ id (PK)               │
│ linkId (FK)           │
│ campaignId (FK)       │
│ affiliateId (FK)      │
│ orderId               │
│ saleAmount            │
│ commission            │
│ status (enum)         │
└───────────────────────┘
         │
         │ aggregates to
         │
         ↓
┌───────────────────────┐
│  AffPaymentRequest    │
│  (Payout Request)     │
├───────────────────────┤
│ id (PK)               │
│ affiliateId (FK)      │
│ amount                │
│ status (enum)         │
│ paymentMethod         │
│ periodStart           │
│ periodEnd             │
└───────────────────────┘
```

## 5. GraphQL API Map

### Queries (7)
```graphql
query GetProfile {
  affiliateUser {              # ✅ Get current user profile
    id, role, companyName
  }
}

query GetCampaign {
  affiliateCampaign(id: "...") # ✅ Get single campaign
}

query SearchCampaigns {
  affiliateCampaigns(search: { # ✅ Search with filters
    status: ACTIVE
    creatorId: "..."
  })
}

query GetLinks {
  affiliateLinks(search: {     # ✅ Get tracking links
    campaignId: "..."
  })
}

query GetConversions {
  affiliateConversions(search: { # ✅ Get conversions
    affiliateId: "..."
    status: APPROVED
  })
}

query GetPayments {
  affiliatePaymentRequests(    # ✅ Get payment requests
    search: { status: PENDING }
  )
}

query GetEarnings {
  affiliateEarningsReport(     # ✅ Earnings report
    startDate: "2024-01-01"
    endDate: "2024-12-31"
  )
}
```

### Mutations (4 + 4 Missing)
```graphql
# ✅ Existing
mutation CreateProfile {
  createAffiliateUser(input: { role: AFFILIATE })
}

mutation CreateCampaign {
  createAffiliateCampaign(input: { name: "..." })
}

mutation CreateLink {
  createAffiliateLink(input: { campaignId: "..." })
}

mutation RequestPayment {
  createPaymentRequest(input: { amount: 1000 })
}

# ❌ Missing but needed
mutation JoinCampaign {
  joinCampaign(input: { campaignId: "..." })
}

mutation ReviewApplication {
  reviewApplication(input: { 
    applicationId: "..."
    status: APPROVED
  })
}

mutation UpdateCampaign {
  updateCampaign(id: "...", input: { ... })
}

mutation ProcessPayment {
  processPayment(id: "...")
}
```

## 6. Component Tree (Frontend)

```
app/admin/affiliate/
├── layout.tsx
│   └── Sidebar Navigation
│       ├── Dashboard
│       ├── Campaigns
│       ├── Links
│       └── Payments
│
├── page.tsx (Landing)
│   └── Overview Cards
│
├── dashboard/page.tsx
│   └── <AffiliateDashboard />
│       ├── Stats Cards
│       │   ├── Total Clicks
│       │   ├── Conversions
│       │   └── Earnings
│       ├── Performance Chart
│       └── Recent Activity
│
├── campaigns/page.tsx
│   └── <CampaignManagement />
│       ├── Filters & Search
│       ├── Campaign Cards/Table
│       │   └── For each campaign:
│       │       ├── Name, Status
│       │       ├── Commission Rate
│       │       ├── Performance Stats
│       │       └── Actions (Edit, View)
│       └── Create Campaign Modal
│           └── Form (name, product, commission)
│
├── links/page.tsx
│   └── <LinkManagement />
│       ├── Link Generator
│       │   └── Form (campaign, UTM params)
│       ├── Links Table
│       │   └── For each link:
│       │       ├── Tracking Code
│       │       ├── Short URL
│       │       ├── Stats (clicks, conversions)
│       │       └── Actions (Copy, QR, Stats)
│       └── Link Analytics Modal
│
└── payments/page.tsx
    └── <PaymentManagement />
        ├── Balance Summary
        ├── Request Payment Form
        ├── Payment History Table
        │   └── For each payment:
        │       ├── Amount, Status
        │       ├── Period
        │       └── Transaction ID
        └── Invoice Download
```

---

## Legend

```
✅ = Working / Implemented
⚠️ = Partial / Needs improvement
🔴 = Missing / Broken / Blocker
❌ = Not implemented

Status Colors:
🟢 = Good (8-10/10)
🟡 = Needs Work (6-7/10)
🔴 = Critical (0-5/10)
```

---

**Diagrams Version**: 1.0  
**Created**: 2025-10-18  
**Format**: ASCII Art for documentation
