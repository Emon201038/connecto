export const hashtagSchema = `#graphql
  type Hashtag {
    id: ID!
    tag: String!
    createdAt: String
    updatedAt: String
    usageCount: Int
    createdBy: User
  }
`;
