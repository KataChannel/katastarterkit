# Documentation Cleanup Script - Enhanced Version

## 📋 Overview

**Script:** `/scripts/docsclean.sh`  
**Version:** 2.0 Enhanced  
**Purpose:** Batch organize markdown documentation files with automatic numbering  
**Date Updated:** 10 tháng 10, 2025

---

## 🚀 Features

### Core Features
✅ **Automatic Numbering** - Adds sequential numbers to files (1-*, 2-*, etc.)  
✅ **Batch Processing** - Handles multiple files efficiently  
✅ **Progress Bar** - Visual feedback during processing  
✅ **Smart Sorting** - Files sorted by modification time  
✅ **Duplicate Detection** - Prevents overwriting existing files  

### Advanced Features  
✅ **Dry Run Mode** - Preview changes without making them  
✅ **Archive Mode** - Archive old docs instead of deleting  
✅ **Category Filter** - Process only specific file categories  
✅ **Detailed Reports** - Comprehensive summary with statistics  
✅ **Error Handling** - Robust error detection and reporting  
✅ **Color Output** - Easy-to-read colored terminal output  

---

## 📖 Usage

### Basic Usage

```bash
# Normal operation - move all .md files
./scripts/docsclean.sh

# Preview changes without making them
./scripts/docsclean.sh --dry-run

# Archive old docs to docs/archive/
./scripts/docsclean.sh --archive

# Process only files starting with "FIX"
./scripts/docsclean.sh --category FIX

# Show help
./scripts/docsclean.sh --help
```

### Combined Options

```bash
# Dry run with archive mode
./scripts/docsclean.sh --dry-run --archive

# Category filter with archive
./scripts/docsclean.sh --category CATEGORY --archive
```

---

## 🎯 Options Reference

### `--dry-run`
**Purpose:** Preview changes without modifying files  
**Use case:** Check what will happen before running actual operation  
**Output:** Shows all moves that would be made

**Example:**
```bash
./scripts/docsclean.sh --dry-run
```

**Sample Output:**
```
🧹 Starting docs cleanup and organization...
🔍 DRY RUN MODE - No changes will be made

📁 Next available number: 69
📊 Found 47 .md files to process

  [DRY RUN] Would move: FILE.md → docs/69-FILE.md
  [DRY RUN] Would move: ANOTHER.md → docs/70-ANOTHER.md
...
```

---

### `--archive`
**Purpose:** Archive old/duplicate docs instead of deleting them  
**Use case:** Preserve old documentation versions  
**Behavior:** Moves duplicates to `docs/archive/` folder

**Example:**
```bash
./scripts/docsclean.sh --archive
```

**What happens:**
- If `docs/69-FILE.md` exists and you have `FILE.md` in root:
  - **Without --archive:** Skip or remove root file
  - **With --archive:** Move `docs/69-FILE.md` → `docs/archive/69-FILE.md`, then move root file

---

### `--category PREFIX`
**Purpose:** Process only files matching a specific prefix  
**Use case:** Organize specific categories of docs (e.g., all fixes, all features)  
**Pattern:** Files starting with PREFIX (case-sensitive)

**Example:**
```bash
# Only process FIX-*.md files
./scripts/docsclean.sh --category FIX

# Only process CATEGORY-*.md files
./scripts/docsclean.sh --category CATEGORY

# Only process GRAPHQL-*.md files
./scripts/docsclean.sh --category GRAPHQL
```

**Sample Output:**
```
🏷️  Category filter: FIX
🏷️  Filtered to 5 files matching category: FIX
📊 Found 5 .md files to process
```

---

### `--help`
**Purpose:** Show usage information  
**Output:** Displays script documentation

---

## 📊 How It Works

### Processing Flow

```
1. Parse command line arguments
   ↓
2. Find all .md files in root directory
   ↓
3. Apply category filter (if specified)
   ↓
4. Sort files by modification time
   ↓
5. Determine next available number
   ↓
6. Process each file:
   - Skip README.md
   - Add number if needed
   - Check for duplicates
   - Archive if --archive mode
   - Move to docs/
   ↓
7. Generate detailed report
```

### Numbering System

**Format:** `<number>-<original-filename>.md`

**Examples:**
```
README.md                    → SKIPPED (README)
MY_DOC.md                    → docs/69-MY_DOC.md
ANOTHER.md                   → docs/70-ANOTHER.md
42-EXISTING.md               → docs/42-EXISTING.md (keeps number)
```

**Next Number Calculation:**
```bash
# Find highest existing number
max_number=$(find docs/ -name "*.md" | grep -oP '^\d+' | sort -n | tail -1)

# Start from next
next_number=$((max_number + 1))
```

---

## 🎨 Output Examples

### Successful Run (Normal Mode)

