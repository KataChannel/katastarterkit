# Dynamic Template System - Hướng Dẫn Sử Dụng

## 🎯 Tổng Quan

Hệ thống Dynamic Template cho phép tạo và quản lý các template có thể tùy chỉnh với dữ liệu động từ database. Hệ thống hỗ trợ:

- ✅ Template với dữ liệu Product, Task, Category
- ✅ Variables có thể tùy chỉnh (text, color, number, boolean, select)
- ✅ Data Sources kết nối với GraphQL API
- ✅ Template compilation với Handlebars-like syntax
- ✅ Import/Export templates
- ✅ Template validation và error handling

## 🏗️ Kiến Trúc Hệ Thống

```
Dynamic Template System
├── Core Engine
│   ├── TemplateCompiler - Biên dịch template với dữ liệu
│   ├── DatabaseTemplateService - Lấy dữ liệu từ database
│   └── TemplateRegistry - Quản lý template repository
├── Data Layer
│   ├── Product GraphQL Integration
│   ├── Task GraphQL Integration
│   └── Category GraphQL Integration
├── UI Components
│   ├── DynamicTemplateManager - Giao diện quản lý chính
│   ├── TemplateCard - Card hiển thị template
│   └── VariableInput - Input cho template variables
└── Types & Examples
    ├── Database Types - TypeScript definitions
    └── Template Examples - Mẫu templates
```

## 📋 Cách Sử Dụng

### 1. Khởi Tạo Template Manager

```tsx
import { DynamicTemplateManager } from '@/components/dynamic-template/DynamicTemplateManager';

function PageBuilderPage() {
  const handleApplyTemplate = (compiledElements: any[]) => {
    // Thêm elements vào PageBuilder canvas
    pageBuilder.addElements(compiledElements);
  };

  return (
    <DynamicTemplateManager
      onApplyTemplate={handleApplyTemplate}
      onSaveTemplate={(template) => console.log('Saved:', template)}
    />
  );
}
```

### 2. Tạo Template Mới

