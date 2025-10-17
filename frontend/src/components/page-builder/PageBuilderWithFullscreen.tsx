/**
 * PageBuilder with Fullscreen Support - Example Usage
 * 
 * This file demonstrates how to integrate the fullscreen functionality
 * into your PageBuilder component.
 */

'use client';

import React from 'react';
import { useFullscreen } from '@/hooks/useFullscreen';
import { EditorToolbar } from '@/components/page-builder/layout/EditorToolbar';

interface PageBuilderWithFullscreenProps {
  pageId?: string;
  // Add other props as needed
}

/**
 * Example: PageBuilder with Fullscreen Support
 * 
 * Usage:
 * <PageBuilderWithFullscreen pageId="123" />
 */
export const PageBuilderWithFullscreen: React.FC<PageBuilderWithFullscreenProps> = ({
  pageId,
}) => {
  const { isFullscreen, toggleFullscreen, fullscreenProps } = useFullscreen();
  
  // Your existing PageBuilder state
  const [editorMode, setEditorMode] = React.useState<'visual' | 'code'>('visual');
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftPanelOpen, setLeftPanelOpen] = React.useState(true);
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);

  const handleSave = () => {
    console.log('Saving page...');
  };

  const handleExit = () => {
    if (isFullscreen) {
      toggleFullscreen();
    }
    console.log('Exiting...');
  };

  return (
    <div {...fullscreenProps}>
      {/* Apply fullscreen props to the main container */}
      <div className="flex flex-col h-full">
        {/* Toolbar with fullscreen controls */}
        <EditorToolbar
          editorMode={editorMode}
          onModeChange={setEditorMode}
          device={device}
          onDeviceChange={setDevice}
          onSave={handleSave}
          onExit={handleExit}
          leftPanelOpen={leftPanelOpen}
          onToggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
          rightPanelOpen={rightPanelOpen}
          onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          {leftPanelOpen && (
            <div className="w-64 border-r bg-gray-50 overflow-auto">
              <div className="p-4">
                <h3 className="font-semibold mb-4">Blocks</h3>
                {/* Add your blocks here */}
              </div>
            </div>
          )}

          {/* Center Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div 
              className={`mx-auto bg-white shadow-lg transition-all duration-300 ${
                device === 'mobile' ? 'max-w-sm' :
                device === 'tablet' ? 'max-w-3xl' :
                'max-w-7xl'
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">
                  {isFullscreen ? 'Fullscreen Mode Active' : 'Normal Mode'}
                </h2>
                <p className="text-gray-600">
                  Press F11 or click the fullscreen button to toggle fullscreen mode.
                </p>
                <p className="text-gray-600 mt-2">
                  When in fullscreen, the editor will appear above all other elements with z-index: 9999.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <div className="w-80 border-l bg-gray-50 overflow-auto">
              <div className="p-4">
                <h3 className="font-semibold mb-4">Properties</h3>
                {/* Add your properties panel here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Alternative: Using CSS classes for fullscreen
 * 
 * Add this to your global CSS file:
 * 
 * .fullscreen-active {
 *   position: fixed !important;
 *   top: 0 !important;
 *   left: 0 !important;
 *   right: 0 !important;
 *   bottom: 0 !important;
 *   z-index: 9999 !important;
 *   background: white !important;
 *   overflow: auto !important;
 * }
 * 
 * body.fullscreen-open {
 *   overflow: hidden !important;
 * }
 */

export default PageBuilderWithFullscreen;
