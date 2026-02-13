export const authSchema = `#graphql
  extend type Query {
    me: User
    getSesssion: User
  }

  type LoginResponse {
    requires2FA: Boolean
    s_id: String
    o_id: String
    message: String
    accessToken: String
    refreshToken: String
    user: User
  }

  extend type Mutation {
    login(email: String!, password: String!): LoginResponse
    logout: Boolean
    saveLoginInfo(sessionId: String!): Boolean
    setCookie(accessToken: String, refreshToken: String): Boolean
  }
`;
