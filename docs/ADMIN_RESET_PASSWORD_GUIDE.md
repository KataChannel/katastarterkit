# 🔐 Hướng Dẫn Sử Dụng Admin Reset Password

## 📖 Quick Start

### Bước 1: Mở User Management
```
1. Login với tài khoản ADMIN
2. Vào trang: /admin/users
3. Tìm user cần reset password
4. Click nút "Edit" (icon bút chì)
```

### Bước 2: Tìm Security Actions
```
Trong modal Edit User:
1. Scroll xuống cuối form
2. Tìm section "Security Actions" (màu vàng/amber)
3. Click button "Reset Password"
```

### Bước 3: Xác nhận
```
Alert hiển thị:
"Bạn có chắc muốn reset mật khẩu cho user 'username'?
Mật khẩu mới sẽ được tạo tự động."

→ Click "OK"
```

### Bước 4: Copy mật khẩu
```
Dialog mới hiển thị:
┌─────────────────────────────────────┐
│ 🔑 Mật khẩu mới đã được tạo         │
├─────────────────────────────────────┤
│                                     │
│ Mật khẩu mới:                       │
│ ┌───────────────────────────┐      │
│ │ K9@mL#2pX$7w        [📋] │      │
│ └───────────────────────────┘      │
│                                     │
│ 📧 Thông tin người dùng:            │
│ • Username: nguyenvana             │
│ • Email: vana@company.com          │
│ • Họ tên: Nguyễn Văn A             │
│                                     │
│ ⚠️ Lưu ý quan trọng:                │
│ • Mật khẩu này chỉ hiển thị 1 lần  │
│ • Hãy copy và gửi ngay             │
│ • Nhân viên nên đổi sau lần đầu    │
│                                     │
│ [📋 Copy Password]  [Đóng]         │
└─────────────────────────────────────┘

→ Click "Copy Password" (hoặc icon 📋)
```

### Bước 5: Gửi cho nhân viên
```
Mật khẩu đã copy vào clipboard!

Gửi cho nhân viên qua:
- Email nội bộ
- Slack/Teams message
- Zalo/Telegram
- Gặp trực tiếp

Template email:
──────────────────────────────────────
Chào [Tên nhân viên],

Mật khẩu tài khoản của bạn đã được reset:

🔑 Username: nguyenvana
🔑 Password: K9@mL#2pX$7w

Vui lòng:
1. Đăng nhập vào hệ thống
2. Đổi mật khẩu ngay lập tức
3. Xóa email này sau khi đổi xong

Trân trọng,
Admin Team
──────────────────────────────────────
```

---

## 🎯 Use Cases

### Case 1: Nhân viên quên mật khẩu
```
Nhân viên: "Admin ơi, em quên mật khẩu rồi!"

Admin:
1. Edit user của nhân viên
2. Reset password
3. Copy password mới
4. Gửi qua chat nội bộ
5. Hướng dẫn nhân viên đổi password

✅ Giải quyết trong 2 phút
```

### Case 2: Tài khoản mới cho nhân viên mới
```
HR: "Admin tạo tài khoản cho nhân viên mới"

Admin:
1. Create new user (username, email, role)
2. Reset password ngay sau khi tạo
3. Copy password
4. Gửi cho HR/Manager
5. Manager gửi cho nhân viên mới

✅ Onboarding nhanh chóng
```

### Case 3: Tài khoản bị hack/nghi ngờ
```
Security alert: "Tài khoản XYZ có hoạt động bất thường"

Admin:
1. Edit user XYZ
2. Set isActive = false (khóa tạm thời)
3. Reset password
4. Liên hệ nhân viên XYZ
5. Gửi password mới
6. Set isActive = true (mở khóa)

✅ Bảo mật được xử lý kịp thời
```

### Case 4: Bulk reset cho nhiều nhân viên
```
IT Policy: "Đổi mật khẩu định kỳ 90 ngày"

Admin:
1. Tạo danh sách users cần reset
2. Reset từng user một
3. Copy và lưu vào Excel:
   Username | New Password | Email
   ---------|--------------|-------
   user1    | K9@mL#2p... | ...
   user2    | X7#nQ$5t... | ...
   
4. Gửi email hàng loạt (BCC)

✅ Tuân thủ security policy
```

---

## 🎨 UI Elements Explained

### 1. Security Actions Section (Trong Edit Modal)
```tsx
┌─────────────────────────────────────────────┐
│ SECURITY ACTIONS                            │
├─────────────────────────────────────────────┤
│ 🔑 Reset mật khẩu cho nhân viên             │
│                                             │
│ Hệ thống sẽ tạo mật khẩu ngẫu nhiên mạnh.  │
│ Bạn có thể copy và gửi cho nhân viên.      │
│                                             │
│ [🔄 Reset Password]                         │
└─────────────────────────────────────────────┘
```

