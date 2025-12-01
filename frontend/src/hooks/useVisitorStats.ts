'use client';

import { useQuery } from '@apollo/client';
import { 
  GET_VISITOR_STATS, 
  GET_REALTIME_USERS, 
  GetVisitorStatsResponse,
  GetRealtimeUsersResponse,
  VisitorStats 
} from '@/graphql/analytics.queries';

/**
 * Hook lấy thống kê lượt truy cập từ Google Analytics
 * 
 * @example
 * ```tsx
 * const { stats, loading, error, refetch } = useVisitorStats();
 * 
 * if (loading) return <Loading />;
 * 
 * return (
 *   <div>
 *     <p>Đang online: {stats.realtime}</p>
 *     <p>Hôm nay: {stats.today}</p>
 *     <p>Tháng này: {stats.thisMonth}</p>
 *     <p>Tổng: {stats.total}</p>
 *   </div>
 * );
 * ```
 */
export function useVisitorStats(options?: {
  /** Thời gian tự động refetch (ms). Mặc định: 60000 (1 phút) */
  pollInterval?: number;
  /** Bỏ qua fetch ban đầu */
  skip?: boolean;
}) {
  const { pollInterval = 60000, skip = false } = options || {};

  const { data, loading, error, refetch } = useQuery<GetVisitorStatsResponse>(
    GET_VISITOR_STATS,
    {
      pollInterval,
      skip,
      fetchPolicy: 'cache-and-network',
    }
  );

  const stats: VisitorStats = data?.visitorStats || {
    realtime: 0,
    today: 0,
    thisMonth: 0,
    total: 0,
    isRealData: false,
  };

  return {
    stats,
    realtime: stats.realtime,
    today: stats.today,
    thisMonth: stats.thisMonth,
    total: stats.total,
    isRealData: stats.isRealData,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook chỉ lấy số người đang online (realtime)
 * Sử dụng khi chỉ cần hiển thị realtime visitors
 * 
 * @example
 * ```tsx
 * const { realtimeUsers, loading } = useRealtimeUsers({ pollInterval: 30000 });
 * ```
 */
export function useRealtimeUsers(options?: {
  /** Thời gian tự động refetch (ms). Mặc định: 30000 (30 giây) */
  pollInterval?: number;
  skip?: boolean;
}) {
  const { pollInterval = 30000, skip = false } = options || {};

  const { data, loading, error, refetch } = useQuery<GetRealtimeUsersResponse>(
    GET_REALTIME_USERS,
    {
      pollInterval,
      skip,
      fetchPolicy: 'network-only', // Luôn lấy mới cho realtime
    }
  );

  return {
    realtimeUsers: data?.realtimeUsers || 0,
    loading,
    error,
    refetch,
  };
}

export type { VisitorStats };
