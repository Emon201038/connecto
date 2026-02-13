import { GraphQLResolveInfo } from "graphql";
import { IResolverContext } from "../types/graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  message: Maybe<Scalars["String"]["output"]>;
  requires2FA: Maybe<Scalars["Boolean"]["output"]>;
  session_id: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  deleteUser: Maybe<Scalars["Boolean"]["output"]>;
  login: Maybe<LoginResponse>;
  registerUser: Maybe<User>;
  verify2FA: Maybe<Scalars["Boolean"]["output"]>;
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type MutationRegisterUserArgs = {
  input: RegisterInput;
};

export type MutationVerify2FaArgs = {
  remember: Scalars["Boolean"]["input"];
  sessionId: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type Pagination = {
  __typename?: "Pagination";
  limit: Maybe<Scalars["Int"]["output"]>;
  nextPage: Maybe<Scalars["Int"]["output"]>;
  page: Maybe<Scalars["Int"]["output"]>;
  prevPage: Maybe<Scalars["Int"]["output"]>;
  totalPage: Maybe<Scalars["Int"]["output"]>;
  totalResult: Maybe<Scalars["Int"]["output"]>;
};

export type PhotoType = {
  __typename?: "PhotoType";
  pub_id: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  friends: Maybe<UserResponse>;
  me: Maybe<User>;
  user: Maybe<User>;
  users: Maybe<UserResponse>;
};

export type QueryFriendsArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  search: InputMaybe<Scalars["String"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUsersArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  search: InputMaybe<Scalars["String"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  sortOrder?: InputMaybe<Scalars["String"]["input"]>;
};

export type RegisterInput = {
  email: Scalars["String"]["input"];
  firstName: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Settings = {
  __typename?: "Settings";
  darkMode: Maybe<Scalars["Boolean"]["output"]>;
  isBanned: Maybe<Scalars["Boolean"]["output"]>;
  isPrivate: Maybe<Scalars["Boolean"]["output"]>;
  isVerified: Maybe<Scalars["Boolean"]["output"]>;
  notifications: Maybe<Scalars["Boolean"]["output"]>;
};

export type TwoFactor = {
  __typename?: "TwoFactor";
  active: Maybe<Scalars["Boolean"]["output"]>;
  secret: Maybe<Scalars["String"]["output"]>;
};

export type User = {
  __typename?: "User";
  bio: Maybe<Scalars["String"]["output"]>;
  coverPicture: Maybe<PhotoType>;
  createdAt: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  firstName: Scalars["String"]["output"];
  followers: Maybe<Array<Maybe<User>>>;
  followings: Maybe<Array<Maybe<User>>>;
  friendRequests: Maybe<Array<Maybe<User>>>;
  friends: Maybe<Array<Maybe<User>>>;
  fullName: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  lastName: Maybe<Scalars["String"]["output"]>;
  nickname: Maybe<Scalars["String"]["output"]>;
  password: Scalars["String"]["output"];
  phone: Maybe<Scalars["String"]["output"]>;
  profilePicture: Maybe<PhotoType>;
  role: UserRole;
  settings: Maybe<Settings>;
  twoFactor: Maybe<TwoFactor>;
  updatedAt: Maybe<Scalars["String"]["output"]>;
  username: Maybe<Scalars["String"]["output"]>;
};

export type UserResponse = {
  __typename?: "UserResponse";
  pagination: Maybe<Pagination>;
  users: Maybe<Array<Maybe<User>>>;
};

export enum UserRole {
  Admin = "ADMIN",
  SuperAdmin = "SUPER_ADMIN",
  User = "USER",
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Pagination: ResolverTypeWrapper<Pagination>;
  PhotoType: ResolverTypeWrapper<PhotoType>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  Settings: ResolverTypeWrapper<Settings>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  TwoFactor: ResolverTypeWrapper<TwoFactor>;
  User: ResolverTypeWrapper<User>;
  UserResponse: ResolverTypeWrapper<UserResponse>;
  UserRole: UserRole;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"]["output"];
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  LoginResponse: LoginResponse;
  Mutation: {};
  Pagination: Pagination;
  PhotoType: PhotoType;
  Query: {};
  RegisterInput: RegisterInput;
  Settings: Settings;
  String: Scalars["String"]["output"];
  TwoFactor: TwoFactor;
  User: User;
  UserResponse: UserResponse;
}>;

export type LoginResponseResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["LoginResponse"] = ResolversParentTypes["LoginResponse"],
> = ResolversObject<{
  message: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  requires2FA: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  session_id: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = ResolversObject<{
  deleteUser: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, "id">
  >;
  login: Resolver<
    Maybe<ResolversTypes["LoginResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  registerUser: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRegisterUserArgs, "input">
  >;
  verify2FA: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationVerify2FaArgs, "remember" | "sessionId" | "token">
  >;
}>;

export type PaginationResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["Pagination"] = ResolversParentTypes["Pagination"],
> = ResolversObject<{
  limit: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  nextPage: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  page: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  prevPage: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  totalPage: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  totalResult: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PhotoTypeResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["PhotoType"] = ResolversParentTypes["PhotoType"],
> = ResolversObject<{
  pub_id: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  url: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  friends: Resolver<
    Maybe<ResolversTypes["UserResponse"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFriendsArgs, "page" | "limit" | "sortBy" | "sortOrder">
  >;
  me: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  user: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, "id">
  >;
  users: Resolver<
    Maybe<ResolversTypes["UserResponse"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUsersArgs, "page" | "limit" | "sortBy" | "sortOrder">
  >;
}>;

export type SettingsResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["Settings"] = ResolversParentTypes["Settings"],
> = ResolversObject<{
  darkMode: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  isBanned: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  isPrivate: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  isVerified: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  notifications: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TwoFactorResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["TwoFactor"] = ResolversParentTypes["TwoFactor"],
> = ResolversObject<{
  active: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  secret: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = ResolversObject<{
  bio: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  coverPicture: Resolver<
    Maybe<ResolversTypes["PhotoType"]>,
    ParentType,
    ContextType
  >;
  createdAt: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  followers: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  followings: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  friendRequests: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  friends: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  fullName: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  lastName: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  nickname: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  password: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  phone: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  profilePicture: Resolver<
    Maybe<ResolversTypes["PhotoType"]>,
    ParentType,
    ContextType
  >;
  role: Resolver<ResolversTypes["UserRole"], ParentType, ContextType>;
  settings: Resolver<
    Maybe<ResolversTypes["Settings"]>,
    ParentType,
    ContextType
  >;
  twoFactor: Resolver<
    Maybe<ResolversTypes["TwoFactor"]>,
    ParentType,
    ContextType
  >;
  updatedAt: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  username: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResponseResolvers<
  ContextType = IResolverContext,
  ParentType extends
    ResolversParentTypes["UserResponse"] = ResolversParentTypes["UserResponse"],
> = ResolversObject<{
  pagination: Resolver<
    Maybe<ResolversTypes["Pagination"]>,
    ParentType,
    ContextType
  >;
  users: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = IResolverContext> = ResolversObject<{
  LoginResponse: LoginResponseResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  Pagination: PaginationResolvers<ContextType>;
  PhotoType: PhotoTypeResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Settings: SettingsResolvers<ContextType>;
  TwoFactor: TwoFactorResolvers<ContextType>;
  User: UserResolvers<ContextType>;
  UserResponse: UserResponseResolvers<ContextType>;
}>;
