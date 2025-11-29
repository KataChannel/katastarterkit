#!/bin/bash

# SETUP EMPLOYEE ONBOARDING WORKFLOW
# Script để tạo CHECKIN_NHANSU template

echo "🚀 Setting up Employee Onboarding Workflow..."
echo ""

# Check if backend is running
if ! curl -s http://localhost:13001/graphql > /dev/null 2>&1; then
    echo "❌ Backend không chạy!"
    echo ""
    echo "Vui lòng start backend trước:"
    echo "  cd backend && bun run dev:backend"
    echo ""
    exit 1
fi

echo "✅ Backend đang chạy"
echo ""

# Run setup mutation
echo "📝 Đang tạo Employee Onboarding template..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:13001/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { setupEmployeeOnboardingWorkflow }"
  }')

# Check response
if echo "$RESPONSE" | grep -q "errors"; then
    echo "❌ Lỗi khi tạo template:"
    echo "$RESPONSE" | jq '.'
    exit 1
fi

if echo "$RESPONSE" | grep -q "successfully"; then
    echo "✅ Tạo template thành công!"
    echo ""
    echo "$RESPONSE" | jq -r '.data.setupEmployeeOnboardingWorkflow'
    echo ""
    echo "📋 Template details:"
    echo "  - Code: CHECKIN_NHANSU"
    echo "  - Name: Checkin Nhân Sự"
    echo "  - Steps: 5"
    echo ""
    echo "🎯 Bây giờ bạn có thể:"
    echo "  1. Navigate to: http://localhost:13000/workflow"
    echo "  2. Click 'Bắt đầu quy trình' trên card 'Checkin Nhân Sự'"
    echo "  3. Fill form và submit"
    echo ""
else
    echo "⚠️  Response không rõ ràng:"
    echo "$RESPONSE" | jq '.'
fi
