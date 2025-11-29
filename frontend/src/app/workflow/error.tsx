'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkflowError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Workflow error:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Đã xảy ra lỗi
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {error.message || 'Không thể tải workflow. Vui lòng thử lại sau.'}
        </p>
        <Button onClick={reset}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      </div>
    </div>
  );
}
