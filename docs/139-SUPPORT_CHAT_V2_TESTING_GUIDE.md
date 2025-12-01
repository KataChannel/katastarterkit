# Support Chat Widget Enhanced V2 - Testing Guide

## 📋 Pre-Test Checklist

### Backend Setup
- [ ] Backend is running: `cd backend && bun run dev`
- [ ] Database is seeded: `bun run seed:settings`
- [ ] WebSocket server is active on port 12001

### Frontend Setup
- [ ] Frontend is running: `cd frontend && bun run dev`
- [ ] Environment variables configured in `.env.local`
- [ ] Notification sound file exists: `frontend/public/sounds/notification.mp3`

## 🧪 Test Cases

### Test 1: Widget Visibility & Basic UI
1. Open browser: `http://localhost:12000`
2. **Verify**: Chat button visible in bottom-right corner
3. **Verify**: Green color theme (or custom color from settings)
4. Click chat button
5. **Verify**: Widget opens smoothly with animation
6. **Verify**: Shows authentication form (Phone/Social tabs)

**Expected Result**: ✅ Widget displays correctly on both mobile and desktop

---

### Test 2: Guest Authentication (Phone)
1. Open chat widget
2. Go to "Số điện thoại" tab
3. Enter name: "Test User"
4. Enter phone: "0123456789"
5. Click "Bắt đầu chat"

**Expected Result**: 
- ✅ Welcome message appears
- ✅ Input area becomes active
- ✅ Quick reply buttons visible (if ≤2 messages)
- ✅ Auth badge shows 📱 icon

---

### Test 3: Session Persistence
1. Complete Test 2 (create conversation)
2. Send a message: "Hello"
3. Close the widget (X button)
4. **Refresh the page**
5. Click chat button again

**Expected Result**: 
- ✅ Previous conversation restored
- ✅ Name and phone remembered
- ✅ Messages still visible
- ✅ Can continue conversation without re-authentication

---

### Test 4: Quick Replies
1. Start a new conversation
2. Look at the bottom of chat area

**Expected Result**:
- ✅ See 5 quick reply buttons:
  - 💰 Giá sản phẩm
  - 📦 Theo dõi đơn hàng
  - 🚚 Vận chuyển
  - 🔄 Đổi trả hàng
  - 💳 Thanh toán
- ✅ Clicking a button fills input with text
- ✅ Quick replies disappear after 2+ messages

---

### Test 5: Real-time Messaging
1. Have conversation open
2. Send message: "Test message 1"
3. **Open Admin Dashboard** in another tab: `http://localhost:12000/admin/support-chat`
4. Find the conversation
5. Reply from admin panel

**Expected Result**:
- ✅ Customer sees admin message instantly
- ✅ Sound notification plays (if enabled)
- ✅ Desktop notification shows (if enabled and tab inactive)
- ✅ Typing indicator shows when admin is typing

---

### Test 6: Sound Notifications
1. Open chat widget
2. Open browser DevTools Console
3. Check audio element: `new Audio('/sounds/notification.mp3')`
4. Have admin send a message

**Expected Result**:
- ✅ Notification sound plays on new message
- ✅ Can toggle sound on/off from header button
- ✅ Sound setting persists after page reload

---

### Test 7: Desktop Notifications
1. Grant notification permission when prompted
2. Open chat widget
3. **Switch to another browser tab**
4. Have admin send a message

**Expected Result**:
- ✅ Desktop notification appears with message content
- ✅ Can toggle notifications on/off from header button
- ✅ Works only when tab is inactive/hidden

---

### Test 8: Social Login - Zalo
1. Configure `NEXT_PUBLIC_ZALO_APP_ID` in `.env.local`
2. Open chat widget
3. Go to "Đăng nhập" tab
4. Click "Đăng nhập với Zalo"
5. Complete OAuth flow

**Expected Result**:
- ✅ Popup opens with Zalo login
- ✅ After success, conversation created
- ✅ Auth badge shows 💬 icon
- ✅ Welcome message includes Zalo username

**Skip if**: Zalo App ID not configured

---

### Test 9: Social Login - Facebook
1. Configure `NEXT_PUBLIC_FACEBOOK_APP_ID` in `.env.local`
2. Open chat widget
3. Go to "Đăng nhập" tab
4. Click "Đăng nhập với Facebook"
5. Complete OAuth flow

**Expected Result**:
- ✅ Facebook SDK loads
- ✅ Login dialog appears
- ✅ Conversation created with Facebook auth
- ✅ Auth badge shows 👥 icon

**Skip if**: Facebook App ID not configured

---

### Test 10: Social Login - Google
1. Configure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
2. Open chat widget
3. Go to "Đăng nhập" tab
4. Click "Đăng nhập với Google"
5. Complete OAuth flow

