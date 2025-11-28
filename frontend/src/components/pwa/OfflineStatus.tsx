'use client';

import React, { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { offlineDataService } from '../../services/offlineDataService';
import { WifiOff, RefreshCw, Clock, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineStatusProps {
  className?: string;
  position?: 'top' | 'bottom';
  showSyncStatus?: boolean;
}

export function OfflineStatus({ 
  className = '', 
  position = 'top',
  showSyncStatus = true 
}: OfflineStatusProps) {
  const [isOnline, setIsOnline] = useState(() => 
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const { capabilities } = usePWA();

  // Monitor online status
  useEffect(() => {
    // Set initial online status on client mount
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitor pending actions and sync status
  useEffect(() => {
    const updateStatus = async () => {
      try {
        const actions = await offlineDataService.getPendingActions();
        setPendingActions(actions.length);
        
        const syncStatus = await offlineDataService.getSyncStatus();
        setIsSyncing(false); // We'll handle syncing state separately
        if (syncStatus.lastSync > 0) {
          setLastSyncTime(new Date(syncStatus.lastSync));
        }
      } catch (error) {
        console.error('Failed to get offline status:', error);
      }
    };

    updateStatus();

    // Poll for status updates
    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingActions > 0 && !isSyncing) {
      // Trigger background sync through service worker
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          return (registration as any).sync.register('background-sync');
        }).catch(console.error);
      }
    }
  }, [isOnline, pendingActions, isSyncing]);

  const positionClasses = {
    top: 'top-4',
    bottom: 'bottom-4'
  };

  // Don't show anything if online and no pending actions
  if (isOnline && pendingActions === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className={`
      fixed ${positionClasses[position]} right-4 z-40
      ${className}
    `}>
      <AnimatePresence mode="wait">
        {/* Offline Indicator */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="
              bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-2
              shadow-lg backdrop-blur-sm
            "
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-yellow-800">
                  Bạn đang offline
                </p>
                <p className="text-xs text-yellow-600 mt-0.5">
                  Thay đổi sẽ được đồng bộ khi có mạng
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sync Status */}
        {showSyncStatus && (isSyncing || pendingActions > 0) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="
              bg-blue-50 border border-blue-200 rounded-xl px-4 py-3
              shadow-lg backdrop-blur-sm
            "
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isSyncing ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">
                      {pendingActions}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {isSyncing ? (
                  <>
                    <p className="text-sm font-medium text-blue-800">
                      Đang đồng bộ...
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      {pendingActions} thay đổi đang chờ
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-orange-800">
                      {pendingActions} thay đổi chờ đồng bộ
                    </p>
                    <p className="text-xs text-orange-600 mt-0.5">
                      {isOnline ? 'Sẽ tự động đồng bộ' : 'Đang chờ kết nối'}
                    </p>
                  </>
                )}
              </div>

              {/* Manual sync button */}
              {isOnline && pendingActions > 0 && !isSyncing && (
                <button
                  onClick={() => {
                    // Trigger manual sync through service worker
                    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
                      navigator.serviceWorker.ready.then(registration => {
                        return (registration as any).sync.register('background-sync');
                      }).catch(console.error);
                    }
                  }}
                  className="
                    p-2 rounded-lg text-blue-600 hover:bg-blue-100 
                    focus:outline-none transition-colors
                  "
                  title="Đồng bộ ngay"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Last sync time */}
        {showSyncStatus && isOnline && lastSyncTime && pendingActions === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="
              bg-green-50 border border-green-200 rounded-xl px-4 py-2 mt-2
              shadow-lg backdrop-blur-sm
            "
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-600">
                  Đồng bộ lúc: {formatSyncTime(lastSyncTime)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Format sync time for display
function formatSyncTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) { // Less than 1 minute
    return 'Vừa xong';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes} phút trước`;
  } else if (diff < 86400000) { // Less than 1 day
    const hours = Math.floor(diff / 3600000);
    return `${hours} giờ trước`;
  } else {
    return date.toLocaleDateString('vi-VN');
  }
}

// Compact offline indicator for mobile
export function CompactOfflineStatus({ className = '' }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [pendingActions, setPendingActions] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updatePendingActions = async () => {
      try {
        const actions = await offlineDataService.getPendingActions();
        setPendingActions(actions.length);
      } catch (error) {
        console.error('Failed to get pending actions:', error);
      }
    };

    updatePendingActions();
    const interval = setInterval(updatePendingActions, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline && pendingActions === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!isOnline && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-100 rounded-full">
          <WifiOff className="w-3 h-3 text-yellow-600" />
          <span className="text-xs text-yellow-700 font-medium">Offline</span>
        </div>
      )}
      
      {pendingActions > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 rounded-full">
          <Clock className="w-3 h-3 text-orange-600" />
          <span className="text-xs text-orange-700 font-medium">
            {pendingActions} chờ
          </span>
        </div>
      )}
    </div>
  );
}