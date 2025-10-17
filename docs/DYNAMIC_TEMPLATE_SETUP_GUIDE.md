# Dynamic Template System - Complete Setup & Integration Guide

## 🚀 Overview

The Dynamic Template System is a comprehensive solution for creating, managing, and rendering dynamic content with database integration. This system allows users to create templates with variables, connect to GraphQL data sources, and render content dynamically.

## 📁 File Structure

```
frontend/src/
├── lib/
│   ├── dynamicTemplateSystem.ts      # Core template engine
│   └── simpleTemplateExamples.ts     # Example templates
├── types/
│   └── database.ts                   # Database type definitions
├── components/
│   ├── dynamic-template/
│   │   └── DynamicTemplateManager.tsx # React UI component
│   └── page-builder/
│       └── PageBuilderWithTemplates.tsx # Integrated page builder
├── utils/
│   └── templateBuilder.ts            # Template builder utilities
└── examples/
    └── DynamicTemplateIntegration.tsx # Integration examples
```

## 🛠️ Quick Setup

### 1. Install Dependencies

The system requires these dependencies (already in your project):
- React 18+
- TypeScript
- Shadcn UI components
- Apollo GraphQL Client
- Lucide React icons

### 2. Basic Usage

```tsx
import { DynamicTemplateManager } from '@/components/dynamic-template/DynamicTemplateManager';
import { PageBuilderWithTemplates } from '@/components/page-builder/PageBuilderWithTemplates';

function MyPage() {
  const handleTemplateApplied = (elements) => {
    console.log('Template elements:', elements);
    // Process template elements
  };

  return (
    <PageBuilderWithTemplates
      onAddElements={handleTemplateApplied}
      currentBlocks={[]}
    />
  );
}
```

### 3. Integration with Existing PageBuilder

```tsx
import { DynamicTemplateIntegrationExample } from '@/examples/DynamicTemplateIntegration';

// Use the complete integration example
export default function PageBuilderPage() {
  return <DynamicTemplateIntegrationExample />;
}
```

## 🎯 Core Features

### ✅ Template Engine
- **Variable Substitution**: `{{variableName}}`
- **Data Binding**: Connect to GraphQL APIs
- **Handlebars-like Syntax**: `{{#each items}}...{{/each}}`
- **Conditional Logic**: `{{#if condition}}...{{/if}}`

### ✅ Database Integration  
- **Product Templates**: E-commerce product grids, catalogs
- **Task Templates**: Project management dashboards
- **Category Templates**: Category showcases, navigation
- **Custom Data Sources**: Any GraphQL endpoint

### ✅ React UI Components
- **Template Browser**: Browse and select templates
- **Variable Editor**: Customize template variables
- **Live Preview**: Real-time template preview
- **Import/Export**: Save and share templates

### ✅ Template Presets
- **Product Grid**: Responsive product layouts
- **Task Dashboard**: Kanban-style task management
- **Category Showcase**: Hero-style category displays
- **Custom Builder**: Create from scratch

## 📖 Template Syntax Guide

### Basic Variables
```html
<h1>{{title}}</h1>
<p>{{description}}</p>
<span style="color: {{color}}">{{text}}</span>
```

### Data Iteration
```html
{{#each products}}
<div class="product">
  <h3>{{name}}</h3>
  <p>${{price}}</p>
  <img src="{{image}}" alt="{{name}}" />
</div>
{{/each}}
```

### Conditional Content
```html
{{#if showPrices}}
<span class="price">${{price}}</span>
{{/if}}

{{#unless outOfStock}}
<button>Add to Cart</button>
{{/unless}}
```

### Helper Functions
```html
{{#eq status 'completed'}}
<span class="badge success">Done</span>
{{/eq}}

{{#gt quantity 0}}
<span class="stock">{{quantity}} in stock</span>
{{/gt}}
```

## 🔧 Template Configuration

### Variable Definition
```typescript
{
  name: 'backgroundColor',
  type: 'string',
  defaultValue: '#ffffff',
  description: 'Background color for the section',
  validation: {
    pattern: '^#[0-9A-Fa-f]{6}$',
    required: true
  }
}
```

### Data Source Configuration  
```typescript
{
  name: 'products',
  type: 'graphql',
  query: 'products',
  variables: {
    limit: 10,
    category: '{{selectedCategory}}'
  },
  fields: ['id', 'name', 'price', 'image', 'description']
}
```

## 🎨 Styling & Customization

### CSS Classes
The system generates semantic CSS classes:
- `.template-container` - Main container
- `.template-variable-{{name}}` - Variable-specific styling  
- `.template-data-{{source}}` - Data source styling
- `.template-category-{{category}}` - Category-based styling

### Responsive Design
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {{#each items}}
  <div class="template-item">{{name}}</div>
  {{/each}}
</div>
```

### Dark Mode Support
```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  {{content}}
</div>
```

## 🔌 GraphQL Integration

### Setup Apollo Client
```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});
```

### Query Examples
```graphql
# Products Query
query GetProducts($limit: Int, $category: String) {
  products(limit: $limit, category: $category) {
    id
    name
    price
    image
    description
    category {
      name
    }
  }
}

