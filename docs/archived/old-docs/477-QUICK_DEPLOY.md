# 🚀 QUICK DEPLOY - TAZAGROUP WITH GEMINI API

## ✅ Pre-flight Check
```bash
./test-gemini-config.sh
```

## 📦 Build
```bash
./build-frontend.sh
```

## 🚀 Deploy
```bash
./deploy.sh
```

## 🧪 Test
```
URL: http://116.118.49.243:13000/lms/admin/courses/create-with-ai
```

## 🔍 Monitor
```bash
ssh root@116.118.49.243 'docker logs tazagroup-backend -f'
```

## ✅ Status
- **GOOGLE_GEMINI_API_KEY:** Configured in .env.tazagroup
- **Server:** 116.118.49.243
- **Tazagroup Ports:** 13000 (frontend), 13001 (backend)
- **Rausach Ports:** 12000 (frontend), 12001 (backend)

---
**Last Updated:** November 6, 2025
