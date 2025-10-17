'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { ElementsLibrary } from './ElementsLibrary';
import { SavedBlocksLibrary } from './SavedBlocksLibrary';

interface LeftPanelProps {
  onClose: () => void;
}

export function LeftPanel({ onClose }: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'saved'>('elements');

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
        <h2 className="font-semibold">Components</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="elements" className="flex-1">Elements</TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="elements" className="mt-0 p-0">
            <ElementsLibrary />
          </TabsContent>

          <TabsContent value="saved" className="mt-0 p-0">
            <SavedBlocksLibrary />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