**Expected Result**:
- ✅ Google picker appears
- ✅ Account selection works
- ✅ Conversation created with Google auth
- ✅ Auth badge shows 🔍 icon

**Skip if**: Google Client ID not configured

---

### Test 11: File Upload UI
1. Open active conversation
2. Look at input area
3. Click paperclip icon (📎)

**Expected Result**:
- ✅ File picker opens
- ✅ Can select multiple files
- ✅ Selected files show as badges above input
- ✅ Can remove selected files with X button
- ✅ Accepts: images, PDF, DOC, DOCX, XLS, XLSX

**Note**: Backend file upload implementation may be pending

---

### Test 12: Online/Offline Status
1. Open chat widget with active conversation
2. **Stop backend server**: Stop terminal running `bun run dev:backend`
3. Observe widget header

**Expected Result**:
- ✅ Status changes from "Trực tuyến" to "Ngoại tuyến"
- ✅ Indicator dot changes from green 🟢 to gray ⚫
- ✅ Can still type messages (they queue)
- ✅ Restart backend → reconnects automatically

---

### Test 13: Settings Control
1. Open chat widget
2. Look at header controls

**Expected Result**:
- ✅ 🔊 Sound toggle works (on/off)
- ✅ 🔔 Notification toggle works (on/off)
- ✅ 🔄 New conversation button resets chat
- ✅ Settings persist after page reload

---

### Test 14: Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone 12, Galaxy S20, etc.)
4. Test widget

**Expected Result**:
- ✅ Widget button sized appropriately
- ✅ Chat window takes full screen on mobile
- ✅ Touch-friendly buttons (44px minimum)
- ✅ Safe area padding for notch devices
- ✅ Smooth animations

---

### Test 15: Admin Settings Integration
1. Go to: `http://localhost:12000/admin/settings/website`
2. Navigate to "Support Chat" tab
3. Change "Màu chính Widget" to `#ff0000` (red)
4. Click Save
5. **Refresh frontend page**
6. Open chat widget

**Expected Result**:
- ✅ Widget color changes to red
- ✅ All other settings apply correctly
- ✅ Can enable/disable features from admin panel

---

## 🐛 Common Issues & Solutions

### Issue: Notification sound not playing
**Solution**: 
- Check file exists: `ls frontend/public/sounds/notification.mp3`
- Browser autoplay policy may block - user must interact first
- Check browser console for errors

### Issue: Desktop notifications not showing
**Solution**:
- Check permission: `Notification.permission` in console
- Must be 'granted' - prompt user to allow
- Only works when tab is inactive

### Issue: WebSocket not connecting
**Solution**:
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_WS_URL` in `.env.local`
- Look for CORS errors in console

### Issue: Social login not working
**Solution**:
- Verify App IDs configured in `.env.local`
- Check OAuth callback URLs in app dashboards
- Ensure callbacks match: `http://localhost:12000/oauth-callback/{provider}/callback`

### Issue: Session not persisting
**Solution**:
- Check browser localStorage (DevTools → Application → Local Storage)
- Key should be: `support_chat_enhanced_session`
- Clear localStorage and test fresh

### Issue: Settings not loading from database
**Solution**:
- Run seed: `cd backend && bun run seed:settings`
- Check database: Support Chat category settings exist
- Verify GraphQL query works in GraphQL Playground

---

## ✅ Acceptance Criteria

All V2 features are complete when:
- ✅ All 15 test cases pass
- ✅ No console errors in browser
- ✅ No backend errors in terminal
- ✅ Mobile and desktop responsive
- ✅ Session persists across page reloads
- ✅ Admin settings apply correctly
- ✅ WebSocket events working (typing, new messages)
- ✅ At least one social login method works (if configured)

---

## 📊 Test Results Template

```
Date: _______________
Tester: _____________

| Test # | Test Name                  | Pass/Fail | Notes |
|--------|----------------------------|-----------|-------|
| 1      | Widget Visibility          | [ ]       |       |
| 2      | Guest Authentication       | [ ]       |       |
| 3      | Session Persistence        | [ ]       |       |
| 4      | Quick Replies              | [ ]       |       |
| 5      | Real-time Messaging        | [ ]       |       |
| 6      | Sound Notifications        | [ ]       |       |
| 7      | Desktop Notifications      | [ ]       |       |
| 8      | Social Login - Zalo        | [ ]       |       |
| 9      | Social Login - Facebook    | [ ]       |       |
| 10     | Social Login - Google      | [ ]       |       |
| 11     | File Upload UI             | [ ]       |       |
| 12     | Online/Offline Status      | [ ]       |       |
| 13     | Settings Control           | [ ]       |       |
| 14     | Mobile Responsive          | [ ]       |       |
| 15     | Admin Settings Integration | [ ]       |       |

Overall Status: [ ] PASS  [ ] FAIL
```

---

**Last Updated**: December 1, 2025  
**Version**: 2.0.0
