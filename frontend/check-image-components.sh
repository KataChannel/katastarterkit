#!/bin/bash

echo "🔧 Updating components to use OptimizedImage..."
echo ""

# Files to update (product and image related)
FILES=(
  "src/components/ui/product-image.tsx"
  "src/components/page-builder/blocks/ProductListBlock.tsx"
  "src/components/page-builder/blocks/ProductDetailBlock.tsx"
  "src/components/posts/post-list.tsx"
  "src/app/(website)/bai-viet/[slug]/page.tsx"
  "src/app/admin/products/page.tsx"
)

cd /mnt/chikiet/kataoffical/shoprausach/frontend

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Checking $file..."
    
    # Check if already using OptimizedImage
    if grep -q "OptimizedImage" "$file"; then
      echo "   ✅ Already using OptimizedImage"
    else
      echo "   ⚠️  Still using next/image - manual update needed"
    fi
  else
    echo "   ❌ File not found: $file"
  fi
done

echo ""
echo "📊 Summary:"
echo "   Total files checked: ${#FILES[@]}"
echo ""
echo "💡 To update manually, replace:"
echo "   import Image from 'next/image';"
echo "   with:"
echo "   import OptimizedImage from '@/components/OptimizedImage';"
echo ""
echo "   And replace <Image> with <OptimizedImage>"
echo ""
