# Scripts Index

Quick reference for all available scripts in the project.

## 🎯 Main Commands (package.json)

### Entry Points
| Command | Description |
|---------|-------------|
| `bun run dev` | Open interactive multi-domain menu |
| `bun run menu` | Alternative menu launcher |
| `bun run quick:dev [domain]` | Quick start dev for specific domain |
| `bun run quick:deploy [domain]` | Quick deploy for specific domain |
| `bun run quick:db [domain]` | Quick open Prisma Studio for domain |

### Development - RAUSACH
| Command | Description |
|---------|-------------|
| `bun run dev:rausach` | Full dev (Backend + Frontend) |
| `bun run dev:rausach:backend` | Backend only (Port 12001) |
| `bun run dev:rausach:frontend` | Frontend only (Port 12000) |

### Development - TAZAGROUP
| Command | Description |
|---------|-------------|
| `bun run dev:tazagroup` | Full dev (Backend + Frontend) |
| `bun run dev:tazagroup:backend` | Backend only (Port 13001) |
| `bun run dev:tazagroup:frontend` | Frontend only (Port 13000) |

### Development - TIMONA
| Command | Description |
|---------|-------------|
| `bun run dev:timona` | Full dev (Backend + Frontend) |
| `bun run dev:timona:backend` | Backend only (Port 15001) |
| `bun run dev:timona:frontend` | Frontend only (Port 15000) |

### Build & Deploy - RAUSACH
| Command | Description |
|---------|-------------|
| `bun run build:rausach` | Build code with prod env |
| `bun run build:rausach:image` | Build Docker images |
| `bun run build:rausach:save` | Save images to tar.gz |
| `bun run deploy:rausach` | Complete deploy workflow |

### Build & Deploy - TAZAGROUP
| Command | Description |
|---------|-------------|
| `bun run build:tazagroup` | Build code with prod env |
| `bun run build:tazagroup:image` | Build Docker images |
| `bun run build:tazagroup:save` | Save images to tar.gz |
| `bun run deploy:tazagroup` | Complete deploy workflow |

### Build & Deploy - TIMONA
| Command | Description |
|---------|-------------|
| `bun run build:timona` | Build code with prod env |
| `bun run build:timona:image` | Build Docker images |
| `bun run build:timona:save` | Save images to tar.gz |
| `bun run deploy:timona` | Complete deploy workflow |

### Database - RAUSACH
| Command | Description |
|---------|-------------|
| `bun run db:studio:rausach` | Open Prisma Studio |
| `bun run db:migrate:rausach` | Run migrations |
| `bun run db:push:rausach` | Push schema changes |
| `bun run db:seed:rausach` | Seed database |
| `bun run db:reset:rausach` | Reset database |

### Database - TAZAGROUP
| Command | Description |
|---------|-------------|
| `bun run db:studio:tazagroup` | Open Prisma Studio |
| `bun run db:migrate:tazagroup` | Run migrations |
| `bun run db:push:tazagroup` | Push schema changes |
| `bun run db:seed:tazagroup` | Seed database |
| `bun run db:reset:tazagroup` | Reset database |

### Database - TIMONA
| Command | Description |
|---------|-------------|
| `bun run db:studio:timona` | Open Prisma Studio |
| `bun run db:migrate:timona` | Run migrations |
| `bun run db:push:timona` | Push schema changes |
| `bun run db:seed:timona` | Seed database |
| `bun run db:reset:timona` | Reset database |

### General Commands
| Command | Description |
|---------|-------------|
| `bun run build` | Build backend + frontend |
| `bun run test` | Run all tests |
| `bun run lint` | Lint all code |
| `bun run format` | Format code with Prettier |
| `bun run setup` | Install all dependencies |
| `bun run clean` | Remove all node_modules |
| `bun run kill:ports` | Kill processes on all ports |

### Docker Commands
| Command | Description |
|---------|-------------|
| `bun run docker:dev` | Start dev infrastructure |
| `bun run docker:infra` | Start infrastructure services |
| `bun run docker:app` | Start application services |
| `bun run docker:down` | Stop all services |

## 📄 Shell Scripts

