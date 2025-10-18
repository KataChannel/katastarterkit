'use client';

import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../ui/tabs';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Textarea } from '../../../ui/textarea';
import { X, Paintbrush, Settings, Trash2, Copy, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { usePageBuilderContext } from '../../PageBuilderProvider';
import { StylePanel } from '../StylePanel';

interface RightPanelProps {
  device: 'desktop' | 'tablet' | 'mobile';
  onClose: () => void;
}

export function RightPanel({ device, onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'settings'>('style');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  
  // Get selected block and operations from context
  const {
    selectedBlockId,
    selectedBlock,
    handleUpdateBlockStyle,
    handleBlockUpdate,
    handleBlockDelete
  } = usePageBuilderContext();

  // Simplified style update handler
  const handleStyleChange = (styles: Record<string, any>) => {
    console.log('RightPanel - handleStyleChange called with:', styles);
    console.log('RightPanel - selectedBlockId:', selectedBlockId);
    if (!selectedBlockId) return;
    handleUpdateBlockStyle(selectedBlockId, styles);
  };

  // Handle block deletion with confirmation
  const handleDelete = () => {
    if (!selectedBlockId) return;
    if (showDeleteConfirm) {
      handleBlockDelete(selectedBlockId);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  // Handle block duplication
  const handleDuplicate = () => {
    if (!selectedBlockId || !selectedBlock) return;
    // TODO: Implement duplication in PageBuilderContext
    console.log('Duplicate block:', selectedBlockId);
    // For now, just log - will implement full duplication later
  };

  // Handle content update
  const handleContentChange = (newContent: any) => {
    if (!selectedBlockId || !selectedBlock) return;
    handleBlockUpdate(selectedBlockId, newContent, selectedBlock.style);
  };

  // Toggle lock state
  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="border-b border-gray-200">
        <div className="h-12 flex items-center justify-between px-4">
          <h2 className="font-semibold">Properties</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Action Buttons */}
        {selectedBlockId && (
          <div className="px-4 pb-3 flex gap-2">
            <Button
              onClick={toggleLock}
              size="sm"
              variant="outline"
              className="flex-1"
              title={isLocked ? 'Unlock block' : 'Lock block'}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5 mr-1.5" /> : <Unlock className="w-3.5 h-3.5 mr-1.5" />}
              <span className="text-xs">{isLocked ? 'Locked' : 'Lock'}</span>
            </Button>
            <Button
              onClick={handleDuplicate}
              size="sm"
              variant="outline"
              className="flex-1"
              title="Duplicate block"
              disabled={isLocked}
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Duplicate</span>
            </Button>
            <Button
              onClick={handleDelete}
              size="sm"
              variant={showDeleteConfirm ? 'destructive' : 'outline'}
              className="flex-1"
              title="Delete block"
              disabled={isLocked}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">{showDeleteConfirm ? 'Confirm?' : 'Delete'}</span>
            </Button>
          </div>
        )}
      </div>

      {selectedBlockId ? (
        <>
          {/* Device Indicator */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-500">
              Editing for: <span className="font-semibold capitalize">{device}</span>
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="style" className="flex-1 gap-2">
                <Paintbrush className="w-4 h-4" />
                Style
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              {/* Style Tab */}
              <TabsContent value="style" className="mt-0">
                <StylePanel
                  selectedBlock={selectedBlock}
                  onStyleChange={handleStyleChange}
                />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0 p-4">
                <div className="space-y-6">
                  {/* Block Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Block Information
                    </h3>
                    <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                          {selectedBlockId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {selectedBlock?.type?.replace(/_/g, ' ') || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Order:</span>
                        <span className="font-medium">#{selectedBlock?.order ?? 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`text-xs px-2 py-1 rounded ${isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isLocked ? 'Locked' : 'Editable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Content Editor */}
                  {selectedBlock?.content && !isLocked && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">Quick Edit Content</h3>
                      <div className="space-y-3">
                        {/* Text content */}
                        {selectedBlock.content.text !== undefined && (
                          <div>
                            <Label htmlFor="block-text" className="text-xs">Text Content</Label>
                            <Textarea
                              id="block-text"
                              value={selectedBlock.content.text || ''}
                              onChange={(e) => handleContentChange({ ...selectedBlock.content, text: e.target.value })}
                              className="mt-1 text-sm"
                              rows={3}
                              placeholder="Enter text..."
                            />
                          </div>
                        )}
                        
                        {/* Title */}
                        {selectedBlock.content.title !== undefined && (
                          <div>
                            <Label htmlFor="block-title" className="text-xs">Title</Label>
                            <Input
                              id="block-title"
                              value={selectedBlock.content.title || ''}
                              onChange={(e) => handleContentChange({ ...selectedBlock.content, title: e.target.value })}
                              className="mt-1 text-sm"
                              placeholder="Enter title..."
                            />
                          </div>
                        )}
                        
                        {/* Description */}
                        {selectedBlock.content.description !== undefined && (
                          <div>
                            <Label htmlFor="block-description" className="text-xs">Description</Label>
                            <Textarea
                              id="block-description"
                              value={selectedBlock.content.description || ''}
                              onChange={(e) => handleContentChange({ ...selectedBlock.content, description: e.target.value })}
                              className="mt-1 text-sm"
                              rows={2}
                              placeholder="Enter description..."
                            />
                          </div>
                        )}
                        
                        {/* URL/Link */}
                        {selectedBlock.content.url !== undefined && (
                          <div>
                            <Label htmlFor="block-url" className="text-xs">URL</Label>
                            <Input
                              id="block-url"
                              type="url"
                              value={selectedBlock.content.url || ''}
                              onChange={(e) => handleContentChange({ ...selectedBlock.content, url: e.target.value })}
                              className="mt-1 text-sm"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Advanced Settings */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">Advanced</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">Visibility</span>
                        <Button size="sm" variant="ghost" className="h-7">
                          <Eye className="w-3 h-3 mr-1" />
                          <span className="text-xs">Visible</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">Animation</span>
                        <Button size="sm" variant="ghost" className="h-7">
                          <span className="text-xs">None</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* JSON Editor (Collapsible) */}
                  {selectedBlock?.content && (
                    <details className="space-y-3">
                      <summary className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-primary">
                        JSON Editor (Advanced)
                      </summary>
                      <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mt-2">
                        <pre className="whitespace-pre-wrap break-words">
                          {JSON.stringify(selectedBlock.content, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}

                  {/* Help Text */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>💡 Tip:</strong> Use the Style tab for visual customization. 
                      Lock the block to prevent accidental changes.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Select a block to edit its properties
          </p>
        </div>
      )}
    </div>
  );
}
