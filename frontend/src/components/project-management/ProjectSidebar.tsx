'use client';

import React, { useState, useEffect } from 'react';
import { useMyProjects } from '@/hooks/useProjects.dynamic';
import { Plus, Archive, Users, MessageSquare, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CreateProjectModal from './CreateProjectModal';

interface ProjectSidebarProps {
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export default function ProjectSidebar({
  selectedProjectId,
  onSelectProject,
}: ProjectSidebarProps) {
  const { data, loading, error } = useMyProjects(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering loading state on server
  if (!mounted) {
    return (
      <div className="h-full flex flex-col bg-background border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Projects</h2>
            <Button
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-sm text-destructive">Failed to load projects</p>
      </div>
    );
  }

  const projects = data?.myProjects || [];

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {projects.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-muted-foreground text-sm mb-4">
                No projects yet
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            </div>
          ) : (
            projects.map((project: any) => (
              <ProjectItem
                key={project.id}
                project={project}
                isSelected={project.id === selectedProjectId}
                onClick={() => onSelectProject(project.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

// ==================== Project Item Component ====================

interface ProjectItemProps {
  project: any;
  isSelected: boolean;
  onClick: () => void;
}

function ProjectItem({ project, isSelected, onClick }: ProjectItemProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'P';
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 rounded-lg text-left transition-colors
        ${
          isSelected
            ? 'bg-primary/10 border border-primary'
            : 'hover:bg-accent border border-transparent'
        }
      `}
    >
      {/* Project Header */}
      <div className="flex items-start gap-3 mb-2">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={project.avatar} />
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            {project.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{project.name}</h3>
          {project.description && (
            <p className="text-xs text-muted-foreground truncate">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CheckSquare className="h-3 w-3" />
          <span>{project._count?.tasks || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          <span>{project._count?.chatMessages || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{project.members?.length || 0}</span>
        </div>
      </div>

      {/* Role Badge */}
      {project.members?.find((m: any) => m.role === 'owner') && (
        <Badge variant="secondary" className="mt-2 text-xs">
          {project.members.find((m: any) => m.role === 'owner')?.role}
        </Badge>
      )}

      {/* Archived Badge */}
      {project.isArchived && (
        <Badge variant="outline" className="mt-2 text-xs">
          <Archive className="h-3 w-3 mr-1" />
          Archived
        </Badge>
      )}
    </button>
  );
}
