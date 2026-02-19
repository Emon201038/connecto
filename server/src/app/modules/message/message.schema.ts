export const messageSchema = `#graphql
  type Message {
    id: ID!
    conversationId: ID!
    sender: User!
    content: String
    attachments: [Attachment]
    replyTo: Message
    reactions: [React]
    createdAt: String!
    updatedAt: String
    type: MessageType
  }

  enum MessageType {
    EMOJI
    TEXT
    IMAGE
    VIDEO
    AUDIO
  }

  type Attachment {
    id: ID!
    url: String!
    type: AttachmentType!
    size: Int
    duration: Int
  }

  enum AttachmentType {
    image
    video
    audio
    file
  }

  type PaginatedMessages {
    meta: Meta
    messages: [Message]
  } 

  extend type Query {
    messages(conversationId: ID!, page: Int=1, limit: Int=20, search: String=""): PaginatedMessages!
  }

  extend type Mutation {
    sendMessage(conversationId: ID!, content: String, attachments: [Upload], type: MessageType, replyTo: ID): Message!
    addReaction(messageId: ID!, emoji: String!): React!
    markAsSeen(messageId: ID!): Boolean!
  }
`;
