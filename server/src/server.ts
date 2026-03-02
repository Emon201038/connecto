import { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { createServer } from "http";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs, resolvers } from "./app/graphql";
import dotenv from "dotenv";
import { app } from "./app";
import cookieParser from "cookie-parser";
import { connectDB } from "./app/config/db";
import { context } from "./app/middleware/context";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import socketInstance from "./socket";

dotenv.config();

export default async function handler(req: Request, res: Response) {
  await connectDB();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    formatError(formattedError) {
      console.log(formattedError);
      return formattedError;
    },
  });

  await apolloServer.start();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://facebook-client-five.vercel.app",
      ],
      credentials: true,
    }),
  );

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 3 }),
    cookieParser(),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => await context({ req, res }),
    }),
  );

  return app(req, res);
}

// 🚀 Local development mode
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  (async () => {
    // Create HTTP server
    const httpServer = createServer(app);

    // connect to DB
    // await connectDB();

    // Initialize Socket.IO
    // socketInstance.initialize(httpServer);

    // Apollo setup
    const localApollo = new ApolloServer({
      typeDefs,
      resolvers,
      formatError(formattedError) {
        console.log(formattedError);
        return formattedError;
      },
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await localApollo.start();

    app.use(
      "/graphql",
      graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 3 }),
      cors({
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://localhost:3000",
          "http://localhost:5173",
          "https://mycric.app",
          "http://188.245.78.123:3000",
          "https://social-app-git-main-emon201038s-projects.vercel.app/",
          "https://social-app-one-self.vercel.app",
          "https://facebook-client-five.vercel.app",
          // CLIENT_URL,
          // SERVER_URL,
        ],
        credentials: true,
      }),
      bodyParser.json(),
      expressMiddleware(localApollo, {
        context: async ({ req, res }: any) => await context({ req, res }),
      }),
    );

    app.listen(PORT, () => {
      console.log(`🚀 Local server ready at http://localhost:${PORT}/graphql`);
    });
  })();
}
