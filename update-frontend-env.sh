#!/bin/bash

# ============================================
# Update Frontend .env for Remote Server
# Updates connection strings to point to deployed infrastructure
# ============================================

SERVER_IP="${1:-116.118.48.208}"
ENV_FILE="frontend/.env"

echo "Updating ${ENV_FILE} to use server at ${SERVER_IP}..."

# Backup original .env
cp ${ENV_FILE} ${ENV_FILE}.backup
echo "✓ Backup created: ${ENV_FILE}.backup"

# Update DATABASE_URL
sed -i "s|DATABASE_URL=\"postgresql://postgres:postgres@localhost:14003/innerv2core\"|DATABASE_URL=\"postgresql://postgres:postgres@${SERVER_IP}:14003/innerv2core\"|g" ${ENV_FILE}
sed -i "s|DATABASE_URL=\"postgresql://postgres:postgres@[0-9.]*:14003/innerv2core\"|DATABASE_URL=\"postgresql://postgres:postgres@${SERVER_IP}:14003/innerv2core\"|g" ${ENV_FILE}
echo "✓ Updated DATABASE_URL to ${SERVER_IP}:14003"

# Update Redis configuration
sed -i "s|REDIS_HOST=localhost|REDIS_HOST=${SERVER_IP}|g" ${ENV_FILE}
sed -i "s|REDIS_HOST=[0-9.]*|REDIS_HOST=${SERVER_IP}|g" ${ENV_FILE}
echo "✓ Updated REDIS_HOST to ${SERVER_IP}"

# Update MinIO configuration
sed -i "s|MINIO_ENDPOINT=localhost|MINIO_ENDPOINT=${SERVER_IP}|g" ${ENV_FILE}
sed -i "s|MINIO_ENDPOINT=[0-9.]*|MINIO_ENDPOINT=${SERVER_IP}|g" ${ENV_FILE}
echo "✓ Updated MINIO_ENDPOINT to ${SERVER_IP}"

# Enable Redis
sed -i "s|#ENABLE_REDIS=true|ENABLE_REDIS=true|g" ${ENV_FILE}
if ! grep -q "ENABLE_REDIS=true" ${ENV_FILE}; then
    echo "" >> ${ENV_FILE}
    echo "# Enable Redis for production" >> ${ENV_FILE}
    echo "ENABLE_REDIS=true" >> ${ENV_FILE}
fi
echo "✓ Enabled Redis"

echo ""
echo "========================================="
echo "Updated Connection Strings:"
echo "========================================="
grep -E "DATABASE_URL|REDIS_HOST|REDIS_PORT|MINIO_ENDPOINT|MINIO_PORT" ${ENV_FILE} | grep -v "^#" || true
echo ""
echo "✓ Frontend .env updated successfully!"
echo ""
echo "To restore original .env:"
echo "  mv ${ENV_FILE}.backup ${ENV_FILE}"
