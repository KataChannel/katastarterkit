import EmployeeOnboardingForm from '@/components/workflow/EmployeeOnboardingForm';

export const metadata = {
  title: 'Checkin Nhân Sự Mới',
  description: 'Tạo hồ sơ và tài khoản cho nhân viên mới',
};

export default function EmployeeOnboardingPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Checkin Nhân Sự Mới
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Quy trình tự động tạo hồ sơ và tài khoản cho nhân viên mới
        </p>
      </div>
      <EmployeeOnboardingForm />
    </div>
  );
}
