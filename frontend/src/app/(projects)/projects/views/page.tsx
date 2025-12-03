'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2,
  LayoutDashboard,
  List,
  Kanban,
  Calendar,
  Target,
  Zap,
  GanttChart,
  Map,
  FolderKanban,
} from 'lucide-react';

// Import all view components
import {
  SprintView,
  RoadmapView,
  BacklogView,
  KanbanView,
  TimelineView,
  CalendarView,
  ListView,
  DashboardView,
} from '@/components/project-management/views';

// GraphQL Query
const GET_USER_PROJECTS = gql`
  query GetUserProjects {
    myProjects {
      id
      name
      methodology
      status
    }
  }
`;

type ViewType = 'dashboard' | 'list' | 'kanban' | 'timeline' | 'calendar' | 'backlog' | 'sprint' | 'roadmap';

const viewConfig: Record<ViewType, { 
  icon: any; 
  label: string; 
  methodologies: string[];
  description: string;
}> = {
  dashboard: {
    icon: LayoutDashboard,
    label: 'Dashboard',
    methodologies: ['ALL'],
    description: 'Tổng quan nhanh',
  },
  list: {
    icon: List,
    label: 'Danh sách',
    methodologies: ['ALL'],
    description: 'Chi tiết, báo cáo, export',
  },
  kanban: {
    icon: Kanban,
    label: 'Kanban',
    methodologies: ['KANBAN', 'AGILE', 'HYBRID', 'LEAN'],
    description: 'Theo dõi luồng công việc',
  },
  timeline: {
    icon: GanttChart,
    label: 'Timeline',
    methodologies: ['WATERFALL', 'HYBRID'],
    description: 'Gantt chart, phụ thuộc',
  },
  calendar: {
    icon: Calendar,
    label: 'Lịch',
    methodologies: ['ALL'],
    description: 'Deadline, sự kiện',
  },
  backlog: {
    icon: Target,
    label: 'Backlog',
    methodologies: ['SCRUM', 'AGILE', 'XP'],
    description: 'Grooming, prioritization',
  },
  sprint: {
    icon: Zap,
    label: 'Sprint',
    methodologies: ['SCRUM', 'AGILE', 'XP'],
    description: 'Quản lý sprint',
  },
  roadmap: {
    icon: Map,
    label: 'Roadmap',
    methodologies: ['ALL'],
    description: 'Chiến lược dài hạn',
  },
};

function ProjectViewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  // Get projects
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_USER_PROJECTS, {
    skip: !isAuthenticated,
    fetchPolicy: 'network-only',
  });

  const projects = projectsData?.myProjects || [];
  const selectedProject = projects.find((p: any) => p.id === selectedProjectId);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Set initial project from URL or first project
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('project');
    const viewFromUrl = searchParams.get('view') as ViewType;
    
    if (projectIdFromUrl) {
      setSelectedProjectId(projectIdFromUrl);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }

    if (viewFromUrl && viewConfig[viewFromUrl]) {
      setActiveView(viewFromUrl);
    }
  }, [projects, searchParams, selectedProjectId]);

  // Get available views based on project methodology
  const getAvailableViews = () => {
    const methodology = selectedProject?.methodology || 'CUSTOM';
    
    return (Object.entries(viewConfig) as [ViewType, typeof viewConfig[ViewType]][])
      .filter(([_, config]) => 
        config.methodologies.includes('ALL') || 
        config.methodologies.includes(methodology)
      );
  };

  // Render active view
  const renderView = () => {
    if (!selectedProjectId) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <FolderKanban className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chọn dự án để xem</p>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView projectId={selectedProjectId} />;
      case 'list':
        return <ListView projectId={selectedProjectId} />;
      case 'kanban':
        return <KanbanView projectId={selectedProjectId} />;
      case 'timeline':
        return <TimelineView projectId={selectedProjectId} />;
      case 'calendar':
        return <CalendarView projectId={selectedProjectId} />;
      case 'backlog':
        return <BacklogView projectId={selectedProjectId} />;
      case 'sprint':
        return <SprintView projectId={selectedProjectId} />;
      case 'roadmap':
        return <RoadmapView projectId={selectedProjectId} />;
      default:
        return <DashboardView projectId={selectedProjectId} />;
    }
  };

  if (isLoading || projectsLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const availableViews = getAvailableViews();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Project Selector */}
          <div className="flex items-center gap-3">
            <FolderKanban className="w-5 h-5 text-muted-foreground" />
            <Select
              value={selectedProjectId || ''}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-[200px] lg:w-[250px]">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({project.methodology})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Methodology Badge */}
          {selectedProject && (
            <div className="text-sm text-muted-foreground">
              Phương pháp: <span className="font-medium">{selectedProject.methodology}</span>
            </div>
          )}
        </div>
      </div>

      {/* View Tabs - Mobile Horizontal Scroll, Desktop Full */}
      <div className="border-b">
        <Tabs
          value={activeView}
          onValueChange={(v) => setActiveView(v as ViewType)}
          className="w-full"
        >
          <TabsList className="w-full justify-start h-auto p-1 overflow-x-auto flex-nowrap">
            {availableViews.map(([viewKey, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger
                  key={viewKey}
                  value={viewKey}
                  className="gap-2 px-3 py-2 whitespace-nowrap flex-shrink-0"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        {renderView()}
      </div>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function ProjectViewsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    }>
      <ProjectViewsPage />
    </Suspense>
  );
}
