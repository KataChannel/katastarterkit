import { gql } from '@apollo/client';

/**
 * Query lấy thống kê lượt truy cập từ Google Analytics
 */
export const GET_VISITOR_STATS = gql`
  query GetVisitorStats {
    visitorStats {
      realtime
      today
      thisMonth
      total
    }
  }
`;

/**
 * Query lấy số người đang online (realtime)
 */
export const GET_REALTIME_USERS = gql`
  query GetRealtimeUsers {
    realtimeUsers
  }
`;

/**
 * Query kiểm tra Analytics đã cấu hình chưa
 */
export const IS_ANALYTICS_CONFIGURED = gql`
  query IsAnalyticsConfigured {
    isAnalyticsConfigured
  }
`;

/**
 * Types cho visitor stats
 */
export interface VisitorStats {
  realtime: number;
  today: number;
  thisMonth: number;
  total: number;
}

export interface GetVisitorStatsResponse {
  visitorStats: VisitorStats;
}

export interface GetRealtimeUsersResponse {
  realtimeUsers: number;
}

export interface IsAnalyticsConfiguredResponse {
  isAnalyticsConfigured: boolean;
}
