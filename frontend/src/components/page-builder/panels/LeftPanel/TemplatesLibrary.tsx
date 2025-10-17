'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
  Newspaper,
  Building2,
  TrendingUp,
  Eye,
  Copy,
  Check,
} from 'lucide-react';

interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'ecommerce' | 'productivity' | 'landing' | 'business' | 'marketing';
  preview: string;
  blocks: number;
  color: string;
}

const templates: TemplateConfig[] = [
  // E-commerce Templates
  {
    id: 'product-grid',
    name: 'Product Grid',
    description: 'Responsive product showcase with 3-column layout',
    category: 'ecommerce',
    preview: '🛍️',
    blocks: 6,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'category-showcase',
    name: 'Category Showcase',
    description: 'Highlight product categories with images',
    category: 'ecommerce',
    preview: '🏪',
    blocks: 4,
    color: 'from-purple-500 to-pink-500',
  },

  // Productivity Templates
  {
    id: 'task-dashboard',
    name: 'Task Dashboard',
    description: 'Kanban-style task management interface',
    category: 'productivity',
    preview: '✅',
    blocks: 8,
    color: 'from-green-500 to-emerald-500',
  },

  // Landing Page Templates
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'Eye-catching hero with CTA buttons',
    category: 'landing',
    preview: '🚀',
    blocks: 3,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Professional contact form with validation',
    category: 'landing',
    preview: '📧',
    blocks: 5,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer reviews in card layout',
    category: 'landing',
    preview: '⭐',
    blocks: 4,
    color: 'from-yellow-500 to-orange-500',
  },

  // Business Templates
  {
    id: 'faq-section',
    name: 'FAQ Section',
    description: 'Accordion-style frequently asked questions',
    category: 'business',
    preview: '❓',
    blocks: 6,
    color: 'from-teal-500 to-cyan-500',
  },

  // Marketing Templates
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Email subscription form with benefits',
    category: 'marketing',
    preview: '📰',
    blocks: 3,
    color: 'from-pink-500 to-rose-500',
  },
];

const categoryIcons = {
  ecommerce: ShoppingBag,
  productivity: LayoutDashboard,
  landing: Sparkles,
  business: Building2,
  marketing: TrendingUp,
};

const categoryLabels = {
  ecommerce: 'E-commerce',
  productivity: 'Productivity',
  landing: 'Landing Page',
  business: 'Business',
  marketing: 'Marketing',
};

function TemplateCard({ template, onInsert }: { template: TemplateConfig; onInsert: (id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInserted, setIsInserted] = useState(false);

  const handleInsert = () => {
    onInsert(template.id);
    setIsInserted(true);
    setTimeout(() => setIsInserted(false), 2000);
  };

  return (
    <div
      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Area */}
      <div className={`relative h-24 sm:h-28 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
        <div className="text-4xl sm:text-5xl">{template.preview}</div>
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs gap-1.5"
              onClick={handleInsert}
            >
              {isInserted ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="hidden sm:inline">Inserted</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="hidden sm:inline">Insert</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs gap-1.5"
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </div>
        )}

        {/* Block Count Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-[10px] sm:text-xs h-5 sm:h-6 px-1.5 sm:px-2 bg-white/90 backdrop-blur-sm">
            {template.blocks} blocks
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base mb-1 truncate group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 mb-2 sm:mb-3">
          {template.description}
        </p>
        
        {/* Category Badge */}
        <div className="flex items-center gap-1.5">
          {React.createElement(categoryIcons[template.category], {
            className: 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400',
          })}
          <span className="text-[10px] sm:text-xs text-gray-500">
            {categoryLabels[template.category]}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TemplatesLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates', icon: Sparkles },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag },
    { id: 'productivity', label: 'Productivity', icon: LayoutDashboard },
    { id: 'landing', label: 'Landing', icon: Newspaper },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsertTemplate = (templateId: string) => {
    console.log('Inserting template:', templateId);
    // TODO: Implement template insertion logic
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-semibold text-sm sm:text-base">Templates</h2>
          <Badge variant="secondary" className="ml-auto text-[10px] sm:text-xs">
            {templates.length} available
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 border-b border-gray-200 overflow-x-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="whitespace-nowrap text-xs h-7 sm:h-8 px-2.5 sm:px-3 flex-shrink-0 gap-1.5"
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
            </Button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onInsert={handleInsertTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 text-xs sm:text-sm py-8 sm:py-12">
            <Search className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-50" />
            <p className="font-medium">No templates found</p>
            <p className="text-[10px] sm:text-xs mt-1">Try a different search term or category</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 sm:p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>
            Showing <span className="font-medium text-gray-700">{filteredTemplates.length}</span> template
            {filteredTemplates.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
