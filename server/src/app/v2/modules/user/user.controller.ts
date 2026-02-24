import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { UserService } from "./user.service";

const getUsers = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users fetched successfully",
    data: [],
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
    data: {},
  });
});
const getUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    data: {},
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
    data: {},
  });
});
const deleteUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: {},
  });
});

const softDeleteUserByUsername = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: {},
  });
});
const softDeleteUserById = catchAsync(async (req, res, next) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfully",
    data: {},
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
