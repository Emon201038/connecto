export const storySchema = `#graphql
  type Story {
    id: ID!
    user: User!
    mediaUrl: String!
    expiresAt: String!
    viewers: [User]
    reactions: [React]
    isDeleted: Boolean
    isViewed: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type StoryGrouped {
    user: User!
    stories: [Story]
  }

  type StoryResponse {
    stories: [StoryGrouped]
    meta: Meta
  }

  extend type Query {
    stories(page:Int=1,limit:Int=15): StoryResponse
  }

  input CreateStoryInput {
    image: Upload
    privacy: String
  }
  extend type Mutation {
    createStory(input: CreateStoryInput): Story
    deleteStory(id: ID!): Boolean
  }
`;
