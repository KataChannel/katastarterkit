#!/bin/bash

# Test script for Xuất Nhập Tồn Performance Optimization
# This script helps verify the display limit functionality

echo "================================================"
echo "🧪 Testing Xuất Nhập Tồn Performance Features"
echo "================================================"
echo ""

echo "📋 Feature Checklist:"
echo ""
echo "Manual Testing Steps:"
echo ""
echo "1. ✅ Display Limit (100 records)"
echo "   - Open page: http://localhost:13000/ketoan/xuatnhapton"
echo "   - Filter to get 150+ records"
echo "   - Verify: Info banner shows 'Tổng số: X • Hiển thị: 100'"
echo "   - Verify: Table warning banner appears"
echo "   - Verify: Pagination shows '(X tổng - giới hạn hiển thị)'"
echo ""

echo "2. ✅ Search Button Toast"
echo "   - Change date range"
echo "   - Click 'Tìm kiếm' button"
echo "   - Verify: Toast shows 'Tìm thấy X bản ghi, hiển thị 100 đầu tiên'"
echo ""

echo "3. ✅ Excel Export (Full Data)"
echo "   - With 150+ records filtered"
echo "   - Click 'Xuất Excel'"
echo "   - Verify: Toast shows 'Đã xuất X bản ghi ra Excel' (not just 100)"
echo "   - Open Excel file"
echo "   - Verify: File contains ALL records (not limited to 100)"
echo ""

echo "4. ✅ Small Dataset (< 100)"
echo "   - Filter to get < 100 records"
echo "   - Verify: No warning banner"
echo "   - Verify: Info banner doesn't show 'Hiển thị' text"
echo "   - Verify: Pagination doesn't show limit indicator"
echo ""

echo "5. ✅ UI Performance"
echo "   - Load page with 1000+ records"
echo "   - Verify: Page loads quickly (< 1 second)"
echo "   - Verify: Table scrolling is smooth"
echo "   - Verify: No lag when filtering"
echo ""

echo "================================================"
echo "🔍 Checking TypeScript Compilation..."
echo "================================================"
cd /chikiet/kataoffical/fullstack/tazagroupcore/frontend

# Check for TypeScript errors in the xuatnhapton directory
npx tsc --noEmit --project tsconfig.json 2>&1 | grep -i "xuatnhapton" || echo "✅ No TypeScript errors in xuatnhapton"

echo ""
echo "================================================"
echo "📊 Code Statistics"
echo "================================================"

echo ""
echo "Modified Files:"
find src/app/ketoan/xuatnhapton -name "*.tsx" -o -name "*.ts" | while read file; do
    lines=$(wc -l < "$file")
    echo "  - $(basename $file): $lines lines"
done

echo ""
echo "Display Limit Configuration:"
grep -n "DISPLAY_LIMIT" src/app/ketoan/xuatnhapton/page.tsx || echo "  ⚠️ DISPLAY_LIMIT constant not found"

echo ""
echo "================================================"
echo "✨ Testing Complete"
echo "================================================"
echo ""
echo "Next Steps:"
echo "1. Start frontend: cd frontend && bun dev"
echo "2. Open: http://localhost:13000/ketoan/xuatnhapton"
echo "3. Follow the manual testing checklist above"
echo "4. Verify all features work as expected"
echo ""
echo "Documentation:"
echo "- See: docs/XUATNHAPTON-PERFORMANCE-OPTIMIZATION.md"
echo "- See: docs/XUATNHAPTON-SEARCH-OPTIMIZATION.md"
echo ""
