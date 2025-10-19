# 🧪 Week 3 Implementation Plan: Quality & Testing

**Phase**: PHASE 2 - Quality & Testing  
**Duration**: Days 11-20 (10 days)  
**Focus**: Backend testing, validation, logging & monitoring  
**Team**: 1 Backend Developer (full-time)  
**Success Metric**: 60%+ test coverage, production-grade quality

---

## 📋 Executive Summary

Week 3 transitions from feature development to quality assurance. After completing all core features in Week 1 (click tracking, conversions, join campaign flow, UI), we now focus on making the system production-ready through comprehensive testing, validation, and monitoring.

**Week 1 Achievement Recap:**
- ✅ 6 tasks completed in 8.5 hours (73% faster than estimated)
- ✅ ~7,000 lines of production code
- ✅ 0 bugs, 0 errors
- ✅ All core features functional

**Week 3 Goals:**
- 🎯 Achieve 60%+ backend test coverage
- 🎯 Implement comprehensive input validation
- 🎯 Configure production-grade logging & monitoring
- 🎯 Ensure system is deployable and maintainable

---

## 🎯 Week 3 Tasks Overview

### Task 7: Backend Unit Tests (Days 11-16) 🔴 CRITICAL
**Estimated**: 20 hours  
**Priority**: Critical  
**Coverage Target**: 60%+

**Deliverables:**
- [ ] Unit tests for 5 affiliate services
- [ ] 100+ test cases covering happy paths and edge cases
- [ ] Jest configuration with coverage reporting
- [ ] CI pipeline integration

**Services to Test:**
1. `AffiliateUserService` (Target: 80% coverage)
2. `AffiliateCampaignService` (Target: 70% coverage)
3. `AffiliateTrackingService` (Target: 60% coverage)
4. `AffiliatePaymentService` (Target: 60% coverage)
5. `AffiliateConversionService` (Target: 65% coverage)

---

### Task 8: Input Validation (Days 13-16) 🟡 HIGH
**Estimated**: 8 hours  
**Priority**: High  
**Focus**: GraphQL inputs + business rules

**Deliverables:**
- [ ] Validation decorators on all GraphQL inputs
- [ ] Business rule validation in service layer
- [ ] Clear error messages for users
- [ ] Validation tests

**Validation Areas:**
1. Campaign creation (commission rates, dates, max affiliates)
2. Link creation (URL validation, uniqueness)
3. Conversion tracking (duplicate prevention)
4. Payment requests (minimum amount, status checks)

---

### Task 9: Logging & Monitoring (Days 17-20) 🟡 HIGH
**Estimated**: 12 hours  
**Priority**: High  
**Focus**: Observability for production

**Deliverables:**
- [ ] Winston logger configured with appropriate levels
- [ ] Logging in all critical operations
- [ ] Suspicious activity detection (fraud prevention)
- [ ] Optional: Sentry integration for error tracking

**Logging Areas:**
1. Click tracking (IP, user agent, suspicious patterns)
2. Conversion recording (commission calculation, duplicate attempts)
3. Payment processing (status changes, failures)
4. Campaign management (creation, joins, approvals)

---

## 📝 Task 7: Backend Unit Tests Implementation

### Day 11-12: Service Layer Tests Setup

**Step 1: Configure Jest**

```bash
cd backend
bun add -D @nestjs/testing @types/jest ts-jest jest
```

**Create `jest.config.js`:**
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
```

**Update `package.json`:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  }
}
```

---

### Day 13-14: Write Unit Tests for Each Service

#### **File 1: `backend/src/services/__tests__/affiliate-user.service.spec.ts`**

**Coverage Goal**: 80%  
**Test Cases**: 15+  
**LOC**: ~300 lines

