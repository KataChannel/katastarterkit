# Fix: WebSocket Connection Refused Error

## Problem
```
GET http://localhost:3001/socket.io/?EIO=4&transport=polling&t=xxx net::ERR_CONNECTION_REFUSED
```

This error means the **backend server is not running** on port 3001.

## Solution

### 1. Start Backend Server

```bash
# From project root
cd /chikiet/kataoffical/shoprausach

# Start backend only
bun run dev:backend

# OR start both backend + frontend
bun run dev
```

### 2. Verify Backend is Running

Check if backend is running on port 3001:
```bash
# Test GraphQL endpoint
curl http://localhost:3001/graphql

# Check if WebSocket namespace is available
curl http://localhost:3001/socket.io/
```

Expected response: Should return HTML page or JSON, not connection refused.

### 3. Environment Variables

Make sure you have `.env` file with correct settings:

```env
# Backend
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/shoprausach"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001/support-chat"
NEXT_PUBLIC_GRAPHQL_URL="http://localhost:3001/graphql"
```

### 4. Check Port Availability

If port 3001 is already in use:

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### 5. Check Backend Logs

Look for WebSocket gateway initialization:
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [SocketModule] SocketModule dependencies initialized
[Nest] INFO [SupportChatGateway] Support Chat Gateway initialized
[Nest] INFO [NestApplication] Nest application successfully started
```

## Code Changes

The AdminChatDashboard has been updated to:

1. **Use environment variable**: `NEXT_PUBLIC_WS_URL`
2. **Better error handling**: Shows clear console messages
3. **Auto-reconnection**: Attempts to reconnect up to 5 times
4. **Fallback URL**: Uses `http://localhost:3001/support-chat` if env var not set

## Common Issues

### Issue 1: Backend not starting
**Solution**: Check `backend/package.json` scripts and run `bun run dev:backend`

### Issue 2: Database not connected
**Solution**: Make sure PostgreSQL is running and DATABASE_URL is correct

### Issue 3: Port 3001 already in use
**Solution**: Kill the process using port 3001 or change backend port

### Issue 4: WebSocket module not loaded
**Solution**: Check if SupportChatModule is imported in backend `app.module.ts`

## Testing

After starting backend, you should see:

1. **Console logs** in AdminChatDashboard:
   ```
   🔌 Connecting to WebSocket: http://localhost:3001/support-chat
   ✅ Admin connected to support chat
   ```

2. **No more connection errors** in browser console

3. **Real-time updates** work when customer sends messages

## Quick Test

```bash
# Terminal 1 - Start backend
bun run dev:backend

# Terminal 2 - Start frontend
bun run dev:frontend

# Open browser
http://localhost:12000/admin/support-chat
```

Check browser console - should see green checkmark "✅ Admin connected to support chat"
