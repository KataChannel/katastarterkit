#!/bin/bash

# Template Library Runtime Test Script
echo "🔍 Template Library Runtime Diagnostic"
echo "======================================"
echo

cd /mnt/chikiet/kataoffical/fullstack/tazagroupcore/frontend

# 1. Test if sample templates are being initialized
echo "📋 1. Testing Sample Template Initialization"
echo "-------------------------------------------"

# Check initSampleTemplates function
if [ -f "src/utils/initSampleTemplates.ts" ]; then
    echo "✅ initSampleTemplates.ts exists"
    
    # Check what sample templates are being created
    SAMPLE_COUNT=$(grep -c "saveCustomTemplate" src/utils/initSampleTemplates.ts)
    echo "📊 Found $SAMPLE_COUNT sample templates being created"
    
    # List sample template names
    echo "📝 Sample template names:"
    grep -A 5 "saveCustomTemplate" src/utils/initSampleTemplates.ts | grep "name:" | sed 's/.*name: //' | sed "s/[',]//g" | while read line; do
        echo "  - $line"
    done
else
    echo "❌ initSampleTemplates.ts missing"
fi

echo

# 2. Check PageBuilder sidebar template tab rendering
echo "🎨 2. Testing Template Tab Rendering"
echo "-----------------------------------"

if [ -f "src/components/page-builder/PageBuilderSidebar.tsx" ]; then
    # Check if templates tab has proper rendering
    if grep -A 20 'value="templates"' src/components/page-builder/PageBuilderSidebar.tsx | grep -q "filteredTemplates.map"; then
        echo "✅ Templates are being rendered in loop"
    else
        echo "❌ Template rendering loop missing"
    fi
    
    # Check if empty state is handled
    if grep -A 10 "filteredTemplates.length === 0" src/components/page-builder/PageBuilderSidebar.tsx; then
        echo "✅ Empty template state handling exists"
    else
        echo "❌ Empty template state handling missing"
    fi
    
    # Check template card structure
    if grep -A 30 "filteredTemplates.map" src/components/page-builder/PageBuilderSidebar.tsx | grep -q "thumbnail"; then
        echo "✅ Template thumbnails are displayed"
    else
        echo "❌ Template thumbnails missing from display"
    fi
else
    echo "❌ PageBuilderSidebar.tsx missing"
fi

echo

# 3. Test default templates count and structure
echo "📊 3. Testing Default Templates Structure"
echo "----------------------------------------"

# Count templates in blockTemplates.ts
HERO_COUNT=$(grep -c 'category: .hero' src/data/blockTemplates.ts)
FEATURES_COUNT=$(grep -c 'category: .features' src/data/blockTemplates.ts)
PRICING_COUNT=$(grep -c 'category: .pricing' src/data/blockTemplates.ts)
CUSTOM_COUNT=$(grep -c 'category: .custom' src/data/blockTemplates.ts)

echo "Template distribution:"
echo "  - Hero: $HERO_COUNT templates"
echo "  - Features: $FEATURES_COUNT templates"
echo "  - Pricing: $PRICING_COUNT templates"
echo "  - Custom: $CUSTOM_COUNT templates"

# Check if templates have required fields
echo
echo "Template structure validation:"

if grep -q "thumbnail.*getThumbnailDataURL" src/data/blockTemplates.ts; then
    echo "✅ Templates have thumbnail generation"
else
    echo "❌ Templates missing thumbnail generation"
fi

if grep -q "blocks.*\[\]" src/data/blockTemplates.ts; then
    echo "✅ Templates have blocks array structure"
else
    echo "❌ Templates missing blocks array structure"
fi

echo

# 4. Check template preview modal integration
echo "🔍 4. Testing Template Preview Modal"
echo "-----------------------------------"

if [ -f "src/components/page-builder/TemplatePreviewModal.tsx" ]; then
    echo "✅ TemplatePreviewModal.tsx exists"
    
    # Check if it has proper template structure rendering
    if grep -q "template.*blocks\|blocks.*template" src/components/page-builder/TemplatePreviewModal.tsx; then
        echo "✅ Preview modal renders template blocks"
    else
        echo "❌ Preview modal missing block rendering"
    fi
    
    # Check if it has apply functionality
    if grep -q "apply\|Apply" src/components/page-builder/TemplatePreviewModal.tsx; then
        echo "✅ Preview modal has apply functionality"
    else
        echo "❌ Preview modal missing apply functionality"
    fi
else
    echo "❌ TemplatePreviewModal.tsx missing"
fi

echo

# 5. Test save template dialog
echo "💾 5. Testing Save Template Dialog"
echo "---------------------------------"

