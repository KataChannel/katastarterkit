#!/bin/bash

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔴 VẤN ĐỀ: FOLDER CÓ THỂ BỊ KHÓA BỞI ORGANIZATION POLICY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Folder hiện tại có thể thuộc Google Workspace Organization"
echo "và không cho phép share với external service accounts."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ GIẢI PHÁP: TẠO FOLDER MỚI TRONG PERSONAL GOOGLE DRIVE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "HÃY LÀM THEO CÁC BƯỚC SAU:"
echo ""
echo "1️⃣  Vào https://drive.google.com"
echo ""
echo "2️⃣  Click 'Mới' / 'New' → 'Thư mục' / 'Folder'"
echo ""
echo "3️⃣  Đặt tên: 'Tài Liệu Nguồn LMS'"
echo ""
echo "4️⃣  Click phải vào folder mới tạo → 'Share' / 'Chia sẻ'"
echo ""
echo "5️⃣  Paste email này:"
echo ""
echo "    app-taza-group-drive-tazagroup@tazagroup-480011.iam.gserviceaccount.com"
echo ""
echo "6️⃣  Chọn quyền: 'Người chỉnh sửa' / 'Editor'"
echo ""
echo "7️⃣  Click 'Gửi' / 'Send'"
echo ""
echo "8️⃣  Mở folder → Copy URL từ thanh địa chỉ trình duyệt"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Sau khi làm xong, paste URL folder mới vào đây và nhấn Enter:"
echo ""
read -p "URL: " NEW_FOLDER_URL

# Extract folder ID from URL
if [[ $NEW_FOLDER_URL =~ folders/([a-zA-Z0-9_-]+) ]]; then
  NEW_FOLDER_ID="${BASH_REMATCH[1]}"
  echo ""
  echo "✅ Đã extract Folder ID: $NEW_FOLDER_ID"
  echo ""
  echo "⏳ Đợi 5 giây để Google đồng bộ..."
  sleep 5
  echo ""
  echo "🧪 Testing folder mới..."
  echo ""
  
  # Temporarily update folder ID and test
  export TEST_FOLDER_ID="$NEW_FOLDER_ID"
  
  # Create temp test script
  cat > /tmp/test-new-folder.js << 'EOJS'
require('dotenv').config();
const { google } = require('googleapis');

async function testFolder() {
  const folderId = process.env.TEST_FOLDER_ID;
  const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON;
  
  if (!credentialsJson) {
    console.error('❌ GOOGLE_DRIVE_CREDENTIALS_JSON not set');
    process.exit(1);
  }
  
  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  
  const drive = google.drive({ version: 'v3', auth });
  
  console.log(`🔍 Testing folder: ${folderId}\n`);
  
  try {
    const response = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType',
    });
    
    console.log('✅ SUCCESS! Folder accessible:');
    console.log('   ID:', response.data.id);
    console.log('   Name:', response.data.name);
    console.log('   Type:', response.data.mimeType);
    console.log('\n✅ Folder mới hoạt động HOÀN HẢO!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    process.exit(1);
  }
}

testFolder();
EOJS
  
  TEST_FOLDER_ID="$NEW_FOLDER_ID" node /tmp/test-new-folder.js
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 THÀNH CÔNG! Folder mới hoạt động tốt!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Bây giờ cập nhật Folder ID vào code..."
    echo ""
    echo "Folder ID mới: $NEW_FOLDER_ID"
    echo "Folder URL: $NEW_FOLDER_URL"
    echo ""
    
    # Update the service file
    cd /chikiet/kataoffical/shoprausach
    
    # Show the command to update
    echo "Chạy command này để cập nhật:"
    echo ""
    echo "sed -i \"s/COMPANY_FOLDER_ID = '[^']*'/COMPANY_FOLDER_ID = '$NEW_FOLDER_ID'/\" backend/src/services/google-drive.service.ts"
    echo ""
    echo "Hoặc tôi sẽ tự động cập nhật ngay bây giờ? (y/n)"
    read -p "Cập nhật tự động? " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      sed -i "s/COMPANY_FOLDER_ID = '[^']*'/COMPANY_FOLDER_ID = '$NEW_FOLDER_ID'/" backend/src/services/google-drive.service.ts
      echo ""
      echo "✅ Đã cập nhật COMPANY_FOLDER_ID trong google-drive.service.ts"
      echo ""
      echo "🔄 Restart backend để áp dụng..."
    fi
  else
    echo ""
    echo "❌ Folder mới cũng không hoạt động."
    echo "Có thể account Google của bạn có restrictions."
  fi
  
else
  echo ""
  echo "❌ URL không hợp lệ. Phải có dạng:"
  echo "   https://drive.google.com/drive/folders/FOLDER_ID"
  echo ""
fi
