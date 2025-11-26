import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FolderTree } from 'lucide-react';

interface BlogTreeHeaderProps {
  onCreateCategory: () => void;
  onCreateBlog: () => void;
}

export function BlogTreeHeader({ onCreateCategory, onCreateBlog }: BlogTreeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <FolderTree className="h-7 w-7" />
          Quản lý Blog & Danh mục
        </h1>
        <p className="text-muted-foreground mt-1">
          Xem và quản lý bài viết theo cấu trúc cây danh mục
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          onClick={onCreateCategory}
          variant="outline"
          className="flex-1 sm:flex-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          Danh mục
        </Button>
        <Button
          onClick={onCreateBlog}
          className="flex-1 sm:flex-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          Bài viết
        </Button>
      </div>
    </div>
  );
}
