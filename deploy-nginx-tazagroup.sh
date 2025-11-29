#!/bin/bash
# Deploy nginx configs for tazagroup to server 116.118.49.243
# Run this from local machine

SERVER="116.118.49.243"
USER="root"

echo "📦 Deploying nginx configs to $SERVER..."

# Copy appapi.tazagroup.vn config
scp nginx/appapi.tazagroup.vn $USER@$SERVER:/etc/nginx/sites-available/appapi.tazagroup.vn

# Copy app.tazagroup.vn config
scp nginx/app.tazagroup.vn $USER@$SERVER:/etc/nginx/sites-available/app.tazagroup.vn

echo "🔗 Creating symlinks..."
ssh $USER@$SERVER "ln -sf /etc/nginx/sites-available/appapi.tazagroup.vn /etc/nginx/sites-enabled/"
ssh $USER@$SERVER "ln -sf /etc/nginx/sites-available/app.tazagroup.vn /etc/nginx/sites-enabled/"

echo "✅ Testing nginx config..."
ssh $USER@$SERVER "nginx -t"

echo "🔄 Reloading nginx..."
ssh $USER@$SERVER "nginx -s reload"

echo "✅ Done! Test CORS:"
echo "   curl -I -X OPTIONS -H 'Origin: https://app.tazagroup.vn' https://appapi.tazagroup.vn/graphql"