### Core Scripts (scripts/)
| File | Description |
|------|-------------|
| `dev.sh` | Main entry point - opens interactive menu |
| `quick-dev.sh [domain]` | Quick start dev with domain argument |
| `quick-deploy.sh [domain]` | Quick deploy with domain argument |
| `db-studio.sh [domain]` | Quick open Prisma Studio |

### Core Menu (scripts/core/)
| File | Description |
|------|-------------|
| `dev-deploy-menu.sh` | Main interactive menu system |
| `menu.sh` | Quick menu launcher |

### Deploy Scripts (scripts/deploy/)
| File | Description |
|------|-------------|
| `deploy-rausach.sh` | Deploy RAUSACH to production |
| `deploy-tazagroup.sh` | Deploy TAZAGROUP to production |
| `deploy-timona.sh` | Deploy TIMONA to production |

### Development Scripts (scripts/dev/)
| File | Description |
|------|-------------|
| `dev-menu.sh` | Development-specific menu |
| `fix-file-watchers.sh` | Fix file watching issues |
| `kill-dev-servers.sh` | Kill development servers |

### Database Scripts (scripts/db/)
| File | Description |
|------|-------------|
| `migrate-secure-urls.ts` | Migrate URLs to secure storage |
| `migrate-storage-domain.ts` | Migrate storage domain |
| `seed-release-hub.sh` | Seed release hub data |

### Utility Scripts (scripts/utils/)
| File | Description |
|------|-------------|
| `kill-ports.sh [ports...]` | Kill processes on specific ports |
| `test-*.ts` | Various test scripts |
| `debug-*.ts` | Various debug scripts |
| `audit-*.ts` | Audit scripts |

## 🗂️ Directory Structure

```
scripts/
├── dev.sh                       # ⭐ Main entry
├── quick-dev.sh                 # ⭐ Quick dev
├── quick-deploy.sh              # ⭐ Quick deploy
├── db-studio.sh                 # ⭐ Quick DB studio
│
├── core/                        # Core menu system
│   ├── dev-deploy-menu.sh
│   └── menu.sh
│
├── deploy/                      # Deployment scripts
│   ├── deploy-rausach.sh
│   ├── deploy-tazagroup.sh
│   └── deploy-timona.sh
│
├── dev/                         # Development utilities
│   ├── dev-menu.sh
│   ├── fix-file-watchers.sh
│   └── kill-dev-servers.sh
│
├── db/                          # Database scripts
│   ├── migrate-secure-urls.ts
│   ├── migrate-storage-domain.ts
│   └── seed-release-hub.sh
│
├── utils/                       # Utility scripts
│   ├── kill-ports.sh
│   ├── test-*.ts
│   ├── debug-*.ts
│   └── audit-*.ts
│
├── legacy/                      # Deprecated scripts
│   ├── 1sshauto.sh
│   ├── 2autogit.sh
│   └── vscode-menu.sh
│
├── deployment/                  # Legacy deployment (old)
├── docker/                      # Legacy docker (old)
├── infrastructure/              # Legacy infra (old)
└── setup/                       # Legacy setup (old)
```

## 🎨 Usage Examples

### Start Development
```bash
# Interactive menu (choose domain)
bun run dev

# Quick start specific domain
bun run quick:dev rausach
bun run quick:dev t           # shorthand for tazagroup
bun run quick:dev timona

# Direct command
bun run dev:rausach
```

### Deploy to Production
```bash
# Interactive menu (choose domain)
bun run dev → Select domain → Option 4

# Quick deploy
bun run quick:deploy rausach
bun run quick:deploy t        # shorthand for tazagroup

# Full command
bun run deploy:rausach
```

### Database Management
```bash
# Open Prisma Studio
bun run quick:db rausach
bun run db:studio:tazagroup

# Run migrations
bun run db:migrate:rausach
bun run db:migrate:tazagroup

# Seed database
bun run db:seed:timona
```

### Kill Ports
```bash
# Kill all app ports (12000-15001)
bun run kill:ports

# Kill specific ports
./scripts/utils/kill-ports.sh 12000 12001
```

## 📚 Related Documentation

- [README.md](README.md) - Scripts overview
- [MULTI_DOMAIN_DEPLOY.md](../MULTI_DOMAIN_DEPLOY.md) - Deployment guide
- [package.json](../package.json) - All npm scripts
