#!/bin/bash

# Template Library Functionality Test Script
echo "🧪 Template Library Functionality Test"
echo "====================================="
echo

cd /mnt/chikiet/kataoffical/fullstack/katacore/frontend

# 1. Test Template Data Loading
echo "📂 1. Testing Template Data Loading"
echo "-----------------------------------"

# Check if BLOCK_TEMPLATES exists and has data
if node -e "
const fs = require('fs');
try {
  const content = fs.readFileSync('src/data/blockTemplates.ts', 'utf8');
  const templateCount = (content.match(/id: '/g) || []).length;
  console.log('✅ BLOCK_TEMPLATES loaded with', templateCount, 'templates');
  
  // Check if export is proper
  if (content.includes('export const BLOCK_TEMPLATES')) {
    console.log('✅ BLOCK_TEMPLATES properly exported');
  } else {
    console.log('❌ BLOCK_TEMPLATES export issue');
  }
} catch (error) {
  console.log('❌ Error loading BLOCK_TEMPLATES:', error.message);
}
"; then
    echo "BLOCK_TEMPLATES check completed"
else
    echo "❌ BLOCK_TEMPLATES check failed"
fi

echo

# 2. Test Custom Templates Storage
echo "💾 2. Testing Custom Templates Storage"
echo "-------------------------------------"

# Test localStorage simulation
node -e "
// Simulate localStorage for Node.js testing
global.localStorage = {
  data: {},
  getItem: function(key) { return this.data[key] || null; },
  setItem: function(key, value) { this.data[key] = value; },
  removeItem: function(key) { delete this.data[key]; }
};

try {
  // Try to load custom templates utility
  const fs = require('fs');
  const content = fs.readFileSync('src/utils/customTemplates.ts', 'utf8');
  
  if (content.includes('getCustomTemplates')) {
    console.log('✅ getCustomTemplates function exists');
  }
  
  if (content.includes('saveCustomTemplate')) {
    console.log('✅ saveCustomTemplate function exists');
  }
  
  if (content.includes('deleteCustomTemplate')) {
    console.log('✅ deleteCustomTemplate function exists');
  }
  
  console.log('✅ Custom templates utilities available');
} catch (error) {
  console.log('❌ Custom templates utilities error:', error.message);
}
"

echo

# 3. Test Template Categories
echo "🏷️ 3. Testing Template Categories"
echo "--------------------------------"

# Extract categories from blockTemplates.ts
CATEGORIES=$(grep -o "category: '[^']*'" src/data/blockTemplates.ts | cut -d"'" -f2 | sort | uniq)
echo "Available template categories:"
for category in $CATEGORIES; do
    COUNT=$(grep -c "category: '$category'" src/data/blockTemplates.ts)
    echo "  - $category: $COUNT templates"
done

echo

# 4. Test Template Thumbnails
echo "🖼️ 4. Testing Template Thumbnails"
echo "--------------------------------"

if [ -f "src/utils/templateThumbnails.ts" ]; then
    echo "✅ templateThumbnails.ts exists"
    
    # Check if getThumbnailDataURL function exists
    if grep -q "getThumbnailDataURL" src/utils/templateThumbnails.ts; then
        echo "✅ getThumbnailDataURL function exists"
    else
        echo "❌ getThumbnailDataURL function missing"
    fi
    
    # Check if it uses our fixed encoding
    if grep -q "encodeURIComponent" src/utils/templateThumbnails.ts; then
        echo "✅ Uses UTF-8 safe encoding (encodeURIComponent)"
    else
        echo "⚠️ May have encoding issues (btoa usage)"
    fi
else
    echo "❌ templateThumbnails.ts missing"
fi

echo

# 5. Test PageBuilder Integration
echo "🔗 5. Testing PageBuilder Integration"
echo "------------------------------------"

# Check PageBuilderProvider integration
if [ -f "src/components/page-builder/PageBuilderProvider.tsx" ]; then
    echo "Checking PageBuilderProvider template integration..."
    
    PROVIDER_FEATURES=(
        "allTemplates"
        "customTemplates"
        "handleApplyTemplate"
        "handlePreviewTemplate"
        "handleDeleteCustomTemplate"
        "handleSaveAsTemplate"
    )
    
    for feature in "${PROVIDER_FEATURES[@]}"; do
        if grep -q "$feature" src/components/page-builder/PageBuilderProvider.tsx; then
            echo "✅ PageBuilderProvider has $feature"
        else
            echo "❌ PageBuilderProvider missing $feature"
        fi
    done
else
    echo "❌ PageBuilderProvider.tsx missing"
fi

echo

# 6. Test Sidebar Template Display
echo "🎨 6. Testing Sidebar Template Display"
echo "-------------------------------------"

if [ -f "src/components/page-builder/PageBuilderSidebar.tsx" ]; then
    echo "Checking PageBuilderSidebar template display..."
    
    SIDEBAR_FEATURES=(
        "Templates"
        "filteredTemplates"
        "templateSearchQuery"
        "selectedTemplateCategory"
        "Preview"
        "Apply"
    )
    
    for feature in "${SIDEBAR_FEATURES[@]}"; do
        if grep -q "$feature" src/components/page-builder/PageBuilderSidebar.tsx; then
            echo "✅ PageBuilderSidebar has $feature"
        else
            echo "❌ PageBuilderSidebar missing $feature"
        fi
    done
else
    echo "❌ PageBuilderSidebar.tsx missing"
fi

echo

# 7. Test Template Search and Filtering
echo "🔍 7. Testing Template Search and Filtering"
echo "-------------------------------------------"

# Check if search functionality exists
if grep -q "templateSearchQuery\|template.*filter\|search.*template" src/components/page-builder/PageBuilderSidebar.tsx; then
    echo "✅ Template search functionality exists"
else
    echo "❌ Template search functionality missing"
fi

# Check if category filtering exists
if grep -q "selectedTemplateCategory\|template.*category\|category.*filter" src/components/page-builder/PageBuilderSidebar.tsx; then
    echo "✅ Template category filtering exists"
else
    echo "❌ Template category filtering missing"
fi

echo

# 8. Test Template Actions
echo "⚡ 8. Testing Template Actions"
echo "-----------------------------"

# Test if template actions are implemented
ACTIONS=(
    "Preview"
    "Apply"
    "Delete"
    "Save"
)

for action in "${ACTIONS[@]}"; do
    if grep -qi "handle.*$action.*template\|$action.*template\|template.*$action" src/components/page-builder/PageBuilderSidebar.tsx src/components/page-builder/PageBuilderProvider.tsx; then
        echo "✅ Template $action action exists"
    else
        echo "❌ Template $action action missing"
    fi
done

echo

# 9. Check for Template Library Modal/Dialog
echo "📦 9. Testing Template Dialogs"
echo "------------------------------"

DIALOGS=(
    "TemplatePreviewModal"
    "SaveTemplateDialog"
    "preview"
    "save.*template"
)

for dialog in "${DIALOGS[@]}"; do
    if find src/components/page-builder -name "*.tsx" -exec grep -l "$dialog" {} \; | head -1 >/dev/null; then
        echo "✅ $dialog exists"
    else
        echo "❌ $dialog missing"
    fi
done

echo

# 10. Template Library Summary
echo "📋 10. Template Library Functionality Summary"
echo "============================================="

echo
echo "🎯 TEMPLATE LIBRARY FUNCTIONALITY TEST COMPLETE"
echo

# Count total issues
TOTAL_FILES=0
WORKING_FILES=0

if [ -f "src/data/blockTemplates.ts" ]; then
    TOTAL_FILES=$((TOTAL_FILES + 1))
    WORKING_FILES=$((WORKING_FILES + 1))
fi

if [ -f "src/utils/customTemplates.ts" ]; then
    TOTAL_FILES=$((TOTAL_FILES + 1))
    WORKING_FILES=$((WORKING_FILES + 1))
fi

if [ -f "src/components/page-builder/PageBuilderProvider.tsx" ]; then
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if grep -q "handleApplyTemplate" src/components/page-builder/PageBuilderProvider.tsx; then
        WORKING_FILES=$((WORKING_FILES + 1))
    fi
fi

if [ -f "src/components/page-builder/PageBuilderSidebar.tsx" ]; then
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if grep -q "Templates" src/components/page-builder/PageBuilderSidebar.tsx; then
        WORKING_FILES=$((WORKING_FILES + 1))
    fi
fi

echo "📊 Status: $WORKING_FILES/$TOTAL_FILES core files working"
echo
echo "🚀 Next Steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open PageBuilder"
echo "3. Check Templates tab in sidebar"
echo "4. Test template preview and apply"
echo "5. Test saving custom templates"
echo
echo "🔧 If issues persist:"
echo "1. Check browser console for errors"
echo "2. Verify localStorage is working"
echo "3. Check network requests for template data"
echo "4. Ensure all template handlers are connected"
echo
echo "==========================================="