export const typeDefs = `#graphql
  type User {
    name: String
  }
  type Query {
    users: [User]
  }
`;