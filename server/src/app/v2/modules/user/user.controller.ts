import { pick } from "../../../helpers/pick";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { userFilterableFields, userPaginationFields } from "./user.constant";
import { UserService } from "./user.service";

const getUsers = catchAsync(async (req, res, next) => {
  const options = pick(req.query, userPaginationFields);
  const filters = pick(req.query, userFilterableFields);

  const users = await UserService.getUsersFromDB(
    options as Record<string, string>,
    filters,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users fetched successfully",
    meta: users.meta,
    data: users.data,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User created successfully",
    data: await UserService.processRegister(req.body),
  });
});

const verifyUserRegister = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User verified successfully",
    data: await UserService.verifyUserRegister(
      res,
      req.body.otp,
      req.params.id,
    ),
  });
});

const getUserByUsername = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: await UserService.getSingleUser("username", req.params.username),
  });
});
const getUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: await UserService.getSingleUser("id", req.params.id),
  });
});

const updateUserByUsername = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: {},
  });
});
const updateUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: {},
  });
});

const deleteUserByUsername = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: await UserService.HardDeleteUser("username", req.params.username),
  });
});
const deleteUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: await UserService.HardDeleteUser("id", req.params.id),
  });
});

const softDeleteUserByUsername = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: await UserService.softDeleteUser("username", req.params.username),
  });
});
const softDeleteUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: await UserService.softDeleteUser("id", req.params.id),
  });
});

export const UserController = {
  getUsers,
  createUser,
  verifyUserRegister,
  getUserByUsername,
  getUserById,
  updateUserByUsername,
  updateUserById,
  deleteUserByUsername,
  deleteUserById,
  softDeleteUserByUsername,
  softDeleteUserById,
};
