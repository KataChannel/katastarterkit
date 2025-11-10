# 🚀 Development Menu Guide

## Quick Start

### Method 1: Interactive Menu (Recommended for VS Code)

```bash
bun run menu
```

This opens an interactive menu where you can select commands to run.

### Method 2: VS Code Tasks (Best for Multiple Terminals)

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select the task you want to run
4. Each task runs in a new terminal

Available tasks:
- **Dev - Backend + Frontend**: Run both services
- **Dev - Backend**: Backend only
- **Dev - Frontend**: Frontend only
- **Rausach - Full/Backend/Frontend**: Port 12000/12001
- **Tazagroup - Full/Backend/Frontend**: Port 13000/13001
- **Prisma Studio**: Database management
- **Docker**: Start/stop services

### Method 3: Direct Commands

```bash
# Rausach domain
bun run dev:rausach              # Both backend + frontend
bun run dev:rausach:backend      # Backend only (port 12001)
bun run dev:rausach:frontend     # Frontend only (port 12000)

# Tazagroup domain
bun run dev:tazagroup            # Both backend + frontend
bun run dev:tazagroup:backend    # Backend only (port 13001)
bun run dev:tazagroup:frontend   # Frontend only (port 13000)

# Database
bun run db:studio                # Default database
bun run db:studio:rausach        # Rausach database
bun run db:studio:tazagroup      # Tazagroup database

# Docker
bun run docker:dev               # Start services
bun run docker:down              # Stop services
```

## 📝 VS Code Terminal Workflow

**Best practice for debugging:**

1. Open VS Code terminal
2. Split terminal into multiple panes:
   - `Ctrl+Shift+5` to split terminal
3. In each pane, run different services:
   - Pane 1: `bun run dev:rausach:backend`
   - Pane 2: `bun run dev:rausach:frontend`
   - Pane 3: `bun run db:studio:rausach`

**Or use Tasks:**
1. `Ctrl+Shift+P` → "Tasks: Run Task" → Select task
2. Each task opens in new terminal automatically
3. All terminals visible in TERMINAL panel

## 🎯 Tips

- **Multiple domains**: Run each domain in separate terminal tabs
- **Debugging**: Split terminals to see backend + frontend logs side by side
- **Database**: Keep Prisma Studio open in separate terminal for real-time data inspection
- **Docker**: Start services once, keep running across sessions

## ⚡ Kill Ports (Fix Port Conflicts)

**TRIỆT ĐỂ - Kill tất cả dev processes và ports:**

```bash
# Kill all dev ports and processes (RECOMMENDED)
bun run kill:all
# or
./scripts/kill-ports.sh

# Kill specific ports
bun run kill:12000    # Rausach frontend
bun run kill:12001    # Rausach backend
bun run kill:13000    # Tazagroup frontend
bun run kill:13001    # Tazagroup backend
```

**Script kill-ports.sh sử dụng 4 phương pháp:**
1. `fuser` - Kill by port
2. `lsof` - List and kill open files
3. `netstat` - Network statistics
4. `ss` - Socket statistics

**Kills by process name:**
- `next dev`
- `ts-node-dev`
- `nest start`
- `bun run dev`
- `prisma studio`

**Or use the menu:**
- `bun run menu` → Select kill port options (18-22 in vscode-menu, 31-35 in dev-menu)

**Or manually:**
```bash
# Find process using port
lsof -i :12000

# Kill specific port
./scripts/kill-ports.sh 12000

# Kill process on specific port
fuser -k 12000/tcp
```

## 🔧 Troubleshooting

**Menu not working:**
```bash
chmod +x vscode-menu.sh
./vscode-menu.sh
```

**Tasks not showing:**
- Ensure `.vscode/tasks.json` exists
- Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"

**Port conflicts:**
- Rausach: 12000 (frontend), 12001 (backend)
- Tazagroup: 13000 (frontend), 13001 (backend)
- Use `bun run kill:all` to clear all ports
- Or kill individual ports: `bun run kill:12000`, etc.
