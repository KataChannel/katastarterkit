'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Type,
  Heading,
  Image,
  MousePointer,
  Star,
  Minus,
  Square,
  Columns,
  Layout,
  MoveVertical,
  Grid3x3,
  Images,
  Video,
  FormInput,
  Quote,
  Users,
  BarChart,
  ChevronDown,
  Clock,
  TrendingUp,
  GitBranch,
  DollarSign,
  MapPin,
  Search,
} from 'lucide-react';
import { BlockType } from '@/types/page-builder';

interface ElementConfig {
  id: BlockType;
  icon: any;
  label: string;
  category: 'basic' | 'layout' | 'content' | 'advanced';
}

const elements: ElementConfig[] = [
  // Basic Elements
  { id: BlockType.TEXT, icon: Type, label: 'Text', category: 'basic' },
  { id: BlockType.HERO, icon: Heading, label: 'Heading', category: 'basic' },
  { id: BlockType.IMAGE, icon: Image, label: 'Image', category: 'basic' },
  { id: BlockType.BUTTON, icon: MousePointer, label: 'Button', category: 'basic' },
  { id: BlockType.DIVIDER, icon: Minus, label: 'Divider', category: 'basic' },

  // Layout Elements
  { id: BlockType.SECTION, icon: Square, label: 'Section', category: 'layout' },
  { id: BlockType.FLEX_ROW, icon: Columns, label: 'Row', category: 'layout' },
  { id: BlockType.FLEX_COLUMN, icon: Layout, label: 'Column', category: 'layout' },
  { id: BlockType.SPACER, icon: MoveVertical, label: 'Spacer', category: 'layout' },
  { id: BlockType.GRID, icon: Grid3x3, label: 'Grid', category: 'layout' },

  // Content Elements
  { id: BlockType.CAROUSEL, icon: Images, label: 'Carousel', category: 'content' },
  { id: BlockType.GALLERY, icon: Image, label: 'Gallery', category: 'content' },
  { id: BlockType.VIDEO, icon: Video, label: 'Video', category: 'content' },
  { id: BlockType.CONTACT_FORM, icon: FormInput, label: 'Form', category: 'content' },
  { id: BlockType.TESTIMONIAL, icon: Quote, label: 'Testimonial', category: 'content' },
  { id: BlockType.TEAM, icon: Users, label: 'Team', category: 'content' },
  { id: BlockType.STATS, icon: BarChart, label: 'Stats', category: 'content' },

  // Advanced Elements
  { id: BlockType.FAQ, icon: ChevronDown, label: 'Accordion', category: 'advanced' },
];

function DraggableElement({ element }: { element: ElementConfig }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `element-${element.id}`,
    data: {
      type: 'new-block',
      blockType: element.id,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const Icon = element.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary hover:shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
      <span className="text-xs sm:text-sm font-medium truncate">{element.label}</span>
    </div>
  );
}

export function ElementsLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Elements' },
    { id: 'basic', label: 'Basic' },
    { id: 'layout', label: 'Layout' },
    { id: 'content', label: 'Content' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const filteredElements = elements.filter((element) => {
    const matchesSearch = element.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || element.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedElements = categories
    .filter((cat) => cat.id !== 'all')
    .map((category) => ({
      category: category.label,
      elements: filteredElements.filter((el) => el.category === category.id),
    }))
    .filter((group) => group.elements.length > 0);

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Search */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 sm:pl-9 h-8 sm:h-9 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 border-b border-gray-200 overflow-x-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="whitespace-nowrap text-xs h-7 sm:h-8 px-2.5 sm:px-3 flex-shrink-0"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {activeCategory === 'all' ? (
          // Grouped view
          <div className="space-y-4 sm:space-y-6">
            {groupedElements.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 px-1">
                  {group.category}
                </h3>
                <div className="grid gap-1.5 sm:gap-2">
                  {group.elements.map((element) => (
                    <DraggableElement key={element.id} element={element} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Single category view
          <div className="grid gap-1.5 sm:gap-2">
            {filteredElements.map((element) => (
              <DraggableElement key={element.id} element={element} />
            ))}
          </div>
        )}

        {filteredElements.length === 0 && (
          <div className="flex flex-col items-center justify-center text-gray-400 text-xs sm:text-sm py-8 sm:py-12">
            <Search className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-50" />
            <p className="font-medium">No elements found</p>
            <p className="text-[10px] sm:text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
