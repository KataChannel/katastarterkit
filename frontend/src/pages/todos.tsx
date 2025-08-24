import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { 
  CalendarDaysIcon,
  ShareIcon,
  BellIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import ProtectedRoute from '../components/ProtectedRoute';
import TaskList from '../components/todos/TaskList';
import { useTaskSubscriptions } from '../hooks/useTodos';

type TabType = 'my-tasks' | 'shared-tasks' | 'dashboard';

const TodosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('my-tasks');
  const { newTasks, updatedTasks } = useTaskSubscriptions();

  const tabs = [
    {
      id: 'my-tasks' as TabType,
      name: 'Tasks của tôi',
      icon: CalendarDaysIcon,
      count: 0,
    },
    {
      id: 'shared-tasks' as TabType,
      name: 'Tasks chia sẻ',
      icon: ShareIcon,
      count: 0,
    },
    {
      id: 'dashboard' as TabType,
      name: 'Tổng quan',
      icon: Squares2X2Icon,
      count: 0,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Todo Management - KataCore</title>
          <meta name="description" content="Quản lý công việc và dự án hiệu quả" />
        </Head>

        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Todo Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Quản lý công việc và dự án một cách hiệu quả
                </p>
              </div>

              {/* Notifications */}
              <div className="flex items-center space-x-4">
                {(newTasks.length > 0 || updatedTasks.length > 0) && (
                  <div className="relative">
                    <BellIcon className="w-6 h-6 text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {newTasks.length + updatedTasks.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.count > 0 && (
                      <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'my-tasks' && (
            <TaskList />
          )}

          {activeTab === 'shared-tasks' && (
            <TaskList showSharedTasks={true} />
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tổng quan Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Statistics Cards */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">Tổng tasks</p>
                      <p className="text-2xl font-semibold text-blue-900">--</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-600">Đang thực hiện</p>
                      <p className="text-2xl font-semibold text-yellow-900">--</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Hoàn thành</p>
                      <p className="text-2xl font-semibold text-green-900">--</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-600">Quá hạn</p>
                      <p className="text-2xl font-semibold text-red-900">--</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thống kê theo thời gian
                </h3>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Biểu đồ thống kê sẽ được thêm vào sau</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TodosPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
