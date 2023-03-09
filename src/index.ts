import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schemas';
import { MongoDBDataSource } from './datasources';


const resolvers = {
  Query: {
    users: (parent: unknown, args: unknown, { dataSources: { mongo } }: Context, info: unknown) => {
      return mongo.getUsers()
    }
  },
};

export type Context = {
  dataSources: {
    mongo: MongoDBDataSource;
  };
  token: string;

}

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

});

server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => {
        let context
        try {
          const mongoDataSource = new MongoDBDataSource({ token: "" })

          await mongoDataSource.init()
          context = {
            dataSources: {
              mongo: mongoDataSource
            },
            token: ""
          }
        } catch (err) {
          throw new Error((err as Error).message)
        }

        return context
      }
    }),
  );

  httpServer.listen({ port: 4000 })
  console.log(`🚀 Server ready at http://localhost:4000`);
})

