import { GraphQLError } from "graphql";
import { MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";

export function handleMongooseError(error: unknown): never {
  // Handle Mongoose-level errors
  if (error instanceof MongooseError) {
    switch (error.name) {
      case "ValidationError":
        throw new GraphQLError(error.message);

      case "CastError":
        throw new GraphQLError(error.message);

      default:
        throw error;
    }
  }

  // Handle MongoDB server errors (like duplicate key)
  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0];
      throw new GraphQLError(
        `${field} already exists: ${error.keyValue?.[field]}`
      );
    }
    throw new GraphQLError(error.message);
  }

  // Fallback
  throw error;
}
