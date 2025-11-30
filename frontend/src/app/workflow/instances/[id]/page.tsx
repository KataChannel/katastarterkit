'use client';

import { use } from 'react';
import WorkflowInstanceView from '@/components/workflow/WorkflowInstanceView';

interface WorkflowInstancePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function WorkflowInstancePage({ params }: WorkflowInstancePageProps) {
  const { id } = use(params);
  
  return (
    <div className="container mx-auto py-6">
      <WorkflowInstanceView instanceId={id} />
    </div>
  );
}
