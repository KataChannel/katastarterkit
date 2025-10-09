const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Để xử lý CORS nếu frontend gọi từ domain khác
const zlib = require('zlib');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const port = 3999; // Có thể thay đổi port nếu cần

// Cấu hình multer để upload file
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Sử dụng CORS middleware
app.use(cors());

// Middleware để parse JSON body
app.use(express.json());

// Endpoint để gửi ZNS
app.post('/sendzns', async (req, res) => {
    try {
        const { phone, template_id, customer_name, customer_id, tracking_id,access_token } = req.body;

        // Validate required fields
        if (!phone || !template_id || !customer_name || !customer_id || !tracking_id) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['phone', 'template_id', 'customer_name', 'customer_id', 'tracking_id']
            });
        }

        let data = JSON.stringify({
            "mode": "development",
            "phone": phone,
            "template_id": template_id,
            "template_data": {
                "customer_name": customer_name,
                "customer_id": customer_id
            },
            "tracking_id": tracking_id
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://business.openapi.zalo.me/message/template',
            headers: { 
                'access_token': access_token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);
        
        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('Error sending ZNS:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});

// Endpoint để gửi ZNS hàng loạt từ file Excel
app.post('/sendzns/bulk', upload.single('file'), async (req, res) => {
    try {
        const { template_id, access_token } = req.body;

        // Validate required fields
        if (!template_id || !access_token) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['template_id', 'access_token', 'file']
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded',
                required: ['file (Excel file)']
            });
        }

        // Đọc file Excel
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Validate data structure
        if (data.length === 0) {
            return res.status(400).json({
                error: 'Excel file is empty',
                hint: 'File phải có ít nhất 1 dòng dữ liệu'
            });
        }

        // Kiểm tra các cột bắt buộc
        const requiredColumns = ['phone', 'customer_name', 'customer_id'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
            return res.status(400).json({
                error: 'Missing required columns in Excel',
                missing: missingColumns,
                hint: 'File Excel cần có các cột: phone, customer_name, customer_id'
            });
        }

        // Gửi ZNS cho từng khách hàng
        const results = [];
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const tracking_id = `BULK_${Date.now()}_${i}`;

            try {
                let requestData = JSON.stringify({
                    "mode": "development",
                    "phone": row.phone.toString(),
                    "template_id": template_id,
                    "template_data": {
                        "customer_name": row.customer_name,
                        "customer_id": row.customer_id.toString()
                    },
                    "tracking_id": tracking_id
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://business.openapi.zalo.me/message/template',
                    headers: { 
                        'access_token': access_token,
                        'Content-Type': 'application/json'
                    },
                    data: requestData
                };

                const response = await axios.request(config);
                
                results.push({
                    row: i + 1,
                    phone: row.phone,
                    customer_name: row.customer_name,
                    customer_id: row.customer_id,
                    status: 'success',
                    response: response.data
                });
                
                successCount++;

                // Delay nhỏ để tránh rate limit (100ms)
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                results.push({
                    row: i + 1,
                    phone: row.phone,
                    customer_name: row.customer_name,
                    customer_id: row.customer_id,
                    status: 'failed',
                    error: error.message,
                    details: error.response?.data
                });
                
                failCount++;
            }
        }

        // Xóa file đã upload
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            summary: {
                total: data.length,
                success: successCount,
                failed: failCount,
                successRate: ((successCount / data.length) * 100).toFixed(2) + '%'
            },
            results: results
        });

    } catch (error) {
        console.error('Error processing bulk ZNS:', error);
        
        // Xóa file nếu có lỗi
        if (req.file) {
            const fs = require('fs');
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data
        });
    }
});


// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});