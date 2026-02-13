export const groupSchema = `#graphql
  enum GroupType {
    FACEBOOK
  }

  enum GroupPrivacy {
    PUBLIC
    PRIVATE
    SECRET
  }

  enum GroupRole {
    ADMIN
    MODERATOR
    MEMBER
    PENDING
    BANNED
  }

  type GroupCoverPhoto {
    url: String
    pub_id: String
  }

  type GroupSettings {
    requirePostApproval: Boolean
    whoCanPost: String
  }

  type Group {
    id: ID
    name: String
    slug: String
    description: String
    type: GroupType!
    privacy: GroupPrivacy
    coverPhoto: GroupCoverPhoto
    createdBy: ID!
    memberCount: Int!
    postCount: Int!
    settings: GroupSettings
    createdAt: String!
    updatedAt: String!
    joined: Boolean
  }

  type GroupMembership {
    id: ID!
    group: Group!
    user: ID!
    role: GroupRole!
    joinedAt: String
    mutedUntil: String
    isBanned: Boolean
    banReason: String
    createdAt: String!
    updatedAt: String!
  }

  type GroupsResponse {
    groups: [Group]
    meta: Meta
  }

  type Query {
    groups(page: Int = 1, limit: Int = 15, search: String = ""): GroupsResponse
    groupById(id: ID!): Group
    groupBySlug(slug: String!): Group
    myGroups(page: Int = 1, limit: Int = 15, search: String = ""): GroupsResponse
    groupMembers(
      groupId: ID!
      limit: Int = 20
      cursor: String
    ): [GroupMembership!]!
    groupFeed(limit: Int = 20, page: Int = 1): PostResponse
    groupPosts(groupId: ID!, limit: Int = 20, page: Int = 1): PostResponse
  }

  input CreateGroupInput {
    name: String!
    slug: String
    description: String
    type: GroupType = FACEBOOK
    privacy: GroupPrivacy = PRIVATE
    coverPhoto: GroupCoverPhotoInput
    settings: GroupSettingsInput
  }

  input GroupCoverPhotoInput {
    url: String!
    pub_id: String
  }

  input GroupSettingsInput {
    requirePostApproval: Boolean = false
    whoCanPost: String = "ANY_MEMBER"
  }

  type Mutation {
    createGroup(input: CreateGroupInput!): Group!
    joinGroup(groupId: ID!): GroupMembership!
    leaveGroup(groupId: ID!): Boolean!
  }
`;
