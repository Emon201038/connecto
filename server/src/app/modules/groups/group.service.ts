import mongoose from "mongoose";
import User from "../user/user.model";
import { Group } from "./group.model";
import { IGroupPostMedia } from "./group.interface";
import { GroupMembership } from "./group-membership.model";
import Post from "../post/post.model";
import { QueryBuilder } from "../../lib/queryBuilder";

const getGroups = async (args: Record<string, string>) => {
  try {
    const builder = new QueryBuilder(Group, args);
    const res = await builder
      .filter()
      .search(["name"])
      .paginate()
      .execWithMeta();
    return { groups: res.data, meta: res.meta };
  } catch (error) {
    throw error;
  }
};

const createGroup = async (payload: Partial<any>, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    const group = await Group.create([{ ...payload, createdBy: user._id }], {
      session,
    });

    await GroupMembership.create(
      [
        {
          group: group[0]._id,
          user: user._id,
          role: "ADMIN",
          joinedAt: new Date(),
        },
      ],
      { session },
    );

    await Group.updateOne(
      { _id: group[0]._id },
      { $inc: { memberCount: 1 } },
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    return group[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const joinGroup = async (groupId: string, userId: string) => {
  const existing = await GroupMembership.findOne({
    group: groupId,
    user: userId,
  });
  if (existing) return existing;

  const membership = await GroupMembership.create({
    group: groupId,
    user: userId,
    role: "MEMBER",
    joinedAt: new Date(),
  });

  await Group.updateOne({ _id: groupId }, { $inc: { memberCount: 1 } });
  return membership;
};

const leaveGroup = async (groupId: string, userId: string) => {
  const removed = await GroupMembership.findOneAndDelete({
    group: groupId,
    user: userId,
  });
  if (removed)
    await Group.updateOne({ _id: groupId }, { $inc: { memberCount: -1 } });
  return true;
};

// Fetch posts in a group (cursor-based pagination)
const getGroupFeed = async (userId: string, limit = 20, page = 1) => {
  const memberships = await GroupMembership.find({ user: userId }).select(
    "group",
  );

  console.log(memberships);
  const groupIds = memberships.map((m) => m.group);

  const posts = await Post.find({
    group: { $in: groupIds },
    isDeleted: false,
  })
    .sort()
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPosts = await Post.countDocuments({
    group: { $in: groupIds },
    isDeleted: false,
  });

  return {
    meta: {
      total: totalPosts,
      page,
      limit,
      totalPage: Math.ceil(totalPosts / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(totalPosts / limit) ? page + 1 : null,
    },
    posts,
  };
};

// New helper: get group by ID
const getGroupById = async (groupId: string) => {
  const group = await Group.findById(groupId).lean();
  if (!group) throw new Error("Group not found");
  return { ...group, id: group._id };
};

// New helper: get group by slug
const getGroupBySlug = async (slug: string) => {
  const group = await Group.findOne({ slug }).lean();
  if (!group) throw new Error("Group not found");
  return { ...group, id: group._id };
};

// New helper: get groups the user is a member of
const getMyGroups = async (
  userId: string,
  limit = 20,
  page = 1,
  search = "",
) => {
  const memberships = await GroupMembership.find({
    user: userId,
  }).sort();

  const groupIds = memberships.map((m) => m.group);
  const groups = await Group.find({ _id: { $in: groupIds } })
    .sort()
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    meta: {
      total: groups.length,
      page,
      limit,
      totalPage: Math.ceil(groups.length / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(groups.length / limit) ? page + 1 : null,
    },
    groups,
  };
};

const getGroupPosts = async (groupId: string, limit = 20, page = 1) => {
  const posts = await Post.find({ group: groupId, isDeleted: false })
    .sort()
    .skip((page - 1) * limit)
    .limit(limit);
  const totalPosts = await Post.countDocuments({
    group: groupId,
    isDeleted: false,
  });
  return {
    meta: {
      total: totalPosts,
      page,
      limit,
      totalPage: Math.ceil(totalPosts / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(totalPosts / limit) ? page + 1 : null,
    },
    posts,
  };
};

export const GroupService = {
  createGroup,
  getGroups,
  joinGroup,
  leaveGroup,
  getGroupFeed,
  getGroupById,
  getGroupBySlug,
  getMyGroups,
  getGroupPosts,
};