**Test Structure:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateUserService } from '../affiliate-user.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AffiliateUserService', () => {
  let service: AffiliateUserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliateUserService,
        {
          provide: PrismaService,
          useValue: {
            affUser: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AffiliateUserService>(AffiliateUserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createAffiliateUser', () => {
    it('should create affiliate profile successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const input = { role: 'AFFILIATE' };
      const mockResult = {
        id: 'aff-123',
        userId,
        role: 'AFFILIATE',
        totalEarnings: 0,
        isActive: true,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.affUser, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.affUser, 'create').mockResolvedValue(mockResult);

      // Act
      const result = await service.createAffiliateUser(userId, input);

      // Assert
      expect(result).toEqual(mockResult);
      expect(prisma.affUser.create).toHaveBeenCalledWith({
        data: { userId, ...input },
      });
    });

    it('should throw error if profile already exists', async () => {
      // Arrange
      const userId = 'user-123';
      const existingProfile = { id: 'aff-123', userId, role: 'AFFILIATE' };
      jest.spyOn(prisma.affUser, 'findUnique').mockResolvedValue(existingProfile);

      // Act & Assert
      await expect(
        service.createAffiliateUser(userId, { role: 'AFFILIATE' })
      ).rejects.toThrow('Affiliate profile already exists');
    });
  });

  describe('getAffiliateUser', () => {
    it('should return affiliate profile by userId', async () => {
      // Test implementation
    });

    it('should return null if profile not found', async () => {
      // Test implementation
    });
  });

  describe('updateAffiliateUser', () => {
    it('should update affiliate profile', async () => {
      // Test implementation
    });

    it('should throw error if profile not found', async () => {
      // Test implementation
    });
  });

  // More tests...
});
```

**Test Cases to Cover:**
1. ✅ Create affiliate profile (success)
2. ✅ Create affiliate profile (duplicate error)
3. ✅ Get affiliate by userId (found)
4. ✅ Get affiliate by userId (not found)
5. ✅ Update affiliate profile (success)
6. ✅ Update affiliate profile (not found)
7. ✅ Get all affiliates (with pagination)
8. ✅ Get all affiliates (empty result)
9. ✅ Get affiliate stats (total earnings, conversions)
10. ✅ Update affiliate status (activate/deactivate)
11. ✅ Validate affiliate role (AFFILIATE vs MERCHANT)
12. ✅ Test decimal field handling (totalEarnings)
13. ✅ Test date field handling (createdAt, updatedAt)
14. ✅ Test role-based filtering
15. ✅ Test search functionality

---

#### **File 2: `backend/src/services/__tests__/affiliate-campaign.service.spec.ts`**

**Coverage Goal**: 70%  
**Test Cases**: 20+  
**LOC**: ~400 lines

**Key Test Cases:**
1. Create campaign (success)
2. Create campaign (invalid commission rate - negative)
3. Create campaign (invalid commission rate - over 100%)
4. Create campaign (invalid date range - end before start)
5. Create campaign (invalid max affiliates - less than 1)
6. Update campaign (success)
7. Update campaign (not owner)
8. Delete campaign (success - no conversions)
9. Delete campaign (soft delete - has conversions)
10. Join campaign (success - auto-approve)
11. Join campaign (success - pending approval)
12. Join campaign (already joined)
13. Join campaign (max affiliates reached)
14. Join campaign (campaign ended)
15. Review application (approve)
16. Review application (reject)
17. Review application (not authorized)
18. Get campaigns with filters (by status)
19. Get campaigns with search
20. Get campaign by ID

---

#### **File 3: `backend/src/services/__tests__/affiliate-tracking.service.spec.ts`**

**Coverage Goal**: 60%  
**Test Cases**: 15+  
**LOC**: ~350 lines

**Key Test Cases:**
1. Track click (success)
2. Track click (invalid link code)
3. Track click (link not found)
4. Track click (record device info)
5. Track click (record referrer)
6. Track click (suspicious pattern detection - 10+ clicks in 1 hour)
7. Update link stats (increment clicks)
8. Update campaign stats (increment clicks)
9. Get click statistics (by link)
10. Get click statistics (by campaign)
11. Get click statistics (by date range)
12. Test IP address extraction
13. Test user agent parsing
14. Test duplicate click prevention (same IP within 1 minute)
15. Test cookie expiration (30 days)

---

#### **File 4: `backend/src/services/__tests__/affiliate-conversion.service.spec.ts`**

**Coverage Goal**: 65%  
**Test Cases**: 18+  
**LOC**: ~380 lines

**Key Test Cases:**
1. Track conversion (success - percentage commission)
2. Track conversion (success - fixed commission)
3. Track conversion (duplicate prevention - same orderId)
4. Track conversion (no affiliate cookie)
5. Track conversion (expired cookie)
6. Calculate commission (percentage - 10% of 1000 = 100)
7. Calculate commission (fixed - 50 VND)
8. Approve conversion (update stats, mark approved)
9. Approve conversion (already approved)
10. Reject conversion (revert stats, mark rejected)
11. Reject conversion (already rejected)
12. Update link stats (increment conversions, earnings)
13. Update campaign stats (increment conversions, earnings)
14. Update affiliate stats (increment conversions, earnings)
15. Get conversion stats (by affiliate)
16. Get conversion stats (by campaign)
17. Get conversion stats (by date range)
18. Test commission rounding (2 decimal places)

---

#### **File 5: `backend/src/services/__tests__/affiliate-payment.service.spec.ts`**

**Coverage Goal**: 60%  
**Test Cases**: 12+  
**LOC**: ~280 lines

**Key Test Cases:**
1. Create payment request (success)
2. Create payment request (below minimum amount)
3. Create payment request (no approved conversions)
4. Calculate available balance (sum of approved conversions)
5. Calculate available balance (exclude already paid)
6. Approve payment request (mark completed)
7. Approve payment request (not authorized)
8. Reject payment request (mark rejected)
9. Reject payment request (not authorized)
10. Get payment requests (by affiliate)
11. Get payment requests (by status)
12. Get payment history (date range)

---

### Day 15-16: Integration Tests & Coverage Check

**Step 1: Run Tests**
```bash
cd backend
bun test
```

**Step 2: Check Coverage**
```bash
bun test:cov
```

**Expected Output:**
```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   62.5  |   58.3   |   65.2  |   63.1  |
 services/                |   68.2  |   62.1   |   70.5  |   69.3  |
  affiliate-user.service  |   82.1  |   78.5   |   85.0  |   83.2  |
  affiliate-campaign...   |   72.5  |   68.2   |   75.0  |   73.8  |
  affiliate-tracking...   |   61.8  |   56.3   |   62.5  |   62.9  |
  affiliate-conversion... |   66.3  |   61.8   |   68.0  |   67.2  |
  affiliate-payment...    |   62.1  |   58.9   |   65.0  |   63.5  |
