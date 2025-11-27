# Scripts Directory

Thư mục chứa tất cả các scripts quản lý, deployment và utilities của dự án multi-domain.

## 🚀 Quick Start

### Interactive Menu (Recommended)
```bash
bun run dev              # Open interactive menu
bun run menu             # Alternative launcher
```

### Quick Commands
```bash
# Quick development
bun run quick:dev [rausach|tazagroup|timona]
# Example: bun run quick:dev rausach

# Quick deploy
bun run quick:deploy [rausach|tazagroup|timona]
# Example: bun run quick:deploy tazagroup

# Quick database studio
bun run quick:db [rausach|tazagroup|timona]
# Example: bun run quick:db timona
```

### Direct Domain Commands
```bash
# Development
bun run dev:rausach
bun run dev:tazagroup
bun run dev:timona

# Deploy
bun run deploy:rausach
bun run deploy:tazagroup
bun run deploy:timona

# Database
bun run db:studio:rausach
bun run db:studio:tazagroup
bun run db:studio:timona
```

## 📁 Organized Structure

```
scripts/
├── 📌 Main Entry Points
│   ├── dev.sh                    # Main interactive menu launcher
│   ├── quick-dev.sh              # Quick dev start with arg
│   ├── quick-deploy.sh           # Quick deploy with arg
│   └── db-studio.sh              # Quick database studio with arg
│
├── 📂 core/                      # Core menu scripts
│   ├── dev-deploy-menu.sh        # Main interactive menu
│   └── menu.sh                   # Menu launcher
│
├── 📂 deploy/                    # Deployment scripts per domain
│   ├── deploy-rausach.sh         # RAUSACH deployment
│   ├── deploy-tazagroup.sh       # TAZAGROUP deployment
│   └── deploy-timona.sh          # TIMONA deployment
│
├── 📂 dev/                       # Development utilities
│   ├── dev-menu.sh               # Dev-specific menu
│   ├── fix-file-watchers.sh     # Fix file watching issues
│   └── kill-dev-servers.sh      # Kill dev servers
│
├── 📂 db/                        # Database scripts
│   ├── migrate-*.ts              # Migration scripts
│   └── seed-*.sh                # Seed scripts
│
├── 📂 utils/                     # Utility scripts
│   ├── kill-ports.sh            # Kill processes on ports
│   ├── test-*.ts                # Test scripts
│   ├── debug-*.ts               # Debug scripts
│   └── audit-*.ts               # Audit scripts
│
└── 📂 legacy/                    # Legacy scripts (deprecated)
    ├── 1sshauto.sh              # Old SSH automation
    ├── 2autogit.sh              # Old Git automation
    └── vscode-menu.sh           # Old VS Code menu
```

## 🏢 Multi-Domain Support

### RAUSACH - shop.rausachtrangia.com
- **Frontend**: Port 12000
- **Backend**: Port 12001
- **MinIO Bucket**: shopuploads
- **Env Files**: `.env.dev.rausach`, `.env.prod.rausach`

### TAZAGROUP - app.tazagroup.vn
- **Frontend**: Port 13000
- **Backend**: Port 13001
- **MinIO Bucket**: tazagroup-uploads
- **Env Files**: `.env.dev.tazagroup`, `.env.prod.tazagroup`

### TIMONA - app.timona.edu.vn
- **Frontend**: Port 15000
- **Backend**: Port 15001
- **MinIO Bucket**: timona-uploads
- **Env Files**: `.env.dev.timona`, `.env.prod.timona`
