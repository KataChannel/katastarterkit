#!/bin/bash

echo "🚀 Starting Audit Optimization Deployment..."
echo ""

# Step 1: Check current audit logs status
echo "📊 Step 1: Checking current status..."
cd /mnt/chikiet/kataoffical/shoprausach/backend

cat > temp-check-status.ts << 'EOF'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const total = await prisma.auditLog.count();
  const last7 = await prisma.auditLog.count({
    where: { timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
  });
  
  console.log(`Total logs: ${total.toLocaleString()}`);
  console.log(`Last 7 days: ${last7.toLocaleString()}`);
  console.log(`Estimated size: ${((total * 1905) / (1024 * 1024)).toFixed(2)} MB`);
  
  await prisma.$disconnect();
}

check();
EOF

bun temp-check-status.ts
echo ""

# Step 2: Info
echo "✅ Audit optimization services have been deployed!"
echo ""
echo "📝 What has been configured:"
echo "  ✓ AuditOptimizationService - với 9 chiến lược tối ưu"
echo "  ✓ SmartAuditService - thay thế EnhancedAuditService"
echo "  ✓ AuditModule - đã thêm vào AppModule"
echo "  ✓ Cron job - chạy cleanup hàng ngày lúc 2 AM"
echo ""

# Step 3: Next steps
echo "🎯 NEXT STEPS:"
echo ""
echo "1️⃣  START SERVER và kiểm tra:"
echo "    bun dev"
echo "    # Check logs xem có lỗi không"
echo ""
echo "2️⃣  MANUAL CLEANUP (optional - đã chạy rồi):"
echo "    bun cleanup-audit-now.ts"
echo ""
echo "3️⃣  THAY THẾ EnhancedAuditService bằng SmartAuditService:"
echo "    # Tìm trong code:"
echo "    grep -r \"EnhancedAuditService\" src/"
echo "    # Thay thế thủ công hoặc tôi sẽ giúp"
echo ""
echo "4️⃣  MONITOR trong vài ngày:"
echo "    # Check logs growth"
echo "    bun check-audit-size.ts"
echo ""
echo "5️⃣  PRODUCTION DEPLOYMENT:"
echo "    # Backup trước"
echo "    bun run db:backup"
echo "    # Deploy"
echo "    bun run docker:prod"
echo ""

# Cleanup
rm -f temp-check-status.ts

echo "📚 Chi tiết đầy đủ: backend/AUDIT_OPTIMIZATION_GUIDE.md"
echo ""
echo "🎉 Deployment preparation complete!"
