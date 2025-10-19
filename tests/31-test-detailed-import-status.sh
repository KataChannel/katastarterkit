#!/bin/bash

# Test chi tiết trạng thái import hóa đơn
# Script này test xem thông báo chi tiết ext_listhoadon và ext_detailhoadon có hoạt động đúng không

echo "=================================================="
echo "🧪 TEST CHI TIẾT TRẠNG THÁI IMPORT HÓA ĐƠN"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Base URL
API_URL="http://localhost:14000"

# 1. Login để lấy token
echo "🔐 Step 1: Đăng nhập để lấy access token..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/graphql" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(email: \"admin@kata.com\", password: \"Admin@123\") { accessToken user { id email } } }"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}❌ Không thể lấy access token. Kiểm tra lại thông tin đăng nhập.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Đã lấy access token thành công${NC}"
echo ""

# 2. Tạo file Excel test với nhiều trường hợp
echo "📝 Step 2: Tạo file Excel test..."

# Tải file mẫu
echo "   Đang tải file mẫu..."
curl -s -X GET "$API_URL/api/invoice-import/template" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -o /tmp/test_import_template.xlsx

if [ ! -f /tmp/test_import_template.xlsx ]; then
    echo -e "${RED}❌ Không thể tải file mẫu${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Đã tải file mẫu: /tmp/test_import_template.xlsx${NC}"
echo ""

# 3. Thực hiện import
echo "📤 Step 3: Thực hiện import..."
echo ""

IMPORT_RESPONSE=$(curl -s -X POST "$API_URL/api/invoice-import/upload" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "file=@/tmp/test_import_template.xlsx")

echo "📊 Kết quả Import:"
echo "=================================================="
echo "$IMPORT_RESPONSE" | jq '.' 2>/dev/null || echo "$IMPORT_RESPONSE"
echo "=================================================="
echo ""

# 4. Parse và hiển thị thống kê chi tiết
echo "📈 Step 4: Phân tích kết quả..."
echo ""

