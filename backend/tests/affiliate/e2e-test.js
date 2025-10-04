/**
 * End-to-End Affiliate System Test
 * Tests complete affiliate workflow from user registration to payout
 */

const { GraphQLClient } = require('graphql-request');
const axios = require('axios');

// Configuration
const GRAPHQL_ENDPOINT = 'http://localhost:14000/graphql';
const API_BASE_URL = 'http://localhost:14000';

// Test data
const testUsers = {
  merchant: {
    email: 'merchant@test.com',
    password: 'testpass123',
    firstName: 'John',
    lastName: 'Merchant',
    username: 'merchant_user'
  },
  affiliate: {
    email: 'affiliate@test.com', 
    password: 'testpass123',
    firstName: 'Jane',
    lastName: 'Affiliate',
    username: 'affiliate_user'
  }
};

// GraphQL Mutations and Queries
const REGISTER_USER = `
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        username
        roleType
      }
      token
    }
  }
`;

const LOGIN_USER = `
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        username
        roleType
      }
      token
    }
  }
`;

const CREATE_AFFILIATE_USER = `
  mutation CreateAffiliateUser($input: CreateAffUserInput!) {
    createAffiliateUser(input: $input) {
      id
      userId
      role
      status
      businessName
      paymentEmail
      paymentMethod
      totalEarnings
      isVerified
    }
  }
`;

const CREATE_AFFILIATE_CAMPAIGN = `
  mutation CreateAffiliateCampaign($input: CreateCampaignInput!) {
    createAffiliateCampaign(input: $input) {
      id
      name
      description
      type
      status
      commissionType
      commissionRate
      fixedAmount
      totalRevenue
      totalCommission
      createdAt
    }
  }
`;

const GET_AFFILIATE_CAMPAIGNS = `
  query GetAffiliateCampaigns($search: CampaignSearchInput) {
    affiliateCampaigns(search: $search) {
      id
      name
      description
      status
      commissionType
      commissionRate
      fixedAmount
      totalClicks
      totalConversions
    }
  }
`;

const CREATE_AFFILIATE_LINK = `
  mutation CreateAffiliateLink($input: CreateAffLinkInput!) {
    createAffiliateLink(input: $input) {
      id
      trackingCode
      originalUrl
      shortUrl
      title
      description
      isActive
      campaign {
        id
        name
      }
    }
  }
`;

const GET_AFFILIATE_LINKS = `
  query GetAffiliateLinks($search: AffLinkSearchInput) {
    affiliateLinks(search: $search) {
      id
      trackingCode
      shortUrl
      originalUrl
      clicks
      conversions
      revenue
      commission
      isActive
      campaign {
        name
        commissionRate
        fixedAmount
      }
    }
  }
`;

const CREATE_PAYMENT_REQUEST = `
  mutation CreatePaymentRequest($input: CreatePaymentRequestInput!) {
    createPaymentRequest(input: $input) {
      id
      amount
      currency
      method
      status
      requestedAt
    }
  }
`;

// Test execution functions
let merchantToken = '';
let affiliateToken = '';
let merchantClient, affiliateClient;
let campaignId = '';
let linkId = '';
let trackingCode = '';

async function setupClients() {
  console.log('🔧 Setting up GraphQL clients...');
  
  const baseClient = new GraphQLClient(GRAPHQL_ENDPOINT);
  
  try {
    // Register merchant user
    console.log('📝 Registering merchant user...');
    const merchantRegResult = await baseClient.request(REGISTER_USER, {
      input: testUsers.merchant
    });
    merchantToken = merchantRegResult.register.token;
    console.log('✅ Merchant registered:', merchantRegResult.register.user.email);
    
    // Register affiliate user
    console.log('📝 Registering affiliate user...');
    const affiliateRegResult = await baseClient.request(REGISTER_USER, {
      input: testUsers.affiliate
    });
    affiliateToken = affiliateRegResult.register.token;
    console.log('✅ Affiliate registered:', affiliateRegResult.register.user.email);
    
  } catch (error) {
    // Users might already exist, try login instead
    console.log('ℹ️ Users might exist, trying login...');
    
    try {
      const merchantLogin = await baseClient.request(LOGIN_USER, {
        input: { email: testUsers.merchant.email, password: testUsers.merchant.password }
      });
      merchantToken = merchantLogin.login.token;
      console.log('✅ Merchant logged in:', merchantLogin.login.user.email);
      
      const affiliateLogin = await baseClient.request(LOGIN_USER, {
        input: { email: testUsers.affiliate.email, password: testUsers.affiliate.password }
      });
      affiliateToken = affiliateLogin.login.token;
      console.log('✅ Affiliate logged in:', affiliateLogin.login.user.email);
      
    } catch (loginError) {
      console.error('❌ Failed to login users:', loginError.message);
      throw loginError;
    }
  }
  
  // Create authenticated clients
  merchantClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: { authorization: `Bearer ${merchantToken}` }
  });
  
  affiliateClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: { authorization: `Bearer ${affiliateToken}` }
  });
  
  console.log('✅ GraphQL clients setup complete\n');
}