```bash
$ ./scripts/docsclean.sh

🧹 Starting docs cleanup and organization...

📁 Next available number: 69

📊 Found 47 .md files to process

[=================================================] 100% (47/47)

════════════════════════════════════════════════════════
✅ Operation Complete!
════════════════════════════════════════════════════════

📊 Summary:
  • Processed: 47 files
  • Moved:     45 files
  • Skipped:   2 files

📁 Total files in docs/: 113

📝 Moved files:
  ✓ CATEGORY_FIX_SUMMARY.md → docs/69-CATEGORY_FIX_SUMMARY.md
  ✓ PRODUCTS_REMOVE_CONFIRMATION_DIALOG.md → docs/70-PRODUCTS_REMOVE_CONFIRMATION_DIALOG.md
  ✓ GRAPHQL_VALIDATION_FIX.md → docs/71-GRAPHQL_VALIDATION_FIX.md
  ... and 42 more

⏭️  Skipped files:
  ⊘ README.md (README)
  ⊘ DUPLICATE.md (target exists: 50-DUPLICATE.md)

📁 Current docs/ contents:
 1. 1-PRODUCT_MODULE_FIX_REPORT.md
 2. 2-GRAPHQL_SCHEMA_FIX_REPORT.md
 3. 3-GRAPHQL_ALL_FIXES_COMPLETE.md
    ...

════════════════════════════════════════════════════════
```

---

### Dry Run Mode

```bash
$ ./scripts/docsclean.sh --dry-run

🧹 Starting docs cleanup and organization...
🔍 DRY RUN MODE - No changes will be made

📁 Next available number: 69
📊 Found 3 .md files to process

  [DRY RUN] Would move: FILE1.md → docs/69-FILE1.md
  [DRY RUN] Would move: FILE2.md → docs/70-FILE2.md
  [DRY RUN] Would move: 42-EXISTING.md → docs/42-EXISTING.md

════════════════════════════════════════════════════════
✅ Operation Complete!
════════════════════════════════════════════════════════

📊 Summary:
  • Processed: 3 files
  • Moved:     3 files
  • Skipped:   0 files

════════════════════════════════════════════════════════
```

---

### Archive Mode

```bash
$ ./scripts/docsclean.sh --archive

🧹 Starting docs cleanup and organization...
📦 Archive mode enabled

📁 Next available number: 69
📊 Found 5 .md files to process

[=================================================] 100% (5/5)

════════════════════════════════════════════════════════
✅ Operation Complete!
════════════════════════════════════════════════════════

📊 Summary:
  • Processed: 5 files
  • Moved:     5 files
  • Skipped:   0 files
  • Archived:  2 files

📁 Total files in docs/: 115
📦 Total files in archive/: 2

📝 Moved files:
  ✓ NEW_FILE.md → docs/69-NEW_FILE.md
  ✓ DUPLICATE.md → docs/70-DUPLICATE.md (replaced)

📦 Archived files:
  📦 70-DUPLICATE.md (duplicate)
  📦 42-OLD_VERSION.md (duplicate)

════════════════════════════════════════════════════════
```

---

### Category Filter

```bash
$ ./scripts/docsclean.sh --category FIX

🧹 Starting docs cleanup and organization...
🏷️  Category filter: FIX

📁 Next available number: 69
🏷️  Filtered to 5 files matching category: FIX
📊 Found 5 .md files to process

[=================================================] 100% (5/5)

📊 Summary:
  • Processed: 5 files
  • Moved:     5 files
  • Skipped:   0 files

📝 Moved files:
  ✓ FIX_BUG_123.md → docs/69-FIX_BUG_123.md
  ✓ FIX_GRAPHQL.md → docs/70-FIX_GRAPHQL.md
  ✓ FIX_VALIDATION.md → docs/71-FIX_VALIDATION.md
  ...
```

---

## 🗂️ Directory Structure

### Before Running Script

```
katacore/
├── README.md                           # Skipped
├── CATEGORY_FIX_SUMMARY.md             # → docs/69-*
├── PRODUCTS_REMOVE_DIALOG.md           # → docs/70-*
├── GRAPHQL_VALIDATION_FIX.md           # → docs/71-*
├── 42-EXISTING_DOC.md                  # → docs/42-* (keeps number)
└── docs/
    ├── 1-FIRST_DOC.md
    ├── 2-SECOND_DOC.md
    └── ...
```

### After Running Script

```
katacore/
├── README.md                           # ✅ Preserved
└── docs/
    ├── 1-FIRST_DOC.md
    ├── 2-SECOND_DOC.md
    ├── ...
    ├── 42-EXISTING_DOC.md              # ✅ Moved (kept number)
    ├── 69-CATEGORY_FIX_SUMMARY.md      # ✅ Numbered & moved
    ├── 70-PRODUCTS_REMOVE_DIALOG.md    # ✅ Numbered & moved
    ├── 71-GRAPHQL_VALIDATION_FIX.md    # ✅ Numbered & moved
    └── archive/                        # If --archive used
        ├── 50-OLD_VERSION.md
        └── 69-DUPLICATE.md
```

---

## 🎯 Use Cases

### 1. Daily Documentation Cleanup

```bash
# End of day - organize all new docs
./scripts/docsclean.sh
```