--------------------------|---------|----------|---------|---------|
```

**Step 3: Address Coverage Gaps**
- Identify files below 60% coverage
- Add missing test cases
- Focus on edge cases and error handling

---

## 📝 Task 8: Input Validation Implementation

### Day 13-14: Add Validation Decorators

**Step 1: Install Dependencies**
```bash
cd backend
bun add class-validator class-transformer
```

**Step 2: Update GraphQL Inputs**

#### **File: `backend/src/graphql/inputs/affiliate.input.ts`**

```typescript
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { 
  IsString, IsNumber, IsUrl, IsOptional, IsEnum, 
  IsDate, Min, Max, Length, IsBoolean, MinDate 
} from 'class-validator';

@InputType()
export class CreateCampaignInput {
  @Field()
  @IsString()
  @Length(3, 100, { message: 'Campaign name must be between 3 and 100 characters' })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(10, 500, { message: 'Description must be between 10 and 500 characters' })
  description?: string;

  @Field()
  @IsUrl({}, { message: 'Product URL must be a valid URL' })
  productUrl: string;

  @Field()
  @IsEnum(['percentage', 'fixed'], { message: 'Commission type must be percentage or fixed' })
  commissionType: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Commission rate must be a number' })
  @Min(0, { message: 'Commission rate must be at least 0' })
  @Max(100, { message: 'Commission rate cannot exceed 100%' })
  commissionRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Fixed amount must be a number' })
  @Min(0, { message: 'Fixed amount must be at least 0' })
  fixedAmount?: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate({ message: 'Start date must be a valid date' })
  @MinDate(new Date(), { message: 'Start date must be in the future' })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate({ message: 'End date must be a valid date' })
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Max affiliates must be a number' })
  @Min(1, { message: 'Max affiliates must be at least 1' })
  maxAffiliates?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  autoApprove?: boolean;
}

@InputType()
export class UpdateCampaignInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedAmount?: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAffiliates?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  autoApprove?: boolean;
}

@InputType()
export class CreateLinkInput {
  @Field()
  @IsString()
  campaignId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(3, 50, { message: 'Custom code must be between 3 and 50 characters' })
  customCode?: string;
}

