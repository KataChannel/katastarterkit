import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function TestAuthPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Test
            </h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID:
                </label>
                <p className="mt-1 text-sm text-gray-900">{user?.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username:
                </label>
                <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At:
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <button
                onClick={logout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
