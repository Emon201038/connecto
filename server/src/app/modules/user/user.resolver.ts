import { IResolverContext } from "../../types/graphql";
import User from "./user.model";
import { UserService } from "./user.service";
import { IUser } from "./user.interface";
import { UserRole } from "../../graphql/types";

export const userResolver = {
  Query: {
    user: async (
      parent: any,
      args: { id: string },
      context: IResolverContext,
    ) => {
      const user = await User.findById(args.id);
      return user;
    },
    users: async (
      _: any,
      args: {
        limit: number;
        page: number;
        search: string;
        filter: object;
        sortBy: string;
        sortOrder: string;
      },
      context: IResolverContext,
    ) => {
      console.log(args);
      if (!context.user?.id) throw new Error("Unauthorized");
      return await UserService.getAllUsers(args, context.user?.id as string);
    },
    userByusername: async (
      parent: any,
      args: { username: string },
      context: IResolverContext,
    ) => {
      const user = await User.findOne({ username: args.username });
      return user;
    },
  },
  Mutation: {
    register: async (
      _parent: null,
      args: {
        id: string;
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: Date;
        phone: string;
        bio?: string;
        role: UserRole;
        email: string;
        password: string;
      },
    ) => {
      console.log(args, "args");
      return await UserService.createUser(args);
    },
    updateUser: async (
      _parent: null,
      args: {
        input: {
          id: string;
          firstName: string;
          lastName: string;
          gender: string;
          dateOfBirth: Date;
          phone: string;
          bio?: string;
          role: UserRole;
        };
      },
    ) => {
      return await UserService.updateUser(args.input);
    },
  },
  User: {
    conversation: async (
      parent: IUser,
      args: null,
      context: IResolverContext,
    ) => {
      if (!context.user?.id) throw new Error("Unauthorized");
      return await UserService.getUserConversation(parent.id, context.user.id);
    },
  },
};