if [ -f "src/components/page-builder/SaveTemplateDialog.tsx" ]; then
    echo "✅ SaveTemplateDialog.tsx exists"
    
    # Check if it has form fields
    FORM_FIELDS=(
        "name"
        "description"
        "category"
    )
    
    for field in "${FORM_FIELDS[@]}"; do
        if grep -qi "$field" src/components/page-builder/SaveTemplateDialog.tsx; then
            echo "✅ Save dialog has $field field"
        else
            echo "❌ Save dialog missing $field field"
        fi
    done
else
    echo "❌ SaveTemplateDialog.tsx missing"
fi

echo

# 6. Check template loading in PageBuilder
echo "🔄 6. Testing Template Loading in PageBuilder"
echo "--------------------------------------------"

if [ -f "src/components/page-builder/PageBuilder.tsx" ]; then
    # Check if PageBuilder includes template-related components
    TEMPLATE_COMPONENTS=(
        "SaveTemplateDialog"
        "TemplatePreviewModal"
        "showSaveTemplateDialog"
        "selectedTemplate"
    )
    
    for component in "${TEMPLATE_COMPONENTS[@]}"; do
        if grep -q "$component" src/components/page-builder/PageBuilder.tsx; then
            echo "✅ PageBuilder includes $component"
        else
            echo "❌ PageBuilder missing $component"
        fi
    done
else
    echo "❌ PageBuilder.tsx missing"
fi

echo

# 7. Test localStorage functionality simulation
echo "💾 7. Testing Template Storage Simulation"
echo "----------------------------------------"

# Create a simple Node.js test for template storage
node -e "
// Mock localStorage
global.localStorage = {
  data: {},
  getItem: function(key) { return this.data[key] || null; },
  setItem: function(key, value) { this.data[key] = value; },
  removeItem: function(key) { delete this.data[key]; }
};

console.log('🧪 Testing localStorage simulation...');

// Test basic storage
localStorage.setItem('test', 'value');
const retrieved = localStorage.getItem('test');
if (retrieved === 'value') {
  console.log('✅ localStorage simulation working');
} else {
  console.log('❌ localStorage simulation failed');
}

// Test template storage format
const testTemplate = {
  id: 'test-template',
  name: 'Test Template',
  description: 'A test template',
  category: 'custom',
  isCustom: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  blocks: []
};

localStorage.setItem('kata_custom_templates', JSON.stringify([testTemplate]));
const templates = JSON.parse(localStorage.getItem('kata_custom_templates') || '[]');

if (templates.length === 1 && templates[0].name === 'Test Template') {
  console.log('✅ Template storage format working');
} else {
  console.log('❌ Template storage format issue');
}
"

echo

# 8. Final recommendations
echo "🎯 8. Template Library Runtime Analysis"
echo "======================================="

echo
echo "📊 ANALYSIS RESULTS:"
echo

# Check if all core files exist
CORE_FILES=(
    "src/data/blockTemplates.ts"
    "src/utils/customTemplates.ts"
    "src/utils/initSampleTemplates.ts"
    "src/components/page-builder/PageBuilderSidebar.tsx"
    "src/components/page-builder/PageBuilderProvider.tsx"
    "src/components/page-builder/SaveTemplateDialog.tsx"
    "src/components/page-builder/TemplatePreviewModal.tsx"
)

EXISTING_FILES=0
for file in "${CORE_FILES[@]}"; do
    if [ -f "$file" ]; then
        EXISTING_FILES=$((EXISTING_FILES + 1))
    fi
done

echo "📁 Files: $EXISTING_FILES/${#CORE_FILES[@]} core template files exist"

echo
echo "🔧 MOST LIKELY ISSUES:"
echo "1. 🚫 Template tab may not be visible or accessible"
echo "2. 🔄 Templates may not be loading on PageBuilder mount"
echo "3. 🎨 Template thumbnails may not be displaying properly"
echo "4. 💾 localStorage may be blocked or not working in browser"
echo "5. ⚡ Template actions (preview/apply) may have validation issues"
echo

echo "🚀 RECOMMENDED DEBUGGING STEPS:"
echo "1. Open browser DevTools"
echo "2. Go to PageBuilder"
echo "3. Check Console for JavaScript errors"
echo "4. Check Application tab → Local Storage for 'kata_custom_templates'"
echo "5. Check Network tab for any failed requests"
echo "6. Try clicking Templates tab in PageBuilder sidebar"
echo "7. Test saving a custom template"
echo

echo "🛠️ QUICK FIXES TO TRY:"
echo "1. Clear browser cache and localStorage"
echo "2. Check if templates tab is visible in sidebar"
echo "3. Test template search functionality"
echo "4. Verify template preview modal opens"
echo "5. Test template apply functionality"
echo

echo "========================================="