'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TodosPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Todos</h1>
            <p className="text-gray-600">This is the todos page. You can implement your todo list component here.</p>
            
            {/* Placeholder for todo components */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                Add your todo list components here. You can create components like:
              </p>
              <ul className="mt-2 text-blue-700 list-disc list-inside">
                <li>TodoList component</li>
                <li>CreateTodo component</li>
                <li>TodoFilters component</li>
                <li>TodoStats component</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
