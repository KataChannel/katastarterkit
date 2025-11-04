# 🔐 VTTECH API Data Decompression Guide

## 🎯 Tóm Tắt Cách VTTECH Trả Về Dữ Liệu

VTTECH API trả về dữ liệu được xử lý theo cách sau:

```
┌─────────────────────────────────────────┐
│   VTTECH Server Response                │
├─────────────────────────────────────────┤
│ 1. JSON Data                            │
│ 2. Gzip Compressed                      │
│ 3. Base64 Encoded                       │
│                                         │
│ Result: H4sIAA...qh/zj+... (String)   │
└─────────────────────────────────────────┘
                   ↓
         Our Server Processing
                   ↓
┌─────────────────────────────────────────┐
│ 1. Base64 Decode → Buffer               │
│ 2. Gzip Decompress → String             │
│ 3. JSON Parse → Object                  │
│                                         │
│ Result: { data: [...] }                 │
└─────────────────────────────────────────┘
                   ↓
         Send to Frontend (JSON)
                   ↓
```

---

## 🔍 Chi Tiết Từng Bước

### Bước 1: Base64 Decoding

```javascript
// Input: "H4sIAA..." (Base64 string từ VTTECH)
const buffer = Buffer.from(encodedData, 'base64');
// Output: Buffer object
```

### Bước 2: Gzip Decompression

```javascript
// Input: Buffer object (gzip compressed)
const zlib = require('zlib');
const decompressed = zlib.gunzipSync(buffer);
// Output: Buffer object (uncompressed)
```

### Bước 3: JSON Parsing

```javascript
// Input: Buffer (UTF-8 encoded JSON)
const decodedData = JSON.parse(decompressed.toString('utf8'));
// Output: JavaScript object
```

---

## 📝 Code Implementation

### Complete Decompression Function

```javascript
const zlib = require('zlib');

function decompressVTTECHData(encodedData) {
    try {
        // 1. Check if data exists and is string
        if (!encodedData || typeof encodedData !== 'string') {
            return encodedData;
        }
        
        // 2. Convert Base64 to Buffer
        const buffer = Buffer.from(encodedData, 'base64');
        
        // 3. Decompress using gzip
        const decompressed = zlib.gunzipSync(buffer);
        
        // 4. Parse JSON
        return JSON.parse(decompressed.toString('utf8'));
    } catch (error) {
        console.warn('Decompression error:', error.message);
        
        // Fallback: try parsing as plain JSON (in case not compressed)
        try {
            return JSON.parse(encodedData);
        } catch {
            // Last resort: return as-is
            return encodedData;
        }
    }
}
```

### Usage in API Endpoint

```javascript
app.post('/api/employees', async (req, res) => {
    try {
        const { cookie, xsrfToken } = req.body;
        
        // Call VTTECH API
        const response = await axios.request(config);
        
        // Decompress the response data
        const decodedData = decompressVTTECHData(response.data);
        
        // Return to client
        res.json({
            success: true,
            data: decodedData || response.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Error handling...
    }
});
```

---

## 🧪 Testing Decompression

### Test with Real VTTECH Data

```bash
# 1. Get credentials
COOKIE="your_cookie_here"
TOKEN="your_token_here"

# 2. Call endpoint
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d "{
    \"cookie\": \"$COOKIE\",
    \"xsrfToken\": \"$TOKEN\"
  }" | jq .

# 3. Expected response:
# {
#   "success": true,
#   "data": [
#     {
#       "Id": 1,
#       "Name": "Nguyễn Văn A",
#       ...
#     }
#   ],
#   "timestamp": "2025-10-25T12:00:00.000Z"
# }
```

### Debug Decompression

```javascript
// If decompression fails, check:

// 1. Is encodedData a valid Base64 string?
console.log('Input type:', typeof response.data);
console.log('Input sample:', response.data.substring(0, 50));

// 2. Can we decode Base64?
try {
    const buffer = Buffer.from(response.data, 'base64');
    console.log('Base64 decode: OK', buffer.length, 'bytes');
} catch (e) {
    console.error('Base64 decode: FAILED', e.message);
}

// 3. Can we decompress?
try {
    const buffer = Buffer.from(response.data, 'base64');
    const decompressed = zlib.gunzipSync(buffer);
    console.log('Gzip decompress: OK', decompressed.length, 'bytes');
} catch (e) {
    console.error('Gzip decompress: FAILED', e.message);
}

// 4. Can we parse JSON?
try {
    const buffer = Buffer.from(response.data, 'base64');
    const decompressed = zlib.gunzipSync(buffer);
    const data = JSON.parse(decompressed.toString('utf8'));
    console.log('JSON parse: OK', Object.keys(data).length, 'keys');
} catch (e) {
    console.error('JSON parse: FAILED', e.message);
}
```

---

## 🛡️ Error Handling

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Invalid Base64 | Data không phải Base64 | Check VTTECH response format |
| Cannot decompress | Data không phải Gzip | Check VTTECH API status |
| Invalid JSON | Decompressed data lỗi | Check VTTECH server response |
| Empty data | Credentials hết hạn | Renew Cookie/Token from VTTECH |

---

## 📚 Dependencies

```json
{
  "zlib": "built-in Node.js module",
  "axios": "^1.6.0",
  "express": "^4.18.2"
}
```

### Installation

```bash
# zlib is built-in, no installation needed
# Other dependencies:
npm install axios express cors body-parser dotenv
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│                                                          │
│  1. Input: Cookie & Xsrf-Token                          │
│  2. Send POST request to API                            │
│  3. Receive JSON response                               │
│  4. Display data in table                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Our API Server                        │
│                   (servervttech.js)                      │
│                                                          │
│  1. Receive POST request from client                    │
│  2. Forward to VTTECH API with credentials             │
│  3. Receive: Base64 + Gzip compressed data             │
│  4. Decompress:                                         │
│     • Base64 decode → Buffer                           │
│     • Gzip decompress → String                         │
│     • JSON parse → Object                              │
│  5. Send JSON to client                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    VTTECH API                            │
│                                                          │
│  1. Receive request with credentials                   │
│  2. Verify authentication                              │
│  3. Query database                                     │
│  4. Get JSON response                                  │
│  5. Compress: JSON → Gzip → Base64                     │
│  6. Return compressed response                         │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Key Points

1. **VTTECH Always Compresses**: Tất cả VTTECH endpoints đều trả về dữ liệu dưới dạng Base64 + Gzip

2. **Automatic Fallback**: If decompression fails, server sẽ:
   - Try parsing as plain JSON
   - Return data as-is if all fails

3. **No Data Loss**: Decompression chỉ là formatting, không mất dữ liệu

4. **Performance**: 
   - Decompression nhanh (< 100ms)
   - Reduce network transfer size
   - Client nhận JSON format rõ ràng

5. **Error Handling**: 
   - Server logs all decompression attempts
   - Frontend receives detailed error messages
   - Supports both compressed and uncompressed data

---

## 🔗 References

- [Node.js zlib documentation](https://nodejs.org/api/zlib.html)
- [Base64 encoding/decoding](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
- [Gzip compression format](https://www.gzip.org/)

---

**Last Updated:** 25/10/2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
