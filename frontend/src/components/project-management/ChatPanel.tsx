'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatPanelProps {
  projectId: string | null;
}

export default function ChatPanel({ projectId }: ChatPanelProps) {
  if (!projectId) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-xs px-4">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Select a project to view chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Project Chat
        </h3>
      </div>

      {/* Chat Area - MVP 3 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-xs px-4">
          <div className="text-4xl mb-3">💬</div>
          <h4 className="font-medium mb-2">Coming Soon</h4>
          <p className="text-sm text-muted-foreground">
            Real-time chat will be available in MVP 3
          </p>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              🚀 Week 6-7: Socket.io implementation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
