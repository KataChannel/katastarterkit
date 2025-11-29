#!/bin/bash

# WORKFLOW SYSTEM - QUICK TEST SCRIPT
# Kiểm tra nhanh hệ thống workflow đã hoạt động chưa

set -e

echo "🔍 WORKFLOW SYSTEM - QUICK CHECK"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check Backend Files
echo "1️⃣  Checking Backend Files..."
backend_files=(
  "backend/src/workflow/workflow.service.ts"
  "backend/src/workflow/employee-onboarding.service.ts"
  "backend/src/workflow/workflow.resolver.ts"
  "backend/src/workflow/workflow.module.ts"
  "backend/src/workflow/entities/workflow.entity.ts"
  "backend/src/workflow/dto/workflow.dto.ts"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${GREEN}✓${NC} $file"
  else
    echo -e "   ${RED}✗${NC} $file (MISSING)"
  fi
done
echo ""

# 2. Check Frontend Components
echo "2️⃣  Checking Frontend Components..."
component_files=(
  "frontend/src/components/workflow/WorkflowTemplateList.tsx"
  "frontend/src/components/workflow/WorkflowInstanceView.tsx"
  "frontend/src/components/workflow/EmployeeOnboardingForm.tsx"
  "frontend/src/graphql/workflow.ts"
)

for file in "${component_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${GREEN}✓${NC} $file"
  else
    echo -e "   ${RED}✗${NC} $file (MISSING)"
  fi
done
echo ""

# 3. Check Frontend Routes
echo "3️⃣  Checking Frontend Routes..."
route_files=(
  "frontend/src/app/workflow/page.tsx"
  "frontend/src/app/workflow/layout.tsx"
  "frontend/src/app/workflow/error.tsx"
  "frontend/src/app/workflow/loading.tsx"
  "frontend/src/app/workflow/instances/[id]/page.tsx"
  "frontend/src/app/workflow/my-instances/page.tsx"
  "frontend/src/app/workflow/my-approvals/page.tsx"
  "frontend/src/app/workflow/employee-onboarding/new/page.tsx"
)

for file in "${route_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${GREEN}✓${NC} $file"
  else
    echo -e "   ${RED}✗${NC} $file (MISSING)"
  fi
done
echo ""

# 4. Check Database Schema
echo "4️⃣  Checking Database Schema..."
if grep -q "model WorkflowTemplate" backend/prisma/schema.prisma; then
  echo -e "   ${GREEN}✓${NC} WorkflowTemplate model"
else
  echo -e "   ${RED}✗${NC} WorkflowTemplate model (MISSING)"
fi

if grep -q "enum WorkflowStatus" backend/prisma/schema.prisma; then
  echo -e "   ${GREEN}✓${NC} WorkflowStatus enum"
else
  echo -e "   ${RED}✗${NC} WorkflowStatus enum (MISSING)"
fi

if grep -q "enum StepType" backend/prisma/schema.prisma; then
  echo -e "   ${GREEN}✓${NC} StepType enum"
else
  echo -e "   ${RED}✗${NC} StepType enum (MISSING)"
fi
echo ""

# 5. Check Module Registration
echo "5️⃣  Checking Module Registration..."
if grep -q "WorkflowModule" backend/src/app.module.ts; then
  echo -e "   ${GREEN}✓${NC} WorkflowModule registered in AppModule"
else
  echo -e "   ${RED}✗${NC} WorkflowModule NOT registered in AppModule"
fi
echo ""

# 6. Check Navigation Menu
echo "6️⃣  Checking Navigation Menu..."
if grep -q "Workflow" frontend/src/components/layout/admin-sidebar-layout.tsx; then
  echo -e "   ${GREEN}✓${NC} Workflow menu added to sidebar"
else
  echo -e "   ${RED}✗${NC} Workflow menu NOT in sidebar"
fi
echo ""

# 7. Documentation Check
echo "7️⃣  Checking Documentation..."
docs=(
  "WORKFLOW_README.md"
  "HE_THONG_WORKFLOW.md"
  "HUONG_DAN_TAO_WORKFLOW_MOI.md"
  "HUONG_DAN_SU_DUNG_UI_WORKFLOW.md"
  "WORKFLOW_TIEN_DO_REVIEW.md"
  "WORKFLOW_ROUTES_COMPLETED.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo -e "   ${GREEN}✓${NC} $doc"
  else
    echo -e "   ${YELLOW}⚠${NC} $doc (optional)"
  fi
done
echo ""

# Summary
echo "=================================="
echo "✅ WORKFLOW SYSTEM CHECK COMPLETE"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  Start Backend:"
echo "   cd backend && bun run dev:backend"
echo ""
echo "2️⃣  Start Frontend:"
echo "   cd frontend && bun run dev:frontend"
echo ""
echo "3️⃣  Setup Employee Onboarding Template:"
echo "   Open: http://localhost:4000/graphql"
echo "   Run mutation:"
echo "   mutation { setupEmployeeOnboardingWorkflow }"
echo ""
echo "4️⃣  Test Workflow UI:"
echo "   Navigate to: http://localhost:3000/workflow"
echo ""
echo "📚 Read documentation:"
echo "   - WORKFLOW_README.md (overview)"
echo "   - WORKFLOW_ROUTES_COMPLETED.md (testing guide)"
echo ""
