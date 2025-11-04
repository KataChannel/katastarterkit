#!/bin/bash

# Pre-deployment System Check for Multi-Domain Setup
# Checks server resources and prerequisites

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Pre-Deployment System Check - Multi-Domain           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Track if any checks fail
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

# Function to print check result
check_result() {
    local status=$1
    local message=$2
    local detail=$3
    
    if [ "$status" = "pass" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $message"
        [ -n "$detail" ] && echo -e "   ${BLUE}ℹ️  $detail${NC}"
        ((CHECKS_PASSED++))
    elif [ "$status" = "fail" ]; then
        echo -e "${RED}❌ FAIL${NC} - $message"
        [ -n "$detail" ] && echo -e "   ${RED}⚠️  $detail${NC}"
        ((CHECKS_FAILED++))
    else
        echo -e "${YELLOW}⚠️  WARN${NC} - $message"
        [ -n "$detail" ] && echo -e "   ${YELLOW}💡 $detail${NC}"
        ((WARNINGS++))
    fi
    echo ""
}

echo -e "${YELLOW}📋 Checking System Requirements...${NC}"
echo ""

# 1. Check Docker
echo -e "${BLUE}[1/15] Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    check_result "pass" "Docker installed" "Version: $DOCKER_VERSION"
else
    check_result "fail" "Docker not installed" "Run: curl -fsSL https://get.docker.com | sh"
fi

# 2. Check Docker Compose
echo -e "${BLUE}[2/15] Checking Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | awk '{print $4}' | sed 's/,//')
    check_result "pass" "Docker Compose installed" "Version: $COMPOSE_VERSION"
else
    check_result "fail" "Docker Compose not installed" "Install from: https://docs.docker.com/compose/install/"
fi

# 3. Check Docker daemon
echo -e "${BLUE}[3/15] Checking Docker daemon...${NC}"
if docker ps &> /dev/null; then
    check_result "pass" "Docker daemon running" ""
else
    check_result "fail" "Docker daemon not running" "Run: sudo systemctl start docker"
fi

# 4. Check user in docker group
echo -e "${BLUE}[4/15] Checking user permissions...${NC}"
if groups | grep -q docker; then
    check_result "pass" "User in docker group" ""
else
    check_result "warn" "User not in docker group" "Run: sudo usermod -aG docker \$USER && newgrp docker"
fi

# 5. Check total RAM
echo -e "${BLUE}[5/15] Checking RAM...${NC}"
TOTAL_RAM=$(free -m | awk 'NR==2{print $2}')
if [ "$TOTAL_RAM" -ge 1024 ]; then
    check_result "pass" "Total RAM: ${TOTAL_RAM}MB" "Sufficient for 2 domains"
elif [ "$TOTAL_RAM" -ge 900 ]; then
    check_result "warn" "Total RAM: ${TOTAL_RAM}MB" "Close to minimum, create swap file"
else
    check_result "fail" "Total RAM: ${TOTAL_RAM}MB" "Need at least 1GB RAM. Create swap file!"
fi

# 6. Check available RAM
echo -e "${BLUE}[6/15] Checking available RAM...${NC}"
AVAILABLE_RAM=$(free -m | awk 'NR==2{print $7}')
if [ "$AVAILABLE_RAM" -ge 512 ]; then
    check_result "pass" "Available RAM: ${AVAILABLE_RAM}MB" ""
else
    check_result "warn" "Available RAM: ${AVAILABLE_RAM}MB" "Consider freeing up memory or creating swap"
fi

# 7. Check swap
echo -e "${BLUE}[7/15] Checking swap...${NC}"
SWAP_TOTAL=$(free -m | awk 'NR==3{print $2}')
if [ "$SWAP_TOTAL" -ge 2048 ]; then
    check_result "pass" "Swap: ${SWAP_TOTAL}MB" "Good!"
elif [ "$SWAP_TOTAL" -ge 1024 ]; then
    check_result "warn" "Swap: ${SWAP_TOTAL}MB" "Recommend 2GB+ for 2 domains"
else
    check_result "warn" "Swap: ${SWAP_TOTAL}MB" "Run: make -f Makefile.multi-domain setup-swap"
fi

# 8. Check CPU cores
echo -e "${BLUE}[8/15] Checking CPU...${NC}"
CPU_CORES=$(nproc)
if [ "$CPU_CORES" -ge 2 ]; then
    check_result "pass" "CPU Cores: $CPU_CORES" "Good performance expected"
elif [ "$CPU_CORES" -eq 1 ]; then
    check_result "warn" "CPU Cores: $CPU_CORES" "Minimum spec, may be slow under load"
else
    check_result "fail" "CPU Cores: $CPU_CORES" "At least 1 core required"
fi

# 9. Check disk space
echo -e "${BLUE}[9/15] Checking disk space...${NC}"
DISK_AVAILABLE=$(df -BG . | awk 'NR==2{print $4}' | sed 's/G//')
if [ "$DISK_AVAILABLE" -ge 10 ]; then
    check_result "pass" "Available disk: ${DISK_AVAILABLE}GB" "Plenty of space"
elif [ "$DISK_AVAILABLE" -ge 5 ]; then
    check_result "warn" "Available disk: ${DISK_AVAILABLE}GB" "Meets minimum, monitor usage"
else
    check_result "fail" "Available disk: ${DISK_AVAILABLE}GB" "Need at least 5GB free"
fi

# 10. Check .env.rausach
echo -e "${BLUE}[10/15] Checking .env.rausach...${NC}"
if [ -f ".env.rausach" ]; then
    check_result "pass" ".env.rausach exists" ""
else
    check_result "fail" ".env.rausach not found" "Create this file with domain configuration"
fi

# 11. Check .env.innerv2
echo -e "${BLUE}[11/15] Checking .env.innerv2...${NC}"
if [ -f ".env.innerv2" ]; then
    check_result "pass" ".env.innerv2 exists" ""
else
    check_result "fail" ".env.innerv2 not found" "Create this file with domain configuration"
fi

# 12. Check required ports availability
echo -e "${BLUE}[12/15] Checking port availability...${NC}"
REQUIRED_PORTS=(12000 12001 12003 12004 12007 12008 13000 13001)
PORTS_IN_USE=()

for port in "${REQUIRED_PORTS[@]}"; do
    if sudo lsof -i :$port &> /dev/null || netstat -tuln 2>/dev/null | grep -q ":$port "; then
        PORTS_IN_USE+=($port)
    fi
done

if [ ${#PORTS_IN_USE[@]} -eq 0 ]; then
    check_result "pass" "All required ports available" "Ports: ${REQUIRED_PORTS[*]}"
else
    check_result "warn" "Some ports in use" "Busy ports: ${PORTS_IN_USE[*]}"
fi

# 13. Check Docker Compose file
echo -e "${BLUE}[13/15] Checking docker-compose.multi-domain.yml...${NC}"
if [ -f "docker-compose.multi-domain.yml" ]; then
    if docker-compose -f docker-compose.multi-domain.yml config &> /dev/null; then
        check_result "pass" "Docker Compose file valid" ""
    else
        check_result "fail" "Docker Compose file has errors" "Run: docker-compose -f docker-compose.multi-domain.yml config"
    fi
else
    check_result "fail" "docker-compose.multi-domain.yml not found" "File missing!"
fi

# 14. Check init-multi-db.sh
echo -e "${BLUE}[14/15] Checking scripts/init-multi-db.sh...${NC}"
if [ -f "scripts/init-multi-db.sh" ]; then
    if [ -x "scripts/init-multi-db.sh" ]; then
        check_result "pass" "Init script exists and executable" ""
    else
        check_result "warn" "Init script not executable" "Run: chmod +x scripts/init-multi-db.sh"
    fi
else
    check_result "fail" "scripts/init-multi-db.sh not found" "File missing!"
fi

# 15. Check network connectivity
echo -e "${BLUE}[15/15] Checking network connectivity...${NC}"
if ping -c 1 8.8.8.8 &> /dev/null; then
    check_result "pass" "Internet connection available" ""
else
    check_result "warn" "No internet connection" "May not be able to pull Docker images"
fi

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    Check Summary                          ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed: $CHECKS_PASSED${NC}"
echo -e "  ${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo -e "  ${RED}❌ Failed: $CHECKS_FAILED${NC}"
echo ""

# Final recommendation
if [ $CHECKS_FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  🎉 All checks passed! Ready to deploy!                  ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo -e "  1. Review .env.rausach and .env.innerv2 configurations"
        echo -e "  2. Run: ${BLUE}./deploy-multi-domain.sh${NC}"
        echo -e "  3. Or use: ${BLUE}make -f Makefile.multi-domain start-all${NC}"
    else
        echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${YELLOW}║  ⚠️  System meets minimum requirements with warnings     ║${NC}"
        echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Recommended actions:${NC}"
        echo -e "  - Review warnings above"
        echo -e "  - Create swap if RAM < 1GB: ${BLUE}make -f Makefile.multi-domain setup-swap${NC}"
        echo -e "  - Free up disk space if needed"
        echo ""
        echo -e "You can proceed, but monitor resources closely."
    fi
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ System does not meet requirements!                    ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}Please fix the failed checks above before deploying.${NC}"
    exit 1
fi

echo ""
