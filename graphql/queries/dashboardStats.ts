import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch various dashboard statistics.
 */
export const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats {
    dashboardStats {
      activeUsers
      suspendedUsers
      restrictedUsers
      inactiveUsers

      totalUsers
      userGrowth

      totalConnections
      totalMessages

      totalEvents
      eventStats

      totalCircles

      pendingReports
      totalReports

      revenueStats
    }
  }
`;
