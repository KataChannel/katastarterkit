'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PageBuilderEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Dynamic route for /admin/pagebuilder/[id]
 * Redirects to /admin/pagebuilder?pageId={id} to use the dialog-based editor
 */
export default function PageBuilderEditPage({ params }: PageBuilderEditPageProps) {
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Redirect to main pagebuilder page with pageId query param
    // This will trigger the dialog-based full-screen editor
    router.replace(`/admin/pagebuilder?pageId=${id}`);
  }, [id, router]);

  // Show loading state during redirect
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Opening page editor...</p>
      </Card>
    </div>
  );
}
