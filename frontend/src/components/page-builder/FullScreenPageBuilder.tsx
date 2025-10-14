'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenLayout } from './layout/FullScreenLayout';
import { PageBuilderProvider } from './PageBuilderProvider';
import type { PageBlock } from '@/types/page-builder';

interface FullScreenPageBuilderProps {
  pageId?: string;
  onExit?: () => void;
  initialMode?: 'visual' | 'code';
  initialBlocks?: PageBlock[];
}

export function FullScreenPageBuilder({
  pageId,
  onExit,
  initialMode = 'visual',
  initialBlocks = [],
}: FullScreenPageBuilderProps) {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>(initialMode);

  // Enter full-screen on mount
  useEffect(() => {
    enterFullScreen();
    return () => exitFullScreen();
  }, []);

  // Handle ESC key to exit
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const enterFullScreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.warn('Failed to enter fullscreen:', err);
      });
    }
    setIsFullScreen(true);
  }, []);

  const exitFullScreen = useCallback(() => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }
    setIsFullScreen(false);
  }, []);

  const handleExit = useCallback(() => {
    exitFullScreen();
    if (onExit) {
      onExit();
    } else {
      router.back();
    }
  }, [exitFullScreen, onExit, router]);

  const handleSave = useCallback(async () => {
    // TODO: Implement save logic
    console.log('Save page:', pageId);
  }, [pageId]);

  return (
    <PageBuilderProvider pageId={pageId}>
      <FullScreenLayout
        editorMode={editorMode}
        onModeChange={setEditorMode}
        onExit={handleExit}
        onSave={handleSave}
        isFullScreen={isFullScreen}
      />
    </PageBuilderProvider>
  );
}
