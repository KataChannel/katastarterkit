'use client';

import React, { useState } from 'react';
import ProjectSidebar from '@/components/project-management/ProjectSidebar';
import TaskFeed from '@/components/project-management/TaskFeed';
import ChatPanel from '@/components/project-management/ChatPanel';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Left Sidebar - Projects List */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out border-r",
          showSidebar 
            ? "w-full sm:w-80 lg:w-[350px]" 
            : "w-0"
        )}
      >
        <div className={cn(
          "h-full overflow-hidden",
          !showSidebar && "hidden"
        )}>
          <ProjectSidebar
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />
        </div>
      </div>

      {/* Center - Task Feed */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Feed Header with Toggle Buttons */}
        <div className="h-12 border-b flex items-center justify-between px-4 bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="gap-2"
          >
            {showSidebar ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="hidden sm:inline">Hide Projects</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Show Projects</span>
              </>
            )}
          </Button>

          <div className="text-sm font-medium text-muted-foreground">
            {selectedProjectId ? 'Project Tasks' : 'All Tasks'}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="gap-2"
          >
            {showChat ? (
              <>
                <span className="hidden sm:inline">Hide Chat</span>
                <PanelRightClose className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Show Chat</span>
                <PanelRightOpen className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Task Feed Content */}
        <div className="flex-1 overflow-hidden">
          <TaskFeed projectId={selectedProjectId} />
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out border-l",
          showChat 
            ? "w-full sm:w-80 lg:w-[350px]" 
            : "w-0"
        )}
      >
        <div className={cn(
          "h-full overflow-hidden",
          !showChat && "hidden"
        )}>
          <ChatPanel projectId={selectedProjectId} />
        </div>
      </div>
    </div>
  );
}