**Colors:**
- Background: Amber/Yellow (`bg-amber-50`)
- Border: `border-amber-200`
- Text: `text-amber-700`
- Icon: `text-amber-600`

**Purpose:** Cảnh báo action quan trọng (không phải danger)

### 2. Password Dialog
```tsx
┌────────────────────────────────────────┐
│ 🔑 Mật khẩu mới đã được tạo     [×]   │ ← Header (Green theme)
├────────────────────────────────────────┤
│ Copy mật khẩu này và gửi cho nhân viên│ ← Description
│ Mật khẩu sẽ không hiển thị lại.       │
├────────────────────────────────────────┤
│                                        │
│ Mật khẩu mới                          │ ← Label
│ ┌──────────────────────────────┐      │
│ │ K9@mL#2pX$7w          [📋]  │      │ ← Input + Copy button
│ └──────────────────────────────┘      │
│                                        │
│ ┌────────────────────────────────┐    │
│ │ ℹ️ Thông tin người dùng:       │    │ ← Blue alert
│ │ • Username: nguyenvana        │    │
│ │ • Email: vana@company.com     │    │
│ └────────────────────────────────┘    │
│                                        │
│ ┌────────────────────────────────┐    │
│ │ ⚠️ Lưu ý quan trọng:           │    │ ← Amber alert
│ │ • Chỉ hiển thị 1 lần          │    │
│ │ • Copy và gửi ngay            │    │
│ │ • Nhân viên nên đổi sau       │    │
│ └────────────────────────────────┘    │
│                                        │
│ [📋 Copy Password]  [Đóng]           │ ← Action buttons
└────────────────────────────────────────┘
```

**Responsive:**
- Mobile: Full width, stacked layout
- Desktop: max-width 448px, horizontal buttons

### 3. Copy Button States
```
State 1: Default
[📋 Copy Password]

State 2: Clicking
[⏳ Copying...]

State 3: Success (2 seconds)
[✅ Đã copy!]

State 4: Back to Default
[📋 Copy Password]
```

**Animation:** Smooth icon transition (Copy → CheckCheck)

---

## 🔍 Password Anatomy

### Ví dụ: `K9@mL#2pX$7w`

```
K    9    @    m    L    #    2    p    X    $    7    w
↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
Up   Num  Spc  Low  Up   Spc  Num  Low  Up   Spc  Num  Low

Legend:
Up  = Uppercase (A-Z)
Low = Lowercase (a-z)
Num = Number (0-9)
Spc = Special (!@#$%^&*()_+-=[]{}|;:,.<>?)
```

