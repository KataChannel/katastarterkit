# GOOGLE GEMINI API CONFIGURATION - DEPLOYMENT READY

## ✅ STATUS: CONFIGURED & READY

**Date:** November 6, 2025  
**Server:** http://116.118.49.243/  
**Domain:** Tazagroup (Port 13xxx)  
**API Key:** AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E

---

## 📋 CONFIGURATION SUMMARY

### **Environment Files**

| File | Location | Has API Key | Status |
|------|----------|-------------|--------|
| `backend/.env` | `/backend/.env` | ✅ Yes | Active (Development) |
| `.env.rausach` | `/.env.rausach` | ✅ Yes | Production (Rausach domain) |
| `.env.tazagroup` | `/.env.tazagroup` | ✅ Yes | Production (Tazagroup domain) |

**API Key Value:**
```bash
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E
```

---

## 🏗️ SERVICES USING GEMINI API

### **1. AI Course Generator**
**File:** `/backend/src/lms/courses/ai-course-generator.service.ts`

**Features:**
- ✅ Generate complete courses from text prompts
- ✅ Auto-create sections, lessons, and content
- ✅ Support Vietnamese language
- ✅ Handle large responses (16K tokens)

**Model:** `gemini-flash-latest` (faster, cheaper than gemini-pro)

**Configuration:**
```typescript
{
  model: 'gemini-flash-latest',
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 16384
}
```

**Usage:**
- Frontend: `/lms/admin/courses/create-with-ai`
- GraphQL Mutation: `generateCourseFromPrompt`

---

### **2. Support Chat AI (Optional)**
**File:** `/backend/src/support-chat/services/ai-response.service.ts`

**Features:**
- ✅ Multi-provider support (ChatGPT, Grok, Gemini)
- ✅ API key stored in database (AIProvider table)
- ✅ NOT using GOOGLE_GEMINI_API_KEY from env
- ✅ Admin can configure via UI

**Note:** Support Chat uses API key from database, not environment variable.

---

## 🐳 DOCKER CONFIGURATION

### **docker-compose.hybrid.yml**

**Rausach Backend (Port 12001):**
```yaml
shopbackend:
  env_file:
    - .env.rausach  # ✅ Contains GOOGLE_GEMINI_API_KEY
```

**Tazagroup Backend (Port 13001):**
```yaml
tazagroup-backend:
  env_file:
    - .env.tazagroup  # ✅ Contains GOOGLE_GEMINI_API_KEY
```

**Environment Variables Passed:**
- ✅ All variables from `.env.tazagroup` loaded into container
- ✅ `GOOGLE_GEMINI_API_KEY` available at runtime
- ✅ No need to rebuild image when changing API key

---

## 🚀 DEPLOYMENT PROCESS

### **Step 1: Verify Configuration**
```bash
./test-gemini-config.sh
```

**Expected Output:**
```
✅ Found in backend/.env
✅ Found in .env.rausach  
✅ Found in .env.tazagroup
✅ Both domains configured with env_file
```

---

### **Step 2: Build Frontend**
```bash
./build-frontend.sh
```

**What happens:**
1. Detects project path (auto)
2. Cleans previous builds
3. Builds for Rausach domain (port 12001)
4. Builds for Tazagroup domain (port 13001)
5. Creates `.next-rausach/` and `.next-tazagroup/`

**Time:** ~3-5 minutes per domain

---

### **Step 3: Deploy to Server**
```bash
./deploy.sh
```

**What happens:**
1. Builds backend locally
2. Syncs files to server (rsync)
3. Builds Docker images on server
4. Starts containers with health checks
5. Runs health check tests

**Server:** 116.118.49.243  
**Rausach:** Port 12xxx  
**Tazagroup:** Port 13xxx

---

## 🧪 TESTING

### **Test AI Course Generator**

**1. Access Admin Panel:**
```
http://116.118.49.243:13000/lms/admin/courses/create-with-ai
```

**2. Enter Prompt:**
```
Tạo khóa học về "Lập trình Python cơ bản" 
với 5 bài học cho người mới bắt đầu
```

**3. Expected Result:**
- ✅ Course created with title, description
- ✅ 5 sections with lessons
- ✅ Vietnamese content
- ✅ Markdown formatted

