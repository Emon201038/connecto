import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  jsonData: {
    success: boolean;
    statusCode: number;
    message: string;
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      nextCursor?: string | null;
      hasMore?: boolean;
    };
    data: T | null | undefined;
  },
) => {
  res.status(jsonData.statusCode).json(jsonData);
};