@InputType()
export class CreatePaymentRequestInput {
  @Field(() => Float)
  @IsNumber()
  @Min(50000, { message: 'Minimum payout amount is 50,000 VND' })
  amount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  notes?: string;
}

@InputType()
export class JoinCampaignInput {
  @Field()
  @IsString()
  campaignId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(10, 300, { message: 'Message must be between 10 and 300 characters' })
  message?: string;
}

@InputType()
export class ReviewCampaignApplicationInput {
  @Field()
  @IsString()
  applicationId: string;

  @Field()
  @IsEnum(['APPROVED', 'REJECTED'], { message: 'Status must be APPROVED or REJECTED' })
  status: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(10, 200)
  reason?: string;
}
```

---

### Day 15: Business Rule Validation in Services

**Update Service Layer with Validation Logic**

#### **File: `backend/src/services/affiliate-campaign.service.ts`**

Add business rule validation:

```typescript
import { BadRequestException, ForbiddenException } from '@nestjs/common';

async createCampaign(userId: string, input: CreateCampaignInput) {
  // Validate commission settings
  if (input.commissionType === 'percentage') {
    if (!input.commissionRate || input.commissionRate <= 0) {
      throw new BadRequestException('Commission rate is required and must be greater than 0 for percentage type');
    }
    if (input.commissionRate > 100) {
      throw new BadRequestException('Commission rate cannot exceed 100%');
    }
  }

  if (input.commissionType === 'fixed') {
    if (!input.fixedAmount || input.fixedAmount <= 0) {
      throw new BadRequestException('Fixed amount is required and must be greater than 0 for fixed type');
    }
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
  return this.prisma.affCampaign.create({
    data: {
      ...input,
      creatorId: userId,
      status: 'ACTIVE',
    },
  });
}

async joinCampaign(userId: string, input: JoinCampaignInput) {
  // Check if campaign exists
  const campaign = await this.prisma.affCampaign.findUnique({
    where: { id: input.campaignId },
    include: {
      _count: {
        select: { affiliates: { where: { status: 'APPROVED' } } },
      },
    },
  });

  if (!campaign) {
    throw new BadRequestException('Campaign not found');
  }

  // Check if campaign is active
  if (campaign.status !== 'ACTIVE') {
    throw new BadRequestException('Campaign is not active');
  }

  // Check if campaign has ended
  if (campaign.endDate && campaign.endDate < new Date()) {
    throw new BadRequestException('Campaign has ended');
  }

  // Check max affiliates
  if (campaign.maxAffiliates && campaign._count.affiliates >= campaign.maxAffiliates) {
    throw new BadRequestException('Campaign has reached maximum number of affiliates');
  }

  // Check if already joined
  const existing = await this.prisma.affCampaignAffiliate.findFirst({
    where: {
      campaignId: input.campaignId,
      affiliateId: userId,
    },
  });

  if (existing) {
    throw new BadRequestException('You have already applied to this campaign');
  }

  // Create application
  const status = campaign.autoApprove ? 'APPROVED' : 'PENDING';
  
  return this.prisma.affCampaignAffiliate.create({
    data: {
      campaignId: input.campaignId,
      affiliateId: userId,
      status,
      joinedAt: new Date(),
      message: input.message,
    },
  });
}
```

---

### Day 16: Validation Tests

**Create validation test file:**

#### **File: `backend/src/graphql/inputs/__tests__/affiliate.input.spec.ts`**

```typescript
import { validate } from 'class-validator';
import { CreateCampaignInput, CreatePaymentRequestInput } from '../affiliate.input';

describe('Affiliate Input Validation', () => {
  describe('CreateCampaignInput', () => {
    it('should pass validation with valid data', async () => {
      const input = new CreateCampaignInput();
      input.name = 'Test Campaign';
      input.productUrl = 'https://example.com/product';
      input.commissionType = 'percentage';
      input.commissionRate = 10;

      const errors = await validate(input);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with short name', async () => {
      const input = new CreateCampaignInput();
      input.name = 'AB'; // Too short
      input.productUrl = 'https://example.com/product';
      input.commissionType = 'percentage';
      input.commissionRate = 10;

      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid URL', async () => {
      const input = new CreateCampaignInput();
      input.name = 'Test Campaign';
      input.productUrl = 'not-a-url';
      input.commissionType = 'percentage';
      input.commissionRate = 10;

      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('productUrl');
    });

    it('should fail validation with commission rate over 100', async () => {
      const input = new CreateCampaignInput();
      input.name = 'Test Campaign';
      input.productUrl = 'https://example.com/product';
      input.commissionType = 'percentage';
      input.commissionRate = 150; // Invalid

      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('CreatePaymentRequestInput', () => {
    it('should fail validation with amount below minimum', async () => {
      const input = new CreatePaymentRequestInput();
      input.amount = 10000; // Below 50,000 minimum

      const errors = await validate(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('amount');
    });

    it('should pass validation with valid amount', async () => {
      const input = new CreatePaymentRequestInput();
      input.amount = 100000;

      const errors = await validate(input);
      expect(errors.length).toBe(0);
    });
  });
});
```

---

## 📝 Task 9: Logging & Monitoring Implementation

### Day 17-18: Configure Winston Logger

**Step 1: Install Dependencies**
```bash
cd backend
bun add winston winston-daily-rotate-file
```

**Step 2: Create Logger Configuration**

#### **File: `backend/src/config/logger.config.ts`**

```typescript
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
    const contextStr = context ? `[${context}]` : '';
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}`;
  })
);

export const createLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
      // Console output
      new winston.transports.Console({
        format: consoleFormat,
      }),
      
      // Error logs - rotate daily
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '30d',
        maxSize: '20m',
      }),
      
      // Combined logs - rotate daily
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        maxSize: '50m',
      }),
      
      // Affiliate-specific logs
      new DailyRotateFile({
        filename: 'logs/affiliate-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        maxFiles: '30d',
        maxSize: '50m',
      }),
    ],
  });
};
```

---

### Day 18-19: Add Logging to Services

#### **Update: `backend/src/services/affiliate-tracking.service.ts`**

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AffiliateTrackingService {
  private readonly logger = new Logger(AffiliateTrackingService.name);

  async trackClick(data: TrackClickDto) {
    this.logger.log(`Click tracked - Link: ${data.linkCode}, IP: ${data.ipAddress}`);

    try {
      // Check for suspicious patterns
      const recentClicks = await this.getRecentClicksByIP(data.ipAddress, 60); // Last 60 minutes
      
      if (recentClicks.length >= 10) {
        this.logger.warn(
          `⚠️  Suspicious click pattern detected! IP: ${data.ipAddress} - ${recentClicks.length} clicks in 1 hour`
        );
        
        // Log details for fraud review
        this.logger.warn({
          event: 'SUSPICIOUS_CLICK_PATTERN',
          ip: data.ipAddress,
          linkCode: data.linkCode,
          clickCount: recentClicks.length,
          timeWindow: '1 hour',
          userAgent: data.userAgent,
        });
      }

      // Find link
      const link = await this.findLinkByCode(data.linkCode);
      if (!link) {
        this.logger.error(`Link not found: ${data.linkCode}`);
        throw new Error('Link not found');
      }

      // Record click
      const click = await this.prisma.affClick.create({
        data: {
          linkId: link.id,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          referrer: data.referrer,
          device: data.device,
          browser: data.browser,
          clickedAt: new Date(),
        },
      });

      // Update stats
      await this.updateLinkStats(link.id);
      await this.updateCampaignStats(link.campaignId);

      this.logger.debug(`Click recorded successfully - ID: ${click.id}`);
      
      return click;
    } catch (error) {
      this.logger.error(`Failed to track click: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async getRecentClicksByIP(ipAddress: string, minutes: number) {
    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);
    
    return this.prisma.affClick.findMany({
      where: {
        ipAddress,
        clickedAt: { gte: timeAgo },
      },
    });
  }
}
```

#### **Update: `backend/src/services/affiliate-conversion.service.ts`**

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AffiliateConversionService {
  private readonly logger = new Logger(AffiliateConversionService.name);

  async trackConversion(orderId: string, saleAmount: number, trackingCode: string) {
    this.logger.log(`🎯 Conversion tracking started - Order: ${orderId}, Amount: ${saleAmount} VND`);

    try {
      // Check for duplicate
      const existing = await this.prisma.affConversion.findFirst({
        where: { orderId },
      });

      if (existing) {
        this.logger.warn(`⚠️  Duplicate conversion attempt - Order: ${orderId}`);
        return existing;
      }

      // Find link by tracking code
      const link = await this.findLinkByTrackingCode(trackingCode);
      if (!link) {
        this.logger.error(`Link not found for tracking code: ${trackingCode}`);
        throw new Error('Link not found');
      }

      // Calculate commission
      const commission = this.calculateCommission(link.campaign, saleAmount);
      
      this.logger.log(`💰 Commission calculated - Amount: ${commission} VND (${link.campaign.commissionType})`);

      // Record conversion
      const conversion = await this.prisma.affConversion.create({
        data: {
          orderId,
          linkId: link.id,
          affiliateId: link.affiliateId,
          campaignId: link.campaignId,
          saleAmount,
          commission,
          status: 'PENDING',
          convertedAt: new Date(),
        },
      });

      this.logger.log(`✅ Conversion recorded - ID: ${conversion.id}, Commission: ${commission} VND`);

      // Update stats
      await this.updateStatsAfterConversion(link, commission);

      return conversion;
    } catch (error) {
      this.logger.error(`❌ Failed to track conversion: ${error.message}`, error.stack);
      throw error;
    }
  }

  async approveConversion(id: string, adminId: string) {
    this.logger.log(`Approving conversion: ${id} by admin: ${adminId}`);

    try {
      const conversion = await this.prisma.affConversion.findUnique({
        where: { id },
        include: { affiliate: true, campaign: true },
      });

      if (!conversion) {
        throw new Error('Conversion not found');
      }

      if (conversion.status !== 'PENDING') {
        this.logger.warn(`Cannot approve conversion ${id} - Current status: ${conversion.status}`);
        throw new Error('Conversion is not pending');
      }

      // Approve
      const updated = await this.prisma.affConversion.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: adminId,
        },
      });

      this.logger.log(`✅ Conversion approved - ID: ${id}, Commission: ${conversion.commission} VND`);
      
      return updated;
    } catch (error) {
      this.logger.error(`Failed to approve conversion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async rejectConversion(id: string, adminId: string, reason: string) {
    this.logger.log(`Rejecting conversion: ${id} by admin: ${adminId} - Reason: ${reason}`);

    try {
      const conversion = await this.prisma.affConversion.findUnique({
        where: { id },
      });

      if (!conversion) {
        throw new Error('Conversion not found');
      }

      if (conversion.status !== 'PENDING') {
        this.logger.warn(`Cannot reject conversion ${id} - Current status: ${conversion.status}`);
        throw new Error('Conversion is not pending');
      }

      // Reject and revert stats
      const updated = await this.prisma.affConversion.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectedBy: adminId,
          rejectionReason: reason,
        },
      });

      await this.revertStatsAfterRejection(conversion);

      this.logger.log(`❌ Conversion rejected - ID: ${id}, Reason: ${reason}`);
      
      return updated;
    } catch (error) {
      this.logger.error(`Failed to reject conversion ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private calculateCommission(campaign: any, saleAmount: number): number {
    if (campaign.commissionType === 'percentage') {
      const commission = Number((saleAmount * (Number(campaign.commissionRate) / 100)).toFixed(2));
      this.logger.debug(`Commission calculation: ${saleAmount} * ${campaign.commissionRate}% = ${commission} VND`);
      return commission;
    } else {
      this.logger.debug(`Fixed commission: ${campaign.fixedAmount} VND`);
      return Number(campaign.fixedAmount || 0);
    }
  }
}
```

#### **Update: `backend/src/services/affiliate-payment.service.ts`**

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AffiliatePaymentService {
  private readonly logger = new Logger(AffiliatePaymentService.name);

  async createPaymentRequest(userId: string, input: CreatePaymentRequestInput) {
    this.logger.log(`Payment request initiated - User: ${userId}, Amount: ${input.amount} VND`);

    try {
      // Calculate available balance
      const balance = await this.calculateAvailableBalance(userId);
      
      if (balance < input.amount) {
        this.logger.warn(`Insufficient balance - User: ${userId}, Requested: ${input.amount}, Available: ${balance}`);
        throw new BadRequestException('Insufficient balance');
      }

      // Create request
      const request = await this.prisma.affPaymentRequest.create({
        data: {
          affiliateId: userId,
          amount: input.amount,
          status: 'PENDING',
          requestedAt: new Date(),
          notes: input.notes,
        },
      });

      this.logger.log(`💳 Payment request created - ID: ${request.id}, Amount: ${input.amount} VND`);
      
      return request;
    } catch (error) {
      this.logger.error(`Failed to create payment request: ${error.message}`, error.stack);
      throw error;
    }
  }

  async approvePaymentRequest(id: string, adminId: string) {
    this.logger.log(`Processing payment approval - Request ID: ${id}, Admin: ${adminId}`);

    try {
      const request = await this.prisma.affPaymentRequest.findUnique({
        where: { id },
      });

      if (!request || request.status !== 'PENDING') {
        throw new Error('Invalid payment request');
      }

      // Update status
      const updated = await this.prisma.affPaymentRequest.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          adminNotes: `Approved by admin ${adminId}`,
        },
      });

      this.logger.log(`✅ Payment approved - ID: ${id}, Amount: ${request.amount} VND`);
      
      return updated;
    } catch (error) {
      this.logger.error(`Failed to approve payment ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

---

### Day 19-20: Optional - Sentry Integration

**Step 1: Install Sentry**
```bash
cd backend
bun add @sentry/node @sentry/nestjs
```

**Step 2: Initialize Sentry**

#### **File: `backend/src/main.ts`**

```typescript
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  // Initialize Sentry BEFORE creating NestJS app
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0, // 100% in dev, adjust for production
    profilesSampleRate: 1.0,
    
    // Configure which errors to capture
    beforeSend(event, hint) {
      // Don't send validation errors
      if (event.exception?.values?.[0]?.type === 'BadRequestException') {
        return null;
      }
      return event;
    },
  });

  const app = await NestFactory.create(AppModule);
  
  // ... rest of bootstrap
}
```

**Step 3: Configure Alerts**
- Go to Sentry dashboard
- Set up alerts for:
  - High error rate (> 10 errors/minute)
  - Critical errors (payment failures, conversion tracking failures)
  - Performance degradation (P95 > 1s)

---

## 📊 Week 3 Success Metrics

### Code Quality
- ✅ 60%+ test coverage achieved
- ✅ All tests passing
- ✅ No critical security vulnerabilities
- ✅ All validation rules implemented

### Testing
- ✅ 100+ test cases written
- ✅ 5 service test files created
- ✅ Validation tests passing
- ✅ CI pipeline green

### Logging & Monitoring
- ✅ Winston logger configured
- ✅ Logging in all critical operations
- ✅ Suspicious activity detection
- ✅ Error tracking (Sentry optional)

### Production Readiness
- ✅ Input validation comprehensive
- ✅ Business rules enforced
- ✅ Clear error messages
- ✅ Logging for debugging
- ✅ Monitoring for alerts

---

## 🎯 Week 3 Deliverables Checklist

### Task 7: Backend Unit Tests
- [ ] Jest configured with coverage threshold (60%)
- [ ] `affiliate-user.service.spec.ts` (15+ test cases, 80% coverage)
- [ ] `affiliate-campaign.service.spec.ts` (20+ test cases, 70% coverage)
- [ ] `affiliate-tracking.service.spec.ts` (15+ test cases, 60% coverage)
- [ ] `affiliate-conversion.service.spec.ts` (18+ test cases, 65% coverage)
- [ ] `affiliate-payment.service.spec.ts` (12+ test cases, 60% coverage)
- [ ] All tests passing (`bun test`)
- [ ] Coverage report generated (`bun test:cov`)
- [ ] CI pipeline integration

### Task 8: Input Validation
- [ ] class-validator installed
- [ ] Validation decorators added to all inputs:
  - [ ] CreateCampaignInput
  - [ ] UpdateCampaignInput
  - [ ] CreateLinkInput
  - [ ] CreatePaymentRequestInput
  - [ ] JoinCampaignInput
  - [ ] ReviewCampaignApplicationInput
- [ ] Business rule validation in services:
  - [ ] Commission settings validation
  - [ ] Date range validation
  - [ ] Max affiliates validation
  - [ ] Campaign status checks
  - [ ] Duplicate prevention
- [ ] Validation tests created and passing
- [ ] Clear error messages for users

### Task 9: Logging & Monitoring
- [ ] Winston logger configured
- [ ] Daily log rotation setup
- [ ] Logging added to services:
  - [ ] AffiliateTrackingService (click tracking, suspicious patterns)
  - [ ] AffiliateConversionService (conversion tracking, approvals)
  - [ ] AffiliatePaymentService (payment requests, completions)
  - [ ] AffiliateCampaignService (campaign operations)
- [ ] Log levels appropriate (debug, info, warn, error)
- [ ] Suspicious activity detection (10+ clicks in 1 hour)
- [ ] Sentry integration (optional)

### Documentation
- [ ] Week 3 implementation plan created ✅ (this document)
- [ ] Test coverage report documented
- [ ] Validation rules documented
- [ ] Logging conventions documented
- [ ] Week 3 completion certificate

---

## ⚡ Quick Start Guide

### Start Week 3 Implementation

```bash
# 1. Install test dependencies
cd backend
bun add -D @nestjs/testing @types/jest ts-jest jest

# 2. Install validation dependencies
bun add class-validator class-transformer

# 3. Install logging dependencies
bun add winston winston-daily-rotate-file

# 4. Create test directory structure
mkdir -p src/services/__tests__
mkdir -p src/graphql/inputs/__tests__

# 5. Start with Task 7.1: Configure Jest
# (Copy jest.config.js from this plan)

# 6. Write first test file
# src/services/__tests__/affiliate-user.service.spec.ts

# 7. Run tests
bun test

# 8. Check coverage
bun test:cov

# 9. Continue with validation (Task 8)

# 10. Add logging (Task 9)
```

---

## 📈 Progress Tracking

Update this section as you complete tasks:

**Day 11 (Unit Tests Setup):**
- [ ] Jest configured
- [ ] First test file created
- [ ] Tests running

**Day 12 (User & Campaign Tests):**
- [ ] affiliate-user.service.spec.ts complete
- [ ] affiliate-campaign.service.spec.ts complete

**Day 13 (Tracking & Conversion Tests):**
- [ ] affiliate-tracking.service.spec.ts complete
- [ ] affiliate-conversion.service.spec.ts complete
- [ ] Validation decorators added

**Day 14 (Payment Tests & Validation):**
- [ ] affiliate-payment.service.spec.ts complete
- [ ] Business rule validation added

**Day 15 (Coverage & Validation Tests):**
- [ ] 60%+ coverage achieved
- [ ] Validation tests created

**Day 16 (Logging Setup):**
- [ ] Winston configured
- [ ] Logger utility created

**Day 17 (Service Logging):**
- [ ] Tracking service logging
- [ ] Conversion service logging

**Day 18 (Payment & Campaign Logging):**
- [ ] Payment service logging
- [ ] Campaign service logging

**Day 19 (Fraud Detection):**
- [ ] Suspicious pattern detection
- [ ] Fraud logging

**Day 20 (Sentry & Wrap-up):**
- [ ] Sentry integration (optional)
- [ ] Week 3 documentation complete

---

## 🎓 Next Steps After Week 3

After completing Week 3, you will have:
1. ✅ 60%+ backend test coverage
2. ✅ Comprehensive input validation
3. ✅ Production-grade logging & monitoring
4. ✅ Fraud detection basics
5. ✅ Deployable, maintainable code

**Week 4 Plan (Days 21-28):**
- Integration tests (GraphQL resolvers)
- Frontend component tests
- UI/UX polish (loading states, error boundaries)
- E2E testing

**Week 5-6 Plan (Days 29-42):**
- Advanced error handling
- Performance optimization
- Security hardening
- Documentation finalization

**Week 7+ Plan (Days 43-84):**
- Payment gateway integration (Stripe)
- Scalability (Redis caching, BullMQ jobs)
- Advanced analytics
- Production deployment

---

**Plan Version**: 1.0  
**Created**: 2025-10-19  
**Status**: Ready to Execute  
**Previous**: Week 1 Complete (73% faster than planned)  
**Current**: Week 3 Implementation  
**Next**: Week 4 (Frontend Testing & Polish)

---

**Let's continue building an exceptional Affiliate System! 🚀**
