'use client';

import React, { useState } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { EditorFooter } from './EditorFooter';
import { LeftPanel } from '../panels/LeftPanel/LeftPanel';
import { RightPanel } from '../panels/RightPanel/RightPanel';
import { usePageState, usePageActions } from '../PageBuilderProvider';

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
  
  // Get block selection from context
  const { selectedBlockId } = usePageState();
  const { handleSelectBlock } = usePageActions();

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
