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
  Minus,
  Square,
  Columns,
  Layout,
  MoveVertical,
  Grid3x3,
  Images,
  Video,
  Users,
  BarChart,
  Search,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { BlockType } from '@/types/page-builder';
import { usePageActions } from '../../PageBuilderProvider';

interface ElementConfig {
  id: BlockType;
  icon: any;
  label: string;
  category: 'basic' | 'layout' | 'content' | 'advanced' | 'ecommerce';
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
  { id: BlockType.VIDEO, icon: Video, label: 'Video', category: 'content' },
  { id: BlockType.TEAM, icon: Users, label: 'Team', category: 'content' },
  { id: BlockType.STATS, icon: BarChart, label: 'Stats', category: 'content' },
  
  // E-commerce Elements
  { id: BlockType.PRODUCT_LIST, icon: ShoppingCart, label: 'Product List', category: 'ecommerce' },
  { id: BlockType.PRODUCT_DETAIL, icon: Package, label: 'Product Detail', category: 'ecommerce' },
];

function DraggableElement({ element }: { element: ElementConfig }) {
  const { handleAddBlock } = usePageActions();
  const [isAdding, setIsAdding] = useState(false);

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
        opacity: isDragging ? 0.7 : 1,
        zIndex: 1000,
      }
    : undefined;

  const Icon = element.icon;

  // Handle double-click to add block directly
  const handleDoubleClick = async () => {
    if (isAdding) return;
    
    try {
      setIsAdding(true);
      console.log('[ElementsLibrary] Double-click add block:', element.id);
      await handleAddBlock(element.id);
    } catch (error) {
      console.error('[ElementsLibrary] Error adding block:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onDoubleClick={handleDoubleClick}
      className={`group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
        isDragging
          ? 'bg-blue-100 border-blue-500 shadow-lg shadow-blue-300 scale-105'
          : isAdding
          ? 'bg-green-100 border-green-500 shadow-lg shadow-green-300'
          : 'border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-400 hover:shadow-md'
      } cursor-grab active:cursor-grabbing relative`}
      title="Double-click to add directly or drag to canvas"
    >
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-all ${
        isDragging
          ? 'bg-blue-500 text-white scale-110'
          : isAdding
          ? 'bg-green-500 text-white scale-110'
          : 'bg-primary/10 text-primary group-hover:bg-blue-400 group-hover:text-white'
      } flex-shrink-0`}>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
      <span className={`text-xs sm:text-sm font-medium truncate transition-colors ${
        isDragging ? 'text-blue-700 font-bold' : isAdding ? 'text-green-700 font-bold' : 'text-gray-700'
      }`}>
        {element.label}
      </span>
      {isDragging && (
        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-semibold">
          Dragging ✨
        </span>
      )}
      {isAdding && (
        <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded font-semibold animate-pulse">
          Adding ✨
        </span>
      )}
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
    { id: 'ecommerce', label: 'E-commerce' },
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
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white">
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
      <div className="flex-shrink-0 flex gap-1.5 sm:gap-2 p-2 sm:p-3 border-b border-gray-200 overflow-x-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
      <div className="flex-1 min-h-0 p-3 sm:p-4 bg-gray-50/50">
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
