import { Request, Response } from "express";
import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs, resolvers } from "./app/graphql";
import dotenv from "dotenv";
import { app } from "./app";
import cookieParser from "cookie-parser";
import socketInstance from "./socket";
import { connectDB } from "./app/config/db";
import { context } from "./app/middleware/context";
import { graphqlUploadExpress } from "graphql-upload-ts";

dotenv.config();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
socketInstance.initialize(httpServer);

async function startServer() {
  // Create Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError(formattedError) {
      console.log(formattedError);
      return formattedError;
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    cors<cors.CorsRequest>({
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
      ],
      credentials: true,
    })
  );

  // Apply middleware
  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 3 }),
    cors<cors.CorsRequest>({
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://localhost:3000",
        "http://localhost:5173",
        "https://mycric.app",
        "http://188.245.78.123:3000",
        "https://social-app-git-main-emon201038s-projects.vercel.app/",
        "https://social-app-one-self.vercel.app",
        // CLIENT_URL,
        // SERVER_URL,
      ],
      credentials: true,
    }),
    cookieParser(),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => await context({ req, res }),
    })
  );

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  interface ErrorWithStatus extends Error {
    status?: number;
  }

  app.use((err: ErrorWithStatus, req: Request, res: Response) => {
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  });

  // Start the server
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
  await connectDB();
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
