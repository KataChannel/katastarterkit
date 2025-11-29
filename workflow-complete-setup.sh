#!/bin/bash

# WORKFLOW SYSTEM - COMPLETE SETUP GUIDE
# Hướng dẫn setup đầy đủ hệ thống workflow

echo "🚀 WORKFLOW SYSTEM - COMPLETE SETUP"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if backend is running
echo -e "${BLUE}[1/3]${NC} Checking backend status..."
if curl -s http://localhost:13001/graphql > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Backend is running at http://localhost:13001"
else
    echo -e "   ${RED}✗${NC} Backend is NOT running"
    echo ""
    echo -e "${YELLOW}ACTION REQUIRED:${NC}"
    echo "  1. Open a new terminal"
    echo "  2. Run: cd backend && bun run dev:backend"
    echo "  3. Wait for message: 'GraphQL server ready'"
    echo "  4. Then run this script again"
    echo ""
    exit 1
fi
echo ""

# Step 2: Check if frontend is running
echo -e "${BLUE}[2/3]${NC} Checking frontend status..."
if curl -s http://localhost:13000 > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Frontend is running at http://localhost:13000"
else
    echo -e "   ${YELLOW}⚠${NC} Frontend is NOT running"
    echo ""
    echo -e "${YELLOW}OPTIONAL (but recommended):${NC}"
    echo "  1. Open another terminal"
    echo "  2. Run: cd frontend && bun run dev:frontend"
    echo "  3. Wait for message: 'Ready in Xms'"
    echo ""
    echo "  (You can continue without frontend for now)"
fi
echo ""

# Step 3: Setup Employee Onboarding template
echo -e "${BLUE}[3/3]${NC} Setting up Employee Onboarding template..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { setupEmployeeOnboardingWorkflow }"
  }')

# Check for errors
if echo "$RESPONSE" | grep -q "errors"; then
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.errors[0].message' 2>/dev/null)
    
    if echo "$ERROR_MSG" | grep -q "already exists"; then
        echo -e "${YELLOW}⚠${NC} Template already exists!"
        echo ""
        echo "  Template 'CHECKIN_NHANSU' đã được tạo trước đó."
        echo "  Bạn có thể sử dụng ngay."
        echo ""
    else
        echo -e "${RED}✗${NC} Error creating template:"
        echo ""
        echo "$RESPONSE" | jq '.'
        echo ""
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Template created successfully!"
    echo ""
    echo "$RESPONSE" | jq -r '.data.setupEmployeeOnboardingWorkflow'
    echo ""
fi

# Success summary
echo "===================================="
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo ""
echo "📋 Template Info:"
echo "  - Code: CHECKIN_NHANSU"
echo "  - Name: Checkin Nhân Sự"
echo "  - Category: HR"
echo "  - Steps: 5"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "  1. Open browser: ${BLUE}http://localhost:13000/workflow${NC}"
echo ""
echo "  2. You should see 'Checkin Nhân Sự' card"
echo ""
echo "  3. Click '${GREEN}Bắt đầu quy trình${NC}' button"
echo ""
echo "  4. Fill the 5-step form:"
echo "     Step 1: Basic info (name, email, phone, position, department)"
echo "     Step 2: Auto (system creates user account)"
echo "     Step 3: Third-party accounts (Gmail, Slack, CRM, etc.)"
echo "     Step 4: Approval (wait for HR manager)"
echo "     Step 5: Confirmation"
echo ""
echo "  5. Submit and view workflow instance detail"
echo ""
echo "📚 Documentation:"
echo "  - WORKFLOW_README.md (overview)"
echo "  - WORKFLOW_BUGS_FIXED.md (recent fixes)"
echo "  - HE_THONG_WORKFLOW.md (technical details)"
echo ""
echo "🐛 Troubleshooting:"
echo "  - Backend not starting? Check: backend/.env"
echo "  - GraphQL errors? Check: http://localhost:13001/graphql"
echo "  - Frontend 404? Restart: cd frontend && bun run dev:frontend"
echo ""
echo "===================================="
