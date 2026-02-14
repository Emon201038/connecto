import { users } from "./../../../lib/dummy-data";
import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    kpiData: build.query<
      {
        engagementRate: number;
        dailyActiveUsers: number;
        totalPosts: number;
        totalUsers: number;
      },
      void
    >({
      query: () => ({
        url: "/",
        method: "POST",
        body: JSON.stringify({
          query: `query GetKpiData { 
              adminDashboardAnalytics {
                kpis {
                  dailyActiveUsers
                  engagementRate
                  totalPosts
                  totalUsers
                }
              }
            }`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: {
          adminDashboardAnalytics: {
            kpis: {
              engagementRate: number;
              dailyActiveUsers: number;
              totalPosts: number;
              totalUsers: number;
            };
          };
        };
      }) => {
        console.log(response, "res");
        return response.data.adminDashboardAnalytics.kpis;
      },
    }),
    demographics: build.query<{ name: string; value: number }[], void>({
      query: () => ({
        url: "/",
        method: "POST",
        body: JSON.stringify({
          query: `query GetDemographics { 
              adminDashboardAnalytics {
                demographics {
                  name
                  value
                }
              }
            }`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: {
          adminDashboardAnalytics: {
            demographics: {
              name: string;
              value: number;
            }[];
          };
        };
      }) => response.data.adminDashboardAnalytics.demographics,
    }),
    userGrowth: build.query<
      { month: string; users: number; newUsers: number }[],
      void
    >({
      query: () => ({
        url: "/",
        method: "POST",
        body: JSON.stringify({
          query: `query GetUserGrowth { 
              adminDashboardAnalytics {
                userGrowth {
                  month
                  newUsers
                  users
                }
              }
            }`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: {
          adminDashboardAnalytics: {
            userGrowth: {
              month: string;
              users: number;
              newUsers: number;
            }[];
          };
        };
      }) =>
        response.data.adminDashboardAnalytics.userGrowth.map((item) => {
          return {
            month: item.month,
            users: item.users,
            newUsers: item.newUsers,
          };
        }),
    }),
    weeklyEngagement: build.query<
      { day: string; comments: number; likes: number; shares: number }[],
      void
    >({
      query: () => ({
        url: "/",
        method: "POST",
        body: JSON.stringify({
          query: `query GetWeeklyEngagement { 
              adminDashboardAnalytics {
                weeklyEngagement {
                  comments
                  day
                  likes
                  shares
                }
              }
            }`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: {
          adminDashboardAnalytics: {
            weeklyEngagement: {
              day: string;
              comments: number;
              likes: number;
              shares: number;
            }[];
          };
        };
      }) =>
        response.data.adminDashboardAnalytics.weeklyEngagement.map((item) => {
          return {
            day: item.day,
            comments: item.comments,
            likes: item.likes,
            shares: item.shares,
          };
        }),
    }),
  }),
});

export const {
  useKpiDataQuery,
  useDemographicsQuery,
  useUserGrowthQuery,
  useWeeklyEngagementQuery,
} = adminApi;
