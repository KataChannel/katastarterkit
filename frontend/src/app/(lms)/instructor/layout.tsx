import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      {children}
    </ProtectedRoute>
  );
}
