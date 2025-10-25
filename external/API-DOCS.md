# 📚 VTTECH API Documentation - Hướng Dẫn Chi Tiết

## Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [Xác Thực](#xác-thực)
3. [API Endpoints](#api-endpoints)
4. [Sử Dụng Giao Diện](#sử-dụng-giao-diện)
5. [Ví Dụ Code](#ví-dụ-code)
6. [Xử Lý Lỗi](#xử-lý-lỗi)

---

## 🎯 Tổng Quan

Hệ thống VTTECH API Server cung cấp các endpoint để quản lý:
- ✅ Nhân viên (Employees)
- ✅ Nhóm nhân viên (Employee Groups)
- ✅ Loại người dùng (User Types)
- ✅ Người dùng (Users)
- ✅ Quyền menu (Permission Menus)
- ✅ Hàm quyền (Permission Functions)
- ✅ Quyền nhóm (Menu Allow Group)

### Server Mặc Định
```
Base URL: http://localhost:3001
Protocol: HTTP
```

### Header Mặc Định
Tất cả request phải có:
```
Content-Type: application/json
```

---

## 🔐 Xác Thực

### Lấy Cookie & Token từ VTTECH

#### 1. Bước Lấy Cookie
```
1. Truy cập: https://tmtaza.vttechsolution.com
2. Đăng nhập vào hệ thống
3. Mở DevTools (F12) → Application
4. Tìm Cookies → tmtaza.vttechsolution.com
5. Tìm cookie tên "ASP.NET_SessionId" hoặc "SessionID"
6. Copy toàn bộ giá trị cookie
```

#### 2. Bước Lấy Xsrf-Token
```
1. Mở DevTools → Network
2. Gửi một request hoặc refresh trang
3. Chọn request POST
4. Vào Tab "Headers"
5. Tìm "Xsrf-Token" trong Request Headers
6. Copy giá trị token
```

#### 3. Cấu Hình trong Ứng Dụng
Giao diện sẽ tự động lưu vào localStorage:
```javascript
localStorage.setItem('vttech_cookie', cookie);
localStorage.setItem('vttech_xsrf_token', xsrfToken);
```

---

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```

**Request:**
```bash
curl http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "VTTECH Server is running"
}
```

---

### 2. Xác Thực Thông Tin
```
POST /api/verify-credentials
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response (Thành Công):**
```json
{
  "success": true,
  "valid": true,
  "message": "Credentials are valid",
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

**Response (Thất Bại):**
```json
{
  "success": false,
  "valid": false,
  "message": "Unauthorized - Invalid credentials",
  "status": 401,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 3. Tải Danh Sách Nhân Viên
```
POST /api/employees
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "Id": 1,
      "Name": "Nguyễn Văn A",
      "Email": "a@example.com",
      "Phone": "0123456789",
      "Department": "IT"
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 4. Tải Danh Sách Nhóm Nhân Viên
```
POST /api/employee-groups
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "GroupId": 1,
      "GroupName": "Nhóm IT",
      "Description": "Phòng công nghệ thông tin",
      "MemberCount": 15
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 5. Tải Loại Người Dùng
```
POST /api/user-types
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "TypeId": 1,
      "TypeName": "Admin",
      "Description": "Quản trị viên hệ thống"
    },
    {
      "TypeId": 2,
      "TypeName": "Manager",
      "Description": "Quản lý"
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 6. Tải Danh Sách Người Dùng
```
POST /api/users
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "UserId": 1,
      "Username": "admin",
      "FullName": "Nguyễn Văn A",
      "Email": "admin@example.com",
      "UserType": "Admin",
      "IsActive": true
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 7. Tải Menu Quyền
```
POST /api/permissions-menu
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "MenuId": 1,
      "MenuName": "Quản Lý Nhân Viên",
      "Icon": "users",
      "Link": "/employees",
      "Order": 1
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 8. Tải Hàm Quyền
```
POST /api/permission-functions
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "FunctionId": 1,
      "FunctionName": "Create",
      "Code": "EMP_CREATE",
      "Description": "Tạo nhân viên mới"
    },
    {
      "FunctionId": 2,
      "FunctionName": "Read",
      "Code": "EMP_READ",
      "Description": "Xem nhân viên"
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

### 9. Tải Quyền Menu Theo Nhóm
```
POST /api/menu-allow-group
```

**Request:**
```json
{
  "cookie": "ASP.NET_SessionId=abc123...",
  "xsrfToken": "token123..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "GroupId": 1,
      "GroupName": "Admin",
      "MenuId": 1,
      "MenuName": "Quản Lý Nhân Viên",
      "Permissions": ["Create", "Read", "Update", "Delete"]
    },
    ...
  ],
  "status": 200,
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

---

## 🌐 Sử Dụng Giao Diện

### Giao Diện Pro (Khuyến Khích)
```
URL: http://localhost:3001/nhanvienvttech-pro.html
```

**Tính năng:**
- 🎨 Dark Mode giao diện chuyên nghiệp
- 📊 Hiển thị dữ liệu dạng bảng
- 🔐 Lưu credentials tự động
- 📥 Xuất dữ liệu JSON
- ⚡ Xử lý lỗi nâng cao
- 🎯 7 Module quản lý

**Cách Sử Dụng:**
1. Mở URL tại trên
2. Dán Cookie vào ô "Cookie"
3. Dán Xsrf-Token vào ô "Xsrf-Token"
4. Chọn Tab muốn xem
5. Nhấn "Tải dữ liệu"
6. Xem kết quả trong bảng
7. Click "Tải JSON" để export

### Giao Diện Legacy
```
URL: http://localhost:3001/nhanvienvttech.html
```

**Tính năng:**
- Xác thực thông tin
- Tải dữ liệu khách hàng
- Hiển thị JSON

---

## 💻 Ví Dụ Code

### JavaScript (Axios)
```javascript
const axios = require('axios');

// Cấu hình
const API_BASE = 'http://localhost:3001';
const cookie = 'your_cookie_here';
const xsrfToken = 'your_token_here';

// Xác thực
async function verifyCredentials() {
  try {
    const response = await axios.post(`${API_BASE}/api/verify-credentials`, {
      cookie,
      xsrfToken
    });
    console.log('Valid:', response.data.valid);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Tải nhân viên
async function loadEmployees() {
  try {
    const response = await axios.post(`${API_BASE}/api/employees`, {
      cookie,
      xsrfToken
    });
    console.log('Employees:', response.data.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Gọi hàm
verifyCredentials();
loadEmployees();
```

### cURL
```bash
# Xác thực
curl -X POST http://localhost:3001/api/verify-credentials \
  -H "Content-Type: application/json" \
  -d '{
    "cookie": "YOUR_COOKIE",
    "xsrfToken": "YOUR_TOKEN"
  }' | jq .

# Tải nhân viên
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "cookie": "YOUR_COOKIE",
    "xsrfToken": "YOUR_TOKEN"
  }' | jq .

# Export ra file JSON
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "cookie": "YOUR_COOKIE",
    "xsrfToken": "YOUR_TOKEN"
  }' | jq . > employees.json
```

### Python (Requests)
```python
import requests
import json

API_BASE = 'http://localhost:3001'

def verify_credentials(cookie, xsrf_token):
    response = requests.post(
        f'{API_BASE}/api/verify-credentials',
        json={
            'cookie': cookie,
            'xsrfToken': xsrf_token
        }
    )
    return response.json()

def load_employees(cookie, xsrf_token):
    response = requests.post(
        f'{API_BASE}/api/employees',
        json={
            'cookie': cookie,
            'xsrfToken': xsrf_token
        }
    )
    return response.json()

# Sử dụng
cookie = 'your_cookie_here'
xsrf_token = 'your_token_here'

# Xác thực
result = verify_credentials(cookie, xsrf_token)
print(json.dumps(result, indent=2))

# Tải nhân viên
employees = load_employees(cookie, xsrf_token)
print(json.dumps(employees['data'], indent=2))
```

---

## ⚠️ Xử Lý Lỗi

### Mã Lỗi Thường Gặp

| Mã | Tên | Nguyên Nhân | Giải Pháp |
|-----|-------|-----------|----------|
| 200 | OK | Yêu cầu thành công | - |
| 400 | Bad Request | Dữ liệu không hợp lệ | Kiểm tra cookie/token |
| 401 | Unauthorized | Cookie/Token không hợp lệ | Lấy lại từ VTTECH |
| 405 | Method Not Allowed | Dùng sai HTTP method | Phải dùng POST |
| 500 | Server Error | Lỗi server | Kiểm tra logs |
| 503 | Service Unavailable | Server không khả dụng | Khởi động lại server |

### Xử Lý Lỗi trong Code

```javascript
async function handleRequest(endpoint, credentials) {
  try {
    const response = await axios.post(
      `http://localhost:3001${endpoint}`,
      credentials
    );

    if (!response.data.success) {
      console.error('API Error:', response.data.error);
      return null;
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      // Server trả về status không 2xx
      console.error('HTTP Error:', error.response.status);
      console.error('Message:', error.response.data);
    } else if (error.request) {
      // Request không nhận được response
      console.error('Network Error: No response from server');
    } else {
      // Lỗi khác
      console.error('Error:', error.message);
    }
    return null;
  }
}
```

### Kiểm Tra Cookie & Token

Cookie/Token hết hạn nếu:
- Trả về 401 Unauthorized
- Dữ liệu rỗng
- Lỗi "Invalid credentials"

Cách cập nhật:
1. Đăng nhập lại vào VTTECH
2. Mở DevTools (F12)
3. Lấy Cookie & Token mới
4. Dán vào giao diện

---

## 📝 Ghi Chú

- ✅ Server chạy ở port 3001
- ✅ CORS đã được kích hoạt
- ✅ Timeout 30 giây cho requests
- ✅ Tất cả request đều là POST (trừ /api/health là GET)
- ✅ Credentials lưu vào localStorage, không gửi lên server
- ✅ Token có thể hết hạn, cần cập nhật định kỳ

---

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra cookie/token còn hạn không
2. Xem logs trong console (F12)
3. Test health check: `curl http://localhost:3001/api/health`
4. Khởi động lại server

---

**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** 25/10/2025
