export const rootSchema = `#graphql
  type Query
  type Mutation
  scalar Upload
  scalar Date
  type File {
    url: String!
    public_id: String!
  }
`;