async function testAffiliateUserRegistration() {
  console.log('👤 Testing affiliate user registration...');
  
  try {
    const affiliateUser = await affiliateClient.request(CREATE_AFFILIATE_USER, {
      input: {
        role: 'AFFILIATE',
        businessName: 'Jane\'s Marketing Agency',
        website: 'https://janemarketing.com',
        paymentEmail: 'payments@janemarketing.com',
        paymentMethod: 'PAYPAL',
        socialProfiles: {
          instagram: '@janemarketing',
          youtube: 'JaneMarketingChannel'
        }
      }
    });
    
    console.log('✅ Affiliate user created:', {
      id: affiliateUser.createAffiliateUser.id,
      role: affiliateUser.createAffiliateUser.role,
      status: affiliateUser.createAffiliateUser.status,
      businessName: affiliateUser.createAffiliateUser.businessName
    });
    
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Affiliate user already exists, continuing...');
      return true;
    }
    console.error('❌ Failed to create affiliate user:', error.message);
    return false;
  }
}

async function testCampaignCreation() {
  console.log('🚀 Testing campaign creation...');
  
  try {
    const campaign = await merchantClient.request(CREATE_AFFILIATE_CAMPAIGN, {
      input: {
        name: 'Premium Product Launch 2025',
        description: 'Promote our latest premium product line with competitive commissions',
        type: 'PUBLIC',
        commissionType: 'PERCENTAGE',
        commissionRate: 15,
        cookieDuration: 30,
        minPayoutAmount: 50,
        maxPayoutAmount: 5000,
        categories: ['technology', 'software'],
        targetCountries: ['US', 'CA', 'UK'],
        terms: 'Standard affiliate terms apply. No PPC bidding on brand terms.',
        materials: {
          banners: ['300x250', '728x90', '160x600'],
          productImages: 10,
          videoAds: 3
        }
      }
    });
    
    campaignId = campaign.createAffiliateCampaign.id;
    console.log('✅ Campaign created:', {
      id: campaignId,
      name: campaign.createAffiliateCampaign.name,
      commissionRate: campaign.createAffiliateCampaign.commissionRate,
      status: campaign.createAffiliateCampaign.status
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create campaign:', error.message);
    return false;
  }
}

async function testCampaignDiscovery() {
  console.log('🔍 Testing campaign discovery...');
  
  try {
    const campaigns = await affiliateClient.request(GET_AFFILIATE_CAMPAIGNS, {
      search: {
        status: 'ACTIVE',
        page: 1,
        size: 10
      }
    });
    
    console.log('✅ Found campaigns:', campaigns.affiliateCampaigns.length);
    
    if (campaigns.affiliateCampaigns.length > 0) {
      const campaign = campaigns.affiliateCampaigns[0];
      if (!campaignId) campaignId = campaign.id;
      console.log('📋 Campaign details:', {
        name: campaign.name,
        commissionRate: campaign.commissionRate,
        totalClicks: campaign.totalClicks
      });
    }
    
    return campaigns.affiliateCampaigns.length > 0;
  } catch (error) {
    console.error('❌ Failed to discover campaigns:', error.message);
    return false;
  }
}

async function testLinkCreation() {
  console.log('🔗 Testing affiliate link creation...');
  
  if (!campaignId) {
    console.error('❌ No campaign ID available for link creation');
    return false;
  }
  
  try {
    const link = await affiliateClient.request(CREATE_AFFILIATE_LINK, {
      input: {
        campaignId: campaignId,
        originalUrl: 'https://example.com/premium-product',
        customAlias: 'premium-launch-2025',
        title: 'Premium Product Launch - Special Offer',
        description: 'Get 20% off our premium product suite with my exclusive link'
      }
    });
    
    linkId = link.createAffiliateLink.id;
    trackingCode = link.createAffiliateLink.trackingCode;
    
    console.log('✅ Affiliate link created:', {
      id: linkId,
      trackingCode: trackingCode,
      shortUrl: link.createAffiliateLink.shortUrl,
      campaign: link.createAffiliateLink.campaign.name
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create affiliate link:', error.message);
    return false;
  }
}

async function testLinkTracking() {
  console.log('📈 Testing link tracking...');
  
  if (!trackingCode) {
    console.error('❌ No tracking code available for testing');
    return false;
  }
  
  try {
    // Simulate click tracking
    const clickResponse = await axios.get(`${API_BASE_URL}/aff/${trackingCode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://google.com'
      },
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    
    console.log('✅ Click tracking test:', {
      status: clickResponse.status,
      redirected: clickResponse.status === 302 || clickResponse.status === 301
    });
    
    // Test pixel tracking
    const pixelResponse = await axios.get(`${API_BASE_URL}/aff/pixel/${trackingCode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
      }
    });
    
    console.log('✅ Pixel tracking test:', {
      status: pixelResponse.status,
      contentType: pixelResponse.headers['content-type']
    });
    
    return true;
  } catch (error) {
    if (error.response && (error.response.status === 302 || error.response.status === 301)) {
      console.log('✅ Click tracking working (redirect response)');
      return true;
    }
    console.error('❌ Link tracking test failed:', error.message);
    return false;
  }
}

async function testLinkAnalytics() {
  console.log('📊 Testing link analytics...');
  
  try {
    const links = await affiliateClient.request(GET_AFFILIATE_LINKS, {
      search: {
        page: 1,
        size: 10
      }
    });
    
    console.log('✅ Retrieved affiliate links:', links.affiliateLinks.length);
    
    if (links.affiliateLinks.length > 0) {
      const link = links.affiliateLinks[0];
      console.log('📈 Link performance:', {
        clicks: link.clicks,
        conversions: link.conversions,
        revenue: link.revenue,
        commission: link.commission
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to retrieve link analytics:', error.message);
    return false;
  }
}

async function testPaymentRequest() {
  console.log('💰 Testing payment request...');
  
  try {
    const paymentRequest = await affiliateClient.request(CREATE_PAYMENT_REQUEST, {
      input: {
        amount: 100.00,
        method: 'PAYPAL',
        paymentDetails: {
          email: 'payments@janemarketing.com'
        }
      }
    });
    
    console.log('✅ Payment request created:', {
      id: paymentRequest.createPaymentRequest.id,
      amount: paymentRequest.createPaymentRequest.amount,
      method: paymentRequest.createPaymentRequest.method,
      status: paymentRequest.createPaymentRequest.status
    });
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create payment request:', error.message);
    return false;
  }
}

// Main test execution
async function runEndToEndTest() {
  console.log('🧪 Starting Affiliate System End-to-End Test\n');
  console.log('================================================\n');
  
  const results = {
    setup: false,
    userRegistration: false,
    campaignCreation: false,
    campaignDiscovery: false,
    linkCreation: false,
    linkTracking: false,
    linkAnalytics: false,
    paymentRequest: false
  };
  
  try {
    // Step 1: Setup
    await setupClients();
    results.setup = true;
    
    // Step 2: Affiliate user registration
    results.userRegistration = await testAffiliateUserRegistration();
    
    // Step 3: Campaign creation (by merchant)
    results.campaignCreation = await testCampaignCreation();
    
    // Step 4: Campaign discovery (by affiliate)
    results.campaignDiscovery = await testCampaignDiscovery();
    
    // Step 5: Link creation (by affiliate)
    results.linkCreation = await testLinkCreation();
    
    // Step 6: Link tracking
    results.linkTracking = await testLinkTracking();
    
    // Step 7: Link analytics
    results.linkAnalytics = await testLinkAnalytics();
    
    // Step 8: Payment request
    results.paymentRequest = await testPaymentRequest();
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
  
  // Results summary
  console.log('\n================================================');
  console.log('🧪 Test Results Summary:');
  console.log('================================================\n');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  const percentage = Math.round((passed / total) * 100);
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  console.log(`\n📊 Overall Result: ${passed}/${total} tests passed (${percentage}%)`);
  
  if (percentage === 100) {
    console.log('🎉 All tests passed! Affiliate system is fully functional.');
  } else if (percentage >= 75) {
    console.log('⚠️ Most tests passed. Minor issues detected.');
  } else {
    console.log('🚨 Multiple test failures. System requires attention.');
  }
  
  console.log('\n================================================\n');
  
  return percentage === 100;
}

// Export for external use
module.exports = {
  runEndToEndTest,
  testUsers,
  GRAPHQL_ENDPOINT,
  API_BASE_URL
};

// Run if called directly
if (require.main === module) {
  runEndToEndTest()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}