import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "./cookies";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const serverFetchHelper = async (
  endPoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const { headers, ...restOptions } = options;
  const accessToken = await getCookie("accessToken");

  if (endPoint !== "/auth/refresh-token") {
    await getNewAccessToken();
  }

  const response = await fetch(`${BACKEND_API_URL}/api/v2${endPoint}`, {
    headers: {
      Cookie: accessToken ? `accessToken=${accessToken}` : "",
      ...options.headers,
    },
    credentials: "include",
    ...restOptions,
  });

  return response;
};

export const serverFetch = {
  get: async (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { ...options, method: "GET" }),
  post: async (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { ...options, method: "POST" }),
  put: async (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { ...options, method: "PUT" }),
  patch: async (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { ...options, method: "PATCH" }),
  delete: async (endPoint: string, options: RequestInit = {}) =>
    serverFetchHelper(endPoint, { ...options, method: "DELETE" }),
};
