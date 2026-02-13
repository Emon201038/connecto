import { IResolverContext } from "../../types/graphql";
import { GraphQLError } from "graphql";
import { AuthServices } from "./auth.service";

export const authResolver = {
  Query: {
    me: async (parent: null, args: null, { user }: IResolverContext) => {
      if (!user)
        throw new GraphQLError("Your session has expired. Please login again.");
      return await AuthServices.me(user.id, user.session_id);
    },
  },
  Mutation: {
    login: async (
      _: any,
      payload: { email: string; password: string },
      { req, res }: IResolverContext,
    ) => {
      return await AuthServices.login(req, res, payload);
    },
    setCookie: async (
      parent: null,
      args: { accessToken: string; refreshToken: string },
      { res }: IResolverContext,
    ) => {
      return await AuthServices.setCookie({ ...args, res });
    },
    logout: async (parent: null, args: null, context: IResolverContext) => {
      return await AuthServices.logout(context);
    },

    saveLoginInfo: async (
      parent: null,
      { sessionId }: { sessionId: string },
      { user }: IResolverContext,
    ) => {
      return await AuthServices.saveLogin(user, sessionId);
    },
  },
};
