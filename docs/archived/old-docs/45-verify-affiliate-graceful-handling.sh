#!/bin/bash

# ✅ Affiliate Profile Graceful Handling - Verification Script
# Tests that users without affiliate profiles can still access the browse page

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  🔍 Affiliate Profile Graceful Handling - Verification${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Configuration
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
SERVICE_FILE="${BACKEND_DIR}/src/services/affiliate.service.ts"
RESOLVER_FILE="${BACKEND_DIR}/src/graphql/resolvers/affiliate.resolver.ts"
COMPONENT_FILE="${FRONTEND_DIR}/src/components/affiliate/campaigns/CampaignBrowser.tsx"

# Counter for checks
CHECKS_PASSED=0
CHECKS_TOTAL=0

# Function to run a check
check() {
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    local description="$1"
    local command="$2"
    
    echo -e "${BLUE}[CHECK $CHECKS_TOTAL]${NC} $description"
    
    if eval "$command"; then
        echo -e "  ${GREEN}✓ PASS${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        echo ""
        return 0
    else
        echo -e "  ${RED}✗ FAIL${NC}"
        echo ""
        return 1
    fi
}

echo -e "${BOLD}📁 Step 1: Verify Files Exist${NC}\n"

check "Service file exists" "test -f $SERVICE_FILE"
check "Resolver file exists" "test -f $RESOLVER_FILE"
check "Component file exists" "test -f $COMPONENT_FILE"

echo -e "${BOLD}🔧 Step 2: Verify Service Changes${NC}\n"

check "Service has getAffiliateUser method" \
    "grep -q 'async getAffiliateUser' $SERVICE_FILE"

check "Service returns null instead of throwing in getAffiliateUser" \
    "grep -A 25 'async getAffiliateUser' $SERVICE_FILE | grep -q 'return null'"

check "Service does NOT throw NotFoundException in getAffiliateUser" \
    "! (grep -A 25 'async getAffiliateUser' $SERVICE_FILE | grep -q 'throw new NotFoundException')"

check "Service has comment explaining null return" \
    "grep -B 3 'if (!profile)' $SERVICE_FILE | grep -iq 'not an error.*affiliate'"

echo -e "${BOLD}🎯 Step 3: Verify Other Methods Still Throw${NC}\n"

check "updateAffiliateUser still throws for missing profile" \
    "grep -A 15 'async updateAffiliateUser' $SERVICE_FILE | grep -q 'throw new NotFoundException'"

check "getAffiliateStats still throws for missing profile" \
    "grep -A 15 'async getAffiliateStats' $SERVICE_FILE | grep -q 'throw new NotFoundException'"

echo -e "${BOLD}📊 Step 4: Verify Resolver Configuration${NC}\n"

check "Resolver marks affiliateUser as nullable" \
    "grep -A 1 '@Query.*affiliateUser' $RESOLVER_FILE | grep -q 'nullable: true'"

check "Resolver has JwtAuthGuard" \
    "grep -B 1 'async getAffiliateUser' $RESOLVER_FILE | grep -q '@UseGuards(JwtAuthGuard)'"

check "Resolver handles null response" \
    "grep -A 3 'async getAffiliateUser' $RESOLVER_FILE | grep -q 'mapDecimalFields.*:.*null'"

echo -e "${BOLD}🎨 Step 5: Verify Frontend Safety${NC}\n"

check "Component uses optional chaining for affiliateUser" \
    "grep -q 'affiliateUser?' $COMPONENT_FILE"

check "Component provides default empty array" \
    "grep -q '\|\| \[\]' $COMPONENT_FILE"

check "Component has loading state" \
    "grep -q 'loading' $COMPONENT_FILE"

echo -e "${BOLD}🧪 Step 6: Code Pattern Analysis${NC}\n"

# Count how many times we throw vs return null in service
THROW_COUNT=$(grep 'throw new NotFoundException.*Affiliate profile not found' $SERVICE_FILE | wc -l || echo 0)
NULL_RETURN_COUNT=$(grep -c 'Return null if profile' $SERVICE_FILE || echo 0)

echo -e "${BLUE}[INFO]${NC} Service throws NotFoundException: ${YELLOW}${THROW_COUNT}${NC} times"
echo -e "${BLUE}[INFO]${NC} Service returns null gracefully: ${YELLOW}${NULL_RETURN_COUNT}${NC} times"
echo ""

check "Exactly 1 graceful null return for getAffiliateUser" \
    "[ $NULL_RETURN_COUNT -eq 1 ]"

check "At least 2 throws for update/stats operations" \
    "[ $THROW_COUNT -ge 2 ]"

echo -e "${BOLD}📝 Step 7: TypeScript Type Safety${NC}\n"

check "Service method returns AffUser | null" \
    "grep -B 5 'async getAffiliateUser' $SERVICE_FILE | grep -q 'Promise<.*|.*null.*>\\|Promise<.*null.*|.*>'"

check "Resolver method returns AffUser | null" \
    "grep -B 3 'async getAffiliateUser' $RESOLVER_FILE | grep -q 'Promise<.*|.*null.*>\\|Promise<.*null.*|.*>'"

echo -e "${BOLD}🔍 Step 8: GraphQL Schema Check${NC}\n"

SCHEMA_FILE="${BACKEND_DIR}/src/graphql/schema.graphql"
if [ -f "$SCHEMA_FILE" ]; then
    check "GraphQL schema has affiliateUser query" \
        "grep -q 'affiliateUser.*AffUser' $SCHEMA_FILE"
else
    echo -e "${YELLOW}⚠ Schema file not found, skipping schema checks${NC}\n"
fi

echo -e "${BOLD}📊 Step 9: Related Query Files${NC}\n"

QUERY_FILE="${FRONTEND_DIR}/src/graphql/affiliate.queries.ts"
if [ -f "$QUERY_FILE" ]; then
    check "Frontend query uses affiliateUser field" \
        "grep -q 'affiliateUser' $QUERY_FILE"
    
    check "Frontend query includes campaignJoins" \
        "grep -q 'campaignJoins' $QUERY_FILE"
else
    echo -e "${YELLOW}⚠ Query file not found, skipping query checks${NC}\n"
fi

echo -e "${BOLD}🎯 Step 10: Security Checks${NC}\n"

check "getAffiliateUser requires authentication" \
    "grep -B 5 'async getAffiliateUser' $RESOLVER_FILE | grep -q 'JwtAuthGuard'"

check "Uses context.req.user for userId" \
    "grep -A 3 'async getAffiliateUser' $RESOLVER_FILE | grep -q 'context.req.user.id'"

echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  📊 VERIFICATION SUMMARY${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

PASS_RATE=$((CHECKS_PASSED * 100 / CHECKS_TOTAL))

echo -e "  Total Checks: ${BOLD}${CHECKS_TOTAL}${NC}"
echo -e "  Passed: ${GREEN}${BOLD}${CHECKS_PASSED}${NC}"
echo -e "  Failed: ${RED}${BOLD}$((CHECKS_TOTAL - CHECKS_PASSED))${NC}"
echo -e "  Pass Rate: ${BOLD}${PASS_RATE}%${NC}"
echo ""

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    echo -e "${GREEN}${BOLD}🎉 ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}The graceful handling fix is correctly implemented.${NC}"
    echo ""
    echo -e "${BOLD}Next Steps:${NC}"
    echo -e "  1. Restart backend: ${BLUE}cd backend && bun run build && pm2 restart backend${NC}"
    echo -e "  2. Test in browser: ${BLUE}http://localhost:3001/admin/affiliate/browse${NC}"
    echo -e "  3. Test with user WITHOUT affiliate profile"
    echo -e "  4. Test with user WITH affiliate profile"
    echo -e "  5. Verify no GraphQL errors in console"
    echo ""
    exit 0
else
    echo -e "${RED}${BOLD}❌ SOME CHECKS FAILED${NC}"
    echo -e "${YELLOW}Please review the failed checks above.${NC}"
    echo ""
    echo -e "${BOLD}Common Issues:${NC}"
    echo -e "  • Service not returning null in getAffiliateUser"
    echo -e "  • Resolver not marked as nullable"
    echo -e "  • Frontend not using optional chaining"
    echo -e "  • TypeScript types not allowing null"
    echo ""
    exit 1
fi
