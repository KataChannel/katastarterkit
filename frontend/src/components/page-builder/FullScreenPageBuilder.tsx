'use client';

import React, { useState, useCallback } from 'react';
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
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>(initialMode);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    } else {
      router.back();
    }
  }, [onExit, router]);

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
      />
    </PageBuilderProvider>
  );
}
