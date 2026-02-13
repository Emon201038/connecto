import { IResolverContext } from "../../types/graphql";
import { AnalyticsService } from "./analytics.service";
import { GraphQLError } from "graphql";

export const analyticsResolver = {
  Query: {
    adminDashboardAnalytics: async (
      _: unknown,
      __: unknown,
      ctx: IResolverContext,
    ) => {
      if (!ctx.user || ctx.user.role !== "ADMIN") {
        throw new GraphQLError("Unauthorized");
      }

      const [kpis, userGrowth, weeklyEngagement, demographics] =
        await Promise.all([
          AnalyticsService.getKpis(),
          AnalyticsService.getUserGrowth(),
          AnalyticsService.getWeeklyEngagement(),
          AnalyticsService.getDemographics(),
        ]);

      return {
        kpis,
        userGrowth,
        weeklyEngagement,
        demographics,
      };
    },
  },
};
