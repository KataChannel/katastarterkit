#!/bin/bash

# Display Multi-Domain Setup Summary

cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🎉 MULTI-DOMAIN DEPLOYMENT SETUP COMPLETE! 🎉             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📦 Setup: 2 Domains on 1 Server (1 Core / 1GB RAM / 5GB Disk)

🌐 DOMAINS:
   • Rausach    → http://116.118.49.243:12000 (Backend: 12001)
   • Tazagroup  → http://116.118.49.243:13000 (Backend: 13001)

🚀 QUICK START:

   1. Check system:
      ./check-system-multi-domain.sh

   2. Setup swap (important!):
      make -f Makefile.multi-domain setup-swap

   3. Start all services:
      make -f Makefile.multi-domain start-all
      
      OR start individually:
      make -f Makefile.multi-domain start-rausach
      make -f Makefile.multi-domain start-tazagroup

   4. Check status:
      make -f Makefile.multi-domain status

📋 USEFUL COMMANDS:

   make -f Makefile.multi-domain help              # Show all commands
   make -f Makefile.multi-domain logs              # View logs
   make -f Makefile.multi-domain stop-all          # Stop all
   make -f Makefile.multi-domain backup-rausach    # Backup
   
   OR use interactive menu:
   ./deploy-multi-domain.sh

📚 DOCUMENTATION:

   • QUICK_START_MULTI_DOMAIN.md      - Quick start guide
   • HUONG_DAN_MULTI_DOMAIN.md        - Detailed guide
   • SO_SANH_PHUONG_AN_DEPLOY.md      - Deployment comparisons
   • MULTI_DOMAIN_SETUP_COMPLETE.md   - Complete setup info

🔧 CONFIGURATION:

   ✓ docker-compose.multi-domain.yml  - Main compose file
   ✓ .env.rausach                     - Rausach config
   ✓ .env.tazagroup                   - Tazagroup config

💾 RESOURCE ALLOCATION:

   Service              Memory    Port(s)
   ────────────────────────────────────────
   PostgreSQL (shared)  256MB     12003
   Redis (shared)       128MB     12004
   Minio (shared)       128MB     12007, 12008
   Rausach Backend      256MB     12001
   Rausach Frontend     256MB     12000
   Tazagroup Backend    256MB     13001
   Tazagroup Frontend   256MB     13000
   ────────────────────────────────────────
   TOTAL               ~1.4GB

⚠️  IMPORTANT:
   
   ✓ Create 2GB swap file before starting!
   ✓ Monitor RAM usage regularly
   ✓ Backup databases daily
   ✓ Change default passwords in .env files

🎯 NEXT STEPS:

   1. Read QUICK_START_MULTI_DOMAIN.md
   2. Run system check
   3. Setup swap file
   4. Start services
   5. Test both domains
   6. Setup backups

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              Ready to deploy! Good luck! 🚀                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

EOF
