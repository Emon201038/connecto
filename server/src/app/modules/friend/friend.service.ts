import mongoose from "mongoose";
import { QueryBuilder } from "../../lib/queryBuilder";
import { IResolverContext } from "../../types/graphql";
import User from "../user/user.model";
import { Friendship } from "./friend.model";
import { FriendRequestStatus } from "./friend.interface";
import { IUser } from "../user/user.interface";

const myFriends = async (
  {
    page,
    limit,
    search = "",
    sortBy = "createdAt",
    sortOrder = -1,
  }: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 1 | -1;
  },
  user: IResolverContext["user"]
) => {
  if (!user) throw new Error("Unauthorized");

  const objectId = new mongoose.Types.ObjectId(user.id);
  const skip = (page - 1) * limit;

  const pipeline = [
    // Step 1: Match accepted friendships involving the logged-in user
    {
      $match: {
        status: FriendRequestStatus.ACCEPTED,
        $or: [
          { requester: new mongoose.Types.ObjectId(user.id) },
          { recipient: new mongoose.Types.ObjectId(user.id) },
        ],
      },
    },

    // Step 2: Identify the "other user" in the friendship
    {
      $addFields: {
        friendId: {
          $cond: [
            { $eq: ["$requester", new mongoose.Types.ObjectId(user.id)] },
            "$recipient",
            "$requester",
          ],
        },
      },
    },

    // Step 3: Lookup the friend user document
    {
      $lookup: {
        from: "users",
        localField: "friendId",
        foreignField: "_id",
        as: "friend",
      },
    },

    // Step 4: Unwind the friend array
    { $unwind: "$friend" },

    // Step 5: Apply search (if any)
    ...(search
      ? [
          {
            $match: {
              $or: [
                { "friend.firstName": { $regex: search, $options: "i" } },
                { "friend.lastName": { $regex: search, $options: "i" } },
                { "friend.fullName": { $regex: search, $options: "i" } },
                { "friend.phone": { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),

    // Step 6: Sort by friend field
    { $sort: { [`friend.${sortBy}`]: sortOrder } },

    // Step 7: Facet -> paginate + count
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              friendshipId: "$_id",
              status: 1,
              user: {
                $mergeObjects: [
                  "$friend",
                  { id: "$friend._id" }, // alias _id -> id for GraphQL
                ],
              },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },

    // Step 8: Shape final response
    {
      $project: {
        users: "$data",
        totalResults: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    },
  ];

  const result = await Friendship.aggregate<{
    users: {
      friendshipId: string;
      status: FriendRequestStatus;
      users: IUser[];
    }[];
    totalResults: number;
  }>(pipeline);
  const { users, totalResults } = result[0] || { users: [], totalResults: 0 };

  return {
    users,
    meta: {
      totalResults,
      page,
      limit,
      totalPage: Math.ceil(totalResults / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(totalResults / limit) ? page + 1 : null,
    },
  };
};

const pendingRequests = async (
  args: { page: number; limit: number; search: string },
  user: IResolverContext["user"]
) => {
  try {
    if (!user) throw new Error("Unauthorized");
    const { page, limit, search } = args;

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: {
          recipient: new mongoose.Types.ObjectId(user.id),
          status: FriendRequestStatus.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "requester",
          foreignField: "_id",
          as: "requester",
        },
      },
      { $unwind: "$requester" },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "requester.firstName": { $regex: search, $options: "i" } },
                  { "requester.lastName": { $regex: search, $options: "i" } },
                  { "requester.fullName": { $regex: search, $options: "i" } },
                  { "requester.phone": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      // { $sort: { [`requester.${sortBy}`]: sortOrder } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                friendshipId: "$_id",
                status: 1,
                user: {
                  $mergeObjects: [
                    "$requester", // or "$requester" in pendingRequests
                    { id: "$requester._id" }, // alias _id to id
                  ],
                },
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $project: {
          users: "$data",
          totalResults: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
    ];

    const result = await Friendship.aggregate<{
      users: {
        friendshipId: string;
        status: FriendRequestStatus;
        users: IUser[];
      }[];
      totalResults: number;
    }>(pipeline);
    const { users, totalResults } = result[0] || { users: [], totalResults: 0 };

    return {
      users,
      meta: {
        totalResult: totalResults,
        page,
        limit,
        totalPage: Math.ceil(totalResults / limit),
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < Math.ceil(totalResults / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const suggestedUsers = async (
  args: { page: number; limit: number; search: string },
  ctx: IResolverContext
) => {
  try {
    const userId = ctx.user?.id;
    const { page, limit, search } = args;
    const objectId = new mongoose.Types.ObjectId(userId);

    // 1. Get friends list
    const friends = await Friendship.find({
      $or: [{ requester: objectId }, { recipient: objectId }],
      status: { $in: [FriendRequestStatus.ACCEPTED] },
    });

    const friendIds = friends.flatMap((f) => [
      f.requester.toString(),
      f.recipient.toString(),
    ]);

    // 2. Get pending requests (both sent + received)
    const pending = await Friendship.find({
      $or: [{ requester: objectId }, { recipient: objectId }],
      status: { $in: [FriendRequestStatus.PENDING] },
    }).select("requester recipient");

    const pendingIds = pending.flatMap((f) => [
      f.requester.toString(),
      f.recipient.toString(),
    ]);

    // 3. Combine all excluded IDs
    const excludedIds = [
      objectId.toString(),
      ...friendIds.map((id) => id.toString()),
      ...pendingIds,
    ];

    // 4. Query suggested users
    const suggestions = await User.find({
      _id: { $nin: excludedIds },
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments({
      _id: { $nin: excludedIds },
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    });

    const meta = {
      page,
      limit,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    };

    return { users: suggestions, meta };
  } catch (error) {
    throw error;
  }
};

export const FriendService = { suggestedUsers, myFriends, pendingRequests };
