"use server";
import { parse } from "cookie";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwtHandlers";
import { serverFetch } from "@/lib/server-fetch";
import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
} from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { zodValidator } from "@/lib/zod-validator";
import z from "zod";
import cookie from "cookie";

export const getNewAccessToken = async () => {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    //Case 1: Both tokens are missing - user is logged out
    if (!accessToken && !refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    // Case 2 : Access Token exist- and need to verify
    if (accessToken) {
      const verifiedToken = await verifyToken(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
      );

      if (verifiedToken.success) {
        return {
          tokenRefreshed: false,
        };
      }
    }

    //Case 3 : refresh Token is missing- user is logged out
    if (!refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    //Case 4: Access Token is invalid/expired- try to get a new one using refresh token
    // This is the only case we need to call the API

    // Now we know: accessToken is invalid/missing AND refreshToken exists
    // Safe to call the API
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    // API Call - serverFetch will skip getNewAccessToken for /auth/refresh-token endpoint
    const response = await serverFetch.get("/auth/refresh-token", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const result = await response.json();

    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    if (!refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    await deleteCookie("accessToken");
    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    await deleteCookie("refreshToken");
    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge:
        parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    if (!result.success) {
      throw new Error(result.message || "Token refresh failed");
    }

    return {
      tokenRefreshed: true,
      success: true,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    return {
      tokenRefreshed: false,
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
};

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string("password is required")
    .min(6, "password must be minimum 6 digit"),
});

export const login = async (prevState: unknown, formData: FormData) => {
  try {
    const redirectTo = formData.get("redirect") || null;
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedPayload = zodValidator(payload, loginSchema);
    if (!validatedPayload.success) {
      return {
        success: false,
        errors: validatedPayload.errors,
        formData: payload,
        message: "validation error",
      };
    }
    const res = await serverFetch.post(`/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!data?.success) {
      throw new Error(data?.message);
    }

    const cookiesHeaders = res.headers.getSetCookie();
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    if (cookiesHeaders && cookiesHeaders.length > 0) {
      cookiesHeaders.forEach((c) => {
        const parsed = cookie.parse(c);
        if (parsed["accessToken"]) {
          accessTokenObject = parsed;
        }
        if (parsed["refreshToken"]) {
          refreshTokenObject = parsed;
        }
      });

      if (!accessTokenObject) {
        throw new Error("No access token found");
      }
      if (!refreshTokenObject) {
        throw new Error("No refresh token found");
      }

      await setCookie("accessToken", accessTokenObject.accessToken, {
        httpOnly: true,
        sameSite: accessTokenObject.SameSite || "none",
        maxAge: parseInt(accessTokenObject["Max-Age"]),
        path: accessTokenObject.path,
        secure: true,
      });
      await setCookie("refreshToken", refreshTokenObject.refreshToken, {
        httpOnly: true,
        sameSite: refreshTokenObject.SameSite || "none",
        maxAge: parseInt(refreshTokenObject["Max-Age"]),
        path: refreshTokenObject.path,
        secure: true,
      });
    } else {
      throw new Error("No get set cookie found");
    }

    const verifiedToken: JwtPayload | string = jwt.verify(
      accessTokenObject["accessToken"],
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
    );
    if (typeof verifiedToken === "string") {
      throw new Error("Failed to verify token");
    }

    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, verifiedToken.role)) {
        redirect(requestedPath);
      } else {
        redirect(getDefaultDashboardRoute(verifiedToken.role));
      }
    } else {
      redirect(getDefaultDashboardRoute(verifiedToken.role));
    }
  } catch (error: any) {
    console.log(error);
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message: error?.message,
      errors: [],
    };
  }
};

export const forgotPassword = async (
  prevState: unknown,
  formData: FormData,
) => {
  const schema = z.object({
    email: z.email("Invalid email address"),
  });
  const payload = {
    email: formData.get("email"),
  };
  try {
    const validatedPayload = zodValidator(payload, schema);
    if (!validatedPayload.success) {
      return {
        success: false,
        errors: validatedPayload.errors,
        formData: payload,
        message: "validation error",
      };
    }

    const data = await serverFetch.get(`/otp/send-otp?email=${payload.email}`);
    const res = await data.json();

    if (!res?.success) {
      throw new Error(res?.message);
    }

    return { ...res, formData: payload };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message,
      errors: [],
      formData: payload,
    };
  }
};

export const verifyOtp = async (prevState: unknown, formData: FormData) => {
  const schema = z.object({
    otp: z.string("OTP is required").min(6, "OTP must be minimum 6 digit"),
    id: z.string("id is required").regex(/^[0-9a-fA-F]{24}$/, "Invalid id"),
  });
  const payload = {
    otp: formData.get("otp"),
    id: formData.get("id"),
  };
  try {
    const validatedPayload = zodValidator(payload, schema);
    if (!validatedPayload.success) {
      return {
        success: false,
        errors: validatedPayload.errors,
        formData: payload,
        message: "validation error",
      };
    }

    const data = await serverFetch.post(
      `/otp/verify-otp?session_id=${validatedPayload?.data?.id}`,
      {
        body: JSON.stringify({ otp: validatedPayload?.data?.otp }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const res = await data.json();

    if (!res?.success) {
      throw new Error(res?.message);
    }

    return { ...res, formData: payload };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message,
      errors: [],
      formData: payload,
    };
  }
};

export const sendOtp = async (email: string) => {
  try {
    const data = await serverFetch.get(`/otp/send-otp?email=${email}`);
    const res = await data.json();
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message,
      errors: [],
    };
  }
};

export const changePassword = async (
  prevState: unknown,
  formData: FormData,
) => {
  const payload = {
    isForgotten: formData.get("isForgotten") === "true",
    token: formData.get("token"),
    currentPassword: formData.get("currentPassword")?.toString(),
    newPassword: formData.get("newPassword")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
  };
  const schema = {
    newPassword: z
      .string("newPassword is required")
      .min(6, "newPassword must be minimum 6 digit"),
    confirmPassword: z
      .string("confirmPassword is required ")
      .min(6, "confirmPassword must be minimum 6 digit"),
  };
  try {
    if (payload.isForgotten) {
      const validatedPayload = zodValidator(
        {
          newPassword: payload.newPassword,
          confirmPassword: payload.confirmPassword,
          token: payload.token,
        },
        z
          .object({
            ...schema,
            token: z
              .string("token is required")
              .min(6, "token must be minimum 6 digit")
              .regex(/(^[\w-]*\.[\w-]*\.[\w-]*$)/, "Invalid token"),
          })
          .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
          }),
      );
      if (!validatedPayload.success) {
        return {
          success: false,
          errors: validatedPayload.errors,
          formData: payload,
          message: "validation error",
        };
      }

      const res = await serverFetch.post("/auth/reset-password", {
        body: JSON.stringify(validatedPayload.data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } else {
      const validatedPayload = zodValidator(
        payload,
        z
          .object({
            ...schema,
            currentPassword: z
              .string("currentPassword is required")
              .min(6, "currentPassword must be minimum 6 digit"),
          })
          .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
          }),
      );
      if (!validatedPayload.success) {
        return {
          success: false,
          errors: validatedPayload.errors,
          formData: payload,
          message: "validation error",
        };
      }

      const res = await serverFetch.post("/auth/change-password", {
        body: JSON.stringify(validatedPayload.data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message,
      errors: [],
      formData: payload,
    };
  }
};