# Tasks Query  
query GetTasks($status: TaskStatus, $assignee: String) {
  tasks(status: $status, assignee: $assignee) {
    id
    title
    description
    status
    priority
    dueDate
    assignee {
      name
      avatar
    }
  }
}
```

## 🧪 Testing Templates

### Template Validation
```typescript
import { templateUtils } from '@/utils/templateBuilder';

const validation = templateUtils.validateTemplate(templateString);
if (!validation.valid) {
  console.error('Template errors:', validation.errors);
}
```

### Preview Generation
```typescript
const preview = templateUtils.generatePreview(template, sampleData);
```

### Complexity Analysis
```typescript
const score = templateUtils.getComplexityScore(template);
console.log('Template complexity:', score);
```

## 🔒 Security Considerations

### Input Sanitization
- All user inputs are escaped by default
- HTML content requires explicit `{{{triple}}}` syntax
- Variable names are validated against safe patterns

### Template Validation
- Syntax validation prevents malicious code
- Variable scope is restricted to defined data sources
- No eval() or dynamic code execution

### Access Control
```typescript
const template = {
  ...templateData,
  permissions: {
    read: ['user', 'admin'],
    write: ['admin'],
    execute: ['user', 'admin']
  }
};
```

## 📊 Performance Optimization

### Template Caching
```typescript
const templateRegistry = new TemplateRegistry({
  cacheSize: 100,
  ttl: 300000, // 5 minutes
});
```

### Lazy Loading
```typescript
// Templates are loaded on-demand
const template = await templateRegistry.getTemplate(id);
```

### Bundle Optimization
- Tree-shakeable imports
- Lazy-loaded components
- Minimal runtime dependencies

## 🚀 Production Deployment

### Environment Variables
```env
# GraphQL endpoint
NEXT_PUBLIC_GRAPHQL_URI=/api/graphql

# Template storage
TEMPLATE_STORAGE_TYPE=database
TEMPLATE_CACHE_TTL=300

# Feature flags
ENABLE_TEMPLATE_IMPORT=true
ENABLE_CUSTOM_TEMPLATES=true
```

### Build Configuration
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@/lib/dynamicTemplateSystem']
  }
};
```

## 🔧 Troubleshooting

### Common Issues

**Template not rendering:**
```typescript
// Check template compilation
const compiled = await compiler.compileTemplate(template);
console.log('Compilation result:', compiled);
```

**Data not loading:**
```typescript
// Check GraphQL connection
const result = await dataService.fetchData(dataSource);
console.log('Data fetch result:', result);
```

**Variables not substituting:**
```typescript
// Check variable definition
console.log('Template variables:', template.variables);
console.log('Provided values:', variableValues);
```

### Debug Mode
```typescript
const templateSystem = new DatabaseTemplateService({
  debug: true,
  logLevel: 'verbose'
});
```

## 📚 API Reference

### Core Classes

#### `TemplateCompiler`
- `compileTemplate(template: TemplateDefinition): Promise<CompiledTemplate>`
- `validateSyntax(template: string): ValidationResult`
- `extractVariables(template: string): TemplateVariable[]`

#### `DatabaseTemplateService`
- `fetchData(dataSource: DataSource): Promise<any>`
- `processTemplate(template: CompiledTemplate, data: any): Promise<RenderedTemplate>`

#### `TemplateRegistry`
- `registerTemplate(template: TemplateDefinition): void`
- `getTemplate(id: string): Promise<TemplateDefinition>`
- `listTemplates(category?: string): Promise<TemplateDefinition[]>`

### React Components

#### `<DynamicTemplateManager>`
Props:
- `onApplyTemplate: (elements: any[]) => void`
- `onSaveTemplate: (template: TemplateDefinition) => void`
- `initialTemplate?: TemplateDefinition`
- `readonly?: boolean`

#### `<PageBuilderWithTemplates>`
Props:
- `onAddElements: (elements: any[]) => void`
- `currentBlocks?: any[]`
- `tenantId?: string`

## 🎯 Next Steps

1. **Integration**: Add to your existing page builder
2. **Customization**: Create custom templates for your use case
3. **Data Sources**: Connect to your GraphQL APIs
4. **Testing**: Use the provided examples and testing utilities
5. **Production**: Deploy with proper caching and security

## 💡 Best Practices

1. **Template Design**:
   - Keep templates focused and single-purpose
   - Use semantic HTML structure
   - Include responsive design considerations

2. **Performance**:
   - Cache compiled templates
   - Use lazy loading for large template libraries
   - Optimize GraphQL queries

3. **Maintainability**:
   - Document template variables and data sources
   - Use consistent naming conventions
   - Version your templates

4. **Security**:
   - Validate all user inputs
   - Sanitize template content
   - Implement proper access controls

## 🤝 Support

For issues, questions, or contributions:
- Check the examples in `/src/examples/`
- Review the test files
- Use the debug mode for troubleshooting
- Follow the TypeScript interfaces for proper usage

---

🎉 **Your Dynamic Template System is ready for production use!**