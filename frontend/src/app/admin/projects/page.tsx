'use client';

import React, { useState } from 'react';
import ProjectSidebar from '@/components/project-management/ProjectSidebar';
import TaskFeed from '@/components/project-management/TaskFeed';
import ChatPanel from '@/components/project-management/ChatPanel';

export default function ProjectManagementPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Sidebar - 25% */}
      <div className="w-1/4 min-w-[280px] max-w-[350px]">
        <ProjectSidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
      </div>

      {/* Center Feed - 50% */}
      <div className="flex-1">
        <TaskFeed projectId={selectedProjectId} />
      </div>

      {/* Right Panel - 25% */}
      <div className="w-1/4 min-w-[280px] max-w-[350px]">
        <ChatPanel projectId={selectedProjectId} />
      </div>
    </div>
  );
}
