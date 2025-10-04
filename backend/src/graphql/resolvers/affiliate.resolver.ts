import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

import { AffUser, AffCampaign, AffLink, AffPaymentRequest } from '../models/affiliate.model';
import { 
  CreateAffUserInput, 
  UpdateAffUserInput,
  CreateCampaignInput 
} from '../inputs/affiliate.input';

import { AffiliateUserService } from '../../services/affiliate.service';
import { AffiliateCampaignService } from '../../services/affiliate.service';
import { AffiliateTrackingService } from '../../services/affiliate-tracking.service';
import { AffiliatePaymentService } from '../../services/affiliate-payment.service';

@Resolver(() => AffUser)
export class AffiliateUserResolver {
  constructor(private affiliateUserService: AffiliateUserService) {}

  @Query(() => String)
  affiliateUserTest() {
    return 'Working';
  }
}

@Resolver(() => AffCampaign)
export class AffiliateCampaignResolver {
  constructor(private campaignService: AffiliateCampaignService) {}

  @Query(() => String)
  affiliateCampaignTest() {
    return 'Working';
  }
}

@Resolver(() => AffLink)
export class AffiliateTrackingResolver {
  constructor(private trackingService: AffiliateTrackingService) {}

  @Query(() => String)
  affiliateTrackingTest() {
    return 'Working';
  }
}

@Resolver(() => AffPaymentRequest)
export class AffiliatePaymentResolver {
  constructor(private paymentService: AffiliatePaymentService) {}

  @Query(() => String)
  affiliatePaymentTest() {
    return 'Working';
  }
}
