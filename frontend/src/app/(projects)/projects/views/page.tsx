'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Plus,
  MessageSquare,
  CheckSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

// Import all view components
import {
  RoadmapView,
  KanbanView,
  CalendarView,
  ListView,
  DashboardView,
} from '@/components/project-management/views';
import CreateProjectModal from '@/components/project-management/CreateProjectModal';
import ChatPanel from '@/components/project-management/ChatPanel';
import { useFindMany } from '@/hooks/useDynamicGraphQL';

type ViewType = 'dashboard' | 'list' | 'kanban' | 'calendar' | 'roadmap';

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
  calendar: {
    icon: Calendar,
    label: 'Lịch',
    methodologies: ['ALL'],
    description: 'Deadline, sự kiện',
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
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('list');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check authentication first
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr || '{}');
        setUserId(user.id);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[Views] Error parsing user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Get projects - SAME LOGIC AS DASHBOARD
  const { data: projectsData, loading: projectsLoading, refetch } = useFindMany('project', {
    where: userId ? {
      OR: [
        { ownerId: { equals: userId } },
        { members: { some: { userId: { equals: userId } } } }
      ]
    } : undefined,
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      },
      _count: {
        select: {
          tasks: true,
          chatMessages: true,
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  }, { 
    skip: !userId,
    requireAuth: true 
  });

  const projects = projectsData || [];
  const selectedProject = projects.find((p: any) => p.id === selectedProjectId);

  // Debug: Log projects
  useEffect(() => {
    if (projects.length > 0) {
      console.log('[Views] Projects loaded:', projects.length, projects.map((p: any) => p.name));
    }
  }, [projects]);

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
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">Chưa chọn dự án</h3>
            <p className="text-sm">Chọn dự án từ danh sách bên trái để xem</p>
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
      case 'calendar':
        return <CalendarView projectId={selectedProjectId} />;
      case 'roadmap':
        return <RoadmapView projectId={selectedProjectId} />;
      default:
        return <ListView projectId={selectedProjectId} />;
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
    <div className="h-full flex overflow-hidden bg-background">
      {/* ==================== SIDEBAR - Like Facebook Group ====================  */}
      <aside 
        className={`
          flex-shrink-0 border-r bg-muted/20 transition-all duration-300
          ${isSidebarCollapsed ? 'w-0 lg:w-16' : 'w-full lg:w-72'}
          ${isSidebarCollapsed ? 'overflow-hidden' : ''}
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-0
          ${!isSidebarCollapsed ? 'block' : 'hidden lg:block'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-3 border-b flex items-center justify-between">
            {!isSidebarCollapsed && (
              <>
                <h2 className="font-semibold text-sm">Dự án của tôi</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Tạo dự án mới"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 hidden lg:flex"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>

          {/* Projects List */}
          <ScrollArea className="flex-1">
            <div className={`p-2 space-y-1 ${isSidebarCollapsed ? 'items-center' : ''}`}>
              {projects.length === 0 ? (
                !isSidebarCollapsed && (
                  <div className="text-center py-8 px-4">
                    <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Chưa có dự án nào</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo dự án
                    </Button>
                  </div>
                )
              ) : (
                projects.map((project: any) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`
                      rounded-lg cursor-pointer transition-all
                      ${selectedProjectId === project.id 
                        ? 'bg-primary/10 border border-primary shadow-sm' 
                        : 'hover:bg-accent border border-transparent'
                      }
                      ${isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-3'}
                    `}
                  >
                    {isSidebarCollapsed ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {project.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <>
                        <div className="flex items-start gap-3 mb-2">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={project.avatar} />
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {project.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{project.name}</h3>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {project.methodology}
                            </Badge>
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
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-4 left-4 z-50 lg:hidden shadow-lg"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* ==================== MAIN CONTENT ====================  */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Project Header */}
        {selectedProject && (
          <div className="border-b bg-muted/30 p-3 lg:p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 lg:h-12 lg:w-12 flex-shrink-0">
                  <AvatarImage src={selectedProject.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {selectedProject.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="font-semibold text-base lg:text-lg truncate">{selectedProject.name}</h1>
                  <p className="text-xs text-muted-foreground">
                    Phương pháp: {selectedProject.methodology}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Tabs */}
        <div className="border-b px-2 lg:px-4">
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as ViewType)}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-1 bg-transparent overflow-x-auto flex-nowrap">
              {availableViews.map(([viewKey, config]) => {
                const Icon = config.icon;
                return (
                  <TabsTrigger
                    key={viewKey}
                    value={viewKey}
                    className="gap-2 px-3 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
        <div className="flex-1 overflow-auto p-3 lg:p-6">
          {renderView()}
        </div>
      </main>

      {/* ==================== CHAT PANEL - Like Facebook Messenger ==================== */}
      <aside 
        className={`
          flex-shrink-0 border-l bg-background transition-all duration-300
          ${isChatCollapsed ? 'w-0 xl:w-14' : 'hidden xl:block xl:w-80'}
          overflow-hidden
        `}
      >
        <div className="h-full flex flex-col">
          {/* Chat Toggle Header */}
          <div className="p-2 border-b flex items-center justify-between">
            {!isChatCollapsed ? (
              <>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Chat nhóm</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setIsChatCollapsed(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 mx-auto"
                onClick={() => setIsChatCollapsed(false)}
                title="Mở chat"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Chat Content */}
          {!isChatCollapsed && (
            <div className="flex-1 overflow-hidden">
              <ChatPanel projectId={selectedProjectId} />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Chat Button */}
      <Button
        size="icon"
        variant="outline"
        className="fixed bottom-4 right-4 z-50 xl:hidden shadow-lg rounded-full h-12 w-12"
        onClick={() => setIsChatCollapsed(!isChatCollapsed)}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Mobile Chat Panel */}
      {!isChatCollapsed && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsChatCollapsed(true)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-xl">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="font-medium">Chat nhóm</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsChatCollapsed(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[calc(100%-56px)]">
              <ChatPanel projectId={selectedProjectId} />
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) refetch();
        }}
      />
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
