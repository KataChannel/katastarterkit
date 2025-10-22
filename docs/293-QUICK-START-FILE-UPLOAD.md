# 🚀 Quick Start Guide: Testing File Upload & Rich Text Editor

## Prerequisites
- Docker running
- Backend and frontend services running
- Admin user account

## 1. Start Services

```bash
cd /chikiet/kataoffical/fullstack/katacore
./run.sh
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MinIO (port 9000, console 9001)
- Backend (port 14000)
- Frontend (port 13000)

## 2. Access MinIO Console

Open your browser:
```
URL: http://localhost:9001
Username: katacore-admin
Password: katacore-secret-2025
```

Verify buckets exist:
- avatars
- posts
- uploads

## 3. Test Course Creation with File Uploads

### Step 1: Login as Admin
```
1. Go to http://localhost:13000/login
2. Email: admin@kata.com (or your admin email)
3. Password: (your admin password)
```

### Step 2: Create Course
```
1. Navigate to /instructor/courses/new
2. Fill in course details:
   - Title: "Test Course with File Upload"
   - Description: "Testing new file upload features"
   - Category: Select any
   - Level: BEGINNER
   - Price: 0
```

### Step 3: Upload Thumbnail
```
1. Find "Course Thumbnail" section
2. Drag and drop an image OR click to browse
3. Supported formats: JPEG, PNG, GIF, WebP
4. Max size: 5MB
5. Watch progress bar fill (0% → 100%)
6. Verify preview appears
7. Click "Next: Add Modules"
```

### Step 4: Create Module
```
1. Click "Add Module"
2. Title: "Module 1: Introduction"
3. Description: "Getting started"
4. Click "Add Module" button
5. Click "Next: Add Lessons"
```

### Step 5: Test Video Upload
```
1. Click "Add Lesson to this Module"
2. Title: "Welcome Video"
3. Type: VIDEO
4. Upload video:
   - Drag & drop video file OR click to browse
   - Supported: MP4, WebM, OGG, MOV
   - Max size: 500MB
   - Watch upload progress
   - Verify video preview appears
5. Duration: 5 (minutes)
6. Click "Add Lesson"
```

### Step 6: Test Rich Text Editor
```
1. Click "Add Lesson to this Module" again
2. Title: "Course Overview"
3. Type: TEXT
4. Rich text editor appears
5. Test formatting:
   - Type some text
   - Select text → click Bold button
   - Add a heading: Click H2 button, type "Section 1"
   - Create list: Click bullet list button, type items
   - Add link:
     * Select text
     * Click Link button
     * Enter URL in prompt
     * Click OK
   - Add blockquote: Click quote button, type quote
6. Content saved as HTML
7. Click "Add Lesson"
8. Click "Next: Publish Course"
```

### Step 7: Publish Course
```
1. Review validation checklist (all green checkmarks)
2. Verify course summary shows:
   - 1 module
   - 2 lessons (1 VIDEO + 1 TEXT)
   - Total duration
3. Click "Publish Course"
4. Redirected to course page
```

## 4. Verify File Storage

### Check MinIO Storage:
```bash
# Enter MinIO container
docker exec -it katacore-minio sh

# List uploaded files
mc ls local/uploads/

# You should see:
# - UUID-timestamp.jpg (thumbnail)
# - UUID-timestamp.mp4 (video)
```

### Check File URLs:
```
Thumbnail URL format:
http://localhost:9000/uploads/UUID-timestamp.jpg

Video URL format:
http://localhost:9000/uploads/UUID-timestamp.mp4
```

## 5. Test Course Viewing

```
1. Go to course page
2. Verify thumbnail appears
3. Click on VIDEO lesson
4. Video player should load and play
5. Click on TEXT lesson
6. Formatted content appears (headings, lists, links, quotes)
```

## 6. Common Issues & Solutions

### Issue: Upload fails with "Not authorized"
**Solution:** Ensure you're logged in as admin/instructor

### Issue: File too large error
**Solution:** Check file sizes:
- Images: < 5MB
- Videos: < 500MB
- Documents: < 10MB

### Issue: Invalid file type
**Solution:** Use supported formats:
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, WebM, OGG, MOV

### Issue: Upload progress stuck at 0%
**Solution:** 
1. Check network connection
2. Verify MinIO is running: `docker ps | grep minio`
3. Check backend logs for errors

### Issue: Rich text editor not loading
**Solution:**
1. Check browser console for errors
2. Verify TipTap packages installed: `npm list @tiptap/react`
3. Refresh page

### Issue: Video preview not showing
**Solution:**
1. Browser may not support video format
2. Try converting to MP4 H.264
3. Check video file isn't corrupted

## 7. Testing Checklist

✅ **File Upload:**
- [ ] Image drag & drop works
- [ ] Video drag & drop works
- [ ] Progress bar shows percentage
- [ ] Preview appears after upload
- [ ] File stored in MinIO
- [ ] URL saved to database

✅ **Rich Text Editor:**
- [ ] Toolbar buttons work
- [ ] Bold/Italic formatting
- [ ] Headings (H1, H2, H3)
- [ ] Bullet lists
- [ ] Numbered lists
- [ ] Blockquotes
- [ ] Links (with URL prompt)
- [ ] Images (via URL)
- [ ] Undo/Redo works
- [ ] HTML saved correctly

✅ **Integration:**
- [ ] Thumbnail upload in BasicInfoStep
- [ ] Video upload in LessonsStep
- [ ] Text editor in LessonsStep
- [ ] Course wizard flow complete
- [ ] Course published successfully
- [ ] Files accessible on course page

## 8. Performance Tips

### For Large Video Files (> 100MB):
1. Use fast internet connection
2. Don't close browser during upload
3. Wait for 100% completion before navigating
4. Consider compression before upload (HandBrake)

### For Multiple Files:
1. Upload one at a time
2. Wait for each to complete
3. MinIO handles concurrent uploads

### For Slow Networks:
1. Use smaller image sizes
2. Compress videos to lower bitrate
3. Consider reducing video resolution

## 9. Development Testing

### Backend Testing:
```bash
cd backend

# Run tests (if any)
bun test

# Check logs
docker logs katacore-backend -f

# Verify GraphQL schema
curl http://localhost:14000/graphql
```

### Frontend Testing:
```bash
cd frontend

# Check for errors
npm run build

# Run dev server
npm run dev
```

### MinIO Testing:
```bash
# Test MinIO API
curl http://localhost:9000/minio/health/live

# Access MinIO console
open http://localhost:9001
```

## 10. Cleanup (Optional)

### Remove Test Files:
```bash
# Enter MinIO container
docker exec -it katacore-minio sh

# Remove all files in uploads bucket
mc rm --recursive --force local/uploads/

# Exit
exit
```

### Reset Database:
```bash
cd backend
bun prisma migrate reset
```

---

## 📊 Expected Results

After completing all steps, you should have:
- ✅ Course with uploaded thumbnail
- ✅ VIDEO lesson with uploaded video file
- ✅ TEXT lesson with rich formatted content
- ✅ All files stored in MinIO
- ✅ Course visible to students
- ✅ Video playable in course player
- ✅ Text content properly formatted

## 🎉 Success Indicators

- Upload progress shows 0% → 100%
- Success checkmark appears after upload
- File preview visible immediately
- Course wizard advances to next step
- Course publishes without errors
- Files accessible via MinIO console
- Video plays in course page
- Text formatting preserved

---

**You've successfully tested the File Upload System & Rich Text Editor!** 🚀
