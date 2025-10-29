#!/bin/bash

# Test Reserved Slugs Protection
# Chạy file này để test tính năng bảo vệ slug

echo "🧪 Testing Page Slug Protection..."
echo ""

# 1. Test: Get list of reserved slugs
echo "1️⃣ Test: Get Reserved Slugs"
echo "Query:"
cat << 'EOF'
query {
  getReservedSlugs
}
EOF
echo ""
echo "Expected: Trả về array các reserved slugs"
echo ""
echo "=========================================="
echo ""

# 2. Test: Try to create page with reserved slug
echo "2️⃣ Test: Create Page với slug 'bai-viet' (Reserved)"
echo "Mutation:"
cat << 'EOF'
mutation {
  createPage(input: {
    title: "Test Bài Viết"
    slug: "bai-viet"
    status: PUBLISHED
  }) {
    id
    slug
  }
}
EOF
echo ""
echo "Expected: ❌ Error - Slug 'bai-viet' đã được hệ thống sử dụng"
echo ""
echo "=========================================="
echo ""

# 3. Test: Create page with valid slug
echo "3️⃣ Test: Create Page với slug 'gioi-thieu' (Valid)"
echo "Mutation:"
cat << 'EOF'
mutation {
  createPage(input: {
    title: "Giới Thiệu"
    slug: "gioi-thieu"
    status: PUBLISHED
  }) {
    id
    slug
    title
  }
}
EOF
echo ""
echo "Expected: ✅ Success - Page được tạo thành công"
echo ""
echo "=========================================="
echo ""

# 4. Test: Try to update page with reserved slug
echo "4️⃣ Test: Update Page với slug 'san-pham' (Reserved)"
echo "Mutation:"
cat << 'EOF'
mutation {
  updatePage(
    id: "PAGE_ID_HERE"
    input: {
      slug: "san-pham"
    }
  ) {
    id
    slug
  }
}
EOF
echo ""
echo "Expected: ❌ Error - Slug 'san-pham' đã được hệ thống sử dụng"
echo ""
echo "=========================================="
echo ""

# 5. List all reserved slugs
echo "📝 Danh sách Reserved Slugs:"
echo ""
echo "Routes chính:"
echo "  - bai-viet"
echo "  - san-pham"
echo "  - gio-hang"
echo "  - thanh-toan"
echo "  - tai-khoan"
echo ""
echo "Authentication:"
echo "  - dang-nhap"
echo "  - dang-ky"
echo "  - quen-mat-khau"
echo ""
echo "System:"
echo "  - admin"
echo "  - api"
echo "  - auth"
echo "  - graphql"
echo ""
echo "Technical:"
echo "  - _next"
echo "  - static"
echo "  - public"
echo "  - images"
echo "  - assets"
echo ""
echo "=========================================="
echo ""

echo "✅ Test script created!"
echo ""
echo "Để chạy test thực tế, bạn có thể:"
echo "1. Mở GraphQL Playground: http://localhost:4000/graphql"
echo "2. Copy các query/mutation ở trên"
echo "3. Chạy từng test case"
echo ""
echo "Hoặc sử dụng curl:"
echo ""
echo "curl -X POST http://localhost:4000/graphql \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "  -d '{\"query\":\"query { getReservedSlugs }\"}'"
