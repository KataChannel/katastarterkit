import WorkflowInstanceView from '@/components/workflow/WorkflowInstanceView';

export const metadata = {
  title: 'Chi tiết Workflow',
  description: 'Xem chi tiết và quản lý workflow instance',
};

interface WorkflowInstancePageProps {
  params: {
    id: string;
  };
}

export default function WorkflowInstancePage({ params }: WorkflowInstancePageProps) {
  return (
    <div className="container mx-auto py-6">
      <WorkflowInstanceView instanceId={params.id} />
    </div>
  );
}
