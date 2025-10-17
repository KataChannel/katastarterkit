/**
 * SavedBlocksLibrary Component
 * Manages user-saved block combinations for quick reuse
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MoreVertical, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Calendar,
  Download,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePageBuilderContext } from '@/components/page-builder/PageBuilderProvider';

interface SavedBlock {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  blocks: any[]; // Block data structure
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
}

const SAVED_BLOCKS_KEY = 'kata_saved_blocks';

export function SavedBlocksLibrary() {
  const [savedBlocks, setSavedBlocks] = useState<SavedBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const {
    blocks,
    handleAddBlock,
  } = usePageBuilderContext();

  // Load saved blocks from localStorage
  useEffect(() => {
    loadSavedBlocks();
  }, []);

  const loadSavedBlocks = () => {
    try {
      const stored = localStorage.getItem(SAVED_BLOCKS_KEY);
      if (stored) {
        setSavedBlocks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved blocks:', error);
    }
  };

  const saveSavedBlocks = (blocks: SavedBlock[]) => {
    try {
      localStorage.setItem(SAVED_BLOCKS_KEY, JSON.stringify(blocks));
      setSavedBlocks(blocks);
    } catch (error) {
      console.error('Error saving blocks:', error);
    }
  };

  const saveCurrentSelection = () => {
    if (blocks.length === 0) {
      alert('No blocks to save. Add some blocks to your page first.');
      return;
    }

    const name = prompt('Enter a name for this saved block combination:');
    if (!name) return;

    const description = prompt('Enter a description (optional):') || '';

    const newSavedBlock: SavedBlock = {
      id: `saved-${Date.now()}`,
      name,
      description,
      blocks: [...blocks],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'custom',
      tags: []
    };

    const updated = [...savedBlocks, newSavedBlock];
    saveSavedBlocks(updated);
  };

  const applySavedBlock = async (savedBlock: SavedBlock) => {
    try {
      // Apply each block from the saved combination
      for (const block of savedBlock.blocks) {
        await handleAddBlock(block.type);
      }
    } catch (error) {
      console.error('Error applying saved block:', error);
    }
  };

  const duplicateSavedBlock = (savedBlock: SavedBlock) => {
    const duplicate: SavedBlock = {
      ...savedBlock,
      id: `saved-${Date.now()}`,
      name: `${savedBlock.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...savedBlocks, duplicate];
    saveSavedBlocks(updated);
  };

  const deleteSavedBlock = (id: string) => {
    if (confirm('Are you sure you want to delete this saved block combination?')) {
      const updated = savedBlocks.filter(b => b.id !== id);
      saveSavedBlocks(updated);
    }
  };

  const exportSavedBlocks = () => {
    const dataStr = JSON.stringify(savedBlocks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'saved-blocks.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSavedBlocks = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target?.result as string);
            const updated = [...savedBlocks, ...imported];
            saveSavedBlocks(updated);
          } catch (error) {
            alert('Error importing saved blocks. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Filter saved blocks based on search and category
  const filteredBlocks = savedBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Saved Blocks</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportSavedBlocks}
              disabled={savedBlocks.length === 0}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={importSavedBlocks}
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={saveCurrentSelection}
              disabled={blocks.length === 0}
            >
              <Plus className="w-4 h-4 mr-1" />
              Save Current
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search saved blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Saved Blocks Grid */}
      <div className="space-y-3">
        {filteredBlocks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">📦</div>
            {savedBlocks.length === 0 ? (
              <>
                <h4 className="font-medium text-gray-900 mb-2">No saved blocks yet</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Create block combinations and save them for quick reuse
                </p>
                <Button
                  onClick={saveCurrentSelection}
                  disabled={blocks.length === 0}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Current Selection
                </Button>
              </>
            ) : (
              <>
                <h4 className="font-medium text-gray-900 mb-2">No blocks found</h4>
                <p className="text-sm text-gray-500">Try adjusting your search terms</p>
              </>
            )}
          </Card>
        ) : (
          filteredBlocks.map(savedBlock => (
            <Card key={savedBlock.id} className="overflow-hidden hover:border-blue-500 hover:shadow-md transition-all">
              {/* Content */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{savedBlock.name}</h4>
                    {savedBlock.description && (
                      <p className="text-xs text-gray-600 mt-1">{savedBlock.description}</p>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => applySavedBlock(savedBlock)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Apply to Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateSavedBlock(savedBlock)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteSavedBlock(savedBlock.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {savedBlock.blocks.length} blocks
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(savedBlock.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySavedBlock(savedBlock)}
                    className="h-7 px-2 text-xs"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}