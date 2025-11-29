import { Loader2 } from 'lucide-react';

export default function WorkflowLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang tải workflow...</p>
      </div>
    </div>
  );
}
