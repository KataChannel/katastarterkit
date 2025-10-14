'use client';

import React, { useState } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { EditorFooter } from './EditorFooter';
import { LeftPanel } from '../panels/LeftPanel/LeftPanel';
import { RightPanel } from '../panels/RightPanel/RightPanel';

interface FullScreenLayoutProps {
  editorMode: 'visual' | 'code';
  onModeChange: (mode: 'visual' | 'code') => void;
  onExit: () => void;
  onSave: () => void;
  isFullScreen: boolean;
}

export function FullScreenLayout({
  editorMode,
  onModeChange,
  onExit,
  onSave,
  isFullScreen,
}: FullScreenLayoutProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

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
            onSelectBlock={setSelectedBlockId}
          />
        </div>

        {/* Right Panel - Style & Settings */}
        {rightPanelOpen && (
          <RightPanel
            selectedBlockId={selectedBlockId}
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
