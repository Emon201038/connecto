import { Friendship } from "./friend.model";
import { FriendRequestStatus } from "./friend.interface";
import { GraphQLError } from "graphql";
import { Types } from "mongoose";
import User from "../user/user.model";
import { IResolverContext } from "../../types/graphql";
import { FriendService } from "./friend.service";

export const friendResolvers = {
  Query: {
    myFriends: async (
      _: any,
      {
        page = 1,
        limit = 15,
        search = "",
      }: { page: number; limit: number; search: string },
      { user }: any
    ) => {
      return FriendService.myFriends({ page, limit, search }, user);
    },
    pendingRequests: async (
      _: any,
      args: { page: number; limit: number; search: string },
      { user }: IResolverContext
    ) => {
      const res = await FriendService.pendingRequests(args, user);
      return res;
    },
    suggestedUser: async (
      _: any,
      args: { page: number; limit: number; search: string },
      context: IResolverContext
    ) => {
      const res = await FriendService.suggestedUsers(args, context);
      return res;
    },
  },

  Friendship: {
    requester: async (friendship: any) => {
      return await User.findById(friendship.requester);
    },
    recipient: async (friendship: any) => {
      return await User.findById(friendship.recipient);
    },
  },

  Mutation: {
    sendFriendRequest: async (
      _: any,
      { recipientId }: { recipientId: string },
      { user }: any
    ) => {
      if (user.id === recipientId)
        throw new GraphQLError("Cannot send request to yourself");

      const existing = await Friendship.findOne({
        $or: [
          { requester: user.id, recipient: recipientId },
          { requester: recipientId, recipient: user.id },
        ],
      });

      if (existing) throw new GraphQLError("Friend request already exists");

      const request = await Friendship.create({
        requester: user.id,
        recipient: recipientId,
      });

      return request.populate("requester recipient");
    },

    acceptFriendRequest: async (
      _: any,
      { requestId }: { requestId: string },
      { user }: any
    ) => {
      const request = await Friendship.findById(requestId);
      if (!request) throw new GraphQLError("Request not found");
      if (!request.recipient.equals(user.id))
        throw new GraphQLError("Not authorized");

      request.status = FriendRequestStatus.ACCEPTED;
      await request.save();

      return request.populate("requester recipient");
    },

    deleteFriendRequest: async (
      _: any,
      { requestId }: { requestId: string },
      { user }: any
    ) => {
      const request = await Friendship.findById(requestId);
      if (!request) throw new GraphQLError("Request not found");
      if (
        !request.requester.equals(user.id) &&
        !request.recipient.equals(user.id)
      )
        throw new GraphQLError("Not authorized");

      await request.deleteOne();
      return true;
    },

    unfriend: async (
      _: any,
      { friendId }: { friendId: string },
      { user }: any
    ) => {
      const friendship = await Friendship.findOne({
        $or: [
          {
            requester: user.id,
            recipient: friendId,
            status: FriendRequestStatus.ACCEPTED,
          },
          {
            requester: friendId,
            recipient: user.id,
            status: FriendRequestStatus.ACCEPTED,
          },
        ],
      });

      if (!friendship) throw new GraphQLError("Friendship not found");

      await friendship.deleteOne();
      return true;
    },
  },
};