**Scenario:** You created many .md files during development. Clean up at end of day.

---

### 2. Preview Before Cleanup

```bash
# Check what will change
./scripts/docsclean.sh --dry-run

# If looks good, run actual cleanup
./scripts/docsclean.sh
```

**Scenario:** Want to see impact before making changes.

---

### 3. Archive Old Versions

```bash
# Keep old versions in archive
./scripts/docsclean.sh --archive
```

**Scenario:** Have updated docs but want to keep old versions for reference.

---

### 4. Organize Specific Category

```bash
# Only organize bug fix docs
./scripts/docsclean.sh --category FIX

# Only organize feature docs
./scripts/docsclean.sh --category FEATURE

# Only organize implementation docs
./scripts/docsclean.sh --category IMPLEMENTATION
```

**Scenario:** Working on specific type of documentation, want to organize incrementally.

---

### 5. Safe Batch Cleanup

```bash
# Preview with category filter
./scripts/docsclean.sh --dry-run --category CATEGORY

# If OK, run with archive for safety
./scripts/docsclean.sh --archive --category CATEGORY
```

**Scenario:** Large batch of docs, want maximum safety.

---

## 🔧 Technical Details

### File Processing Logic

```bash
# For each file:
if file has number (e.g., 42-FILE.md):
    if docs/42-FILE.md exists:
        if --archive:
            move docs/42-FILE.md → docs/archive/42-FILE.md
            move root/42-FILE.md → docs/42-FILE.md
        else:
            remove root/42-FILE.md (duplicate)
    else:
        move root/42-FILE.md → docs/42-FILE.md
else:
    new_name = ${next_number}-FILE.md
    if docs/${new_name} exists:
        if --archive:
            move docs/${new_name} → docs/archive/${new_name}
            move root/FILE.md → docs/${new_name}
        else:
            skip (target exists)
    else:
        move root/FILE.md → docs/${new_name}
    next_number++
```

### Progress Bar Implementation

```bash
show_progress() {
    local current=$1
    local total=$2
    local percentage=$((current * 100 / total))
    local bar_length=50
    local filled=$((percentage * bar_length / 100))
    
    printf "\r["
    printf "%${filled}s" | tr ' ' '='
    printf "%$((bar_length - filled))s" | tr ' ' ' '
    printf "] %3d%% (%d/%d)" "$percentage" "$current" "$total"
}
```

---

## ⚠️ Important Notes

### What Gets Skipped

1. **README.md** - Always skipped (case-insensitive)
2. **Files in subdirectories** - Only root-level files processed
3. **Non-.md files** - Only markdown files
4. **Files already in docs/** - Only root-level files moved

### Safety Features

1. **Dry run mode** - Preview before changes
2. **Archive mode** - Keep old versions
3. **Duplicate detection** - Prevents data loss
4. **Error tracking** - Reports all failures
5. **Atomic moves** - mv command is atomic

### Performance

- **Small batches (< 10 files):** Instant
- **Medium batches (10-50 files):** < 1 second
- **Large batches (50-200 files):** 1-3 seconds
- **Progress bar overhead:** Negligible

---

## 📝 Examples by Category

### Bug Fixes

```bash
# Files: FIX_*.md, BUGFIX_*.md
./scripts/docsclean.sh --category FIX
```

### Features

```bash
# Files: FEATURE_*.md, NEW_*.md
./scripts/docsclean.sh --category FEATURE
```

### Implementation Reports

```bash
# Files: IMPLEMENTATION_*.md
./scripts/docsclean.sh --category IMPLEMENTATION
```

### Category-Specific

```bash
# Files: CATEGORY_*.md
./scripts/docsclean.sh --category CATEGORY
```

---

## 🐛 Troubleshooting

### Issue: Permission Denied

```bash
# Solution: Make script executable
chmod +x scripts/docsclean.sh
```

### Issue: No Files Found

```bash
# Check if files exist
ls -la *.md

# Check if using correct directory
pwd  # Should be in katacore root
```

### Issue: Dry Run Shows Different Results Than Actual Run

```bash
# This is normal if files are created/modified between runs
# Always run dry-run immediately before actual run
./scripts/docsclean.sh --dry-run && ./scripts/docsclean.sh
```

---

## ✅ Best Practices

1. **Always dry-run first** for large batches
2. **Use --archive** when unsure about duplicates
3. **Use --category** for incremental organization
4. **Run at end of work session** to keep docs organized
5. **Check summary report** for any errors

---

## 📊 Version History

### Version 2.0 (Current) - 10 tháng 10, 2025
- ✅ Added dry-run mode
- ✅ Added archive mode
- ✅ Added category filtering
- ✅ Added progress bar
- ✅ Enhanced error handling
- ✅ Detailed summary reports
- ✅ Color-coded output

### Version 1.0 (Original)
- Basic file moving
- Auto-numbering
- Duplicate detection

---

**Status:** ✅ Production Ready  
**Tested:** Yes  
**Documentation:** Complete  
**Location:** `/scripts/docsclean.sh`
