'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, Loader2, AlertCircle } from 'lucide-react';
import { ListViewProps } from './types';
import { useListView } from './useListView';
import { CreateTaskDialog } from './CreateTaskDialog';
import { ListViewToolbar } from './ListViewToolbar';
import { TaskTable } from './TaskTable';
import { ListViewStats } from './ListViewStats';

export function ListView({ projectId }: ListViewProps) {
  const {
    // Data
    filteredTasks,
    stats,
    loading,
    error,
    
    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    
    // Sorting
    sortField,
    sortOrder,
    toggleSort,
    
    // Create dialog
    isCreateOpen,
    setIsCreateOpen,
    newTask,
    setNewTask,
    isSubmitting,
    
    // Actions
    handleCreateTask,
    handleDeleteTask,
    handleStatusChange,
    exportToCSV,
    refetch,
  } = useListView(projectId);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="font-medium">Không thể tải danh sách tasks</p>
            <p className="text-sm mt-1">{error.message}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <List className="w-5 h-5 sm:w-6 sm:h-6" />
            Danh sách Tasks
          </h2>
          <p className="text-sm text-muted-foreground">
            {stats.filtered} / {stats.total} tasks
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <ListViewToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onCreateClick={() => setIsCreateOpen(true)}
        onExportCSV={exportToCSV}
      />

      {/* Task Table/List */}
      <Card>
        <CardContent className="p-0">
          <TaskTable
            tasks={filteredTasks}
            sortField={sortField}
            sortOrder={sortOrder}
            onToggleSort={toggleSort}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
        </CardContent>
      </Card>

      {/* Stats Footer */}
      <ListViewStats
        pending={stats.pending}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      {/* Create Dialog */}
      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        newTask={newTask}
        onTaskChange={setNewTask}
        onSubmit={handleCreateTask}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
