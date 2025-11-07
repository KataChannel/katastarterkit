#!/bin/bash

# Script to remove all @apollo/client imports and create stubs

cd /mnt/chikiet/Innerbright/innerv2/frontend

echo "🔍 Finding files with @apollo/client imports..."

# Find all files with @apollo/client
FILES=$(grep -r "from '@apollo/client'" src --include="*.ts" --include="*.tsx" -l)

echo "📝 Found files:"
echo "$FILES"

echo ""
echo "🔧 Creating backup and stub versions..."

for file in $FILES; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        dirname=$(dirname "$file")
        
        # Skip if already processed
        if [[ "$filename" == *.old.* ]] || [[ "$filename" == *.new.* ]]; then
            continue
        fi
        
        echo "  Processing: $file"
        
        # Backup original
        cp "$file" "${file}.apollo.backup"
        
        # Create stub comment at top
        echo "// DEPRECATED: Apollo Client removed - Stub file" > "${file}.tmp"
        echo "// TODO: Migrate to Server Actions or remove this file" >> "${file}.tmp"
        echo "" >> "${file}.tmp"
        echo "if (typeof window !== 'undefined') {" >> "${file}.tmp"
        echo "  console.warn('⚠️ DEPRECATED: This hook uses Apollo Client stubs. Please migrate to Server Actions.');" >> "${file}.tmp"
        echo "}" >> "${file}.tmp"
        echo "" >> "${file}.tmp"
        
        # Comment out all content
        sed 's/^/\/\/ /' "$file" >> "${file}.tmp"
        
        # Move tmp to original
        mv "${file}.tmp" "$file"
        
        echo "    ✅ Created stub for $filename"
    fi
done

echo ""
echo "✅ Done! All Apollo Client files have been stubbed."
echo "📂 Backups saved with .apollo.backup extension"
echo ""
echo "⚠️  Note: You may need to create proper stub exports for each file manually."
