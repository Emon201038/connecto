export const postSchema = `#graphql
  enum PostType {
    text
    image
    video
  }

  enum PostPrivacy {
    PUBLIC
    FRIENDS
    ONLY_ME
  }

  type PhotoType {
    url: String
    pub_id: String
  }

  type PostFeelingsType {
    type: String
    emoji: String
    text: String
  }

  type PostReaction {
    user: User!
    emoji: String!
  }
  union EntityTarget = User | Hashtag

  type Entity {
    offset: Int!
    end: Int!
    type: String!
    target: EntityTarget
    text: String
  }

  type Post {
    id: ID!
    type: PostType!
    content: String!
    attachments: [PhotoType]
    updatedAt: String
    createdAt: String
    author: User
    comments: [Comment!]
    reactions: [PostReaction!]
    reactionSummary: [ReactionSummary!]
    reactionCount: Int
    commentCount: Int
    myReaction: React
    share: [Share!]
    shareCount: Int
    privacy: PostPrivacy
    feelings: PostFeelingsType
    hash_tags: [String]
    tags: [User]
    entities: [Entity]
    group: Group
  }

  type ReactionSummary {
    reactionType: ReactionType!
    count: Int!
  }

  type Share {
    user: User
  }

  input PostFeelingsInput {
    type: String
    emoji: String
    text: String
  }

  input EntityInput {
    offset: Int!
    end: Int!
    type: String!
    target: ID
    text: String
  }

  input CreatePostInput {
    type: PostType!
    group: ID
    content: String!
    feelings: PostFeelingsInput
    entities: [EntityInput]
    privacy: PostPrivacy
    attachments: [Upload]
  }

  type PostResponse {
    meta: Meta
    posts: [Post!]
  }

  type HashtagInfo {
    tag: String!
    count: Int!
  }
  type ReactionsResponse {
    meta: Meta
    reactions: [PostReaction]
  }

  extend type Query {
    getPost(id: ID!): Post
    posts(page: Int = 1, limit: Int = 10, search: String, username: String, author: ID): PostResponse
    getHashtagInfo(tag: String!): [HashtagInfo]
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): Post
    deletePost(id: ID!): Boolean
  }
`;
