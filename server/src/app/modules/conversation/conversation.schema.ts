export const conversationSchema = `#graphql
  type Conversation {
    id: ID!
    type: ConversationType!
    members: [ConversationMember]
    lastMessage: Message
    unreadCount: Int
    title: String
    avatar: String
    createdAt: String!
    upStringdAt: String!
  }

  enum ConversationType {
    DIRECT
    GROUP
  }

  type ConversationMember {
    id: ID!
    conversation: Conversation!
    user: User!
    role: MemberRole!
    nickname: String
    theme: String
    emoji: String
    isMuted: Boolean
    isPinned: Boolean
    archived: Boolean
    joinedAt: String!
    leftAt: String
  }

  enum MemberRole {
    ADMIN
    MEMBER
  }

  type MyConversationResponse {
    conversations: [Conversation]
    meta: Meta
  }

  extend type Query {
    myConversations(page: Int = 1, limit: Int = 10, search: String=""): MyConversationResponse
    conversationInfo(id: ID!): ConversationMember
  }

  input CreateGroupConversationInput {
    title: String!
    participantIds: [ID]
  }

  extend type Mutation {
    createDirectConversation(participantId: ID!): Conversation!
    createGroupConversation(input: CreateGroupConversationInput!): Conversation!
    updateEmoji(id: ID!, emoji: String!): ConversationMember
  }
`;
