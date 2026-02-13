import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";
import { authResolver } from "../modules/auth/auth.resolver";
import { userResolver } from "../modules/user/user.resolver";
import { otpResolver } from "../modules/otp/otp.resolver";
import { postResolvers } from "../modules/post/post.resolver";
import { commentResolver } from "../modules/comment/comment.resolver";
import { reactionResolver } from "../modules/reaction/reaction.resolver";
import groupResolver from "../modules/groups/group.resolver";
import { friendResolvers } from "../modules/friend/friend.resolver";
import { rootSchema } from "../modules/root/root.schema";
import { authSchema } from "../modules/auth/auth.schema";
import { userSchema } from "../modules/user/user.schema";
import { otpSchema } from "../modules/otp/otp.schema";
import { postSchema } from "../modules/post/post.schema";
import { commentSchema } from "../modules/comment/comment.schema";
import { reactionSchema } from "../modules/reaction/reaction.schema";
import { groupSchema } from "../modules/groups/group.schema";
import { friendSchema } from "../modules/friend/friend.schema";
import { conversationSchema } from "../modules/conversation/conversation.schema";
import { hashtagSchema } from "../modules/hashtag/hashtag.schema";
import { conversationResolver } from "../modules/conversation/conversation.resolver";
import { messageSchema } from "../modules/message/message.schema";
import { messageResolver } from "../modules/message/message.resolver";
import { storySchema } from "../modules/story/story.schema";
import { storyResolver } from "../modules/story/story.resolver";
import { analyticsSchema } from "../modules/analytics/analytics.schema";
import { analyticsResolver } from "../modules/analytics/analytics.resolver";

// Load all .gql files from modules
// const typesArray = loadFilesSync(
//   [
//     path.join(__dirname, "../modules/root/root.gql"),
//     path.join(__dirname, "../modules/**/*.gql"),
//   ],
//   { recursive: true }
// );

// export const typeDefs = mergeTypeDefs(typesArray);
export const typeDefs = [
  rootSchema,
  authSchema,
  userSchema,
  otpSchema,
  postSchema,
  storySchema,
  commentSchema,
  reactionSchema,
  groupSchema,
  friendSchema,
  hashtagSchema,
  conversationSchema,
  messageSchema,
  analyticsSchema,
];

export const resolvers = [
  authResolver,
  userResolver,
  otpResolver,
  storyResolver,
  postResolvers,
  commentResolver,
  reactionResolver,
  groupResolver,
  friendResolvers,
  conversationResolver,
  messageResolver,
  analyticsResolver,
];
