'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Eye,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Save,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  FileDown,
  FileUp,
  Library,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SaveTemplateDialog } from '@/components/page-builder/templates';
import { ImportTemplateDialog } from '@/components/page-builder/templates';
import { TemplateLibrary } from '@/components/page-builder/templates';
import { PageTemplate, PageElement, ImportTemplateData } from '@/types/template';
import { useTemplates } from '@/hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';

interface EditorToolbarProps {
  editorMode: 'visual' | 'code';
  onModeChange: (mode: 'visual' | 'code') => void;
  device: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  onSave: () => void;
  onExit: () => void;
  leftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  rightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  currentPageStructure?: PageElement[];
  currentPageStyles?: any;
  onApplyTemplate?: (template: PageTemplate) => void;
}

export function EditorToolbar({
  editorMode,
  onModeChange,
  device,
  onDeviceChange,
  onSave,
  onExit,
  leftPanelOpen,
  onToggleLeftPanel,
  rightPanelOpen,
  onToggleRightPanel,
  currentPageStructure = [],
  currentPageStyles,
  onApplyTemplate,
}: EditorToolbarProps) {
  const { toast } = useToast();
  const { addTemplate, importFromJSON } = useTemplates();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + S - Save as Template
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setIsSaveDialogOpen(true);
      }
      // Ctrl/Cmd + Shift + O - Import Template
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        setIsImportDialogOpen(true);
      }
      // Ctrl/Cmd + Shift + L - Template Library
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setIsLibraryOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle save template
  const handleSaveTemplate = async (template: PageTemplate) => {
    try {
      const success = await addTemplate(template);
      if (success) {
        toast({
          title: 'Template saved',
          description: `"${template.name}" has been saved to your template library.`,
          type: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save template. Please try again.',
          type: 'error',
        });
      }
      return success;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template. Please try again.',
        type: 'error',
      });
      return false;
    }
  };

  // Handle import template
  const handleImportTemplate = async (data: ImportTemplateData) => {
    try {
      // Convert template to JSON string
      const jsonString = JSON.stringify(data.template);
      const result = await importFromJSON(jsonString);
      
      if (result.success) {
        toast({
          title: 'Template imported',
          description: `"${data.template.name}" has been imported successfully.`,
          type: 'success',
        });
        return true;
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to import template. Please try again.',
          type: 'error',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import template. Please try again.',
        type: 'error',
      });
      return false;
    }
  };

  // Handle apply template from library
  const handleApplyTemplateFromLibrary = (template: PageTemplate) => {
    if (onApplyTemplate) {
      onApplyTemplate(template);
      setIsLibraryOpen(false);
      toast({
        title: 'Template applied',
        description: `"${template.name}" has been applied to your page.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-4">
      {/* Left Section - Logo & Mode */}
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg text-primary">
          Kata Builder
        </div>

        {/* Editor Mode Switcher */}
        <Tabs value={editorMode} onValueChange={(v) => onModeChange(v as 'visual' | 'code')}>
          <TabsList>
            <TabsTrigger value="visual" className="gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Code</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Center Section - Device Preview */}
      <div className="flex items-center gap-2">
        <Tabs value={device} onValueChange={(v) => onDeviceChange(v as 'desktop' | 'tablet' | 'mobile')}>
          <TabsList>
            <TabsTrigger value="desktop" className="gap-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden md:inline">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="gap-2">
              <Tablet className="w-4 h-4" />
              <span className="hidden md:inline">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden md:inline">Mobile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Panel Toggles */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleLeftPanel}
          title={leftPanelOpen ? 'Hide left panel' : 'Show left panel'}
        >
          {leftPanelOpen ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRightPanel}
          title={rightPanelOpen ? 'Hide right panel' : 'Show right panel'}
        >
          {rightPanelOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </Button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Undo/Redo */}
        <Button variant="ghost" size="icon" disabled title="Undo (Ctrl+Z)">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled title="Redo (Ctrl+Y)">
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300" />

        {/* Template Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
              <FileDown className="w-4 h-4 mr-2" />
              Save as Template
              <span className="ml-auto text-xs text-gray-500">⇧⌘S</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsImportDialogOpen(true)}>
              <FileUp className="w-4 h-4 mr-2" />
              Import Template
              <span className="ml-auto text-xs text-gray-500">⇧⌘O</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsLibraryOpen(true)}>
              <Library className="w-4 h-4 mr-2" />
              Template Library
              <span className="ml-auto text-xs text-gray-500">⇧⌘L</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save */}
        <Button variant="default" size="sm" onClick={onSave} className="gap-2">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" title="Global Settings">
          <Settings className="w-4 h-4" />
        </Button>

        {/* Exit */}
        <Button variant="ghost" size="icon" onClick={onExit} title="Exit Fullscreen (ESC)">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Template Dialogs */}
      <SaveTemplateDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveTemplate}
        currentPageStructure={currentPageStructure}
        currentPageStyles={currentPageStyles}
      />

      <ImportTemplateDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportTemplate}
      />

      {/* Template Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Template Library</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsLibraryOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <TemplateLibrary onTemplateSelect={handleApplyTemplateFromLibrary} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
