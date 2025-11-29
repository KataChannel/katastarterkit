import WorkflowTemplateList from '@/components/workflow/WorkflowTemplateList';

export const metadata = {
  title: 'Workflow - Quản lý quy trình',
  description: 'Quản lý các quy trình nghiệp vụ trong doanh nghiệp',
};

export default function WorkflowPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Workflow
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Quản lý các quy trình nghiệp vụ trong doanh nghiệp
        </p>
      </div>
      <WorkflowTemplateList />
    </div>
  );
}
