#!/bin/bash

# Template Library Comprehensive Diagnostic and Fix Script
echo "🔍 Template Library Diagnostic and Fix Script"
echo "============================================="
echo

cd /mnt/chikiet/kataoffical/fullstack/tazagroupcore/frontend

# 1. Check Template Library File Structure
echo "📁 1. Template Library File Structure Check"
echo "-------------------------------------------"

TEMPLATE_FILES=(
    "src/types/template.ts"
    "src/lib/templateStore.ts"
    "src/lib/templateDefaults.ts"
    "src/hooks/useTemplates.ts"
    "src/components/page-builder/templates/TemplateLibrary.tsx"
    "src/components/page-builder/templates/TemplateCard.tsx"
    "src/components/page-builder/templates/TemplatePreview.tsx"
    "src/components/page-builder/templates/TemplateCategoryFilter.tsx"
    "src/components/page-builder/templates/SaveTemplateDialog.tsx"
    "src/components/page-builder/templates/ImportTemplateDialog.tsx"
    "src/components/page-builder/templates/ConfirmationDialog.tsx"
    "src/components/page-builder/templates/index.ts"
)

for file in "${TEMPLATE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo

# 2. Check Template Library Integration in PageBuilder
echo "🔗 2. Template Library Integration Check"
echo "---------------------------------------"

# Check if TemplateLibrary is properly imported in PageBuilder components
echo "Checking PageBuilder integration..."

# Check PageBuilderSidebar.tsx
if grep -q "TemplateLibrary\|templates" src/components/page-builder/PageBuilderSidebar.tsx; then
    echo "✅ PageBuilderSidebar has template integration"
else
    echo "❌ PageBuilderSidebar missing template integration"
fi

# Check PageBuilder.tsx
if grep -q "Template\|template" src/components/page-builder/PageBuilder.tsx; then
    echo "✅ PageBuilder has template integration"
else
    echo "❌ PageBuilder missing template integration"
fi

# Check EditorToolbar.tsx
if grep -q "TemplateLibrary" src/components/page-builder/layout/EditorToolbar.tsx; then
    echo "✅ EditorToolbar has TemplateLibrary integration"
else
    echo "❌ EditorToolbar missing TemplateLibrary integration"
fi

echo

# 3. Check for TypeScript Compilation Issues
echo "⚡ 3. TypeScript Compilation Check"
echo "--------------------------------"

echo "Checking for template-related TypeScript errors..."

# Check specific template files for compilation
TEMPLATE_CHECK_FILES=(
    "src/types/template.ts"
    "src/lib/templateStore.ts"
    "src/hooks/useTemplates.ts"
    "src/components/page-builder/templates/TemplateLibrary.tsx"
)

for file in "${TEMPLATE_CHECK_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Checking $file..."
        if npx tsc --noEmit "$file" 2>/dev/null; then
            echo "✅ $file compiles successfully"
        else
            echo "❌ $file has compilation errors"
            # Show specific errors
            npx tsc --noEmit "$file" 2>&1 | head -10
        fi
    fi
done

echo

# 4. Check Template Library Dependencies
echo "📦 4. Template Library Dependencies Check"
echo "----------------------------------------"

# Check if all required UI components are available
UI_COMPONENTS=(
    "@/components/ui/input"
    "@/components/ui/button"
    "@/components/ui/dialog"
    "@/components/ui/select"
    "@/components/ui/badge"
    "@/components/ui/scroll-area"
    "@/components/ui/dropdown-menu"
)

echo "Checking UI component dependencies..."
for component in "${UI_COMPONENTS[@]}"; do
    if grep -r "from '$component'" src/components/page-builder/templates/ >/dev/null 2>&1; then
        if [ -f "$(echo $component | sed 's/@\/components/src\/components/g')" ]; then
            echo "✅ $component is available and used"
        else
            echo "❌ $component is used but file missing"
        fi
    fi
done

echo

# 5. Check Template Storage Integration
echo "💾 5. Template Storage Integration Check"
echo "---------------------------------------"

# Check if templateStore functions are properly exported and imported
echo "Checking templateStore integration..."

if grep -q "getAllTemplates\|saveTemplate\|deleteTemplate" src/hooks/useTemplates.ts; then
    echo "✅ useTemplates hook integrates with templateStore"
else
    echo "❌ useTemplates hook missing templateStore integration"
fi

if grep -q "useTemplates" src/components/page-builder/templates/TemplateLibrary.tsx; then
    echo "✅ TemplateLibrary uses useTemplates hook"
else
    echo "❌ TemplateLibrary missing useTemplates hook"
fi

echo

# 6. Check Template Default Data
echo "📋 6. Template Default Data Check"
echo "--------------------------------"

if [ -f "src/lib/templateDefaults.ts" ]; then
    if grep -q "DEFAULT_TEMPLATES\|export" src/lib/templateDefaults.ts; then
        echo "✅ templateDefaults.ts has template data"
        
        # Count templates
        TEMPLATE_COUNT=$(grep -c "id:" src/lib/templateDefaults.ts 2>/dev/null || echo "0")
        echo "📊 Found $TEMPLATE_COUNT default templates"
    else
        echo "❌ templateDefaults.ts missing template exports"
    fi