if command -v jq &> /dev/null; then
    SUCCESS=$(echo $IMPORT_RESPONSE | jq -r '.success')
    TOTAL_ROWS=$(echo $IMPORT_RESPONSE | jq -r '.totalRows')
    SUCCESS_COUNT=$(echo $IMPORT_RESPONSE | jq -r '.successCount')
    ERROR_COUNT=$(echo $IMPORT_RESPONSE | jq -r '.errorCount')
    MESSAGE=$(echo $IMPORT_RESPONSE | jq -r '.message')
    
    # Statistics
    TOTAL_INVOICES=$(echo $IMPORT_RESPONSE | jq -r '.statistics.totalInvoices')
    TOTAL_DETAILS=$(echo $IMPORT_RESPONSE | jq -r '.statistics.totalDetails')
    INVOICES_CREATED=$(echo $IMPORT_RESPONSE | jq -r '.statistics.invoicesCreated')
    DETAILS_CREATED=$(echo $IMPORT_RESPONSE | jq -r '.statistics.detailsCreated')
    DUPLICATES_SKIPPED=$(echo $IMPORT_RESPONSE | jq -r '.statistics.duplicatesSkipped')
    VALIDATION_ERRORS=$(echo $IMPORT_RESPONSE | jq -r '.statistics.validationErrors')
    
    echo "╔════════════════════════════════════════════════════╗"
    echo "║         THỐNG KÊ CHI TIẾT IMPORT                   ║"
    echo "╠════════════════════════════════════════════════════╣"
    
    if [ "$SUCCESS" == "true" ]; then
        echo -e "║ ${GREEN}✅ Trạng thái: THÀNH CÔNG${NC}                          ║"
    else
        echo -e "║ ${YELLOW}⚠️  Trạng thái: CÓ LỖI${NC}                              ║"
    fi
    
    echo "╠════════════════════════════════════════════════════╣"
    echo -e "║ ${BLUE}📊 Tổng số dòng:${NC} ${TOTAL_ROWS}                                 ║"
    echo -e "║ ${GREEN}✅ Thành công:${NC} ${SUCCESS_COUNT}                                  ║"
    echo -e "║ ${RED}❌ Lỗi:${NC} ${ERROR_COUNT}                                         ║"
    echo "╠════════════════════════════════════════════════════╣"
    echo -e "║ ${BLUE}📋 ext_listhoadon (Tổng):${NC} ${TOTAL_INVOICES}                    ║"
    echo -e "║ ${GREEN}✅ ext_listhoadon (Đã tạo):${NC} ${INVOICES_CREATED}                 ║"
    echo -e "║ ${BLUE}📝 ext_detailhoadon (Tổng):${NC} ${TOTAL_DETAILS}                   ║"
    echo -e "║ ${GREEN}✅ ext_detailhoadon (Đã tạo):${NC} ${DETAILS_CREATED}                ║"
    echo "╠════════════════════════════════════════════════════╣"
    
    if [ "$DUPLICATES_SKIPPED" != "0" ] && [ "$DUPLICATES_SKIPPED" != "null" ]; then
        echo -e "║ ${YELLOW}⚠️  Hóa đơn trùng lặp:${NC} ${DUPLICATES_SKIPPED}                       ║"
    fi
    
    if [ "$VALIDATION_ERRORS" != "0" ] && [ "$VALIDATION_ERRORS" != "null" ]; then
        echo -e "║ ${RED}❌ Lỗi validation:${NC} ${VALIDATION_ERRORS}                           ║"
    fi
    
    echo "╠════════════════════════════════════════════════════╣"
    
    # Tính tỷ lệ thành công
    if [ "$TOTAL_INVOICES" != "0" ]; then
        SUCCESS_RATE=$(echo "scale=2; ($INVOICES_CREATED * 100) / $TOTAL_INVOICES" | bc)
        echo -e "║ ${BLUE}📈 Tỷ lệ thành công:${NC} ${SUCCESS_RATE}%                         ║"
    fi
    
    # Tính trung bình chi tiết trên mỗi hóa đơn
    if [ "$INVOICES_CREATED" != "0" ]; then
        AVG_DETAILS=$(echo "scale=2; $DETAILS_CREATED / $INVOICES_CREATED" | bc)
        echo -e "║ ${BLUE}📊 TB chi tiết/hóa đơn:${NC} ${AVG_DETAILS}                       ║"
    fi
    
    echo "╚════════════════════════════════════════════════════╝"
    echo ""
    
    echo "💬 Message: $MESSAGE"
    echo ""
    
    # Hiển thị danh sách hóa đơn đã tạo
    INVOICES_CREATED_LIST=$(echo $IMPORT_RESPONSE | jq -r '.invoicesCreated[]?')
    if [ ! -z "$INVOICES_CREATED_LIST" ]; then
        echo "📋 Danh sách hóa đơn đã xử lý:"
        echo "=================================================="
        echo $IMPORT_RESPONSE | jq -r '.invoicesCreated[] | 
            "[\(.status | if . == "created" then "✅ Đã tạo" elif . == "duplicate" then "⚠️  Trùng" else "❌ Lỗi" end)] " + 
            "Số: \(.shdon) | " + 
            "Ký hiệu: \(.khhdon) | " +
            "Chi tiết: \(.detailsCount) dòng | " +
            "Tổng tiền: \(.tgtttbso)"'
        echo "=================================================="
        echo ""
    fi
    
    # Hiển thị chi tiết lỗi nếu có
    ERRORS=$(echo $IMPORT_RESPONSE | jq -r '.errors[]?')
    if [ ! -z "$ERRORS" ]; then
        echo -e "${RED}❌ Chi tiết lỗi:${NC}"
        echo "=================================================="
        echo $IMPORT_RESPONSE | jq -r '.errors[] | "Dòng \(.row): \(.error)"'
        echo "=================================================="
        echo ""
    fi
    
    echo ""
    echo "✨ Test hoàn tất!"
    echo ""
    
    # Kiểm tra xem có đủ thông tin chi tiết không
    echo "🔍 Kiểm tra tính năng mới:"
    if [ "$TOTAL_INVOICES" != "null" ] && [ "$TOTAL_DETAILS" != "null" ] && \
       [ "$INVOICES_CREATED" != "null" ] && [ "$DETAILS_CREATED" != "null" ]; then
        echo -e "${GREEN}✅ statistics.totalInvoices: OK${NC}"
        echo -e "${GREEN}✅ statistics.totalDetails: OK${NC}"
        echo -e "${GREEN}✅ statistics.invoicesCreated: OK${NC}"
        echo -e "${GREEN}✅ statistics.detailsCreated: OK${NC}"
    else
        echo -e "${RED}❌ Thiếu thông tin thống kê chi tiết${NC}"
    fi
    
    INVOICES_LIST_COUNT=$(echo $IMPORT_RESPONSE | jq -r '.invoicesCreated | length')
    if [ "$INVOICES_LIST_COUNT" != "null" ] && [ "$INVOICES_LIST_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ invoicesCreated list: OK (${INVOICES_LIST_COUNT} items)${NC}"
    else
        echo -e "${RED}❌ Thiếu danh sách hóa đơn đã tạo${NC}"
    fi
    
else
    echo -e "${YELLOW}⚠️  jq không được cài đặt. Hiển thị raw response:${NC}"
    echo "$IMPORT_RESPONSE"
fi

echo ""
echo "=================================================="
echo "🎉 Test hoàn tất!"
echo "=================================================="
