#!/bin/bash
# Test Google Drive connection with .env file

cd /chikiet/kataoffical/shoprausach/backend

# Read .env and extract GOOGLE_DRIVE_CREDENTIALS_JSON
CREDENTIALS=$(grep "^GOOGLE_DRIVE_CREDENTIALS_JSON=" .env | cut -d'=' -f2-)

if [ -z "$CREDENTIALS" ]; then
    echo "❌ GOOGLE_DRIVE_CREDENTIALS_JSON not found in .env"
    exit 1
fi

# Export and run test
export GOOGLE_DRIVE_CREDENTIALS_JSON="$CREDENTIALS"
node test-google-drive-direct.js
