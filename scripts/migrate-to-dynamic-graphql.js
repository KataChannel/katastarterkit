#!/usr/bin/env node

/**
 * ============================================================================
 * MIGRATION SCRIPT: Convert to Dynamic GraphQL
 * ============================================================================
 * 
 * Automatically converts existing code to use Dynamic GraphQL system
 * 
 * Usage:
 *   node scripts/migrate-to-dynamic-graphql.js [component-path]
 *   node scripts/migrate-to-dynamic-graphql.js --analyze
 *   node scripts/migrate-to-dynamic-graphql.js --all
 * 
 * Examples:
 *   node scripts/migrate-to-dynamic-graphql.js frontend/src/app/admin/tasks
 *   node scripts/migrate-to-dynamic-graphql.js --analyze
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// PATTERNS TO DETECT
// ============================================================================

const PATTERNS = {
  // Custom hooks usage
  customHooks: /use(Get|Create|Update|Delete)(Tasks|Users|Products|Posts|Comments|Categories)/g,
  
  // Apollo Client queries
  apolloQuery: /useQuery\((GET_\w+),/g,
  apolloMutation: /useMutation\((CREATE_\w+|UPDATE_\w+|DELETE_\w+),/g,
  
  // GraphQL imports
  graphqlImports: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]@\/graphql\/\w+\/(queries|mutations)['"]/g,
  
  // Custom resolver calls (backend)
  customResolvers: /@Query\(\)\s+async\s+get\w+\(/g,
  customMutations: /@Mutation\(\)\s+async\s+(create|update|delete)\w+\(/g,
};

// ============================================================================
// CONVERSION TEMPLATES
// ============================================================================

const CONVERSIONS = {
  // Frontend: useQuery -> useFindMany
  'useQuery(GET_TASKS': `useFindMany('task'`,
  'useQuery(GET_USERS': `useFindMany('user'`,
  'useQuery(GET_PRODUCTS': `useFindMany('product'`,
  'useQuery(GET_POSTS': `useFindMany('post'`,
  
  // Frontend: useMutation -> useCreateOne/useUpdateOne/useDeleteOne
  'useMutation(CREATE_TASK': `useCreateOne('task')`,
  'useMutation(UPDATE_TASK': `useUpdateOne('task')`,
  'useMutation(DELETE_TASK': `useDeleteOne('task')`,
  'useMutation(CREATE_USER': `useCreateOne('user')`,
  'useMutation(UPDATE_USER': `useUpdateOne('user')`,
  'useMutation(DELETE_USER': `useDeleteOne('user')`,
};

// ============================================================================
// ANALYZER
// ============================================================================

class CodeAnalyzer {
  constructor() {
    this.stats = {
      totalFiles: 0,
      filesWithOldPatterns: 0,
      patterns: {},
      files: [],
    };
  }

  analyze(dirPath) {
    console.log(`\n🔍 Analyzing: ${dirPath}\n`);
    this.scanDirectory(dirPath);
    this.printReport();
  }

  scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Directory not found: ${dirPath}`);
      return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Skip node_modules, .git, etc
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      if (entry.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (entry.name.match(/\.(ts|tsx|js|jsx)$/)) {
        this.analyzeFile(fullPath);
      }
    }
  }

  analyzeFile(filePath) {
    this.stats.totalFiles++;
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = [];

    // Check each pattern
    for (const [name, pattern] of Object.entries(PATTERNS)) {
      const found = content.match(pattern);
      if (found) {
        matches.push({ pattern: name, count: found.length, examples: found.slice(0, 3) });
        this.stats.patterns[name] = (this.stats.patterns[name] || 0) + found.length;
      }
    }

    if (matches.length > 0) {
      this.stats.filesWithOldPatterns++;
      this.stats.files.push({
        path: filePath,
        matches,
      });
    }
  }

  printReport() {
    console.log('=' .repeat(80));
    console.log('📊 MIGRATION ANALYSIS REPORT');
    console.log('='.repeat(80));
    console.log(`\nTotal files scanned: ${this.stats.totalFiles}`);
    console.log(`Files needing migration: ${this.stats.filesWithOldPatterns}`);
    console.log(`Migration potential: ${Math.round((this.stats.filesWithOldPatterns / this.stats.totalFiles) * 100)}%`);

    console.log('\n' + '-'.repeat(80));
    console.log('Pattern Frequency:');
    console.log('-'.repeat(80));
    for (const [pattern, count] of Object.entries(this.stats.patterns)) {
      console.log(`  ${pattern}: ${count} occurrences`);
    }

    console.log('\n' + '-'.repeat(80));
    console.log('Files to Migrate:');
    console.log('-'.repeat(80));
    for (const file of this.stats.files.slice(0, 20)) {
      console.log(`\n  📄 ${file.path}`);
      for (const match of file.matches) {
        console.log(`     • ${match.pattern}: ${match.count} matches`);
        if (match.examples.length > 0) {
          console.log(`       Examples: ${match.examples.join(', ')}`);
        }
      }
    }

    if (this.stats.files.length > 20) {
      console.log(`\n  ... and ${this.stats.files.length - 20} more files`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('💡 RECOMMENDATIONS');
    console.log('='.repeat(80));
    
    if (this.stats.filesWithOldPatterns === 0) {
      console.log('✅ No files need migration - you\'re all set!');
    } else {
      console.log(`\n1. Start with ${Math.min(5, this.stats.filesWithOldPatterns)} files`);
      console.log('2. Test thoroughly after each migration');
      console.log('3. Use this command to migrate a specific file:');
      console.log('   node scripts/migrate-to-dynamic-graphql.js <file-path>');
      console.log('\n4. Example migration for top file:');
      if (this.stats.files.length > 0) {
        console.log(`   node scripts/migrate-to-dynamic-graphql.js ${this.stats.files[0].path}`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
}

// ============================================================================
// MIGRATOR
// ============================================================================

class CodeMigrator {
  migrate(filePath) {
    console.log(`\n🔄 Migrating: ${filePath}\n`);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const backup = `${filePath}.backup`;

    // Create backup
    fs.writeFileSync(backup, content);
    console.log(`✅ Backup created: ${backup}`);

    let newContent = content;
    let changesMade = 0;

    // Apply conversions
    for (const [oldPattern, newPattern] of Object.entries(CONVERSIONS)) {
      const regex = new RegExp(oldPattern.replace(/[()]/g, '\\$&'), 'g');
      const matches = newContent.match(regex);
      if (matches) {
        newContent = newContent.replace(regex, newPattern);
        changesMade += matches.length;
        console.log(`  ✓ Replaced ${matches.length}x: ${oldPattern} → ${newPattern}`);
      }
    }

    // Update imports
    if (newContent.includes('useQuery') || newContent.includes('useMutation')) {
      // Add Dynamic GraphQL imports if not present
      if (!newContent.includes('useDynamicGraphQL')) {
        const importLine = `import { useFindMany, useCreateOne, useUpdateOne, useDeleteOne } from '@/hooks/useDynamicGraphQL';\n`;
        newContent = importLine + newContent;
        changesMade++;
        console.log('  ✓ Added Dynamic GraphQL imports');
      }
    }

    if (changesMade > 0) {
      fs.writeFileSync(filePath, newContent);
      console.log(`\n✅ Migration complete: ${changesMade} changes made`);
      console.log(`📝 Review changes and test thoroughly!`);
      console.log(`🔙 Restore backup if needed: mv ${backup} ${filePath}`);
    } else {
      console.log('\n⚠️  No changes needed - file is already migrated or no patterns found');
      fs.unlinkSync(backup);
    }

    console.log('');
  }
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  console.log('\n' + '='.repeat(80));
  console.log('🚀 DYNAMIC GRAPHQL MIGRATION TOOL');
  console.log('='.repeat(80));

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Usage:
  node scripts/migrate-to-dynamic-graphql.js [command] [path]

Commands:
  --analyze              Analyze codebase and show migration report
  --all                  Migrate all files (use with caution!)
  <path>                 Migrate specific file or directory

Examples:
  node scripts/migrate-to-dynamic-graphql.js --analyze
  node scripts/migrate-to-dynamic-graphql.js frontend/src/app/admin/tasks/page.tsx
  node scripts/migrate-to-dynamic-graphql.js frontend/src/app/admin/tasks

⚠️  WARNING: Always backup your code before migration!
    `);
    return;
  }

  const command = args[0];

  if (command === '--analyze') {
    const analyzer = new CodeAnalyzer();
    const targetDir = args[1] || path.join(__dirname, '../frontend/src');
    analyzer.analyze(targetDir);
  } else if (command === '--all') {
    console.log('⚠️  Full migration not yet implemented.');
    console.log('Please migrate files one by one for safety.');
    console.log('Use --analyze to see which files need migration.');
  } else {
    const migrator = new CodeMigrator();
    migrator.migrate(command);
  }
}

// Run
main();
