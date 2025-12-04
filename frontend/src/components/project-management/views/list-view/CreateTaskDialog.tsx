'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewTaskForm, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from './types';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: NewTaskForm;
  onTaskChange: (task: NewTaskForm) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  newTask,
  onTaskChange,
  onSubmit,
  isSubmitting,
}: CreateTaskDialogProps) {
  const [priorityOpen, setPriorityOpen] = React.useState(false);
  const [categoryOpen, setCategoryOpen] = React.useState(false);

  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === newTask.priority);
  const selectedCategory = CATEGORY_OPTIONS.find(c => c.value === newTask.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6 pb-2 border-b shrink-0">
          <DialogTitle>Tạo Task mới</DialogTitle>
          <DialogDescription>
            Thêm công việc mới vào dự án
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              placeholder="Nhập tiêu đề task..."
              value={newTask.title}
              onChange={(e) => onTaskChange({ ...newTask, title: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả chi tiết..."
              rows={3}
              value={newTask.description}
              onChange={(e) => onTaskChange({ ...newTask, description: e.target.value })}
              className="w-full resize-none"
            />
          </div>

          {/* Priority & Category - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Combobox */}
            <div className="space-y-2">
              <Label>Mức ưu tiên</Label>
              <Popover open={priorityOpen} onOpenChange={setPriorityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={priorityOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedPriority?.label || 'Chọn mức ưu tiên...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {PRIORITY_OPTIONS.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              onTaskChange({ ...newTask, priority: option.value });
                              setPriorityOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                newTask.priority === option.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Combobox */}
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between font-normal"
                  >
                    {selectedCategory?.label || 'Chọn danh mục...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {CATEGORY_OPTIONS.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              onTaskChange({ ...newTask, category: option.value });
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                newTask.category === option.value ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-4 pb-4 sm:px-6 sm:pb-6 pt-2 border-t shrink-0 gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Tạo Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
