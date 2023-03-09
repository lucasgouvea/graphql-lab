export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String
  }

  type Query {
    user(id: ID!): User
  }
`;