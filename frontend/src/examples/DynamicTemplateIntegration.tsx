/**
 * Complete Integration Example: Dynamic Template System with PageBuilder
 * This file demonstrates how to use all components together
 */

'use client';

import React from 'react';
import PageBuilderWithTemplates from '@/components/page-builder/PageBuilderWithTemplates';

// ============================================================================
// Main Integration Component
// ============================================================================

/**
 * Complete example showing Dynamic Template System integration
 * Usage: Import and use this component in your page
 */
export const DynamicTemplateIntegrationExample: React.FC = () => {
  // Handle when template elements are added to the page
  const handleAddElements = (elements: any[]) => {
    console.log('New template elements added:', elements);
    // Here you would integrate with your existing page builder state
    // For example, add elements to Redux store, Context, or local state
  };

  // Mock existing page blocks (replace with your actual page builder state)
  const currentBlocks = [
    {
      id: 'block-1',
      type: 'hero',
      content: 'Existing Hero Section',
    },
    {
      id: 'block-2', 
      type: 'features',
      content: 'Existing Features Block',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageBuilderWithTemplates
        onAddElements={handleAddElements}
        currentBlocks={currentBlocks}
      />
    </div>
  );
};

// ============================================================================
// Usage Examples for Different Scenarios
// ============================================================================

/**
 * Example 1: E-commerce Product Page Builder
 */
export const EcommercePageBuilder: React.FC = () => {
  const handleProductTemplateApplied = (elements: any[]) => {
    console.log('Product template elements:', elements);
    // Process product-specific template elements
    // - Update product catalog
    // - Refresh shopping cart
    // - Update SEO metadata
  };

  return (
    <PageBuilderWithTemplates
      onAddElements={handleProductTemplateApplied}
      currentBlocks={[]}
    />
  );
};

/**
 * Example 2: Project Management Dashboard Builder  
 */
export const ProjectDashboardBuilder: React.FC = () => {
  const handleTaskTemplateApplied = (elements: any[]) => {
    console.log('Task dashboard elements:', elements);
    // Process task-specific template elements
    // - Update project metrics
    // - Refresh task assignments
    // - Update progress charts
  };

  return (
    <PageBuilderWithTemplates
      onAddElements={handleTaskTemplateApplied}
      currentBlocks={[]}
    />
  );
};

/**
 * Example 3: Custom Template Development Workflow
 */
export const CustomTemplateWorkflow: React.FC = () => {
  const [savedTemplates, setSavedTemplates] = React.useState<any[]>([]);

  const handleTemplateApplied = (elements: any[]) => {
    console.log('Custom template applied:', elements);
    // Custom workflow processing
  };

  const handleTemplateSaved = (template: any) => {
    console.log('Template saved:', template);
    setSavedTemplates(prev => [...prev, template]);
    
    // Save to backend
    // await saveTemplateToBackend(template);
  };

  return (
    <div>
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-lg font-semibold">Custom Template Development</h2>
        <p className="text-sm text-muted-foreground">
          Saved Templates: {savedTemplates.length}
        </p>
      </div>
      
      <PageBuilderWithTemplates
        onAddElements={handleTemplateApplied}
        currentBlocks={[]}
      />
    </div>
  );
};

// ============================================================================
// Advanced Integration Patterns
// ============================================================================

/**
 * Pattern 1: Template System with Redux Integration
 */
export const ReduxIntegratedPageBuilder: React.FC = () => {
  // Example Redux integration
  // const dispatch = useDispatch();
  // const pageBlocks = useSelector(state => state.pageBuilder.blocks);

  const handleTemplateApplied = (elements: any[]) => {
    // Dispatch Redux action
    // dispatch(addTemplateElements(elements));
    console.log('Redux integration:', elements);
  };

  return (
    <PageBuilderWithTemplates
      onAddElements={handleTemplateApplied}
      currentBlocks={[]} // pageBlocks from Redux
    />
  );
};

/**
 * Pattern 2: Template System with GraphQL Integration
 */
export const GraphQLIntegratedPageBuilder: React.FC = () => {
  // Example Apollo Client integration
  // const { data: products } = useQuery(GET_PRODUCTS);
  // const { data: tasks } = useQuery(GET_TASKS);

  const handleTemplateApplied = (elements: any[]) => {
    console.log('GraphQL data available for templates:', elements);
    // Template system will automatically fetch data via GraphQL
    // based on template data source configuration
  };

  return (
    <PageBuilderWithTemplates
      onAddElements={handleTemplateApplied}
      currentBlocks={[]}
    />
  );
};

/**
 * Pattern 3: Multi-tenant Template System
 */
export const MultiTenantPageBuilder: React.FC<{
  tenantId: string;
  userRole: string;
}> = ({ tenantId, userRole }) => {
  const handleTemplateApplied = (elements: any[]) => {
    console.log(`Template applied for tenant ${tenantId}:`, elements);
    // Apply tenant-specific processing
    // - Filter templates by tenant access
    // - Apply tenant branding
    // - Log tenant usage metrics
  };

  const handleTemplateSaved = (template: any) => {
    const tenantTemplate = {
      ...template,
      tenantId,
      createdBy: userRole,
      permissions: ['read', 'write'], // Based on user role
    };
    
    console.log('Tenant template saved:', tenantTemplate);
    // Save with tenant context
  };

  return (
    <div>
      <div className="p-2 bg-gray-100 text-xs">
        Tenant: {tenantId} | Role: {userRole}
      </div>
      <PageBuilderWithTemplates
        onAddElements={handleTemplateApplied}
        currentBlocks={[]}
      />
    </div>
  );
};

// ============================================================================
// Export all examples
// ============================================================================

export default {
  DynamicTemplateIntegrationExample,
  EcommercePageBuilder,
  ProjectDashboardBuilder,
  CustomTemplateWorkflow,
  ReduxIntegratedPageBuilder,
  GraphQLIntegratedPageBuilder,
  MultiTenantPageBuilder,
};