#!/bin/bash

# ============================================================================
# QUICK REMOTE DEPLOYMENT - One Command Deploy
# ============================================================================

echo "🚀 Starting deployment to server 116.118.48.208..."
echo ""
echo "Prerequisites:"
echo "  1. Ensure you can SSH to the server: ssh root@116.118.48.208"
echo "  2. If not, set up SSH key: ssh-copy-id root@116.118.48.208"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Set environment variables
export SERVER_IP="116.118.48.208"
export SSH_USER="${SSH_USER:-root}"
export SSH_PORT="${SSH_PORT:-22}"

# Make deploy script executable
chmod +x deploy-to-remote.sh

# Run deployment
./deploy-to-remote.sh

echo ""
echo "✅ Deployment script completed!"
echo ""
echo "🌐 Your application should be available at:"
echo "   Frontend: http://116.118.48.208:14000"
echo "   Backend:  http://116.118.48.208:14001/graphql"
echo ""
echo "📋 To monitor on the server:"
echo "   ssh root@116.118.48.208"
echo "   cd /opt/innerv2"
echo "   docker compose -f docker-compose.build.yml ps"
echo "   docker compose -f docker-compose.build.yml logs -f backend"
