'use client';

import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { EditorFooter } from './EditorFooter';
import { LeftPanel } from '../panels/LeftPanel/LeftPanel';
import { RightPanel } from '../panels/RightPanel/RightPanel';
import { usePageState, usePageActions } from '../PageBuilderProvider';
import { toast } from 'sonner';
import { UPDATE_PAGE } from '@/graphql/queries/pages';
import { UpdatePageInput } from '@/types/page-builder';

interface FullScreenLayoutProps {
  editorMode: 'visual' | 'code';
  onModeChange: (mode: 'visual' | 'code') => void;
  onExit: () => void;
  onSave: () => void;
}

export function FullScreenLayout({
  editorMode,
  onModeChange,
  onExit,
  onSave,
}: FullScreenLayoutProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  
  // Get block selection and loading state from context
  const { selectedBlockId, loading, editingPage } = usePageState();
  const { handleSelectBlock } = usePageActions();

  // GraphQL mutation for updating page
  const [updatePageMutation] = useMutation(UPDATE_PAGE);

  // Handle saving global page settings
  const handleSettingsSave = useCallback(async (settings: any) => {
    if (!editingPage?.id) {
      toast.error('No page selected');
      return;
    }

    try {
      const updateInput: UpdatePageInput = {
        title: settings.pageTitle,
        slug: settings.pageSlug,
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        seoKeywords: settings.seoKeywords ? settings.seoKeywords.split(',').map((k: string) => k.trim()) : [],
      };

      await updatePageMutation({
        variables: {
          id: editingPage.id,
          input: updateInput,
        },
      });

      toast.success('Global settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save global settings');
      throw error;
    }
  }, [editingPage?.id, updatePageMutation]);

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <EditorToolbar
        editorMode={editorMode}
        onModeChange={onModeChange}
        device={device}
        onDeviceChange={setDevice}
        onSave={onSave}
        onExit={onExit}
        leftPanelOpen={leftPanelOpen}
        onToggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
        rightPanelOpen={rightPanelOpen}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        isLoading={loading}
        pageTitle={editingPage?.title}
        onSettingsSave={handleSettingsSave}
        pageId={editingPage?.id}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Library */}
        {leftPanelOpen && (
          <LeftPanel
            onClose={() => setLeftPanelOpen(false)}
          />
        )}

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorCanvas
            editorMode={editorMode}
            device={device}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
          />
        </div>

        {/* Right Panel - Style & Settings */}
        {rightPanelOpen && (
          <RightPanel
            device={device}
            onClose={() => setRightPanelOpen(false)}
          />
        )}
      </div>

      {/* Bottom Footer */}
      <EditorFooter
        selectedBlockId={selectedBlockId}
        device={device}
      />
    </div>
  );
}
