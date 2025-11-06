#!/bin/bash
# Test GOOGLE_GEMINI_API_KEY configuration

echo "🔍 Testing GOOGLE_GEMINI_API_KEY Configuration"
echo "=============================================="
echo ""

# Check .env files
echo "📁 Checking .env files:"
echo ""

echo "1️⃣ backend/.env:"
grep "GOOGLE_GEMINI_API_KEY" backend/.env 2>/dev/null && echo "   ✅ Found" || echo "   ❌ Missing"

echo "2️⃣ .env.rausach:"
grep "GOOGLE_GEMINI_API_KEY" .env.rausach 2>/dev/null && echo "   ✅ Found" || echo "   ❌ Missing"

echo "3️⃣ .env.tazagroup:"
grep "GOOGLE_GEMINI_API_KEY" .env.tazagroup 2>/dev/null && echo "   ✅ Found" || echo "   ❌ Missing"

echo ""
echo "📊 Docker Compose Configuration:"
echo ""

echo "Checking docker-compose.hybrid.yml..."
if grep -q "env_file:" docker-compose.hybrid.yml && \
   grep -q ".env.rausach" docker-compose.hybrid.yml && \
   grep -q ".env.tazagroup" docker-compose.hybrid.yml; then
    echo "✅ Both domains configured with env_file"
else
    echo "❌ Missing env_file configuration"
fi

echo ""
echo "🔧 Services Using GOOGLE_GEMINI_API_KEY:"
echo ""

echo "Backend services:"
grep -r "GOOGLE_GEMINI_API_KEY" backend/src --include="*.ts" 2>/dev/null | \
    cut -d: -f1 | sort -u | while read file; do
        echo "  • $(basename $file)"
    done

echo ""
echo "✅ Configuration Check Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Build: ./build-frontend.sh"
echo "   2. Deploy: ./deploy.sh"
echo "   3. Test AI Course Generator at: http://116.118.49.243:13000/lms/admin/courses/create-with-ai"
echo ""
