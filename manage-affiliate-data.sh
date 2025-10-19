#!/bin/bash

# ====================================================
# AFFILIATE SYSTEM DATA MANAGEMENT SCRIPT
# ====================================================
# This script helps you manage sample data for the
# affiliate system in your database.
# ====================================================

set -e

BACKEND_DIR="/chikiet/kataoffical/fullstack/katacore/backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║    AFFILIATE SYSTEM - DATA MANAGEMENT SCRIPT        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

show_menu() {
    echo ""
    echo -e "${YELLOW}Available Commands:${NC}"
    echo ""
    echo "  1) seed       - Create sample affiliate data"
    echo "  2) clear      - Clear all affiliate data"
    echo "  3) reseed     - Clear and recreate all data"
    echo "  4) stats      - Show database statistics"
    echo "  5) help       - Show this help message"
    echo "  6) exit       - Exit script"
    echo ""
}

seed_data() {
    echo -e "${GREEN}🌱 Seeding affiliate system data...${NC}"
    cd "$BACKEND_DIR"
    bun scripts/seed-affiliate-data.ts
    echo -e "${GREEN}✅ Data seeding completed!${NC}"
}

clear_data() {
    echo -e "${YELLOW}⚠️  WARNING: This will delete ALL affiliate data!${NC}"
    echo -e "${YELLOW}This includes:${NC}"
    echo "  - Affiliate/Merchant users"
    echo "  - Campaigns"
    echo "  - Links"
    echo "  - Clicks"
    echo "  - Conversions"
    echo "  - Payment Requests"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" == "yes" ]; then
        echo -e "${BLUE}🗑️  Clearing affiliate data...${NC}"
        cd "$BACKEND_DIR"
        
        # Using Prisma to delete data in correct order
        bun -e "
        import { PrismaClient } from '@prisma/client';
        const prisma = new PrismaClient();
        
        async function clearData() {
          console.log('Deleting payment requests...');
          await prisma.affPaymentRequest.deleteMany({});
          
          console.log('Deleting conversions...');
          await prisma.affConversion.deleteMany({});
          
          console.log('Deleting clicks...');
          await prisma.affClick.deleteMany({});
          
          console.log('Deleting links...');
          await prisma.affLink.deleteMany({});
          
          console.log('Deleting campaign affiliates...');
          await prisma.affCampaignAffiliate.deleteMany({});
          
          console.log('Deleting campaigns...');
          await prisma.affCampaign.deleteMany({});
          
          console.log('Deleting affiliate users...');
          await prisma.affUser.deleteMany({});
          
          console.log('✅ All affiliate data cleared!');
          await prisma.\$disconnect();
        }
        
        clearData().catch(console.error);
        "
        
        echo -e "${GREEN}✅ Data cleared successfully!${NC}"
    else
        echo -e "${YELLOW}❌ Operation cancelled${NC}"
    fi
}

reseed_data() {
    echo -e "${BLUE}♻️  Reseeding affiliate data...${NC}"
    clear_data
    if [ $? -eq 0 ]; then
        seed_data
    fi
}

