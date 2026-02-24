import { users } from "../../../../prisma/seed/user";
import prisma from "../../config/db";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import bcrypt from "bcryptjs";

const seendUsers = catchAsync(async (req, res, next) => {
  const data = await prisma.user.createMany({
    data: users.map((u) => {
      const hashedPass = bcrypt.hashSync(u.password, 10);
      return {
        ...u,
        fullName: `${u.firstName} ${u.lastName}`,
        password: hashedPass,
      };
    }),
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users created successfully",
    data,
  });
});

export { seendUsers };
