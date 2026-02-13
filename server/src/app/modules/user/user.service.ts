import mongoose from "mongoose";
import { QueryBuilder } from "../../lib/queryBuilder";
import User from "./user.model";
import {
  Conversation,
  ConversationMember,
} from "../conversation/conversation.model";
import { UserRole } from "../../graphql/types";
import { handleMongooseError } from "../auth/auth.helper";

interface UserFilterInput {
  gender: "MALE" | "FEMALE";
  role: UserRole;
  username: string;
}
const createUser = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  phone?: string;
  password: string;
}) => {
  try {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) throw new Error("User already exists");
    console.log(payload);
    const user = new User(payload);

    console.log(user);
    await user.save({ validateBeforeSave: true });
    return true;
  } catch (error) {
    handleMongooseError(error);
  }
};
const updateUser = async (payload: {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  phone: string;
  role: UserRole;
  bio?: string;
}) => {
  try {
    console.log(payload);
    const user = await User.findByIdAndUpdate(payload.id, payload, {
      new: true,
    });
    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    handleMongooseError(error);
  }
};

const getAllUsers = async (
  args: {
    limit: number;
    page: number;
    search: string;
    filter: object;
    sortBy: string;
    sortOrder: string;
  },
  userId: string,
) => {
  try {
    let queryParams = args as unknown as Record<string, string | object>;
    if (queryParams?.filter && typeof queryParams.filter === "object") {
      queryParams = {
        ...queryParams,
        ...queryParams.filter,
      };

      delete queryParams.filter;
    }
    const builder = new QueryBuilder(User, queryParams);

    // if (userId) {
    //   builder.exclude("_id", new mongoose.Types.ObjectId(userId));
    // }

    const res = await builder
      .filter()
      .exclude("_id", new mongoose.Types.ObjectId(userId))
      .search(["email", "phone", "firstName", "lastName"])
      .sort()
      .paginate()
      .execWithMeta();
    return { users: res.data, meta: res.meta };
  } catch (error) {
    throw error;
  }
};

const getUserConversation = async (userId: string, loggedInUserId: string) => {
  try {
    const myConversations = await ConversationMember.find({
      user: loggedInUserId,
    });
    const existingMember = await ConversationMember.findOne({
      user: userId,
      conversation: { $in: myConversations.map((c) => c.conversation) },
    });

    let conversationInfo = null;

    if (existingMember) {
      const conv = await Conversation.findById(
        existingMember.conversation._id,
      ).populate("lastMessage");

      conversationInfo = {
        id: conv?._id,
        hasConversation: conv?._id ? true : false,
        lastMessage: conv?._id,
      };
    } else {
      conversationInfo = {
        id: null,
        hasConversation: false,
        lastMessage: null,
      };
    }
    return conversationInfo;
  } catch (error) {
    throw error;
  }
};

export const UserService = {
  createUser,
  updateUser,
  getAllUsers,
  getUserConversation,
};
