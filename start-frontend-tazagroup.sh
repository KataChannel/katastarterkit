#!/bin/bash

# Start Frontend for Innerv2 Domain (Port 13000)

cd "$(dirname "$0")/frontend"

echo "🚀 Starting Innerv2 Frontend on port 13000..."
echo "📝 Using .env.local for configuration"
echo ""

# Ensure .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "Creating .env.local with Innerv2 configuration..."
    cat > .env.local << 'EOF'
# Local Development Environment Variables for Innerv2
# This file overrides .env for local development

# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
NEXTAUTH_URL=http://116.118.48.208:13000

# Next.js Frontend - Innerv2 Domain (13xxx ports)
NEXT_PUBLIC_APP_URL=http://116.118.48.208:13000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.48.208:13001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.48.208:13001
NEXT_PUBLIC_SOCKET_URL=http://116.118.48.208:13001

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=897974685698-621ekaodhnha7ssfaml6m1u418ab2ucq.apps.googleusercontent.com
EOF
fi

echo "✅ Configuration ready!"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://116.118.48.208:13000"
echo "   Backend:  http://116.118.48.208:13001/graphql"
echo ""

# Start Next.js dev server on port 13000
npm run dev -- -p 13000
