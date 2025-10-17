import { BlockTemplate } from '@/data/blockTemplates';
import { generateThumbnailSVG, getThumbnailDataURL } from './templateThumbnails';

const CUSTOM_TEMPLATES_KEY = 'kata_custom_templates';

/**
 * Custom Template Storage Utility
 * Manages user-created templates in localStorage
 */

export interface CustomTemplate extends BlockTemplate {
  isCustom: true;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all custom templates from localStorage
 */
export function getCustomTemplates(): CustomTemplate[] {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return [];
    
    const templates = JSON.parse(stored) as CustomTemplate[];
    return templates;
  } catch (error) {
    console.error('Error loading custom templates:', error);
    return [];
  }
}

/**
 * Save a new custom template
 */
export function saveCustomTemplate(
  template: Omit<BlockTemplate, 'id' | 'thumbnail'>
): CustomTemplate {
  try {
    const templates = getCustomTemplates();
    
    // Generate unique ID
    const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Generate thumbnail from template structure
    const thumbnail = generateCustomTemplateThumbnail(template);
    
    const customTemplate: CustomTemplate = {
      ...template,
      id,
      thumbnail,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to beginning of array (newest first)
    templates.unshift(customTemplate);
    
    // Save to localStorage
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    
    return customTemplate;
  } catch (error) {
    console.error('Error saving custom template:', error);
    throw error;
  }
}

/**
 * Update an existing custom template
 */
export function updateCustomTemplate(
  id: string,
  updates: Partial<Omit<BlockTemplate, 'id' | 'thumbnail'>>
): CustomTemplate | null {
  try {
    const templates = getCustomTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      console.error('Template not found:', id);
      return null;
    }
    
    // Update template
    const updatedTemplate: CustomTemplate = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Regenerate thumbnail if blocks changed
    if (updates.blocks) {
      updatedTemplate.thumbnail = generateCustomTemplateThumbnail(updatedTemplate);
    }
    
    templates[index] = updatedTemplate;
    
    // Save to localStorage
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    
    return updatedTemplate;
  } catch (error) {
    console.error('Error updating custom template:', error);
    throw error;
  }
}

/**
 * Delete a custom template
 */
export function deleteCustomTemplate(id: string): boolean {
  try {
    const templates = getCustomTemplates();
    const filtered = templates.filter(t => t.id !== id);
    
    if (filtered.length === templates.length) {
      console.error('Template not found:', id);
      return false;
    }
    
    // Save to localStorage
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error deleting custom template:', error);
    throw error;
  }
}

/**
 * Get a single custom template by ID
 */
export function getCustomTemplate(id: string): CustomTemplate | null {
  try {
    const templates = getCustomTemplates();
    return templates.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error getting custom template:', error);
    return null;
  }
}

/**
 * Clear all custom templates
 */
export function clearCustomTemplates(): boolean {
  try {
    localStorage.removeItem(CUSTOM_TEMPLATES_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing custom templates:', error);
    throw error;
  }
}

/**
 * Export custom templates to JSON
 */
export function exportCustomTemplates(): string {
  try {
    const templates = getCustomTemplates();
    return JSON.stringify(templates, null, 2);
  } catch (error) {
    console.error('Error exporting custom templates:', error);
    throw error;
  }
}

/**
 * Import custom templates from JSON
 */
export function importCustomTemplates(jsonString: string): CustomTemplate[] {
  try {
    const imported = JSON.parse(jsonString) as CustomTemplate[];
    
    // Validate structure
    if (!Array.isArray(imported)) {
      throw new Error('Invalid template format: expected array');
    }
    
    // Validate each template
    imported.forEach((template, index) => {
      if (!template.id || !template.name || !template.blocks) {
        throw new Error(`Invalid template at index ${index}: missing required fields`);
      }
    });
    
    // Get existing templates
    const existing = getCustomTemplates();
    
    // Merge (imported templates get new IDs to avoid conflicts)
    const merged = [
      ...imported.map(template => ({
        ...template,
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        importedAt: new Date().toISOString(),
      })),
      ...existing,
    ];
    
    // Save to localStorage
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(merged));
    
    return imported;
  } catch (error) {
    console.error('Error importing custom templates:', error);
    throw error;
  }
}

/**
 * Generate thumbnail for custom template
 */
function generateCustomTemplateThumbnail(template: Omit<BlockTemplate, 'id' | 'thumbnail'>): string {
  // For custom templates, generate a generic thumbnail based on structure
  const blockCount = template.blocks.length;
  const totalBlocks = template.blocks.reduce((count, block) => {
    return count + 1 + (block.children?.length || 0);
  }, 0);
  
  // Create simple SVG representation
  const svg = `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="400" height="300" fill="#f8fafc"/>
      
      <!-- Header -->
      <rect x="20" y="20" width="360" height="40" rx="8" fill="#3b82f6" opacity="0.1"/>
      <text x="200" y="45" text-anchor="middle" fill="#1e293b" font-size="16" font-weight="600">
        ${template.name.substring(0, 20)}
      </text>
      
      <!-- Blocks representation -->
      <text x="200" y="80" text-anchor="middle" fill="#64748b" font-size="12">
        ${blockCount} block${blockCount !== 1 ? 's' : ''} • ${totalBlocks} total
      </text>
      
      <!-- Category badge -->
      <rect x="150" y="100" width="100" height="24" rx="12" fill="#3b82f6"/>
      <text x="200" y="116" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="500">
        ${template.category.toUpperCase()}
      </text>
      
      <!-- Visual blocks representation -->
      ${generateBlocksVisualization(template.blocks)}
      
      <!-- Custom badge -->
      <rect x="160" y="260" width="80" height="20" rx="10" fill="#10b981"/>
      <text x="200" y="274" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="600">
        CUSTOM
      </text>
    </svg>
  `;
  
  // Convert to data URL with proper UTF-8 encoding
  // Use encodeURIComponent to handle Unicode characters
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}

/**
 * Generate visual representation of blocks structure
 */
function generateBlocksVisualization(blocks: any[]): string {
  const maxBlocks = Math.min(blocks.length, 4);
  let y = 140;
  let elements = '';
  
  for (let i = 0; i < maxBlocks; i++) {
    const width = 320 - (i * 20);
    const x = 40 + (i * 10);
    elements += `
      <rect x="${x}" y="${y}" width="${width}" height="20" rx="4" fill="#cbd5e1" opacity="${1 - (i * 0.15)}"/>
    `;
    y += 30;
  }
  
  if (blocks.length > 4) {
    elements += `
      <text x="200" y="${y + 10}" text-anchor="middle" fill="#94a3b8" font-size="10">
        +${blocks.length - 4} more...
      </text>
    `;
  }
  
  return elements;
}

/**
 * Get template statistics
 */
export function getCustomTemplateStats(): {
  total: number;
  byCategory: Record<string, number>;
  totalSize: number;
} {
  try {
    const templates = getCustomTemplates();
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY) || '[]';
    
    const byCategory = templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: templates.length,
      byCategory,
      totalSize: new Blob([stored]).size,
    };
  } catch (error) {
    console.error('Error getting template stats:', error);
    return { total: 0, byCategory: {}, totalSize: 0 };
  }
}
