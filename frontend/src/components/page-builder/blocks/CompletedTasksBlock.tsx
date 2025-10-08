'use client';

import { useQuery, gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar, User } from 'lucide-react';
import { CompletedTasksBlockContent } from '@/types/page-builder';

// GraphQL Query to fetch completed tasks
const GET_COMPLETED_TASKS = gql`
  query GetCompletedTasks($page: Int!, $limit: Int!) {
    getTasksPaginated(
      page: $page
      limit: $limit
      filters: { status: COMPLETED }
    ) {
      data {
        id
        title
        description
        status
        priority
        dueDate
        userId
        createdAt
        updatedAt
      }
      meta {
        total
        page
        limit
        totalPages
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

interface CompletedTasksBlockProps {
  content: CompletedTasksBlockContent;
  style?: any;
  isEditing?: boolean;
}

export function CompletedTasksBlock({ content, style, isEditing = false }: CompletedTasksBlockProps) {
  const {
    title = 'Completed Tasks',
    subtitle = 'Our recent achievements',
    limit = 10,
    showDate = true,
    showAssignee = true,
    layout = 'list',
    filterByProject,
    sortBy = 'completedDate'
  } = content;

  const { data, loading, error } = useQuery(GET_COMPLETED_TASKS, {
    variables: { page: 1, limit },
    skip: isEditing, // Don't fetch data in editing mode
  });

  if (isEditing) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Tasks Block</h3>
        <p className="text-sm text-gray-500">
          Will display {limit} completed tasks in {layout} layout
        </p>
        {filterByProject && (
          <Badge variant="outline" className="mt-2">
            Filtered by project: {filterByProject}
          </Badge>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center text-red-600">
        <p>Error loading tasks: {error.message}</p>
      </div>
    );
  }

  const tasks = data?.getTasksPaginated?.data || [];
  const totalTasks = data?.getTasksPaginated?.meta?.total || 0;

  if (tasks.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No completed tasks yet</p>
      </div>
    );
  }

  return (
    <section className="w-full py-12 px-4" style={style}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
          <div className="mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {totalTasks} tasks completed
            </Badge>
          </div>
        </div>

        {/* Tasks List/Grid */}
        {layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <Badge 
                      variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {showDate && task.updatedAt && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Completed: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : layout === 'timeline' ? (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {tasks.map((task: any, index: number) => (
                <div key={task.id} className="relative pl-16">
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-green-500 border-4 border-white"></div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle>{task.title}</CardTitle>
                          {task.description && (
                            <CardDescription className="mt-2">{task.description}</CardDescription>
                          )}
                        </div>
                        <Badge 
                          variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {showDate && task.updatedAt && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Completed: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // List layout
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-start space-x-4 flex-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        {showDate && task.updatedAt && (
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Completed: {new Date(task.updatedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center text-gray-400 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={task.priority === 'HIGH' ? 'destructive' : task.priority === 'MEDIUM' ? 'default' : 'secondary'}
                    className="ml-4"
                  >
                    {task.priority}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
