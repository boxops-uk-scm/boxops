import { createServer } from "node:http";
import { createSchema, createYoga } from "graphql-yoga";

const typeDefs = /* GraphQL */ `
  type Query {
    viewer: User!
  }

  type User {
    id: ID!
    name: String!
    profileImageUrl: String
  }
`;

const resolvers = {
  Query: {
    viewer: () => {
      return {
        id: "123",
        name: "Tom Bates",
      };
    }
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/graphql",
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log("GraphQL server running on http://localhost:4000/graphql");
});