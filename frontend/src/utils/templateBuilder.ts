/**
 * Template Builder Utilities
 * Helper functions and presets for creating templates
 */

import { TemplateDefinition, TemplateVariable } from '@/lib/dynamicTemplateSystem';

// ============================================================================
// Template Builder Class
// ============================================================================

export class TemplateBuilder {
  private template: Partial<TemplateDefinition>;

  constructor(id: string, name: string) {
    this.template = {
      id,
      name,
      version: '1.0.0',
      variables: [],
      dataSources: [],
      template: '',
      metadata: {
        category: 'custom',
        tags: [],
        description: '',
        author: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  setCategory(category: string): TemplateBuilder {
    if (this.template.metadata) {
      this.template.metadata.category = category;
    }
    return this;
  }

  setDescription(description: string): TemplateBuilder {
    if (this.template.metadata) {
      this.template.metadata.description = description;
    }
    return this;
  }

  addVariable(variable: TemplateVariable): TemplateBuilder {
    this.template.variables = this.template.variables || [];
    this.template.variables.push(variable);
    return this;
  }

  addDataSource(dataSource: any): TemplateBuilder {
    this.template.dataSources = this.template.dataSources || [];
    this.template.dataSources.push(dataSource);
    return this;
  }

  setTemplate(template: string): TemplateBuilder {
    this.template.template = template;
    return this;
  }

  addTag(tag: string): TemplateBuilder {
    if (this.template.metadata) {
      this.template.metadata.tags = this.template.metadata.tags || [];
      this.template.metadata.tags.push(tag);
    }
    return this;
  }

  build(): TemplateDefinition {
    if (!this.template.id || !this.template.name || !this.template.template) {
      throw new Error('Template must have id, name, and template content');
    }
    return this.template as TemplateDefinition;
  }
}

// ============================================================================
// Template Presets
// ============================================================================

export class TemplatePresets {
  /**
   * Create a product grid template
   */
  static createProductGrid(id: string): TemplateDefinition {
    return new TemplateBuilder(id, 'Product Grid')
      .setCategory('ecommerce')
      .setDescription('Responsive product grid with customizable layout')
      .addTag('ecommerce')
      .addTag('products')
      .addTag('grid')
      .addVariable({
        name: 'title',
        type: 'string',
        defaultValue: 'Featured Products',
        description: 'Grid title',
      })
      .addVariable({
        name: 'columns',
        type: 'number',
        defaultValue: 3,
        description: 'Number of columns',
      })
      .addVariable({
        name: 'showPrices',
        type: 'boolean',
        defaultValue: true,
        description: 'Show product prices',
      })
      .addVariable({
        name: 'backgroundColor',
        type: 'string',
        defaultValue: '#ffffff',
        description: 'Background color',
      })
      .addDataSource({
        name: 'products',
        type: 'graphql',
        query: 'products',
        variables: {},
      })
      .setTemplate(`
<div class="product-grid" style="background-color: {{backgroundColor}}; padding: 2rem;">
  <h2 class="text-2xl font-bold mb-6 text-center">{{title}}</h2>
  <div class="grid grid-cols-{{columns}} gap-6">
    {{#each products}}
    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
      {{#if image}}
      <img src="{{image}}" alt="{{name}}" class="w-full h-48 object-cover" />
      {{/if}}
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-2">{{name}}</h3>
        <p class="text-gray-600 text-sm mb-3">{{description}}</p>
        {{#if ../showPrices}}
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-green-600">\${{price}}</span>
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
        {{/if}}
      </div>
    </div>
    {{/each}}
  </div>
</div>
      `)
      .build();
  }

  /**
   * Create a task dashboard template
   */
  static createTaskDashboard(id: string): TemplateDefinition {
    return new TemplateBuilder(id, 'Task Dashboard')
      .setCategory('productivity')
      .setDescription('Interactive task management dashboard')
      .addTag('productivity')
      .addTag('tasks')
      .addTag('dashboard')
      .addVariable({
        name: 'projectName',
        type: 'string',
        defaultValue: 'My Project',
        description: 'Project name',
      })
      .addVariable({
        name: 'showCompleted',
        type: 'boolean',
        defaultValue: true,
        description: 'Show completed tasks',
      })
      .addVariable({
        name: 'groupByStatus',
        type: 'boolean',
        defaultValue: true,
        description: 'Group tasks by status',
      })
      .addDataSource({
        name: 'tasks',
        type: 'graphql',
        query: 'tasks',
        variables: {},
      })
      .setTemplate(`
<div class="task-dashboard p-6 bg-gray-50 min-h-screen">
  <div class="max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{projectName}}</h1>
      <div class="flex gap-4 mt-4">
        <div class="bg-blue-100 px-4 py-2 rounded-lg">
          <span class="text-blue-800 font-semibold">{{tasks.length}} Total Tasks</span>
        </div>
        <div class="bg-green-100 px-4 py-2 rounded-lg">
          <span class="text-green-800 font-semibold">
            {{#countWhere tasks 'status' 'completed'}}{{/countWhere}} Completed
          </span>
        </div>
        <div class="bg-yellow-100 px-4 py-2 rounded-lg">
          <span class="text-yellow-800 font-semibold">
            {{#countWhere tasks 'status' 'in_progress'}}{{/countWhere}} In Progress
          </span>
        </div>
      </div>
    </header>

    {{#if groupByStatus}}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- TODO Column -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-semibold text-gray-700 mb-4">To Do</h3>
        {{#each tasks}}
        {{#if (eq status 'todo')}}
        <div class="task-item bg-gray-50 p-3 rounded mb-3">
          <h4 class="font-medium">{{title}}</h4>
          <p class="text-sm text-gray-600">{{description}}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs text-gray-500">{{dueDate}}</span>
            <span class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
              {{priority}}
            </span>
          </div>
        </div>
        {{/if}}
        {{/each}}
      </div>

      <!-- IN PROGRESS Column -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-semibold text-yellow-700 mb-4">In Progress</h3>
        {{#each tasks}}
        {{#if (eq status 'in_progress')}}
        <div class="task-item bg-yellow-50 p-3 rounded mb-3 border-l-4 border-yellow-400">
          <h4 class="font-medium">{{title}}</h4>
          <p class="text-sm text-gray-600">{{description}}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs text-gray-500">{{dueDate}}</span>
            <span class="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">
              {{priority}}
            </span>
          </div>
        </div>
        {{/if}}
        {{/each}}
      </div>

      <!-- COMPLETED Column -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="font-semibold text-green-700 mb-4">Completed</h3>
        {{#if showCompleted}}
        {{#each tasks}}
        {{#if (eq status 'completed')}}
        <div class="task-item bg-green-50 p-3 rounded mb-3 border-l-4 border-green-400">
          <h4 class="font-medium line-through text-gray-500">{{title}}</h4>
          <p class="text-sm text-gray-500">{{description}}</p>
          <div class="mt-2 flex justify-between items-center">
            <span class="text-xs text-green-600">✓ Completed</span>
            <span class="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
              {{priority}}
            </span>
          </div>
        </div>
        {{/if}}
        {{/each}}
        {{/if}}
      </div>
    </div>
    {{else}}
    <!-- Linear Task List -->
    <div class="space-y-4">
      {{#each tasks}}
      <div class="task-item bg-white p-4 rounded-lg shadow-sm border-l-4 
                  {{#if (eq status 'completed')}}border-green-400 bg-green-50{{/if}}
                  {{#if (eq status 'in_progress')}}border-yellow-400 bg-yellow-50{{/if}}
                  {{#if (eq status 'todo')}}border-gray-400{{/if}}">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="font-medium {{#if (eq status 'completed')}}line-through text-gray-500{{/if}}">
              {{title}}
            </h4>
            <p class="text-sm text-gray-600 mt-1">{{description}}</p>
          </div>
          <div class="flex items-center gap-2 ml-4">
            <span class="px-2 py-1 rounded text-xs
                        {{#if (eq status 'completed')}}bg-green-200 text-green-800{{/if}}
                        {{#if (eq status 'in_progress')}}bg-yellow-200 text-yellow-800{{/if}}
                        {{#if (eq status 'todo')}}bg-gray-200 text-gray-700{{/if}}">
              {{status}}
            </span>
            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              {{priority}}
            </span>
          </div>
        </div>
        <div class="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span>Due: {{dueDate}}</span>
          <span>Assigned: {{assignee}}</span>
        </div>
      </div>
      {{/each}}
    </div>
    {{/if}}
  </div>
</div>
      `)
      .build();
  }

  /**
   * Create a category showcase template
   */
  static createCategoryShowcase(id: string): TemplateDefinition {
    return new TemplateBuilder(id, 'Category Showcase')
      .setCategory('ecommerce')
      .setDescription('Attractive category display with hero images')
      .addTag('ecommerce')
      .addTag('categories')
      .addTag('showcase')
      .addVariable({
        name: 'title',
        type: 'string',
        defaultValue: 'Shop by Category',
        description: 'Showcase title',
      })
      .addVariable({
        name: 'layout',
        type: 'string',
        defaultValue: 'grid',
        description: 'Layout type: grid, list, or carousel',
      })
      .addVariable({
        name: 'showProductCount',
        type: 'boolean',
        defaultValue: true,
        description: 'Show number of products in each category',
      })
      .addDataSource({
        name: 'categories',
        type: 'graphql',
        query: 'categories',
        variables: {},
      })
      .setTemplate(`
<div class="category-showcase py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
  <div class="max-w-7xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">{{title}}</h2>
      <p class="text-xl text-gray-600">Discover our amazing product categories</p>
    </div>

    {{#if (eq layout 'grid')}}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {{#each categories}}
      <div class="category-card group cursor-pointer">
        <div class="relative overflow-hidden rounded-xl shadow-lg bg-white transform transition-transform group-hover:scale-105">
          {{#if image}}
          <div class="aspect-w-16 aspect-h-9">
            <img src="{{image}}" alt="{{name}}" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
          </div>
          {{/if}}
          <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div class="text-center text-white">
              <h3 class="text-2xl font-bold mb-2">{{name}}</h3>
              {{#if ../showProductCount}}
              <p class="text-lg opacity-90">{{productCount}} products</p>
              {{/if}}
              <button class="mt-4 bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {{/each}}
    </div>
    {{/if}}

    {{#if (eq layout 'list')}}
    <div class="space-y-6">
      {{#each categories}}
      <div class="category-row bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          {{#if image}}
          <div class="w-32 h-32 flex-shrink-0">
            <img src="{{image}}" alt="{{name}}" class="w-full h-full object-cover" />
          </div>
          {{/if}}
          <div class="flex-1 p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{name}}</h3>
            <p class="text-gray-600 mb-3">{{description}}</p>
            {{#if ../showProductCount}}
            <p class="text-sm text-gray-500 mb-4">{{productCount}} products available</p>
            {{/if}}
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Explore Category
            </button>
          </div>
        </div>
      </div>
      {{/each}}
    </div>
    {{/if}}

    {{#if (eq layout 'carousel')}}
    <div class="overflow-hidden">
      <div class="flex gap-6 animate-scroll">
        {{#each categories}}
        <div class="flex-shrink-0 w-80">
          <div class="category-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {{#if image}}
            <img src="{{image}}" alt="{{name}}" class="w-full h-48 object-cover" />
            {{/if}}
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{name}}</h3>
              <p class="text-gray-600 text-sm mb-3">{{description}}</p>
              {{#if ../showProductCount}}
              <p class="text-sm text-blue-600 font-semibold mb-4">{{productCount}} products</p>
              {{/if}}
              <button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                Shop Category
              </button>
            </div>
          </div>
        </div>
        {{/each}}
      </div>
    </div>
    {{/if}}
  </div>
</div>
      `)
      .build();
  }

  /**
   * Get all preset templates
   */
  static getAllPresets(): TemplateDefinition[] {
    const timestamp = Date.now();
    return [
      this.createProductGrid(`product-grid-${timestamp}`),
      this.createTaskDashboard(`task-dashboard-${timestamp}`),
      this.createCategoryShowcase(`category-showcase-${timestamp}`),
    ];
  }

  /**
   * Create a blank template
   */
  static createBlankTemplate(id: string, name: string): TemplateDefinition {
    return new TemplateBuilder(id, name)
      .setCategory('custom')
      .setDescription('Blank template for custom development')
      .addTag('custom')
      .setTemplate(`
<div class="custom-template p-6">
  <h2 class="text-2xl font-bold mb-4">{{title}}</h2>
  <p class="text-gray-600">Add your custom template content here...</p>
</div>
      `)
      .build();
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

export const templateUtils = {
  /**
   * Validate template syntax
   */
  validateTemplate(template: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for balanced handlebars
    const openBraces = (template.match(/{{\s*[^}]+\s*}}/g) || []).length;
    const closeBraces = (template.match(/{{\/[^}]+}}/g) || []).length;
    
    if (openBraces !== closeBraces * 2) { // Each helper has open and close
      errors.push('Unbalanced handlebars expressions');
    }

    // Check for valid variable syntax
    const variables = template.match(/{{\s*[a-zA-Z_][a-zA-Z0-9_.]*\s*}}/g);
    if (variables) {
      variables.forEach(variable => {
        const varName = variable.replace(/[{}]/g, '').trim();
        if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(varName)) {
          errors.push(`Invalid variable name: ${varName}`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Extract variables from template
   */
  extractVariables(template: string): string[] {
    const variables = new Set<string>();
    const matches = template.match(/{{\s*[a-zA-Z_][a-zA-Z0-9_.]*\s*}}/g);
    
    if (matches) {
      matches.forEach(match => {
        const varName = match.replace(/[{}]/g, '').trim();
        if (!varName.startsWith('#') && !varName.startsWith('/')) {
          variables.add(varName);
        }
      });
    }

    return Array.from(variables);
  },

  /**
   * Generate template preview
   */
  generatePreview(template: TemplateDefinition, sampleData?: any): string {
    // This is a simplified preview generator
    // In a real implementation, you'd use the full template compiler
    let preview = template.template;
    
    // Replace simple variables with sample data
    if (sampleData) {
      Object.keys(sampleData).forEach(key => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        preview = preview.replace(regex, sampleData[key]);
      });
    }

    // Replace remaining variables with placeholders
    preview = preview.replace(/{{\s*([a-zA-Z_][a-zA-Z0-9_.]*)\s*}}/g, '[[$1]]');
    
    return preview;
  },

  /**
   * Calculate template complexity score
   */
  getComplexityScore(template: TemplateDefinition): number {
    let score = 0;
    
    // Variables (+1 each)
    score += (template.variables?.length || 0);
    
    // Data sources (+5 each)
    score += (template.dataSources?.length || 0) * 5;
    
    // Template size (+1 per 100 chars)
    score += Math.ceil(template.template.length / 100);
    
    // Handlebars helpers (+3 each)
    const helpers = (template.template.match(/{{\s*#[^}]+\s*}}/g) || []).length;
    score += helpers * 3;
    
    return score;
  },
};

export default {
  TemplateBuilder,
  TemplatePresets,
  templateUtils,
};