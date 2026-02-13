import Comment from "../comment/comment.model";
import Post from "../post/post.model";
import Reaction from "../reaction/reaction.model";
import User from "../user/user.model";

export class AnalyticsService {
  static async getKpis() {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    /**
     * Run independent queries in parallel
     */
    const [
      totalUsers,
      totalPosts,
      dailyActiveUsers,
      totalReactions,
      reactionUserIds,
      commentUserIds,
      postUserIds,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      User.countDocuments({ lastActiveAt: { $gte: since24h } }),
      Reaction.countDocuments(),
      Reaction.distinct("user"),
      Comment.distinct("author"),
      Post.distinct("author"),
    ]);

    /**
     * Unique engaged users
     */
    const engagedUserSet = new Set<string>();

    reactionUserIds.forEach((id) => engagedUserSet.add(String(id)));
    commentUserIds.forEach((id) => engagedUserSet.add(String(id)));
    postUserIds.forEach((id) => engagedUserSet.add(String(id)));

    const engagedUsers = engagedUserSet.size;

    /**
     * KPI calculations (SAFE)
     */
    const engagementRate =
      totalUsers > 0
        ? Number(((engagedUsers / totalUsers) * 100).toFixed(2))
        : 0;

    const activityScore =
      totalUsers > 0 ? Number((totalReactions / totalUsers).toFixed(2)) : 0;

    return {
      totalUsers,
      dailyActiveUsers,
      totalPosts,
      engagementRate, // %
      activityScore, // avg reactions per user
    };
  }

  static async getUserGrowth() {
    const now = new Date();

    // 1️⃣ Build last 6 months template
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12
        label: date.toLocaleString("en", { month: "short" }),
        newUsers: 0,
      };
    });

    // 2️⃣ Aggregate users from DB
    const dbData = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(last6Months[0].year, last6Months[0].month - 1, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          newUsers: { $sum: 1 },
        },
      },
    ]);

    // 3️⃣ Map DB results for fast lookup
    const dbMap = new Map<string, number>();
    dbData.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      dbMap.set(key, item.newUsers);
    });

    // 4️⃣ Merge & calculate cumulative users
    let cumulativeUsers = await User.countDocuments({
      createdAt: {
        $lt: new Date(last6Months[0].year, last6Months[0].month - 1, 1),
      },
    });

    return last6Months.map((item) => {
      const key = `${item.year}-${item.month}`;
      const newUsers = dbMap.get(key) ?? 0;

      cumulativeUsers += newUsers;

      return {
        month: item.label,
        users: cumulativeUsers,
        newUsers,
      };
    });
  }

  static async getWeeklyEngagement() {
    const reactions = await Reaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          likes: {
            $sum: { $cond: [{ $eq: ["$type", "LIKE"] }, 1, 0] },
          },
          shares: {
            $sum: { $cond: [{ $eq: ["$type", "SHARE"] }, 1, 0] },
          },
        },
      },
    ]);

    const comments = await Comment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          comments: { $sum: 1 },
        },
      },
    ]);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days.map((day, index) => {
      const reactionDay = reactions.find((r) => r._id === index + 1);
      const commentDay = comments.find((c) => c._id === index + 1);

      return {
        day,
        likes: reactionDay?.likes || 0,
        shares: reactionDay?.shares || 0,
        comments: commentDay?.comments || 0,
      };
    });
  }

  static async getDemographics() {
    const now = new Date();

    const data = await User.aggregate([
      /**
       * Step 1: Calculate age
       */
      {
        $addFields: {
          age: {
            $dateDiff: {
              startDate: "$dateOfBirth",
              endDate: now,
              unit: "year",
            },
          },
        },
      },

      /**
       * Step 2: Bucket by age ranges
       */
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [18, 25, 35, 45, 55, 100],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    /**
     * Step 3: Normalize response for frontend
     */
    const labelsMap: Record<string, string> = {
      "18": "18-24",
      "25": "25-34",
      "35": "35-44",
      "45": "45-54",
      "55": "55+",
      Other: "Other",
    };

    return data.map((item) => ({
      name: labelsMap[String(item._id)] ?? "Other",
      value: item.count,
    }));
  }
}
