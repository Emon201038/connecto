export const userSchema = `#graphql
  type PhotoType {
    url: String
    pub_id: String
  }

  type Settings {
    isPrivate: Boolean
    isVerified: Boolean
    isBanned: Boolean
    darkMode: Boolean
    notifications: Boolean
  }

  type TwoFactor {
    active: Boolean
    secret: String
  }

  enum UserRole {
    USER
    ADMIN
    SUPER_ADMIN
  }

  type User {
    id: ID!
    _id: ID
    firstName: String!
    lastName: String
    fullName: String
    username: String
    nickname: String
    email: String!
    phone: String
    password: String!
    profilePicture: PhotoType
    coverPicture: PhotoType
    bio: String
    createdAt: String
    updatedAt: String
    friends: [User]
    followings: [User]
    followers: [User]
    friendRequests: [User]
    settings: Settings
    twoFactor: TwoFactor
    role: UserRole!
    dateOfBirth: String
    isDeleted: Boolean
    deletedAt: String
    isDisabled: Boolean
    gender: String
    conversation: ConversationInfo
  }

  type ConversationInfo {
    id: ID
    hasConversation: Boolean!
    lastMessage: Message
  }

  type UserResponse {
    users: [User]
    meta: Meta
  }

  input RegisterInput {
    firstName: String!
    lastName: String
    phone: String!
    gender: String!
    dateOfBirth: String!
    email: String!
    password: String!
  }

  type Meta {
    page: Int
    limit: Int
    prevPage: Int
    nextPage: Int
    totalPage: Int
    totalResult: Int
  }

  input UserFilterInput {
  search: String
  role: UserRole
  isDeleted: String
  isDisabled: String
  isVerified: Boolean
  isBanned: Boolean
  isPrivate: Boolean
  username: String
  email: String
  hasTwoFactor: Boolean
  gender: String
  createdFrom: String
  createdTo: String
}


  extend type Query {
    # getUser(id: ID!): User
    user(id: ID!): User
    userByusername(username: String!): User
    users(
      page: Int = 1
      limit: Int = 10
      search: String
      filter: UserFilterInput
      sortBy: String = "createdAt"
      sortOrder: String = "DESC"
    ): UserResponse
    friends(
      page: Int = 1
      limit: Int = 10
      search: String
      sortBy: String = "fullName"
      sortOrder: String = "DESC"
    ): UserResponse
  }

  input UpdateUserInput {
    id: ID!
    firstName: String!
    lastName: String
    phone: String!
    dateOfBirth: String!
    gender: String!
    role: UserRole!
    bio: String
  }

  extend type Mutation {
    register(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      gender: String!
      dateOfBirth: String!
      phone: String
    ): Boolean
    deleteUser(id: ID!): Boolean
    updateUser(input: UpdateUserInput!): User
  }
`;