**Characteristics:**
- ✅ Length: 12 characters
- ✅ Uppercase: 3 chars (K, L, X)
- ✅ Lowercase: 3 chars (m, p, w)
- ✅ Numbers: 3 chars (9, 2, 7)
- ✅ Special: 3 chars (@, #, $)
- ✅ Entropy: ~71 bits (very strong)
- ✅ Randomized: Not sequential

**Strength Score:** 🟢🟢🟢🟢🟢 (5/5 - Very Strong)

---

## 📱 Mobile View

### iPhone/Android Portrait (390px)

```
┌──────────────────────┐
│  Edit User      [×] │
├──────────────────────┤
│ Account Info         │
│ ┌──────────────────┐ │
│ │ Username         │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Email            │ │
│ └──────────────────┘ │
│                      │
│ Personal Info        │
│ ┌──────────────────┐ │
│ │ First Name       │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Last Name        │ │
│ └──────────────────┘ │
│                      │
│ ⬇️ Scroll down...    │
│                      │
│ Security Actions     │
│ ┌──────────────────┐ │
│ │ 🔑 Reset password│ │
│ │                  │ │
│ │ [Reset Password] │ │ ← Full width button
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ [Cancel]         │ │ ← Full width
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ [Save Changes]   │ │ ← Full width
│ └──────────────────┘ │
└──────────────────────┘
```

**Mobile Optimizations:**
- ✅ Touch-friendly buttons (48px min height)
- ✅ Large text (16px base)
- ✅ No horizontal scroll
- ✅ Stacked layout
- ✅ Easy thumb reach

---

## 🛠️ Troubleshooting

### Problem 1: Không thấy nút "Reset Password"

**Possible causes:**
1. ❌ Không phải ADMIN role
2. ❌ EditUserModal version cũ
3. ❌ GraphQL file chưa import

**Solutions:**
```bash
# Check role
console.log(currentUser.roleType); // Should be "ADMIN"

# Update component
# Verify imports:
import { ADMIN_RESET_PASSWORD } from '@/graphql/admin/user-management.graphql';
```

### Problem 2: Copy button không hoạt động

**Possible causes:**
1. ❌ HTTP (not HTTPS) - Clipboard API requires secure context
2. ❌ Browser permissions denied
3. ❌ Old browser (IE, old Safari)

**Solutions:**
```javascript
// Fallback for old browsers
const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};
```

### Problem 3: Dialog không hiển thị

**Possible causes:**
1. ❌ shadcn/ui Dialog component chưa cài
2. ❌ z-index conflict
3. ❌ State không update

**Solutions:**
```bash
# Install Dialog component
npx shadcn-ui@latest add dialog

# Check state
console.log(showPasswordDialog); // Should be true
```

### Problem 4: Password quá yếu

**Diagnosis:**
```typescript
// Test password strength
const testPassword = "K9@mL#2pX$7w";

console.log('Length:', testPassword.length); // Should be 12
console.log('Has uppercase:', /[A-Z]/.test(testPassword)); // true
console.log('Has lowercase:', /[a-z]/.test(testPassword)); // true
console.log('Has number:', /[0-9]/.test(testPassword)); // true
console.log('Has special:', /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(testPassword)); // true
```

**If any is false:** Check backend `generateRandomPassword()` method

---

## 📊 Metrics & Monitoring

### Success Metrics
```sql
-- Số lần reset password hôm nay
SELECT COUNT(*) 
FROM "AuditLog" 
WHERE action = 'ADMIN_RESET_PASSWORD' 
  AND "createdAt" >= CURRENT_DATE;

-- Top admins reset nhiều nhất
SELECT 
  userId,
  COUNT(*) as reset_count
FROM "AuditLog"
WHERE action = 'ADMIN_RESET_PASSWORD'
  AND "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY userId
ORDER BY reset_count DESC
LIMIT 10;

-- Users được reset nhiều lần (suspicious?)
SELECT 
  details->>'targetUserId' as user_id,
  COUNT(*) as times_reset
FROM "AuditLog"
WHERE action = 'ADMIN_RESET_PASSWORD'
  AND "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY details->>'targetUserId'
HAVING COUNT(*) > 3
ORDER BY times_reset DESC;
```

### Performance Metrics
```
Average time to reset password: < 2 seconds
Dialog load time: < 100ms
Copy to clipboard: < 50ms
```

---

## ✅ Best Practices

### DO ✅
1. ✅ **Confirm trước khi reset** - Tránh click nhầm
2. ✅ **Copy ngay lập tức** - Không để quên
3. ✅ **Gửi qua kênh bảo mật** - Email nội bộ, không SMS
4. ✅ **Hướng dẫn nhân viên đổi password** - Sau lần đầu login
5. ✅ **Xóa password khỏi chat/email** - Sau khi nhân viên confirm
6. ✅ **Log actions** - Để audit trail

### DON'T ❌
1. ❌ **Không gửi qua public channels** - Facebook, Zalo group
2. ❌ **Không lưu plain text** - Vào Excel không mã hóa
3. ❌ **Không reset hàng loạt** - Không có lý do rõ ràng
4. ❌ **Không share password** - Với người không liên quan
5. ❌ **Không để nhân viên dùng password này mãi** - Force change
6. ❌ **Không reset khi không cần** - Chỉ khi thực sự cần thiết

---

## 🎓 Training Guide

### For Admins

**Session 1: Basic Reset (15 mins)**
1. Giới thiệu tính năng
2. Demo reset 1 user
3. Practice: Reset 3 users
4. Q&A

**Session 2: Security Best Practices (20 mins)**
1. Password strength explanation
2. Secure delivery methods
3. Audit log review
4. Incident response

**Session 3: Bulk Operations (15 mins)**
1. Bulk reset workflow
2. Excel template
3. Email templates
4. Tracking & follow-up

### For New Users (Receiving Password)

**Email Template:**
```
Subject: [Action Required] Mật khẩu tạm thời của bạn

Chào [Tên],

Bạn nhận được email này vì tài khoản của bạn đã được tạo/reset mật khẩu.

🔐 THÔNG TIN ĐĂNG NHẬP:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: [username]
Password: [password]
URL: https://app.company.com/login
━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ HÀNH ĐỘNG CẦN THIẾT:
1. Đăng nhập ngay lập tức
2. Vào Settings → Change Password
3. Tạo mật khẩu mới (riêng của bạn)
4. Xóa email này

❗ LƯU Ý BẢO MẬT:
• Không chia sẻ password này với ai
• Không lưu password vào trình duyệt
• Không sử dụng password này cho tài khoản khác
• Liên hệ IT nếu có vấn đề: it@company.com

Trân trọng,
IT Department
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-01  
**Author:** Admin Team  
**Status:** ✅ Production Ready
