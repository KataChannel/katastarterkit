#!/bin/bash

# Start Frontend for Rausach Domain (Port 12000)

cd "$(dirname "$0")/frontend"

echo "🚀 Starting Rausach Frontend on port 12000..."
echo "📝 Using .env.local for configuration"
echo ""

# Ensure .env.local exists with Rausach config
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo "Creating .env.local with Rausach configuration..."
fi

# Always update .env.local for Rausach
cat > .env.local << 'EOF'
# Local Development Environment Variables for Rausach
# This file overrides .env for local development

# NextAuth.js
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
NEXTAUTH_URL=http://116.118.49.243:12000

# Next.js Frontend - Rausach Domain (12xxx ports)
NEXT_PUBLIC_APP_URL=http://116.118.49.243:12000
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://116.118.49.243:12001/graphql
NEXT_PUBLIC_BACKEND_URL=http://116.118.49.243:12001
NEXT_PUBLIC_SOCKET_URL=http://116.118.49.243:12001

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=897974685698-621ekaodhnha7ssfaml6m1u418ab2ucq.apps.googleusercontent.com
EOF

echo "✅ Configuration ready for Rausach!"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://116.118.49.243:12000"
echo "   Backend:  http://116.118.49.243:12001/graphql"
echo ""

# Start Next.js dev server on port 12000
npm run dev
