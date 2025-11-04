#!/bin/bash

# ============================================================================
# FINAL DEPLOYMENT VERIFICATION
# Run this before actual deployment to production
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FINAL DEPLOYMENT VERIFICATION CHECKLIST     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

check_pass() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}[✗]${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

# 1. Files Existence
echo -e "${BLUE}1. Checking Deployment Files...${NC}"

files=(
    "docker-compose.production.yml"
    "backend/Dockerfile.production"
    "frontend/Dockerfile.production"
    "docker/postgres/postgresql.conf"
    "deploy-optimized.sh"
    "pre-deploy-check.sh"
    "cleanup-production.sh"
    "monitor.sh"
    ".env.production.template"
    ".dockerignore"
    "DEPLOYMENT_GUIDE.md"
    "DEPLOYMENT_OPTIMIZATION_2GB.md"
    "OPTIMIZATION_SUMMARY.md"
    "QUICK_REFERENCE.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file not found"
    fi
done
echo ""

# 2. Scripts Executable
echo -e "${BLUE}2. Checking Script Permissions...${NC}"

scripts=(
    "deploy-optimized.sh"
    "pre-deploy-check.sh"
    "cleanup-production.sh"
    "monitor.sh"
)

for script in "${scripts[@]}"; do
    if [ -x "$script" ]; then
        check_pass "$script is executable"
    else
        check_fail "$script not executable (run: chmod +x $script)"
    fi
done
echo ""

# 3. Environment Configuration
echo -e "${BLUE}3. Checking Environment Setup...${NC}"

if [ -f ".env.production" ]; then
    check_pass ".env.production exists"
    
    source .env.production 2>/dev/null || true
    
    # Check critical variables
    vars=(
        "POSTGRES_PASSWORD:change-this-password"
        "JWT_SECRET:change-this-jwt-secret"
        "NEXTAUTH_SECRET:change-this-nextauth-secret"
        "MINIO_ACCESS_KEY:change-this-key"
        "MINIO_SECRET_KEY:change-this-secret"
    )
    
    for var_check in "${vars[@]}"; do
        var_name="${var_check%%:*}"
        default_val="${var_check#*:}"
        var_value="${!var_name}"
        
        if [ -z "$var_value" ]; then
            check_fail "$var_name not set"
        elif [[ "$var_value" == *"$default_val"* ]]; then
            check_fail "$var_name still using default value"
        else
            check_pass "$var_name configured"
        fi
    done
    
    # Check JWT length
    if [ ${#JWT_SECRET} -ge 32 ]; then
        check_pass "JWT_SECRET length OK (${#JWT_SECRET} chars)"
    else
        check_fail "JWT_SECRET too short (${#JWT_SECRET} chars, need >= 32)"
    fi
    
else
    check_fail ".env.production not found (copy from .env.production.template)"
fi
echo ""

# 4. Docker Configuration
echo -e "${BLUE}4. Checking Docker Configuration...${NC}"

if grep -q "memory:" "docker-compose.production.yml"; then
    check_pass "Memory limits configured"
else
    check_fail "Memory limits not found"
fi

if grep -q "healthcheck:" "docker-compose.production.yml"; then
    check_pass "Health checks configured"
else
    check_fail "Health checks not found"
fi

if grep -q "logging:" "docker-compose.production.yml"; then
    check_pass "Log rotation configured"
else
    check_warn "Log rotation not configured"
fi
echo ""

# 5. PostgreSQL Configuration
echo -e "${BLUE}5. Checking PostgreSQL Configuration...${NC}"

if [ -f "docker/postgres/postgresql.conf" ]; then
    check_pass "PostgreSQL config exists"
    
    if grep -q "max_connections = 40" "docker/postgres/postgresql.conf"; then
        check_pass "max_connections optimized"
    fi
    
    if grep -q "shared_buffers = 128MB" "docker/postgres/postgresql.conf"; then
        check_pass "shared_buffers optimized"
    fi
    
    if grep -q "jit = off" "docker/postgres/postgresql.conf"; then
        check_pass "JIT disabled for low RAM"
    fi
else
    check_fail "PostgreSQL config not found"
fi
echo ""

# 6. Frontend Configuration
echo -e "${BLUE}6. Checking Frontend Configuration...${NC}"

if [ -f "frontend/next.config.js" ]; then
    if grep -q "output: 'standalone'" "frontend/next.config.js"; then
        check_pass "Next.js standalone output enabled"
    else
        check_fail "Next.js standalone not enabled"
    fi
else
    check_fail "next.config.js not found"
fi
echo ""

# 7. Build Dependencies
echo -e "${BLUE}7. Checking Build Dependencies...${NC}"

if command -v bun &> /dev/null; then
    check_pass "Bun installed"
else
    check_fail "Bun not installed (required for builds)"
fi

if command -v docker &> /dev/null; then
    check_pass "Docker installed"
else
    check_fail "Docker not installed"
fi

if command -v docker compose &> /dev/null; then
    check_pass "Docker Compose installed"
else
    check_fail "Docker Compose not installed"
fi
echo ""

# 8. Security Checks
echo -e "${BLUE}8. Security Verification...${NC}"

if [ -f ".gitignore" ]; then
    if grep -q ".env.production" ".gitignore"; then
        check_pass ".env.production in .gitignore"
    else
        check_warn ".env.production should be in .gitignore"
    fi
fi

if [ -f ".dockerignore" ]; then
    check_pass ".dockerignore exists"
else
    check_warn ".dockerignore not found (recommended)"
fi

# Check if production env is in git
if git ls-files --error-unmatch .env.production 2>/dev/null; then
    check_fail ".env.production is tracked by git (SECURITY RISK!)"
else
    check_pass ".env.production not tracked by git"
fi
echo ""

# 9. Documentation
echo -e "${BLUE}9. Documentation Completeness...${NC}"

docs=(
    "DEPLOYMENT_GUIDE.md"
    "DEPLOYMENT_OPTIMIZATION_2GB.md"
    "OPTIMIZATION_SUMMARY.md"
    "QUICK_REFERENCE.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        check_pass "$doc exists"
    else
        check_warn "$doc not found"
    fi
done
echo ""

# Final Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              VERIFICATION SUMMARY              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
PASS_PERCENT=$((PASSED * 100 / TOTAL))

echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo -e "Success Rate: ${PASS_PERCENT}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✓ READY FOR PRODUCTION DEPLOYMENT!          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Review .env.production one more time"
    echo "2. Run: ./pre-deploy-check.sh"
    echo "3. Run: ./deploy-optimized.sh"
    echo "4. Monitor: ./monitor.sh"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║   ✗ NOT READY - FIX ISSUES BEFORE DEPLOY      ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Please fix the ${FAILED} failed check(s) above.${NC}"
    echo ""
    exit 1
fi