**4. Check Logs:**
```bash
ssh root@116.118.49.243
docker logs tazagroup-backend -f
```

**Expected Log Output:**
```
✅ AI Course Generator initialized with Gemini Pro
🔑 API Key: AIzaSyA1DM...IQ5E
🤖 [AI Course Generator] Starting...
📝 Prompt: Tạo khóa học về...
✅ Generated course successfully
```

---

## 🔧 TROUBLESHOOTING

### **Issue 1: "AI service is not configured"**

**Cause:** GOOGLE_GEMINI_API_KEY not found

**Solution:**
```bash
# Check env file
grep GOOGLE_GEMINI_API_KEY .env.tazagroup

# Should output:
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E

# If missing, add it:
echo "GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E" >> .env.tazagroup
```

---

### **Issue 2: "Invalid API key"**

**Cause:** API key expired or invalid

**Solution:**
1. Get new API key from: https://makersuite.google.com/app/apikey
2. Update in all .env files:
   ```bash
   # .env.tazagroup
   GOOGLE_GEMINI_API_KEY=<new-key>
   
   # .env.rausach
   GOOGLE_GEMINI_API_KEY=<new-key>
   
   # backend/.env
   GOOGLE_GEMINI_API_KEY=<new-key>
   ```
3. Restart containers:
   ```bash
   ssh root@116.118.49.243
   cd /root/shoprausach
   docker compose -f docker-compose.hybrid.yml restart tazagroup-backend
   ```

---

### **Issue 3: Container not loading env vars**

**Cause:** Docker compose not reading env_file

**Solution:**
```bash
# Verify docker-compose.hybrid.yml
grep -A 5 "tazagroup-backend:" docker-compose.hybrid.yml

# Should show:
# env_file:
#   - .env.tazagroup

# Rebuild and restart:
ssh root@116.118.49.243
cd /root/shoprausach
docker compose -f docker-compose.hybrid.yml down
docker compose -f docker-compose.hybrid.yml up -d --build
```

---

## 📊 MONITORING

### **Check Container Env Vars:**
```bash
ssh root@116.118.49.243
docker exec tazagroup-backend env | grep GEMINI
```

**Expected:**
```
GOOGLE_GEMINI_API_KEY=AIzaSyA1DMQnWmOrhmeILPho9LBPhwpWyGkIQ5E
```

---

### **Check API Usage:**
1. Visit: https://makersuite.google.com/app/apikey
2. View your API key
3. Check usage statistics
4. Monitor quota limits

---

## 🎯 PRODUCTION CHECKLIST

- [x] GOOGLE_GEMINI_API_KEY added to `.env.tazagroup` ✅
- [x] GOOGLE_GEMINI_API_KEY added to `.env.rausach` ✅
- [x] docker-compose.hybrid.yml configured with env_file ✅
- [x] AI Course Generator service initialized ✅
- [x] Test script created (`test-gemini-config.sh`) ✅
- [x] Documentation complete ✅

---

## 🔗 USEFUL LINKS

- **Google AI Studio:** https://makersuite.google.com/app/apikey
- **Gemini API Docs:** https://ai.google.dev/docs
- **Server Admin:** http://116.118.49.243:13000/admin
- **AI Course Generator:** http://116.118.49.243:13000/lms/admin/courses/create-with-ai
- **GraphQL Playground:** http://116.118.49.243:13001/graphql

---

## 📝 NOTES

1. **API Key Security:**
   - ✅ Not exposed in frontend
   - ✅ Only used in backend services
   - ✅ Loaded from environment variables
   - ✅ Not committed to Git (in .gitignore)

2. **Rate Limits:**
   - Free tier: 60 requests/minute
   - Paid tier: Higher limits
   - Monitor usage at: https://makersuite.google.com

3. **Model Selection:**
   - `gemini-flash-latest`: Fast, cheaper, good for most use cases ✅ (Current)
   - `gemini-pro`: More accurate, slower, more expensive
   - Can change in `ai-course-generator.service.ts` line 23

4. **Cost Optimization:**
   - Current model: gemini-flash (cheaper)
   - Max tokens: 16384 (large enough for courses)
   - Temperature: 0.7 (balanced creativity)

---

**✅ READY FOR DEPLOYMENT!**

Chạy: `./deploy.sh` để deploy lên server 116.118.49.243
