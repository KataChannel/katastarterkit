import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

// Test Queries
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      refresh_token
      user {
        id
        username
        email
      }
    }
  }
`;

const GET_TASKS_QUERY = gql`
  query GetTasks($filters: TaskFilterInput) {
    getTasks(filters: $filters) {
      id
      title
      description
      category
      priority
      status
      dueDate
      createdAt
      updatedAt
      userId
      author {
        id
        username
        firstName
        lastName
        avatar
      }
    }
  }
`;

const TestGraphQLPage: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [loginInput, setLoginInput] = useState({
    username: 'admin',
    password: 'admin123'
  });

  const [login, { loading: loginLoading, error: loginError, data: loginData }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const accessToken = data.login.access_token;
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const { data: tasksData, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useQuery(GET_TASKS_QUERY, {
    skip: !token,
    context: {
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    },
    onCompleted: (data) => {
      console.log('Tasks query successful:', data);
    },
    onError: (error) => {
      console.error('Tasks query error:', error);
    }
  });

  const handleLogin = () => {
    login({
      variables: {
        input: loginInput
      }
    });
  };

  const handleTestTasks = () => {
    if (!token) {
      alert('Please login first');
      return;
    }
    refetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">GraphQL API Test</h1>

        {/* Login Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Test Login</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Username"
              value={loginInput.username}
              onChange={(e) => setLoginInput(prev => ({ ...prev, username: e.target.value }))}
              className="border rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginInput.password}
              onChange={(e) => setLoginInput(prev => ({ ...prev, password: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
          
          {loginError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              <strong>Login Error:</strong> {loginError.message}
            </div>
          )}
          
          {loginData && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              <strong>Login Success:</strong> Token received for user {loginData.login.user.username}
            </div>
          )}
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Test Get Tasks</h2>
          
          <div className="mb-4">
            <button
              onClick={handleTestTasks}
              disabled={tasksLoading || !token}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {tasksLoading ? 'Loading Tasks...' : 'Get Tasks'}
            </button>
          </div>

          {!token && (
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded">
              Please login first to test tasks query
            </div>
          )}
          
          {tasksError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              <strong>Tasks Error:</strong> {tasksError.message}
              <details className="mt-2">
                <summary>Error Details</summary>
                <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(tasksError, null, 2)}</pre>
              </details>
            </div>
          )}
          
          {tasksData && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
              <strong>Tasks Success:</strong> Found {tasksData.getTasks.length} tasks
              <details className="mt-2">
                <summary>Tasks Data</summary>
                <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded">
                  {JSON.stringify(tasksData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Current State */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Token:</strong> {token ? 'Set' : 'Not set'}</div>
            <div><strong>Login Status:</strong> {loginData ? 'Logged in' : 'Not logged in'}</div>
            <div><strong>Tasks Status:</strong> {tasksData ? `${tasksData.getTasks.length} tasks loaded` : 'No tasks loaded'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestGraphQLPage;
