# 📜 Scripts Directory - Full Index

Utility scripts for development, testing, and maintenance.

## 🚀 Development Scripts

### **1sshauto.sh** - SSH Auto Setup
Auto SSH configuration and key management

### **2autogit.sh** - Auto Git Operations  
Automated git commands and workflows

### **3deploy.sh** - Deployment
Deploy application (see [README-DEPLOY.md](./README.md) for deployment docs)

### **4docsclean.sh** - Documentation Organizer ⚠️
Recursively organizes markdown files into `docs/` folder with numbering.

**⚠️ Known Issue**: Uses `find` command which may create long-running processes. If script hangs after Ctrl+C, see [FIX_SCRIPT_RUNNING_BACKGROUND.md](../FIX_SCRIPT_RUNNING_BACKGROUND.md)

**Usage**:
```bash
./4docsclean.sh              # Normal run
./4docsclean.sh --dry-run    # Preview changes
./4docsclean.sh --archive    # Archive old docs
./4docsclean.sh --category FIX  # Only process FIX-*.md files
```

### **5killport.sh** - Port Killer
Kill processes using specific ports

**Usage**:
```bash
bash 5killport.sh
# Enter ports: 4000 12000
```

### **6kill-dev-servers.sh** - Dev Server Killer ✨
Kill all development servers running in background (concurrently, ts-node-dev, next dev)

**Use when**: Ctrl+C doesn't kill servers properly

**Usage**:
```bash
bash 6kill-dev-servers.sh
# Or auto-kill:
# Press 'y' when prompted
```

**What it kills**:
- `concurrently` processes
- `ts-node-dev` backend servers
- `next dev` frontend servers
- `postcss` workers

## 🛠️ Utility Scripts

### **fix-file-watchers.sh** - Fix File Watcher Limits
Increase system file watcher limits for large projects

### **kill-ports.sh** - Alternative Port Killer
Another version of port killing utility

## 🐛 Testing & Debug Scripts

### **bug-fix-summary-chat.sh** - Bug Fix Summary
Generate summary of bug fixes and chat logs

### **quick-test-chat.sh** - Quick Chat Test
Quick testing for chat functionality

### **test-chat-membership.ts** - Chat Membership Test
Test chat membership features

### **test-create-project-graphql.ts** - Project Creation Test (GraphQL)
Test project creation via GraphQL

### **test-create-project-with-owner.ts** - Project with Owner Test
Test project creation with owner assignment

### **debug-jwt-token.ts** - JWT Token Debugger
Debug and decode JWT tokens

### **debug-project-membership.ts** - Project Membership Debugger
Debug project membership issues

## 🔍 Audit Scripts

### **audit-all-projects.ts** - Project Audit
Audit all projects in the system

### **fix-project-owners-as-members.ts** - Fix Project Owners
Fix project owner membership issues

## 📖 Usage Guide

### Via Menu Script (Recommended)
```bash
cd /path/to/project
./menu.sh
# Select script number from list
```

### Direct Execution
```bash
cd /path/to/project
bash scripts/4docsclean.sh
```

## ⚠️ Common Issues & Solutions

### 1. Script still running after Ctrl+C

**Problem**: Dev servers or background processes still running after closing terminal

**Solution**:
```bash
# Quick fix
bash scripts/6kill-dev-servers.sh

# Or manual
pkill -9 -f "concurrently"
pkill -9 -f "ts-node-dev"
pkill -9 -f "next dev"
```

**Full Guide**: [FIX_SCRIPT_RUNNING_BACKGROUND.md](../FIX_SCRIPT_RUNNING_BACKGROUND.md)

### 2. Port already in use

**Solution**:
```bash
bash scripts/5killport.sh
# Enter: 4000 12000
```

### 3. Too many file watchers

**Solution**:
```bash
bash scripts/fix-file-watchers.sh
```

## 🔧 Script Development

### Adding a New Script

1. Create script in `scripts/` folder:
   ```bash
   touch scripts/7my-new-script.sh
   chmod +x scripts/7my-new-script.sh
   ```

2. Add shebang and description:
   ```bash
   #!/bin/bash
   # Description: What this script does
   
   echo "Script running..."
   ```

3. Script will automatically appear in `./menu.sh`

### Script Naming Convention

- Prefix with number: `1`, `2`, `3`, etc.
- Use descriptive names: `docsclean`, `killport`, etc.
- Use `.sh` extension for shell scripts
- Use `.ts` extension for TypeScript scripts

## 📊 Script Categories

| Category | Scripts | Purpose |
|----------|---------|---------|
| **Development** | 1-3 | SSH, Git, Deploy |
| **Maintenance** | 4-6 | Docs, Port management |
| **Testing** | test-*, debug-* | Testing and debugging |
| **Utilities** | fix-*, kill-* | System utilities |
| **Audit** | audit-* | System audits |

## 💡 Best Practices

### 1. Always check before running
```bash
# Preview what script does
head -20 scripts/4docsclean.sh
```

### 2. Use dry-run when available
```bash
./4docsclean.sh --dry-run
```

### 3. Kill processes before starting new ones
```bash
bash scripts/6kill-dev-servers.sh
# Then start your dev server
```

### 4. Monitor running processes
```bash
# Terminal 1: Run script
./menu.sh

# Terminal 2: Monitor
watch -n 1 'ps aux | grep -E "node|bun" | grep -v grep'
```

### 5. Use --help when available
```bash
./4docsclean.sh --help
```

## 🆘 Emergency Commands

### Kill Everything
```bash
# Kill all Node processes (DANGEROUS!)
pkill -9 node

# Kill all Bun processes
pkill -9 bun

# Kill by port
lsof -ti:4000 | xargs kill -9
```

### Check What's Running
```bash
# Check processes
ps aux | grep -E "node|bun|concurrently" | grep -v grep

# Check ports
lsof -i:4000
lsof -i:12000

# Check all open ports
netstat -tulpn | grep LISTEN
```

### Clean Up
```bash
# Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Remove all .next caches
find . -name ".next" -type d -prune -exec rm -rf {} +

# Remove all dist folders
find . -name "dist" -type d -prune -exec rm -rf {} +
```

## 📚 Related Documentation

- **Deployment**: [README.md](./README.md) (in this folder)
- **Background Process Issues**: [FIX_SCRIPT_RUNNING_BACKGROUND.md](../FIX_SCRIPT_RUNNING_BACKGROUND.md)
- **Menu Script**: [menu.sh](../menu.sh)

## 🔗 Quick Links

- [Main Project README](../README.md)
- [Deployment Guide](./DEPLOY_GUIDE.md)
- [Deployment Summary](./DEPLOY_SUMMARY.md)

---

**Last Updated**: 2024-11-11  
**Maintainer**: Development Team  
**Location**: `/scripts/`
