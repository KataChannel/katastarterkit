// Test Google Drive API directly with Node.js
require('dotenv').config();
const { google } = require('googleapis');

async function testGoogleDrive() {
  try {
    console.log('🔍 Testing Google Drive Connection...\n');
    
    // Read credentials from env
    const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS_JSON;
    
    if (!credentialsJson) {
      console.error('❌ GOOGLE_DRIVE_CREDENTIALS_JSON not set');
      process.exit(1);
    }
    
    console.log('✅ Credentials loaded');
    const credentials = JSON.parse(credentialsJson);
    console.log('📧 Service Account:', credentials.client_email);
    
    // Initialize auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });
    console.log('✅ Google Drive API initialized\n');
    
    // Test accessing the folder
    const folderId = '1JR8q5xZ8vCWJgDEXMdEjwYinte4IXPE4';
    console.log(`🔍 Testing access to folder: ${folderId}`);
    
    try {
      const response = await drive.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType, owners, permissions, driveId',
        supportsAllDrives: true,
      });
      
      console.log('✅ SUCCESS! Folder accessible:');
      console.log('   ID:', response.data.id);
      console.log('   Name:', response.data.name);
      console.log('   Type:', response.data.mimeType);
      console.log('   Drive ID:', response.data.driveId || 'N/A (My Drive)');
      console.log('\n✅ Google Drive connection is working!');
      
    } catch (error) {
      console.error('\n❌ FAILED to access folder:');
      console.error('   Error:', error.message);
      console.error('   Code:', error.code);
      
      if (error.code === 404) {
        console.error('\n💡 Possible causes:');
        console.error('   1. Folder not shared with service account');
        console.error('   2. Google needs time to sync permissions (wait 2-5 minutes)');
        console.error('   3. Folder ID is incorrect');
        console.error('   4. This is a Shared Drive - make sure service account has access');
        console.error('\n📧 Make sure this email has access to the Shared Drive:');
        console.error('   ', credentials.client_email);
      } else if (error.code === 403 && error.message.includes('not been used')) {
        console.error('\n💡 Google Drive API is not enabled for this project!');
        console.error('   Enable it at: https://console.developers.google.com/apis/api/drive.googleapis.com');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testGoogleDrive();