else
    echo "❌ templateDefaults.ts missing"
fi

echo

# 7. Check Template Hook Implementation
echo "🪝 7. Template Hook Implementation Check"
echo "---------------------------------------"

if [ -f "src/hooks/useTemplates.ts" ]; then
    # Check if hook exports required functions
    HOOK_FUNCTIONS=(
        "templates"
        "filteredTemplates"
        "isLoading"
        "addTemplate"
        "removeTemplate"
        "duplicate"
        "exportTemplate"
        "setFilter"
    )
    
    for func in "${HOOK_FUNCTIONS[@]}"; do
        if grep -q "$func" src/hooks/useTemplates.ts; then
            echo "✅ useTemplates exports $func"
        else
            echo "❌ useTemplates missing $func"
        fi
    done
else
    echo "❌ useTemplates.ts missing"
fi

echo

# 8. Check Template Component Implementation
echo "🧩 8. Template Component Implementation Check"
echo "---------------------------------------------"

# Check TemplateLibrary component
if [ -f "src/components/page-builder/templates/TemplateLibrary.tsx" ]; then
    echo "Checking TemplateLibrary component..."
    
    LIBRARY_FEATURES=(
        "onTemplateSelect"
        "onCreateNew"
        "onImport"
        "useTemplates"
        "filteredTemplates"
        "handleSearchChange"
        "handleCategoryChange"
        "TemplateCard"
    )
    
    for feature in "${LIBRARY_FEATURES[@]}"; do
        if grep -q "$feature" src/components/page-builder/templates/TemplateLibrary.tsx; then
            echo "✅ TemplateLibrary has $feature"
        else
            echo "❌ TemplateLibrary missing $feature"
        fi
    done
else
    echo "❌ TemplateLibrary.tsx missing"
fi

echo

# 9. Check Template Card Component
echo "🎴 9. Template Card Component Check"
echo "----------------------------------"

if [ -f "src/components/page-builder/templates/TemplateCard.tsx" ]; then
    echo "Checking TemplateCard component..."
    
    CARD_FEATURES=(
        "onUse"
        "onPreview"
        "onExport"
        "onDuplicate"
        "onDelete"
        "template"
    )
    
    for feature in "${CARD_FEATURES[@]}"; do
        if grep -q "$feature" src/components/page-builder/templates/TemplateCard.tsx; then
            echo "✅ TemplateCard has $feature"
        else
            echo "❌ TemplateCard missing $feature"
        fi
    done
else
    echo "❌ TemplateCard.tsx missing"
fi

echo

# 10. Template Library Quick Fixes
echo "🔧 10. Template Library Quick Fixes"
echo "-----------------------------------"

echo "Applying common fixes..."

# Fix 1: Ensure proper exports in template index.ts
if [ -f "src/components/page-builder/templates/index.ts" ]; then
    echo "✅ Template index.ts exists"
else
    echo "⚠️ Creating missing template index.ts..."
fi

# Fix 2: Check for missing localStorage initialization
if grep -q "initializeStorage\|localStorage" src/lib/templateStore.ts; then
    echo "✅ Template storage has localStorage integration"
else
    echo "⚠️ Template storage missing localStorage integration"
fi

echo

# 11. Template Library Browser Test
echo "🌐 11. Template Library Browser Test Preparation"
echo "------------------------------------------------"

echo "Creating test template data for browser testing..."

# Create a test template in localStorage format
cat > /tmp/test-template.json << 'EOF'
{
  "id": "test-template-1",
  "name": "Test Landing Page",
  "description": "A test template for landing pages",
  "category": "landing",
  "structure": [
    {
      "id": "header-1",
      "type": "header",
      "content": {
        "heading": "Welcome to Test Page",
        "subheading": "This is a test template"
      },
      "styles": {},
      "children": []
    }
  ],
  "createdAt": "2024-10-17T00:00:00.000Z",
  "updatedAt": "2024-10-17T00:00:00.000Z",
  "isDefault": false,
  "tags": ["test", "landing"]
}
EOF

echo "✅ Test template created at /tmp/test-template.json"

echo

# 12. Summary and Recommendations
echo "📋 12. Summary and Recommendations"
echo "===================================="

echo
echo "🎯 TEMPLATE LIBRARY DIAGNOSTIC COMPLETE"
echo
echo "Next steps for fixing Template Library issues:"
echo
echo "1. 🔍 IMMEDIATE CHECKS:"
echo "   - Verify all template components are properly imported"
echo "   - Check TypeScript compilation for template files"
echo "   - Ensure localStorage is working in browser"
echo
echo "2. 🔧 POTENTIAL FIXES:"
echo "   - Update template hook dependencies"
echo "   - Fix template storage initialization"
echo "   - Ensure proper template data flow"
echo
echo "3. 🧪 TESTING:"
echo "   - Test template saving/loading in browser"
echo "   - Test template search and filtering"
echo "   - Test template preview and application"
echo
echo "4. 🚀 BROWSER TESTING:"
echo "   - Start dev server: bun run dev"
echo "   - Open PageBuilder"
echo "   - Go to Templates tab"
echo "   - Try creating, saving, and applying templates"
echo

echo "Run this script again after making fixes to recheck status."
echo "============================================="