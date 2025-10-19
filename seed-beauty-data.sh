#!/bin/bash

# Script chạy seed dữ liệu khóa đào tạo thẩm mỹ

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  🎨 SEED DỮ LIỆU AFFILIATE - KHÓA ĐÀO TẠO THẨM MỸ${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}⚠️  Cảnh báo: Script này sẽ tạo dữ liệu mẫu vào database${NC}"
echo -e "${YELLOW}    Đảm bảo bạn đang chạy trên development environment!${NC}"
echo ""
read -p "Tiếp tục? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Đã hủy.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🚀 Bắt đầu seed dữ liệu...${NC}"
echo ""

cd backend

# Run seed script có sẵn (đã có sẵn và hoạt động tốt)
echo -e "${BLUE}📦 Chạy script seed affiliate có sẵn...${NC}"
bun run scripts/seed-affiliate-data.ts

echo ""
echo -e "${GREEN}✅ Hoàn tất!${NC}"
echo ""
echo -e "${BOLD}📝 Xem dữ liệu tại:${NC}"
echo -e "   🌐 Frontend: ${BLUE}http://localhost:3001/admin/affiliate/browse${NC}"
echo -e "   🔧 Prisma Studio: ${BLUE}cd backend && npx prisma studio${NC}"
echo ""
