import { useSubscription } from '@apollo/client';
import { NEW_POST_SUBSCRIPTION } from '../lib/graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useState } from 'react';

export default function TestSubscriptionsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  // Test post subscription
  const { data: postData, error: postError } = useSubscription(
    NEW_POST_SUBSCRIPTION,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        console.log('Post subscription data:', subscriptionData);
        if (subscriptionData?.data?.postCreated) {
          const post = subscriptionData.data.postCreated;
          setEvents(prev => [{
            type: 'Post Created',
            data: post,
            timestamp: new Date().toISOString()
          }, ...prev.slice(0, 9)]); // Keep last 10 events
        }
      },
      onError: (error) => {
        console.error('Post subscription error:', error);
        setEvents(prev => [{
          type: 'Error',
          data: { message: error.message },
          timestamp: new Date().toISOString()
        }, ...prev.slice(0, 9)]);
      }
    }
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Real-time Subscription Test
            </h1>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Connection Status
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    postError ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm">
                    Post Subscription: {postError ? 'Error' : 'Connected'}
                  </span>
                </div>
              </div>
              
              {postError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-red-700 text-sm">
                    Error: {postError.message}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Real-time Events
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                This page will display real-time events when posts are created. 
                Try creating a new post from another tab or browser to see the events.
              </p>
              
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No events yet. Create a post to see real-time updates!
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {events.map((event, index) => (
                      <div key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`font-medium ${
                              event.type === 'Error' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {event.type}
                            </h3>
                            {event.type === 'Post Created' && (
                              <div className="mt-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {event.data.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                  by {event.data.author?.username}
                                </p>
                              </div>
                            )}
                            {event.type === 'Error' && (
                              <p className="text-sm text-red-600 mt-1">
                                {event.data.message}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">How to test:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Keep this page open</li>
                <li>Open another tab and go to the dashboard</li>
                <li>Create a new post</li>
                <li>Watch for real-time updates appearing on this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
