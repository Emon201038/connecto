import { GraphQLError } from "graphql";
import { GroupService } from "./group.service";
import { GroupMembership } from "./group-membership.model";
import { IResolverContext } from "../../types/graphql";
import { IGroup } from "./group.interface";
import User from "../user/user.model";
import { Group } from "./group.model";

export default {
  Query: {
    async groups(
      _: any,
      {
        limit = 15,
        page = 1,
        search,
      }: { limit: number; page: number; search: string },
    ) {
      const res = await GroupService.getGroups({
        limit: limit.toString(),
        page: page.toString(),
        search,
      } as Record<string, string>);
      return res;
    },
    async groupById(_: any, { id }: { id: string }) {
      return GroupService.getGroupById(id);
    },

    async groupBySlug(_: any, { slug }: { slug: string }) {
      return GroupService.getGroupBySlug(slug);
    },

    async myGroups(
      _: any,
      {
        limit = 20,
        page = 1,
        search = "",
      }: { limit: number; page: number; search: string },
      ctx: IResolverContext,
    ) {
      const userId = ctx.user?.id;
      if (!userId) throw new GraphQLError("Unauthorized");

      return GroupService.getMyGroups(userId, limit, page, search);
    },

    async groupMembers(_: any, { groupId, limit = 20, cursor }: any) {
      const after = cursor
        ? new Date(Buffer.from(cursor, "base64").toString("utf8"))
        : null;

      const members = await GroupMembership.find({
        group: groupId,
        ...(after ? { createdAt: { $lt: after } } : {}),
      })
        .sort()
        .limit(limit + 1)
        .lean();

      return members.slice(0, limit).map((m) => ({ ...m, id: m._id }));
    },

    async groupFeed(
      _: any,
      { limit = 20, page = 1 }: { page: number; limit: number },
      context: IResolverContext,
    ) {
      if (!context.user) throw new GraphQLError("Unauthorized");
      return GroupService.getGroupFeed(context.user.id, limit, page);
    },

    async groupPosts(
      _: any,
      {
        groupId,
        limit = 20,
        page = 1,
      }: { page: number; limit: number; groupId: string },
      context: IResolverContext,
    ) {
      if (!context.user) throw new GraphQLError("Unauthorized");
      return GroupService.getGroupPosts(groupId, limit, page);
    },
  },

  Group: {
    joined: async (parent: IGroup, _: any, context: IResolverContext) => {
      const membership = await GroupMembership.findOne({
        group: parent._id,
        user: context.user?.id,
      }).select("_id");

      return !!membership;
    },
  },

  GroupMembership: {
    user: async (parent: any, _: any, context: IResolverContext) => {
      return await User.findById(parent.user).lean();
    },
    group: async (parent: any, _: any, context: IResolverContext) => {
      return await Group.findById(parent.group).lean();
    },
  },

  Mutation: {
    async createGroup(
      _: any,
      { input }: { input: { name: string; privacy: string } },
      ctx: IResolverContext,
    ) {
      const userId = ctx.user?.id;
      if (!userId) throw new GraphQLError("Unauthorized");

      return GroupService.createGroup(input, userId);
    },

    async joinGroup(_: any, { groupId }: any, ctx: any) {
      const userId = ctx.user?.id;
      if (!userId) throw new GraphQLError("Unauthorized");

      const res = await GroupService.joinGroup(groupId, userId);
      console.log(res);
      return res;
    },

    async leaveGroup(_: any, { groupId }: any, ctx: any) {
      const userId = ctx.user?.id;
      if (!userId) throw new GraphQLError("Unauthorized");

      return GroupService.leaveGroup(groupId, userId);
    },
  },
};
