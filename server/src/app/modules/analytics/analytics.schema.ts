export const analyticsSchema = `#graphql
  type DashboardKpi {
    totalUsers: Int!
    dailyActiveUsers: Int!
    totalPosts: Int!
    engagementRate: Float!
  }

  type UserGrowth {
    month: String!
    users: Int!
    newUsers: Int!
  }

  type WeeklyEngagement {
    day: String!
    likes: Int!
    comments: Int!
    shares: Int!
  }

  type Demographics {
    name: String!
    value: Int!
  }

  type DashboardAnalytics {
    kpis: DashboardKpi!
    userGrowth: [UserGrowth!]!
    weeklyEngagement: [WeeklyEngagement!]!
    demographics: [Demographics!]!
  }

  extend type Query {
    adminDashboardAnalytics: DashboardAnalytics!
  }
`;