```typescript
import { DynamicTemplate } from '@/lib/dynamicTemplateSystem';

const productTemplate: DynamicTemplate = {
  id: 'my-product-template',
  name: 'Sản phẩm của tôi',
  description: 'Template hiển thị sản phẩm với tùy chỉnh',
  category: 'ecommerce',
  
  // Định nghĩa variables
  variables: [
    {
      id: 'title',
      name: 'title',
      label: 'Tiêu đề section',
      type: 'text',
      defaultValue: 'Sản phẩm nổi bật',
      required: true,
    },
    {
      id: 'backgroundColor',
      name: 'backgroundColor',
      label: 'Màu nền',
      type: 'color',
      defaultValue: '#ffffff',
    },
  ],
  
  // Kết nối data sources
  dataSources: [
    {
      id: 'products',
      name: 'Danh sách sản phẩm',
      type: 'product',
      query: 'getProducts',
      fields: ['id', 'name', 'price', 'images'],
      filters: { isFeatured: true, isActive: true },
      pagination: { limit: 6, offset: 0 },
    },
  ],
  
  // Thiết kế structure
  structure: [
    {
      id: 'product-section',
      type: 'container',
      content: `
        <section style="padding: 60px 20px; background-color: {{backgroundColor}};">
          <div class="container">
            <h2>{{title}}</h2>
            <div class="products-grid">
              {{#each data.products}}
              <div class="product-card">
                <img src="{{images.0.url}}" alt="{{name}}" />
                <h3>{{name}}</h3>
                <p class="price">{{price | currency}}</p>
              </div>
              {{/each}}
            </div>
          </div>
        </section>
      `,
      styles: {},
    },
  ],
};
```

### 3. Sử Dụng Template Registry

```typescript
import { TemplateRegistry } from '@/lib/dynamicTemplateSystem';

const registry = new TemplateRegistry();

// Đăng ký template
registry.register({
  id: productTemplate.id,
  template: productTemplate,
  metadata: {
    name: productTemplate.name,
    description: productTemplate.description,
    author: 'Your Name',
    version: '1.0.0',
    tags: ['ecommerce', 'products'],
    lastModified: new Date().toISOString(),
  },
});

// Compile template với variables
const compiledElements = await registry.compileTemplate('my-product-template', {
  title: 'Sản phẩm mới nhất',
  backgroundColor: '#f0f9ff',
});
```

## 🔧 Các Loại Variables

### Text Variable
```typescript
{
  id: 'title',
  name: 'title',
  label: 'Tiêu đề',
  type: 'text',
  defaultValue: 'Tiêu đề mặc định',
  required: true,
}
```

### Color Variable
```typescript
{
  id: 'backgroundColor',
  name: 'backgroundColor',
  label: 'Màu nền',
  type: 'color',
  defaultValue: '#ffffff',
}
```

### Select Variable
```typescript
{
  id: 'layout',
  name: 'layout',
  label: 'Kiểu layout',
  type: 'select',
  defaultValue: 'grid',
  validation: {
    options: ['grid', 'list', 'masonry'],
  },
}
```

### Boolean Variable
```typescript
{
  id: 'showPrice',
  name: 'showPrice',
  label: 'Hiển thị giá',
  type: 'boolean',
  defaultValue: true,
}
```

### Number Variable
```typescript
{
  id: 'itemsPerPage',
  name: 'itemsPerPage',
  label: 'Số items mỗi trang',
  type: 'number',
  defaultValue: 12,
  validation: {
    min: 1,
    max: 50,
  },
}
```

## 📊 Data Sources

### Product Data Source
```typescript
{
  id: 'products',
  name: 'Sản phẩm',
  type: 'product',
  query: 'getProducts',
  fields: [
    'id', 'name', 'description', 'price', 
    'originalPrice', 'discountPercentage',
    'images', 'category', 'stock', 'unit'
  ],
  filters: {
    isActive: true,
    isFeatured: true,
    status: 'ACTIVE',
  },
  pagination: { limit: 12, offset: 0 },
}
```

### Task Data Source
```typescript
{
  id: 'tasks',
  name: 'Công việc',
  type: 'task',
  query: 'getTasks',
  fields: [
    'id', 'title', 'description', 'status',
    'priority', 'progress', 'dueDate', 'assignee'
  ],
  filters: {
    status: ['TODO', 'IN_PROGRESS'],
    assigneeId: 'user-123',
  },
  pagination: { limit: 20, offset: 0 },
}
```

### Category Data Source
```typescript
{
  id: 'categories',
  name: 'Danh mục',
  type: 'category',
  query: 'getCategories',
  fields: [
    'id', 'name', 'slug', 'description',
    'image', 'productCount', 'children'
  ],
  filters: {
    isActive: true,
  },
  pagination: { limit: 10, offset: 0 },
}
```

## 📝 Template Syntax

### Variables
```handlebars
{{title}}                    <!-- Text variable -->
{{backgroundColor}}          <!-- Color variable -->
{{showPrice}}               <!-- Boolean variable -->
```

### Data Iteration
```handlebars
{{#each data.products}}
  <div class="product">
    <h3>{{name}}</h3>
    <p>{{price | currency}}</p>
    {{#if images}}
      <img src="{{images.0.url}}" alt="{{name}}" />
    {{/if}}
  </div>
{{/each}}
```

### Conditional Rendering
```handlebars
{{#if showPrice}}
  <span class="price">{{price | currency}}</span>
{{/if}}

{{#eq status 'ACTIVE'}}
  <badge class="active">Active</badge>
{{/eq}}
```

### Filters
```handlebars
{{price | currency}}           <!-- Format as currency -->
{{dueDate | formatDate}}       <!-- Format date -->
{{description | truncate:100}} <!-- Truncate text -->
{{name | uppercase}}           <!-- Uppercase text -->
```

## 🎨 Template Examples

### 1. Product Showcase Template
```typescript
// Xem file: /frontend/src/lib/simpleTemplateExamples.ts
// - SIMPLE_PRODUCT_GRID_TEMPLATE
```

### 2. Task Dashboard Template
```typescript
// Xem file: /frontend/src/lib/simpleTemplateExamples.ts
// - SIMPLE_TASK_LIST_TEMPLATE
```

### 3. Category Grid Template
```typescript
// Custom category template với:
// - Grid layout tùy chỉnh
// - Image và product count
// - Responsive design
```

## 🔌 GraphQL Integration

### Product Queries
```graphql
query GetProducts($limit: Int, $filters: ProductFiltersInput) {
  products(limit: $limit, filters: $filters) {
    items {
      id
      name
      description
      price
      originalPrice
      discountPercentage
      images {
        url
        alt
        isPrimary
      }
      category {
        name
        slug
      }
      status
      stock
      unit
    }
  }
}
```

### Task Queries
```graphql
query GetTasks($limit: Int, $filters: TaskFilterInput) {
  tasks(limit: $limit, filters: $filters) {
    items {
      id
      title
      description
      status
      priority
      category
      dueDate
      progress
      assignee {
        name
        email
        avatar
      }
      tags
    }
  }
}
```

## 🛠️ Advanced Features

### 1. Template Validation
```typescript
const validation = registry.validateTemplate(template);
if (!validation.valid) {
  console.error('Template errors:', validation.errors);
}
```

### 2. Import/Export Templates
```typescript
// Export
const jsonString = JSON.stringify(template, null, 2);
downloadFile('template.json', jsonString);

// Import
const template = JSON.parse(jsonString);
registry.register({ id: template.id, template, metadata });
```

### 3. Custom Data Fetching
```typescript
class CustomDataService extends DatabaseTemplateService {
  async fetchCustomData(source: TemplateDataSource) {
    // Custom implementation
    return await customAPI.getData(source.query, source.filters);
  }
}
```

## 🚀 Best Practices

### 1. Performance
- Sử dụng pagination cho large datasets
- Cache compiled templates
- Optimize GraphQL queries với fragments
- Lazy load template thumbnails

### 2. Security
- Validate template input data
- Sanitize user-generated content
- Restrict template execution scope
- Implement rate limiting

### 3. Maintainability
- Use descriptive variable names
- Document template purpose và usage
- Version control templates
- Test templates với real data

### 4. User Experience
- Provide clear variable labels và descriptions
- Show template previews
- Implement undo/redo functionality
- Add template search và filtering

## 🎯 Ví Dụ Thực Tế

### E-commerce Product Grid
```typescript
// Template hiển thị sản phẩm với:
// ✅ Tùy chỉnh số columns (2-6)
// ✅ Hiển thị/ẩn giá và discount
// ✅ Filter theo category
// ✅ Responsive design
// ✅ Add to cart functionality
```

### Task Management Dashboard
```typescript
// Template quản lý công việc với:
// ✅ Group theo status/priority
// ✅ Progress bars
// ✅ Due date highlighting
// ✅ Assignee avatars
// ✅ Tag system
```

### Content Management
```typescript
// Template cho blog/news với:
// ✅ Featured articles
// ✅ Category navigation
// ✅ Author information
// ✅ Social sharing
// ✅ SEO optimization
```

## 📞 Support & Contribution

- **Documentation**: Đọc thêm trong `/docs/templates/`
- **Examples**: Xem `/frontend/src/lib/templateExamples.ts`
- **Issues**: Báo lỗi qua GitHub Issues
- **Contribution**: Fork và submit Pull Requests

---

**🎉 Kết luận**: Hệ thống Dynamic Template cung cấp giải pháp toàn diện cho việc tạo và quản lý template với dữ liệu động, giúp tăng productivity và flexibility trong việc phát triển UI components.