show_stats() {
    echo -e "${BLUE}📊 Fetching database statistics...${NC}"
    cd "$BACKEND_DIR"
    
    bun -e "
    import { PrismaClient } from '@prisma/client';
    const prisma = new PrismaClient();
    
    async function getStats() {
      const users = await prisma.affUser.count();
      const affiliates = await prisma.affUser.count({ where: { role: 'AFFILIATE' } });
      const merchants = await prisma.affUser.count({ where: { role: 'MERCHANT' } });
      const campaigns = await prisma.affCampaign.count();
      const activeCampaigns = await prisma.affCampaign.count({ where: { status: 'ACTIVE' } });
      const applications = await prisma.affCampaignAffiliate.count();
      const approvedApps = await prisma.affCampaignAffiliate.count({ where: { status: 'approved' } });
      const links = await prisma.affLink.count();
      const activeLinks = await prisma.affLink.count({ where: { isActive: true } });
      const clicks = await prisma.affClick.count();
      const conversions = await prisma.affConversion.count();
      const pendingConversions = await prisma.affConversion.count({ where: { status: 'PENDING' } });
      const approvedConversions = await prisma.affConversion.count({ where: { status: 'APPROVED' } });
      const paidConversions = await prisma.affConversion.count({ where: { status: 'PAID' } });
      const paymentRequests = await prisma.affPaymentRequest.count();
      const pendingPayments = await prisma.affPaymentRequest.count({ where: { status: 'PENDING' } });
      const completedPayments = await prisma.affPaymentRequest.count({ where: { status: 'COMPLETED' } });
      
      // Financial stats
      const totalRevenue = await prisma.affConversion.aggregate({
        _sum: { saleAmount: true }
      });
      
      const totalCommission = await prisma.affConversion.aggregate({
        _sum: { commission: true }
      });
      
      const totalPaid = await prisma.affPaymentRequest.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      });
      
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('📊 AFFILIATE SYSTEM DATABASE STATISTICS');
      console.log('═══════════════════════════════════════════');
      console.log('');
      console.log('👥 USERS:');
      console.log('   Total Affiliate Users:    ' + users);
      console.log('   ├─ Affiliates:            ' + affiliates);
      console.log('   └─ Merchants:             ' + merchants);
      console.log('');
      console.log('📋 CAMPAIGNS:');
      console.log('   Total Campaigns:          ' + campaigns);
      console.log('   └─ Active:                ' + activeCampaigns);
      console.log('');
      console.log('📝 APPLICATIONS:');
      console.log('   Total Applications:       ' + applications);
      console.log('   └─ Approved:              ' + approvedApps);
      console.log('');
      console.log('🔗 LINKS:');
      console.log('   Total Links:              ' + links);
      console.log('   └─ Active:                ' + activeLinks);
      console.log('');
      console.log('📊 TRACKING:');
      console.log('   Total Clicks:             ' + clicks);
      console.log('   Total Conversions:        ' + conversions);
      console.log('   ├─ Pending:               ' + pendingConversions);
      console.log('   ├─ Approved:              ' + approvedConversions);
      console.log('   └─ Paid:                  ' + paidConversions);
      console.log('');
      console.log('💳 PAYMENTS:');
      console.log('   Total Requests:           ' + paymentRequests);
      console.log('   ├─ Pending:               ' + pendingPayments);
      console.log('   └─ Completed:             ' + completedPayments);
      console.log('');
      console.log('💵 FINANCIAL:');
      console.log('   Total Revenue:            ' + (totalRevenue._sum.saleAmount || 0).toLocaleString('vi-VN') + ' VND');
      console.log('   Total Commission:         ' + (totalCommission._sum.commission || 0).toLocaleString('vi-VN') + ' VND');
      console.log('   Total Paid Out:           ' + (totalPaid._sum.amount || 0).toLocaleString('vi-VN') + ' VND');
      console.log('   Pending Payout:           ' + ((totalCommission._sum.commission || 0) - (totalPaid._sum.amount || 0)).toLocaleString('vi-VN') + ' VND');
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('');
      
      await prisma.\$disconnect();
    }
    
    getStats().catch(console.error);
    "
}

show_help() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║           AFFILIATE DATA MANAGEMENT HELP             ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./manage-affiliate-data.sh [command]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo ""
    echo -e "  ${GREEN}seed${NC}"
    echo "    Creates sample affiliate data including:"
    echo "    - 10 users (6 affiliates, 4 merchants)"
    echo "    - 8 campaigns with various statuses"
    echo "    - Campaign applications"
    echo "    - Affiliate links with tracking codes"
    echo "    - Realistic click data (~2000 clicks)"
    echo "    - Conversions with different statuses"
    echo "    - Payment requests"
    echo ""
    echo -e "  ${RED}clear${NC}"
    echo "    Removes ALL affiliate data from database"
    echo "    ⚠️  WARNING: This action cannot be undone!"
    echo ""
    echo -e "  ${BLUE}reseed${NC}"
    echo "    Clears existing data and creates fresh sample data"
    echo ""
    echo -e "  ${BLUE}stats${NC}"
    echo "    Displays current database statistics including:"
    echo "    - User counts"
    echo "    - Campaign statistics"
    echo "    - Click and conversion metrics"
    echo "    - Financial summary"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./manage-affiliate-data.sh seed"
    echo "  ./manage-affiliate-data.sh stats"
    echo "  ./manage-affiliate-data.sh reseed"
    echo ""
}

# Main script logic
if [ $# -eq 0 ]; then
    show_menu
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1|seed)
            seed_data
            ;;
        2|clear)
            clear_data
            ;;
        3|reseed)
            reseed_data
            ;;
        4|stats)
            show_stats
            ;;
        5|help)
            show_help
            ;;
        6|exit)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            exit 1
            ;;
    esac
else
    case $1 in
        seed)
            seed_data
            ;;
        clear)
            clear_data
            ;;
        reseed)
            reseed_data
            ;;
        stats)
            show_stats
            ;;
        help)
            show_help
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${GREEN}✅ Operation completed successfully!${NC}"
