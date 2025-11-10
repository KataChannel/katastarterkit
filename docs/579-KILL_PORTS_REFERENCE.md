# 🔥 Quick Kill Ports Reference

## Quick Commands

```bash
# Kill ALL dev processes and ports (TRIỆT ĐỂ)
bun run kill:all

# Kill specific ports
bun run kill:12000  # Rausach frontend
bun run kill:12001  # Rausach backend  
bun run kill:13000  # Tazagroup frontend
bun run kill:13001  # Tazagroup backend
```

## What Gets Killed?

### Ports
- 12000 - Rausach Frontend
- 12001 - Rausach Backend
- 13000 - Tazagroup Frontend
- 13001 - Tazagroup Backend
- 3000 - Default Frontend
- 3001 - Default Backend
- 5555 - Prisma Studio

### Processes by Name
- `next dev` - Next.js development server
- `ts-node-dev.*main.ts` - NestJS backend
- `nest start.*dev` - NestJS alternative
- `bun run dev` - Bun dev processes
- `prisma studio` - Prisma database GUI

## Methods Used

Script uses 4 different methods to ensure complete kill:

1. **fuser** - Kills processes by port number
2. **lsof** - Lists open files and kills associated processes
3. **netstat** - Checks network connections and kills processes
4. **ss** - Socket statistics, kills remaining processes

## Menu Access

### VS Code Menu
```bash
bun run menu
# Select options 18-22
```

### Dev Menu (External Terminal)
```bash
./dev-menu.sh
# Select options 31-35
```

## Direct Script

```bash
# Kill all
./scripts/kill-ports.sh

# Kill specific port
./scripts/kill-ports.sh 12000
```

## Manual Methods

```bash
# Find process on port
lsof -i :12000

# Kill by port
fuser -k 12000/tcp

# Kill by PID
kill -9 <PID>

# Find and kill Node processes
ps aux | grep node | grep -v grep
pkill -f "next dev"
pkill -f "ts-node-dev"
```

## Troubleshooting

**Port still in use after kill?**
```bash
# Force kill all Node processes
pkill -9 node

# Force kill all Bun processes  
pkill -9 bun

# Check what's using the port
lsof -i :12000
netstat -tulpn | grep 12000
ss -tulpn | grep 12000
```

**Permission denied?**
```bash
# Use sudo (not recommended for dev)
sudo fuser -k 12000/tcp

# Or kill by PID after finding it
lsof -ti :12000 | xargs kill -9
```

## Best Practices

1. **Always use `bun run kill:all` before starting dev servers**
2. **Don't kill ports while saving work** - May lose unsaved changes
3. **Check remaining processes** after kill to ensure clean slate
4. **Restart terminal** if ports remain stuck

## Emergency Kill

If nothing works:
```bash
# Nuclear option - kills all Node/Bun processes
sudo killall -9 node
sudo killall -9 bun
sudo killall -9 ts-node-dev

# Then restart your terminal
```
